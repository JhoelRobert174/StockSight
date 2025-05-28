import { useState } from "react"
import { Button, Input } from "@/components/ui"
import { API_BASE } from "../constants/config"

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })


            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Gagal registrasi")

            setMessage("Registrasi berhasil. Silakan login.")
            setUsername("")
            setPassword("")
        } catch (err) {
            setMessage("Error: " + err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md dark:bg-gray-800 rounded px-8 pt-6 pb-8 w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Register
                </h2>

                {message && <p className="mb-4 text-red-500">{message}</p>}

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
                    color = "green"
                >
                    Daftar
                </Button>
            </form>
        </div>
    )
}

export default Register
