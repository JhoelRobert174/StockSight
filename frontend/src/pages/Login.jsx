import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper } from "@/components/ui"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setMessage("Username dan password wajib diisi.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      await login(username, password)
      navigate("/dashboard")
    } catch (err) {
      setMessage("Login gagal: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper title="Login" onSubmit={handleSubmit}>
      {message && (
        <div className="text-red-500 bg-red-100 dark:bg-red-950 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

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
        color="blue"
        disabled={isLoading}
      >
        {isLoading ? "Masuk..." : "Masuk"}
      </Button>

      <p className="mt-4 text-center text-black dark:text-gray-400">
        Belum punya akun?{" "}
        <a href="/register" className="text-blue-600 dark:text-blue-400 underline">
          Daftar di sini
        </a>
      </p>
      <p className="mt-2 text-center text-black dark:text-gray-400">
        Lupa password?{" "}
        <a href="/verify" className="text-blue-600 dark:text-blue-400 underline">
          Reset di sini
        </a>
      </p>

    </FormWrapper>
  )
}

export default Login
