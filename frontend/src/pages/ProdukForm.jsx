import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { API_BASE } from "../constants/config"
import { Button, Input, Select, PageWrapper } from "@/components/ui"

function ProdukForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [form, setForm] = useState({
    nama: "",
    kategori_id: "",
    stok: "",
    harga: "",
  })
  const [kategoriList, setKategoriList] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/kategori`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject("Gagal ambil kategori"))
      .then(data => setKategoriList(data.data || []))
      .catch(() => setKategoriList([]))
  }, [])


  useEffect(() => {
    if (isEdit) {
      fetch(`${API_BASE}/produk/${id}`, { credentials: "include" })
        .then(res => res.ok ? res.json() : Promise.reject("Gagal ambil produk"))
        .then(data => {
          setForm({
            nama: data.nama,
            kategori_id: kategoriList.find(k => k.nama === data.kategori)?.id || "",
            stok: data.stok,
            harga: data.harga
          })
          setLoading(false)
        })
        .catch(err => setError(err))
    }
  }, [id, isEdit, kategoriList])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: ["stok", "harga", "kategori_id"].includes(name) ? parseInt(value) : value
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.kategori_id || isNaN(form.kategori_id)) {
      setError("Kategori belum dipilih atau tidak valid.")
      return
    }


    const url = isEdit ? `${API_BASE}/produk/${id}` : `${API_BASE}/produk`
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal simpan produk")

      navigate("/produk")
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  if (isEdit && loading) return <div>Loading...</div>

return (
  <PageWrapper title={isEdit ? "Edit Produk" : "Tambah Produk"}>
    {error && (
      <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-950 px-4 py-2 rounded">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="nama"
        value={form.nama}
        onChange={handleChange}
        placeholder="Nama Produk"
        variant="dry"
        type="text"
      />

      <Select
        name="kategori_id"
        value={form.kategori_id}
        onChange={handleChange}
        variant="dry"
      >
        <option value="">-- Pilih Kategori --</option>
        {kategoriList.map(k => (
          <option key={k.id} value={k.id}>{k.nama}</option>
        ))}
      </Select>

      <Input
        name="stok"
        type="number"
        value={form.stok}
        onChange={handleChange}
        placeholder="Stok"
        variant="dry"
      />

      <Input
        name="harga"
        type="number"
        value={form.harga}
        onChange={handleChange}
        placeholder="Harga"
        variant="dry"
      />

      <div className="flex justify-between">
        <Button
          type="submit"
          color="purblue"
          variant="default"
        >
          Simpan
        </Button>
        <Button
          type="button"
          onClick={() => navigate("/produk")}
          color="red"
          variant="outline"
        >
          Batal
        </Button>
      </div>
    </form>
  </PageWrapper>
)
}

export default ProdukForm
