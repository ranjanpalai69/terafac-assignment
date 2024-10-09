import { StyledEngineProvider } from "@mui/material/styles";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StyledEngineProvider injectFirst>
  <App />
</StyledEngineProvider>,
)
