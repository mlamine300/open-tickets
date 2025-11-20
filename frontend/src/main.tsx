import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import Layout from './layouts/Layout.tsx'

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    <BrowserRouter>
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </StrictMode>
)
