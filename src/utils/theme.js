const THEME_KEY = 'smart-expense-tracker:theme'

export function readInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#121110' : '#ebe6dc')
  }
}

export function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (storageError) {
    console.error('Could not save theme to localStorage:', storageError)
  }
}
