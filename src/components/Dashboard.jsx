import { formatINR } from '../utils/formatters'

function Dashboard({ totalSpent, totalTransactions, aiTotal }) {
  const displayTotal = aiTotal != null ? aiTotal : totalSpent

  return (
    <section className="panel border-l-4 border-l-[var(--accent)] px-5 py-6 sm:px-7 sm:py-8">
      <p className="font-display text-4xl tracking-tight sm:text-5xl">{formatINR(displayTotal)}</p>
      <p className="mt-2 text-sm text-muted">
        {totalTransactions} transaction{totalTransactions === 1 ? '' : 's'} logged
      </p>
    </section>
  )
}

export default Dashboard
