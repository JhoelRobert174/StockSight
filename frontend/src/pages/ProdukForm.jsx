import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"

function ProdukForm() {
  const navigate = useNavigate()
  const { id } = useParams() // jika edit
  const isEdit = !!id

  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    stok: "",
    harga: "",
  })

  // Dummy fetch data produk
  useEffect(() => {
    if (isEdit) {
      // Simulasi ambil data berdasarkan ID
      setForm({
        nama: "Sabun Mandi",
        kategori: "Kebutuhan Rumah",
        stok: "12",
        harga: "8000",
      })
    }
  }, [isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isEdit ? "Edit Produk" : "Tambah Produk", form)
    navigate("/produk")
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit" : "Tambah"} Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama Produk"
          className="w-full px-3 py-2 border-gray-300 rounded focus:ring"
        />
        <input
          name="kategori"
          value={form.kategori}
          onChange={handleChange}
          placeholder="Kategori"
          className="w-full px-3 py-2 border-gray-300 rounded focus:ring"
        />
        <input
          name="stok"
          type="number"
          value={form.stok}
          onChange={handleChange}
          placeholder="Stok"
          className="w-full px-3 py-2 border-gray-300 rounded focus:ring"
        />
        <input
          name="harga"
          type="number"
          value={form.harga}
          onChange={handleChange}
          placeholder="Harga"
          className="w-full px-3 py-2 border-gray-300 rounded focus:ring"
        />

        <div className="flex justify-between">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Simpan
          </button>
          <button type="button" onClick={() => navigate("/produk")} className="px-4 py-2 rounded border-gray-300 focus:ring">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProdukForm
