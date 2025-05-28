import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"
import { Button, Input } from "@/components/ui"

function KategoriForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [nama, setNama] = useState("")
  const [loading, setLoading] = useState(isEdit) // Tetap true jika isEdit
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      setLoading(true) // Pastikan loading true di awal fetch jika isEdit
      fetch(`${API_BASE}/kategori/${id}`, {
        credentials: "include",
      })
        .then(res => {
          if (!res.ok) return Promise.reject(`Gagal ambil data kategori (${res.status})`) // Pesan error lebih baik
          return res.json()
        })
        .then(data => {
          setNama(data.nama)
        })
        .catch(err => {
          console.error(err)
          setError(typeof err === 'string' ? err : (err.message || "Terjadi kesalahan saat mengambil data."))
        })
        .finally(() => setLoading(false)) // setLoading(false) setelah semua selesai
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true) // Set loading true saat submit

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
      if (!res.ok) throw new Error(data.error || `Gagal ${isEdit ? "update" : "simpan"} kategori (${res.status})`) // Pesan error lebih baik

      navigate("/kategori")
    } catch (err) {
      console.error(err)
      setError(err.message || `Terjadi kesalahan saat ${isEdit ? "update" : "menyimpan"} data.`)
    } finally {
      setLoading(false) // Set loading false setelah submit selesai
    }
  }

  // Loading state untuk seluruh form, mirip ProdukForm saat isEdit
  if (isEdit && loading && !nama) { // Tampilkan loading hanya jika isEdit, loading, dan belum ada data nama
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    )
  }

  return (
    // Mengadopsi struktur div utama dari ProdukForm.jsx
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      {/* Judul halaman konsisten dengan ProdukForm.jsx */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {isEdit ? "Edit" : "Tambah"} Kategori
      </h1>

      {/* Pesan Error disamakan dengan ProdukForm.jsx */}
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div> {/* Tambahan div untuk label jika diperlukan di masa depan */}
          {/* <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</label> */}
          <Input
            id="nama" // Tambah id untuk accessibility dengan label
            name="nama" // Tambah name attribute
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Kategori"
            // Class input disamakan dengan ProdukForm.jsx (px-3)
            variant="dry" // Menggunakan variant "dry" untuk konsistensi
            disabled={loading && !isEdit} // Disable input saat loading tambah baru
          />
        </div>
        <div className="flex justify-between">
          <Button
            type="submit"
            // Class tombol simpan disamakan dengan ProdukForm.jsx
            color="blue"
            disabled={loading} // Disable tombol saat loading
          >
            {loading ? (isEdit ? 'Menyimpan...' : 'Menambahkan...') : 'Simpan'}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/kategori")}
            color="red"
            variant="outline"
            disabled={loading} // Disable tombol saat loading
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}

export default KategoriForm