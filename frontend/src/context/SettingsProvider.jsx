import { useState, useEffect, useCallback } from "react"
import { SettingsContext } from "./SettingsContext"
import { API_BASE } from "../constants/config"
import { useAuth } from "@/hooks/useAuth"

export default function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [rawNamaToko, setRawNamaToko] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchSettings()
  }, [isAuthenticated, fetchSettings])

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

    await fetchSettings()
  }

  const namaToko = `${rawNamaToko} Inventory Dashboard`

  const deleteAccount = async () => {
    const res = await fetch(`${API_BASE}/me/delete-account`, {
      method: "DELETE",
      credentials: "include"
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data?.error || "Gagal menghapus akun")
    }

    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/login"
  }

  return (
    <SettingsContext.Provider
      value={{
        rawNamaToko,
        setRawNamaToko,
        namaToko,
        loading,
        saveStoreName,
        deleteAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
