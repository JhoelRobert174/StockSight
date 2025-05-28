import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthProvider"
import SidebarProvider from "./context/SidebarProvider"
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AuthProvider>
  </React.StrictMode>
)
