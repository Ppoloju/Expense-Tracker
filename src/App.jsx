import { useEffect, useMemo, useState } from 'react'
import Dashboard from './components/Dashboard'
import AddExpenseForm from './components/AddExpenseForm'
import RecentTransactions from './components/RecentTransactions'
import SmartInsights from './components/SmartInsights'
import ExpensePieChart from './components/ExpensePieChart'
import ThemeToggle from './components/ThemeToggle'
import { applyTheme, persistTheme, readInitialTheme } from './utils/theme'
import { getExpenseInsights } from './services/geminiService'
import { parseYMD } from './utils/formatters'

const STORAGE_KEY = 'smart-expense-tracker:expenses'
const BUDGET_KEY = 'smart-expense-tracker:budget'
const CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other']

function readStoredValue(key) {
  try {
    return localStorage.getItem(key)
  } catch (storageError) {
    console.error(`Could not read ${key} from localStorage:`, storageError)
    return null
  }
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (storageError) {
    console.error(`Could not save ${key} to localStorage:`, storageError)
  }
}

function readInitialExpenses() {
  const saved = readStoredValue(STORAGE_KEY)
  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch (storageError) {
    console.error('Could not parse saved expenses:', storageError)
    return []
  }
}

function readInitialBudget() {
  const stored = readStoredValue(BUDGET_KEY)
  const value = stored ? Number(stored) : 0
  return Number.isFinite(value) && value >= 0 ? value : 0
}

function App() {
  const [expenses, setExpenses] = useState(readInitialExpenses)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [insights, setInsights] = useState(getExpenseInsights([]))
  const [timeframe, setTimeframe] = useState('all') // all | 2d | week | month | year | custom
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [theme, setTheme] = useState(readInitialTheme)

  const [monthlyBudget, setMonthlyBudget] = useState(readInitialBudget)

  useEffect(() => {
    writeStoredValue(STORAGE_KEY, JSON.stringify(expenses))
    setInsights(getExpenseInsights(expenses, monthlyBudget))
  }, [expenses, monthlyBudget])

  useEffect(() => {
    writeStoredValue(BUDGET_KEY, String(monthlyBudget || 0))
  }, [monthlyBudget])

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses],
  )

  const dateFilteredExpenses = useMemo(() => {
    if (timeframe === 'all') return expenses

    const today = new Date()
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
    let start = null

    if (timeframe === '2d') {
      start = new Date(end)
      start.setDate(start.getDate() - 1)
      start.setHours(0, 0, 0, 0)
    } else if (timeframe === 'week') {
      start = new Date(end)
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
    } else if (timeframe === 'month') {
      start = new Date(end)
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
    } else if (timeframe === 'year') {
      start = new Date(end)
      start.setDate(start.getDate() - 364)
      start.setHours(0, 0, 0, 0)
    } else if (timeframe === 'custom') {
      const from = parseYMD(customFrom)
      const to = parseYMD(customTo)
      if (!from || !to) return expenses
      start = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0, 0)
      const customEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999)
      return expenses.filter((e) => {
        const d = parseYMD(e?.date)
        if (!d) return false
        return d >= start && d <= customEnd
      })
    }

    if (!start) return expenses
    return expenses.filter((e) => {
      const d = parseYMD(e?.date)
      if (!d) return false
      return d >= start && d <= end
    })
  }, [expenses, timeframe, customFrom, customTo])

  const filteredExpenses = useMemo(() => {
    const term = query.toLowerCase().trim()
    if (!term) return dateFilteredExpenses
    return dateFilteredExpenses.filter((expense) => {
      const amountText = String(expense.amount)
      const noteText = expense.note.toLowerCase()
      const categoryText = expense.category.toLowerCase()
      const dateText = String(expense.date).toLowerCase()
      return (
        amountText.includes(term) ||
        noteText.includes(term) ||
        categoryText.includes(term) ||
        dateText.includes(term)
      )
    })
  }, [dateFilteredExpenses, query])

  const timeframeTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e?.amount || 0), 0)
  }, [filteredExpenses])

  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map((category) => ({
      name: category,
      value: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    })).filter((item) => item.value > 0)
  }, [expenses])

  const geminiSummary = useMemo(() => {
    const base = {
      totalCalculation: totalSpent,
      categorySummary: {},
      smartInsights: [],
      budgetAlerts: [],
      nextBestAction: '',
    }

    const fromApi =
      Array.isArray(insights) && insights.length > 0 && insights[0]
        ? insights[0]
        : null

    return fromApi ? { ...base, ...fromApi } : base
  }, [insights, totalSpent])

  const addExpense = (formValues) => {
    const amount = Number(formValues.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return false
    }

    setError('')
    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      amount,
      category: formValues.category,
      date: formValues.date,
      note: formValues.note.trim(),
    }

    setExpenses((prev) => [newExpense, ...prev])
    return true
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const updateExpense = (id, formValues) => {
    const amount = Number(formValues.amount)
    if (!Number.isFinite(amount) || amount <= 0) return false

    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount,
              category: formValues.category,
              date: formValues.date,
              note: formValues.note.trim(),
            }
          : expense,
      ),
    )
    return true
  }

  return (
    <main className="app-page">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:gap-7 sm:py-10">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">Expense Tracker</h1>
            <p className="mt-1 text-sm text-muted">Track spending. Build better savings habits.</p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-5">
            <Dashboard
              totalSpent={totalSpent}
              totalTransactions={expenses.length}
              aiTotal={geminiSummary.totalCalculation}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-3">
            
            <AddExpenseForm
              categories={CATEGORIES}
              onSubmit={addExpense}
              error={error}
            />
          </div>
          <div className="lg:col-span-2">
            <ExpensePieChart data={categoryBreakdown} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-5">
            <RecentTransactions
              query={query}
              setQuery={setQuery}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              customFrom={customFrom}
              setCustomFrom={setCustomFrom}
              customTo={customTo}
              setCustomTo={setCustomTo}
              timeframeTotal={timeframeTotal}
              expenses={filteredExpenses}
              onDelete={deleteExpense}
              onUpdate={updateExpense}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-5">
            <SmartInsights
              insights={geminiSummary}
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
            />
          </div>
        </section> 
      </div>
    </main>
  )
}

export default App
