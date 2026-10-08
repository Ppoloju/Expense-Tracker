export function formatINR(amount) {
  const value = Number(amount || 0)
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  })
}

export function formatDDMMYYYY(dateInput) {
  // Accepts "YYYY-MM-DD" or a Date. Falls back to input string.
  if (!dateInput) return ''

  if (dateInput instanceof Date) {
    const dd = String(dateInput.getDate()).padStart(2, '0')
    const mm = String(dateInput.getMonth() + 1).padStart(2, '0')
    const yyyy = String(dateInput.getFullYear())
    return `${dd}-${mm}-${yyyy}`
  }

  const str = String(dateInput)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  if (!match) return str
  const [, yyyy, mm, dd] = match
  return `${dd}-${mm}-${yyyy}`
}

export function parseYMD(dateStr) {
  const str = String(dateStr || '')
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  if (!match) return null
  const [, yyyy, mm, dd] = match
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  return Number.isNaN(d.getTime()) ? null : d
}

