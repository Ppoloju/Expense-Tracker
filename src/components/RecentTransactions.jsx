import { useState } from 'react'
import { formatDDMMYYYY, formatINR } from '../utils/formatters'
import { categoryBadgeClass } from '../utils/categoryStyles'

function RecentTransactions({
  query,
  setQuery,
  timeframe,
  setTimeframe,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  timeframeTotal,
  expenses,
  onDelete,
  onUpdate,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState(null)
  const [editError, setEditError] = useState('')

  const startEditing = (expense) => {
    setEditingId(expense.id)
    setEditValues({
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
      note: expense.note || '',
    })
    setEditError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValues(null)
    setEditError('')
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditValues((previous) => ({ ...previous, [name]: value }))
  }

  const handleEditSubmit = (event, id) => {
    event.preventDefault()
    const amount = Number(editValues.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setEditError('Enter an amount greater than 0.')
      return
    }

    if (onUpdate(id, editValues)) cancelEditing()
  }

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="section-title">Transactions</h2>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          className="field sm:max-w-xs"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
        <label className="sm:col-span-1">
          <span className="mb-1 block text-sm text-muted">Period</span>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="field">
            <option value="all">All time</option>
            <option value="2d">Last 2 days</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        {timeframe === 'custom' ? (
          <>
            <label className="sm:col-span-1">
              <span className="mb-1 block text-sm text-muted">From</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="field"
              />
            </label>
            <label className="sm:col-span-1">
              <span className="mb-1 block text-sm text-muted">To</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="field"
              />
            </label>
          </>
        ) : (
          <p className="text-sm text-muted sm:col-span-2 sm:pb-2">
            Total in period: <span className="font-medium text-[var(--text-primary)]">{formatINR(timeframeTotal)}</span>
          </p>
        )}
      </div>

      {timeframe === 'custom' ? (
        <p className="mt-3 text-sm text-muted">
          Total in period:{' '}
          <span className="font-medium text-[var(--text-primary)]">{formatINR(timeframeTotal)}</span>
        </p>
      ) : null}

      <ul className="mt-5 divide-y divide-[var(--border)]">
        {expenses.length === 0 ? (
          <li className="py-6 text-sm text-muted">Nothing here yet.</li>
        ) : (
          expenses.map((expense) => (
            <li
              key={expense.id}
              className="py-4 first:pt-0"
            >
              {editingId === expense.id ? (
                <form onSubmit={(event) => handleEditSubmit(event, expense.id)} className="grid gap-3 sm:grid-cols-2">
                  <label>
                    <span className="mb-1 block text-sm text-muted">Amount</span>
                    <input
                      type="number"
                      name="amount"
                      min="0.01"
                      step="0.01"
                      required
                      value={editValues.amount}
                      onChange={handleEditChange}
                      className="field"
                    />
                  </label>
                  <label>
                    <span className="mb-1 block text-sm text-muted">Category</span>
                    <select name="category" value={editValues.category} onChange={handleEditChange} className="field">
                      {['Food', 'Travel', 'Bills', 'Entertainment', 'Other'].map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1 block text-sm text-muted">Date</span>
                    <input
                      type="date"
                      name="date"
                      required
                      value={editValues.date}
                      onChange={handleEditChange}
                      className="field"
                    />
                  </label>
                  <label>
                    <span className="mb-1 block text-sm text-muted">Note</span>
                    <input
                      type="text"
                      name="note"
                      value={editValues.note}
                      onChange={handleEditChange}
                      className="field"
                    />
                  </label>
                  {editError ? <p role="alert" className="text-sm text-[var(--danger)]">{editError}</p> : null}
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" className="btn-primary">Save changes</button>
                    <button type="button" onClick={cancelEditing} className="btn-ghost">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{formatINR(expense.amount)}</span>
                      <span className={categoryBadgeClass(expense.category)}>{expense.category}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{formatDDMMYYYY(expense.date)}</p>
                    {expense.note ? <p className="mt-0.5 text-sm">{expense.note}</p> : null}
                  </div>
                  <div className="flex gap-2 self-start">
                    <button type="button" onClick={() => startEditing(expense)} className="btn-ghost">Edit</button>
                    <button type="button" onClick={() => onDelete(expense.id)} className="btn-danger">Remove</button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export default RecentTransactions
