import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"

function KategoriForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [nama, setNama] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetch(`${API_BASE}/kategori/${id}`, {
        credentials: "include",
      })
        .then((res) => res.ok ? res.json() : Promise.reject("Gagal ambil data kategori"))
        .then((data) => {
          setNama(data.nama)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError(err)
        })
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const url = isEdit ? `${API_BASE}/kategori/${id}` : `${API_BASE}/kategori`
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nama })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal simpan kategori")

      navigate("/kategori")
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit" : "Tambah"} Kategori
      </h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Kategori"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate("/kategori")}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

export default KategoriForm
