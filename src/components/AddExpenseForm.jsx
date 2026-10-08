import { useState } from 'react'

function AddExpenseForm({ categories, onSubmit, error }) {
  const [formValues, setFormValues] = useState({
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const created = onSubmit(formValues)
    if (created) {
      setFormValues((prev) => ({
        ...prev,
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
      }))
    }
  }

  return (
    <section className="panel h-full p-5 sm:p-6 lg:flex lg:flex-col">
      <h2 className="section-title">Add expense</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex-1"
      >
        <label className="sm:col-span-1">
          <span className="mb-1 block text-sm text-muted">Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            name="amount"
            value={formValues.amount}
            onChange={handleChange}
            className="field"
            placeholder="0.00"
          />
        </label>

        <label className="sm:col-span-1">
          <span className="mb-1 block text-sm text-muted">Category</span>
          <select name="category" value={formValues.category} onChange={handleChange} className="field">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-1">
          <span className="mb-1 block text-sm text-muted">Date</span>
          <input
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleChange}
            className="field"
          />
        </label>

        <label className="sm:col-span-1">
          <span className="mb-1 block text-sm text-muted">Note</span>
          <input
            type="text"
            name="note"
            value={formValues.note}
            onChange={handleChange}
            className="field"
            placeholder="Groceries, taxi, bill…"
          />
        </label>

        {error ? <p className="sm:col-span-2 text-sm text-[var(--danger)]">{error}</p> : null}

        <button type="submit" className="btn-primary sm:col-span-2">
          Add expense
        </button>
      </form>
    </section>
  )
}

export default AddExpenseForm
