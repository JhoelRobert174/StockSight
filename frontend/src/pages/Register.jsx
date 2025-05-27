import { useState } from "react"

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:6543/register", {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Register
                </h2>

                {message && <p className="mb-4 text-red-500">{message}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded"
                />

                <button
                    type="submit"
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Daftar
                </button>
            </form>
        </div>
    )
}

export default Register
