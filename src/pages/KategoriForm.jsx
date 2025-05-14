import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function KategoriForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [nama, setNama] = useState("")

  useEffect(() => {
    if (isEdit) {
      setNama("Alat Tulis")
    }
  }, [isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isEdit ? "Edit Kategori" : "Tambah Kategori", nama)
    navigate("/kategori")
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit" : "Tambah"} Kategori
      </h1>
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
