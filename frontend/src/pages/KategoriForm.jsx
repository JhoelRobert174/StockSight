import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"
import { Button, Input, PageWrapper } from "@/components/ui"

function KategoriForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [nama, setNama] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      fetch(`${API_BASE}/kategori/${id}`, { credentials: "include" })
        .then(res => {
          if (!res.ok) return Promise.reject(`Gagal ambil data kategori (${res.status})`)
          return res.json()
        })
        .then(data => {
          setNama(data.nama)
        })
        .catch(err => {
          console.error(err)
          setError(typeof err === 'string' ? err : (err.message || "Terjadi kesalahan saat mengambil data."))
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

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
      if (!res.ok) throw new Error(data.error || `Gagal ${isEdit ? "update" : "simpan"} kategori (${res.status})`)

      navigate("/kategori")
    } catch (err) {
      console.error(err)
      setError(err.message || `Terjadi kesalahan saat ${isEdit ? "update" : "menyimpan"} data.`)
    } finally {
      setLoading(false)
    }
  }

  if (isEdit && loading && !nama) {
    return (
      <PageWrapper title="Edit Kategori" centered>
        <div className="text-center text-gray-800 dark:text-gray-100">Loading...</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={isEdit ? "Edit Kategori" : "Tambah Kategori"}>
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="nama"
            name="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Kategori"
            variant="dry"
            disabled={loading && !isEdit}
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit" color="blue" disabled={loading}>
            {loading ? (isEdit ? 'Menyimpan...' : 'Menambahkan...') : 'Simpan'}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/kategori")}
            color="red"
            variant="outline"
            disabled={loading}
          >
            Batal
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}

export default KategoriForm
