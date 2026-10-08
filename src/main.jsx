import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyTheme, readInitialTheme } from './utils/theme.js'
import './index.css'
import App from './App.jsx'

applyTheme(readInitialTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
