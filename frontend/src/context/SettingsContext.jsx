import { createContext, useContext } from "react"

export const SettingsContext = createContext()

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error("useSettings must be used inside SettingsProvider")
  return context
}
