import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { API_BASE } from "../constants/config"
import { PanelTitle, Button, Input, Select, PageWrapper, Loading } from "@/components/ui"
import {
  FiPlus,
  FiEdit2,
  FiX,
} from "react-icons/fi"

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
  const [displayHarga, setDisplayHarga] = useState("")


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

          setDisplayHarga(formatNumber(data.harga || 0))
          setLoading(false)
        })

        .catch(err => setError(err))
    }
  }, [id, isEdit, kategoriList])

  function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }


  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "harga") {
      // Bersihkan titik, lalu parse ke integer
      const rawValue = value.replace(/\./g, "")
      const parsed = parseInt(rawValue) || 0

      setDisplayHarga(formatNumber(rawValue))
      setForm({ ...form, harga: parsed })
      return
    }

    setForm({
      ...form,
      [name]: ["stok", "kategori_id"].includes(name) ? parseInt(value) : value
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

  if (loading) return <Loading text="Mengambil data produk..." />

  return (
    <PageWrapper
      title={
        <PanelTitle icon={isEdit ? FiEdit2 : FiPlus}>
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </PanelTitle>
      }
    >

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
          type="text"
          value={displayHarga}
          onChange={handleChange}
          placeholder="Harga"
          variant="dry"
        />


        <div className="flex justify-between">
          <Button type="submit"
            color="purblue"
            variant="default">
            <FiPlus className="mr-2" />
            Simpan
          </Button>
          <Button type="button" onClick={() => navigate("/produk")}
            color="red"
            variant="outline">
            <FiX className="mr-2" />
            Batal
          </Button>
        </div>

      </form>
    </PageWrapper>
  )
}

export default ProdukForm
