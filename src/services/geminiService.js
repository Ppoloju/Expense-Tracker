export function getExpenseInsights(expenses, monthlyBudget = 0) {
  const safeExpenses = Array.isArray(expenses) ? expenses : []
  const safeMonthlyBudget = Number(monthlyBudget || 0)

  const formatINR = (amount) => {
    const value = Number(amount || 0)
    const safe = Number.isFinite(value) ? value : 0
    return safe.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    })
  }

  const parseYMD = (dateStr) => {
    const str = String(dateStr || '')
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
    if (!match) return null
    const [, yyyy, mm, dd] = match
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return Number.isNaN(d.getTime()) ? null : d
  }

  const sumInRange = (start, end) => {
    return safeExpenses.reduce((sum, e) => {
      const d = parseYMD(e?.date)
      if (!d) return sum
      if (d < start || d > end) return sum
      return sum + Number(e?.amount || 0)
    }, 0)
  }

  const totalCalculation = safeExpenses.reduce(
    (sum, e) => sum + Number(e?.amount || 0),
    0,
  )

  const categorySummary = safeExpenses.reduce((acc, e) => {
    const category = e?.category || 'Other'
    acc[category] = (acc[category] || 0) + Number(e?.amount || 0)
    return acc
  }, {})

  const entries = Object.entries(categorySummary)
  const top = entries.sort((a, b) => b[1] - a[1])[0]
  const topCategory = top?.[0]
  const topAmount = Number(top?.[1] || 0)
  const topPct =
    totalCalculation > 0 ? Math.round((topAmount / totalCalculation) * 100) : 0
  void topCategory
  void topPct

  const smartInsights = []
  if (totalCalculation <= 0) {
    smartInsights.push(
      'Whenever you’re ready, add your first expense and I’ll help you understand your spending.',
    )
  } else {
    // Weekly & monthly insights (based on today)
    const now = new Date()
    const endToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    )

    const start7 = new Date(endToday)
    start7.setDate(start7.getDate() - 6)
    start7.setHours(0, 0, 0, 0)
    const endPrev7 = new Date(start7)
    endPrev7.setMilliseconds(-1) // just before start7
    const startPrev7 = new Date(endPrev7)
    startPrev7.setDate(startPrev7.getDate() - 6)
    startPrev7.setHours(0, 0, 0, 0)

    const last7Total = sumInRange(start7, endToday)
    const prev7Total = sumInRange(startPrev7, endPrev7)

    const start30 = new Date(endToday)
    start30.setDate(start30.getDate() - 29)
    start30.setHours(0, 0, 0, 0)
    const endPrev30 = new Date(start30)
    endPrev30.setMilliseconds(-1)
    const startPrev30 = new Date(endPrev30)
    startPrev30.setDate(startPrev30.getDate() - 29)
    startPrev30.setHours(0, 0, 0, 0)

    const last30Total = sumInRange(start30, endToday)
    const prev30Total = sumInRange(startPrev30, endPrev30)

    smartInsights.push(`This week (last 7 days), you spent ${formatINR(last7Total)}.`)
    if (prev7Total > 0) {
      const diffPct = Math.round(((last7Total - prev7Total) / prev7Total) * 100)
      const absDiffPct = Math.abs(diffPct)

      if (diffPct > 0) {
        smartInsights.push(
      absDiffPct >= 100
            ? `That’s a big jump compared to the week before. You’re doing great—keep an eye on the biggest category.`
            : `That’s about ${diffPct}% more than the week before. You’re doing great—just keep an eye on the biggest category.`,
        )
      } else if (diffPct < 0) {
        smartInsights.push(
            absDiffPct >= 100
            ? `That’s a big drop compared to the week before. Nice work!`
            : `That’s about ${absDiffPct}% less than the week before. Nice work!`,
        )
      } else {
        smartInsights.push('That’s very similar to the week before—steady spending is a good sign.')
      }
    }

    smartInsights.push(`This month (last 30 days), you spent ${formatINR(last30Total)}.`)
    if (prev30Total > 0) {
      const diffPct = Math.round(((last30Total - prev30Total) / prev30Total) * 100)
      const absDiffPct = Math.abs(diffPct)
      if (diffPct > 0) {
        smartInsights.push(
          absDiffPct >= 100
            ? `That’s a big jump compared to the previous 30 days. If you’d like, we can find one easy place to save.`
            : `That’s about ${diffPct}% more than the previous 30 days. If you’d like, we can find one easy place to save.`,
        )
      } else if (diffPct < 0) {
        smartInsights.push(
          absDiffPct >= 100
            ? `That’s a big drop compared to the previous 30 days. Great progress!`
            : `That’s about ${absDiffPct}% less than the previous 30 days. Great progress!`,
        )
      }
    }

  }

  const budgetAlerts = []
  if (safeMonthlyBudget > 0 && totalCalculation > safeMonthlyBudget) {
    const overBy = totalCalculation - safeMonthlyBudget

    budgetAlerts.push(
      `Gentle reminder: you used ${formatINR(totalCalculation)} which is over your budget of ${formatINR(safeMonthlyBudget)}. You're about ${formatINR(overBy)} over.`,
    )
  }

  const nextBestAction =
    totalCalculation <= 0
      ? 'If you add a few expenses, I can share clearer weekly and monthly insights.'
      : 'You could set a simple monthly budget and try to keep your total gently below it.'

  return [
    {
      totalCalculation,
      categorySummary,
      smartInsights,
      budgetAlerts,
      nextBestAction,
    },
  ]
}
