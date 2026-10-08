import { formatINR } from '../utils/formatters'

function SmartInsights({ insights, monthlyBudget, setMonthlyBudget }) {
  const total = Number(insights?.totalCalculation ?? 0)
  const safeMonthlyBudget = Number(monthlyBudget || 0)
  const usedPercentRaw =
    safeMonthlyBudget > 0 ? Math.round((total / safeMonthlyBudget) * 100) : 0
  const usedPercentText =
    safeMonthlyBudget > 0 && usedPercentRaw >= 100 ? 'Over budget' : `${usedPercentRaw}%`
  const isOverBudget = safeMonthlyBudget > 0 && total > safeMonthlyBudget
  const smartList = Array.isArray(insights?.smartInsights) ? insights.smartInsights : []
  const alertsList = Array.isArray(insights?.budgetAlerts) ? insights.budgetAlerts : []

  return (
    <section className="panel p-5 sm:p-6">
      <h2 className="section-title">Insights & budget</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label>
          <span className="mb-1 block text-sm text-muted">Monthly budget (₹)</span>
          <input
            type="number"
            min="0"
            step="100"
            value={monthlyBudget ?? 0}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (!Number.isFinite(value) || value < 0) {
                setMonthlyBudget(0)
              } else {
                setMonthlyBudget(value)
              }
            }}
            className="field w-32"
          />
        </label>
        {monthlyBudget > 0 ? (
          <p
            className={`text-sm ${isOverBudget ? 'text-[var(--danger)]' : 'text-muted'}`}
          >
            {formatINR(total)} of {formatINR(monthlyBudget)} ({usedPercentText})
          </p>
        ) : null}
      </div>

      {smartList.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {smartList.map((item, index) => (
            <li key={`${item}-${index}`} className="insight-block">
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {alertsList.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {alertsList.map((item, index) => (
            <li key={`${item}-${index}`} className="alert-block">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default SmartInsights
