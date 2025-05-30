import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthProvider"
import SidebarProvider from "./context/SidebarProvider"
import SettingsProvider from "./context/SettingsProvider"
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
)

