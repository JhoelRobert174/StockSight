import { useNavigate } from "react-router-dom"
import { useState } from "react"

function KategoriList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const dummyKategori = [
    { id: 1, nama: "Kebutuhan Rumah" },
    { id: 2, nama: "Alat Tulis" },
    { id: 3, nama: "Makanan" },
  ]

  const filteredKategori = dummyKategori
    .filter((kat) =>
      kat.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a.nama.toLowerCase()
      const valB = b.nama.toLowerCase()
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
    })

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const confirmDelete = (nama) => {
    const ok = window.confirm(`Yakin ingin menghapus kategori ${nama}?`)
    if (ok) {
      alert(`Kategori ${nama} berhasil dihapus.`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Kategori</h1>
        <button
          onClick={() => navigate("/kategori/tambah")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          + Tambah Kategori
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari kategori..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredKategori.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Tidak ada kategori yang cocok.</div>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-md text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th
                onClick={toggleSort}
                className="cursor-pointer px-6 py-3 text-left"
              >
                Nama Kategori
              </th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredKategori.map((kat) => (
              <tr key={kat.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">{kat.nama}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => navigate(`/kategori/edit/${kat.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(kat.nama)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default KategoriList
