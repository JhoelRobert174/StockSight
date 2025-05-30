import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button, Input, FormWrapper } from "@/components/ui"
import { API_BASE } from "../constants/config"

export function ResetPasswordForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = location.state?.username || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
  if (!username) {
    navigate("/login")
  }
}, [username, navigate])

  const handleReset = async (e) => {
    e.preventDefault()
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setMessage("Password wajib diisi.")
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage("Password tidak cocok.")
      return
    }
    if (username === newPassword) {
      setMessage("Password tidak boleh sama dengan username.")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, new_password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal reset password")
      setMessage("Password berhasil direset. Mengarahkan ke login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setMessage("Error: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper title="Reset Password" onSubmit={handleReset}>
      {message && (
        <div className="mb-4 px-4 py-2 rounded text-red-500 bg-red-100 dark:bg-red-950">{message}</div>
      )}
      <Input
        variant="dry"
        placeholder="Password Baru"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        variant="dry"
        placeholder="Konfirmasi Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit" variant="wide" color="green" disabled={isLoading}>
        {isLoading ? "Mengubah..." : "Reset Password"}
      </Button>
    </FormWrapper>
  )
}

export default ResetPasswordForm
