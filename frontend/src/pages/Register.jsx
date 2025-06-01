import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper, Message } from "@/components/ui"
import { API_BASE } from "../constants/config"

function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const showMessage = (text, type = "error") => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      showMessage("Semua field wajib diisi.")
      return
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/
    if (!emailRegex.test(email)) {
      showMessage("Format email tidak valid.")
      return
    }

    if (password !== confirmPassword) {
      showMessage("Password dan konfirmasi tidak cocok.")
      return
    }

    if (username === password) {
      showMessage("Password tidak boleh sama dengan username.")
      return
    }

    setIsLoading(true)
    setMessage("") // clear sebelumnya

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal registrasi")

      showMessage("Registrasi berhasil. Mengarahkan ke login...", "success")

      setTimeout(() => {
        navigate("/login")
      }, 2000)

      setEmail("")
      setUsername("")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      showMessage("Error: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper title="Register" onSubmit={handleSubmit}>
      {message && <Message type={messageType}>{message}</Message>}

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
      <Input
        variant="dry"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        variant="dry"
        placeholder="Konfirmasi Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        type="submit"
        variant="wide"
        color="green"
        disabled={isLoading}
      >
        {isLoading ? "Mendaftarkan..." : "Daftar"}
      </Button>
    </FormWrapper>
  )
}

export default Register
