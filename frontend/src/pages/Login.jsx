import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper } from "@/components/ui"

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
    <FormWrapper title="Login" onSubmit={handleSubmit}>
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
      >
        Masuk
      </Button>

      <p className="mt-4 text-center text-black dark:text-gray-400">
        Belum punya akun?{" "}
        <a href="/register" className="text-blue-600 dark:text-blue-400 underline">
          Daftar di sini
        </a>
      </p>
    </FormWrapper>
  )
}

export default Login
