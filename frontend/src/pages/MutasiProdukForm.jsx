import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { API_BASE } from "../constants/config"
import { Button, Input, PageWrapper } from "@/components/ui"

function MutasiProdukForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [produkNama, setProdukNama] = useState("")
  const [form, setForm] = useState({
    aksi: "masuk",
    jumlah: "",
    harga: ""
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/produk/${id}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data produk"))
      .then(data => {
        setProdukNama(data.nama)
        setForm(prev => ({ ...prev, harga: data.harga }))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Gagal memuat data produk")
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === "jumlah" ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const payload = {
        ...form,
        harga: form.harga !== "" ? parseFloat(form.harga) : undefined
      }

      const res = await fetch(`${API_BASE}/produk/${id}/mutasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mutasi produk")

      navigate("/produk")
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <PageWrapper title={`Mutasi Produk: ${produkNama}`}>
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Aksi: masuk / keluar */}
        <select
          name="aksi"
          value={form.aksi}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="masuk">Tambah Stok</option>
          <option value="keluar">Kurangi Stok</option>
        </select>

        {/* Jumlah Mutasi */}
        <Input
          name="jumlah"
          type="number"
          value={form.jumlah}
          onChange={handleChange}
          placeholder="Jumlah"
          variant="dry"
          required
        />

        {/* Harga opsional */}
        <Input
          name="harga"
          type="number"
          value={form.harga}
          onChange={handleChange}
          placeholder="Harga (opsional)"
          variant="dry"
        />

        <div className="flex justify-between">
          <Button type="submit" color="blue" variant="default">
            Simpan Mutasi
          </Button>
          <Button type="button" onClick={() => navigate("/produk")} color="red" variant="outline">
            Batal
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}

export default MutasiProdukForm
