import { useState, useEffect } from "react"
import { SettingsContext } from "./SettingsContext"
import { API_BASE } from "../constants/config"
import { useAuth } from "@/hooks/useAuth" // ⬅️ pastikan ini tersedia

export default function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [rawNamaToko, setRawNamaToko] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return // ⛔️ Jangan fetch sebelum login

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Gagal fetch settings")

        const data = await res.json()
        const nama = data.store_name || "StockSight"

        setRawNamaToko(nama)
        localStorage.setItem("namaToko", nama)
      } catch (err) {
        console.error("Gagal ambil data setting:", err)
        setRawNamaToko(localStorage.getItem("namaToko") || "StockSight")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [isAuthenticated])

  const saveStoreName = async (name) => {
    const res = await fetch(`${API_BASE}/me/store-name`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ store_name: name }),
    })

    if (!res.ok) throw new Error("Gagal update store name")

    setRawNamaToko(name)
    localStorage.setItem("namaToko", name)
  }

  const namaToko = `${rawNamaToko} Store`

  return (
    <SettingsContext.Provider
      value={{
        rawNamaToko,
        setRawNamaToko,
        namaToko,
        loading,
        saveStoreName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
