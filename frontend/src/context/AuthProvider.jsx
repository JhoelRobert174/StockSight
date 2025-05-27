import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { API_BASE } from "../constants/config"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/me`, {
      credentials: "include"
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setUser(data ?? null)  // ⬅️ Force null
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
    // Reset user
    setUser(null)
    // Optional: trigger full reload (bypass state bleed)
    window.location.href = "/login"
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
