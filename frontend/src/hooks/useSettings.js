import { useContext } from "react"
import { SettingsContext } from "../context/SettingsContext"

export function useSettings() {
  return useContext(SettingsContext)
}
