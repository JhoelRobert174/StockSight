import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper } from "@/components/ui"
import { API_BASE } from "../constants/config"

export function IdentityVerifyForm() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const navigate = useNavigate()

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!email.trim() || !username.trim()) {
      setMessage("Email dan username wajib diisi.")
      return
    }
    try {
      const res = await fetch(`${API_BASE}/verify-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal verifikasi")
      setIsVerified(true)
    } catch (err) {
      setMessage("Error: " + err.message)
    }
  }

  if (isVerified) {
    navigate("/reset-password", { state: { username } })
  }

  return (
    <FormWrapper title="Verifikasi Identitas" onSubmit={handleVerify}>
      {message && (
        <div className="mb-4 px-4 py-2 rounded text-red-500 bg-red-100 dark:bg-red-950">{message}</div>
      )}
      <Input
        variant="dry"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        variant="dry"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="submit" variant="wide" color="blue">Lanjut</Button>
    </FormWrapper>
  )
}

export default IdentityVerifyForm
