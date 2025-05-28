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
          <input
            id="nama" // Tambah id untuk accessibility dengan label
            name="nama" // Tambah name attribute
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Kategori"
            // Class input disamakan dengan ProdukForm.jsx (px-3)
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading && !isEdit} // Disable input saat loading tambah baru
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            // Class tombol simpan disamakan dengan ProdukForm.jsx
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" // transition-colors adalah praktik baik
            disabled={loading} // Disable tombol saat loading
          >
            {loading ? (isEdit ? 'Menyimpan...' : 'Menambahkan...') : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate("/kategori")}
            // Class tombol batal disamakan dengan ProdukForm.jsx, dengan penyesuaian hover & text dark mode
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={loading} // Disable tombol saat loading
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

export default KategoriForm