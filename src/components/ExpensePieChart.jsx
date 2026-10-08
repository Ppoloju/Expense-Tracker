import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatINR } from '../utils/formatters'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function ExpensePieChart({ data }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0)

  return (
    <section className="panel h-full p-5 sm:p-6">
      <h2 className="section-title">By category</h2>

      {data.length === 0 ? (
        <div className="panel-inset mt-4 flex h-56 w-full items-center justify-center p-6 text-sm text-muted md:h-64">
          No categories yet.
        </div>
      ) : (
        <div className="mt-4 h-56 w-full md:h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 300, height: 224 }}
          >
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius="82%" innerRadius="48%">
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value) => {
                  const safeValue = Number(value || 0)
                  const pct = total > 0 ? Math.round((safeValue / total) * 100) : 0
                  return `${formatINR(safeValue)} (${pct}%)`
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default ExpensePieChart
