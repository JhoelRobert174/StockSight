import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { API_BASE } from "../constants/config"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: "include",
        })

        if (res.status === 401) {
          setUser(null)
        } else if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          console.error("Gagal verifikasi user:", res.status)
          setUser(null)
        }
      } catch (err) {
        console.error("Error saat cek auth:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Login gagal")

    const me = await fetch(`${API_BASE}/me`, {
      credentials: "include"
    }).then((res) => res.ok ? res.json() : null)

    setUser(me)
  }

  const logout = async () => {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include"
    })
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
