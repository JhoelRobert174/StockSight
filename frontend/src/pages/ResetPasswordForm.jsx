import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button, Input, FormWrapper, Message } from "@/components/ui"
import { API_BASE } from "../constants/config"

export function ResetPasswordForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = location.state?.username || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!username) {
      navigate("/login")
    }
  }, [username, navigate])

  const showMessage = (text, type = "error") => {
    setMessage(text)
    setMessageType(type)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showMessage("Password wajib diisi.")
      return
    }
    if (newPassword !== confirmPassword) {
      showMessage("Password tidak cocok.")
      return
    }
    if (username === newPassword) {
      showMessage("Password tidak boleh sama dengan username.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal reset password")

      showMessage("Password berhasil direset. Mengarahkan ke login...", "success")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      showMessage("Error: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper title="Reset Password" onSubmit={handleReset}>
      {message && <Message type={messageType}>{message}</Message>}

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
