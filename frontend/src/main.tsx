import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RezooMe from './RezooMe.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RezooMe />
  </StrictMode>,
)
