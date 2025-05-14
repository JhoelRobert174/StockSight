import { useNavigate } from "react-router-dom"

function ProdukList() {
  const navigate = useNavigate()

  const dummyProduk = [
    { id: 1, nama: "Sabun Mandi", kategori: "Kebutuhan Rumah", stok: 12, harga: 8000 },
    { id: 2, nama: "Buku Tulis", kategori: "Alat Tulis", stok: 35, harga: 4000 },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
        <button
          onClick={() => navigate("/produk/tambah")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          + Tambah Produk
        </button>
      </div>

      {dummyProduk.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Tidak ada produk.</div>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-md text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Kategori</th>
              <th className="px-6 py-3 text-right">Stok</th>
              <th className="px-6 py-3 text-right">Harga</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyProduk.map((produk) => (
              <tr key={produk.id} className="hover:bg-gray-50">
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
                    onClick={() => alert(`Hapus ${produk.nama}?`)}
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
