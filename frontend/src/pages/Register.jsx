import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, FormWrapper } from "@/components/ui"
import { API_BASE } from "../constants/config"

function Register() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
            setMessage("Semua field wajib diisi.")
            return
        }

        const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/
        if (!emailRegex.test(email)) {
            setMessage("Format email tidak valid.")
            return
        }
        if (password !== confirmPassword) {
            setMessage("Error: Password dan konfirmasi tidak cocok.")
            return
        }
        if (username === password) {
            setMessage("Password tidak boleh sama dengan username.")
            return
        }


        setIsLoading(true)
        setMessage("")

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Gagal registrasi")

            setMessage("Registrasi berhasil. Mengarahkan ke login...")
            setTimeout(() => {
                navigate("/login")
            }, 2000)

            setEmail("")
            setUsername("")
            setPassword("")
            setConfirmPassword("")
        } catch (err) {
            setMessage("Error: " + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <FormWrapper title="Register" onSubmit={handleSubmit}>
            {message && (
                <div
                    className={`mb-4 px-4 py-2 rounded ${message.startsWith("Error")
                        ? "text-red-500 bg-red-100 dark:bg-red-950"
                        : "text-green-600 bg-green-100 dark:bg-green-950"
                        }`}
                >
                    {message}
                </div>
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
