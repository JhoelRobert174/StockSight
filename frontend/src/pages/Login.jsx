import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Button, Input } from "@/components/ui"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      console.log("Login sukses")
      navigate("/dashboard")
    } catch (err) {
      console.error("Login error:", err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h2>

        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="wide"
          color = "blue"
        >
          Masuk
        </Button>
        <p className="mt-4 text-center text-black dark:text-gray-400">
          Belum punya akun? <a href="/register" className="text-blue-600 dark:text-blue-400 underline">Daftar di sini</a>
        </p>

      </form>
    </div>
  )
}

export default Login
