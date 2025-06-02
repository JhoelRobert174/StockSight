import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper, Message } from "@/components/ui"
import { Link } from "react-router-dom"


function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const showMessage = (text, type = "error") => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      showMessage("Username dan password wajib diisi.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      await login(username, password)
      navigate("/dashboard")
    } catch (err) {
      showMessage("Login gagal: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper title="Login" onSubmit={handleSubmit}>
      {message && <Message type={messageType}>{message}</Message>}

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

      <Button
        type="submit"
        variant="wide"
        color="purblue"
        disabled={isLoading}
      >
        {isLoading ? "Masuk..." : "Masuk"}
      </Button>

      <p className="mt-4 text-center text-black dark:text-gray-400">
        Belum punya akun?{" "}
        <Link to="/register" className="text-blue-600 dark:text-blue-400 underline">
          Daftar di sini
        </Link>
      </p>
      <p className="mt-2 text-center text-black dark:text-gray-400">
        Lupa password?{" "}
        <Link to="/verify" className="text-blue-600 dark:text-blue-400 underline">
          Reset di sini
        </Link>
      </p>

    </FormWrapper>
  )
}

export default Login
