// context/SidebarProvider.jsx
import { useState } from "react"
import { SidebarContext } from "./SidebarContext"

export default function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(o => !o)
  const close = () => setOpen(false)

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}
