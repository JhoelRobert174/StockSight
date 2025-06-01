import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"
import { Button, Input, PageWrapper, Loading, PanelTitle } from "@/components/ui"
import { FiTag, FiPlus, FiX } from "react-icons/fi"

function KategoriForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [nama, setNama] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    fetch(`${API_BASE}/kategori/${id}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject(`Gagal ambil data kategori (${res.status})`))
      .then(data => setNama(data.nama))
      .catch(err => {
        console.error(err)
        setError(typeof err === 'string' ? err : (err.message || "Terjadi kesalahan saat mengambil data."))
      })
      .finally(() => setLoading(false))
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
      <PageWrapper
        title={<PanelTitle icon={FiTag}>Edit Kategori</PanelTitle>}
        centered
      >
        <Loading text="Mengambil data kategori..." />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title={
        <PanelTitle icon={FiTag}>
          {isEdit ? "Edit Kategori" : "Tambah Kategori"}
        </PanelTitle>
      }
    >
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="nama"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Kategori"
          type="text"
          disabled={loading && !isEdit}
        />
        <div className="flex justify-between">
          <Button type="submit" color="purblue" disabled={loading}>
            <FiPlus className="mr-2" />
            {loading ? (isEdit ? 'Menyimpan...' : 'Menambahkan...') : 'Simpan'}

          </Button>
          <Button
            type="button"
            onClick={() => navigate("/kategori")}
            color="red"
            variant="outline"
            disabled={loading}
          >
            <FiX className="mr-2" />
            Batal
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}

export default KategoriForm
