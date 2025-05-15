import { useNavigate } from "react-router-dom"
import { useState } from "react"

function ProdukList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState({ key: "nama", order: "asc" })

  const dummyProduk = [
    { id: 1, nama: "Sabun Mandi", kategori: "Kebutuhan Rumah", stok: 12, harga: 8000 },
    { id: 2, nama: "Buku Tulis", kategori: "Alat Tulis", stok: 35, harga: 4000 },
  ]

  const filteredProduk = dummyProduk.filter((produk) =>
    produk.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProduk = [...filteredProduk].sort((a, b) => {
    const valA = a[sortBy.key]
    const valB = b[sortBy.key]
    return sortBy.order === "asc"
      ? valA > valB
        ? 1
        : -1
      : valA < valB
      ? 1
      : -1
  })

  const toggleSort = (key) => {
    setSortBy((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }))
  }

  const confirmDelete = (nama) => {
    const ok = window.confirm(`Yakin ingin menghapus ${nama}?`)
    if (ok) {
      alert(`${nama} berhasil dihapus.`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
        <button
          onClick={() => navigate("/produk/tambah")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          + Tambah Produk
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari produk..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {sortedProduk.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Tidak ada produk yang cocok.</div>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-md text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th onClick={() => toggleSort("nama")} className="cursor-pointer px-6 py-3 text-left">Nama</th>
              <th onClick={() => toggleSort("kategori")} className="cursor-pointer px-6 py-3 text-left">Kategori</th>
              <th onClick={() => toggleSort("stok")} className="cursor-pointer px-6 py-3 text-right">Stok</th>
              <th onClick={() => toggleSort("harga")} className="cursor-pointer px-6 py-3 text-right">Harga</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProduk.map((produk) => (
              <tr key={produk.id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-3">{produk.nama}</td>
                <td className="px-6 py-3">{produk.kategori}</td>
                <td className="px-6 py-3 text-right">{produk.stok}</td>
                <td className="px-6 py-3 text-right">Rp {produk.harga.toLocaleString()}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => navigate(`/produk/edit/${produk.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(produk.nama)}
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

export default ProdukList
