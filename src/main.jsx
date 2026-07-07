import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WeddingSite from './WeddingSite.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><WeddingSite /></StrictMode>
)