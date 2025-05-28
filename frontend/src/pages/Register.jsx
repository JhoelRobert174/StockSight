import { useState } from "react"
import { Button, Input, FormWrapper } from "@/components/ui"
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
        <FormWrapper title="Register">
            {message && (
                <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    color="green"
                >
                    Daftar
                </Button>
            </form>
        </FormWrapper>
    )

}

export default Register
