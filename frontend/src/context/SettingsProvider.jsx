import { useState, useEffect } from "react"
import { SettingsContext } from "./SettingsContext"


export default function SettingsProvider({ children }) {
  const [rawNamaToko, setRawNamaToko] = useState(() => {
    return localStorage.getItem("namaToko") || "StockSight"
  })

  useEffect(() => {
    localStorage.setItem("namaToko", rawNamaToko)
  }, [rawNamaToko])

  const namaToko = `${rawNamaToko} Store`

  return (
    <SettingsContext.Provider value={{ namaToko, rawNamaToko, setRawNamaToko }}>
      {children}
    </SettingsContext.Provider>
  )
}
