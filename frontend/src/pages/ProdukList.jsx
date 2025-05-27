import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../constants/config"

function ProdukList() {
  const navigate = useNavigate()
  const [produkList, setProdukList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [gotoPage, setGotoPage] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/produk?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`, {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data produk"))
      .then(data => {
        setProdukList(data.data || [])
        setTotalPages(Math.ceil((data.meta?.total || 0) / limit))
      })
      .catch(err => {
        console.error(err)
        setProdukList([])
      })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm])

  useEffect(() => {
    setPage(1) // reset halaman saat search atau limit berubah
  }, [searchTerm, limit])

  const confirmDelete = async (id, nama) => {
    const ok = window.confirm(`Yakin ingin menghapus ${nama}?`)
    if (!ok) return

    try {
      const res = await fetch(`${API_BASE}/produk/${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal hapus produk")

      setProdukList(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div>Loading...</div>

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

      <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-600">
          Tampilkan{" "}
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
          </select>{" "}
          entri
        </div>
      </div>

      {produkList.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Tidak ada produk yang cocok.</div>
      ) : (
        <>
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
              {produkList.map((produk) => (
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
                      onClick={() => confirmDelete(produk.id, produk.nama)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${p === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                →
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lompat ke halaman:</span>
              <input
                type="number"
                value={gotoPage}
                onChange={(e) => setGotoPage(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                min={1}
                max={totalPages}
              />
              <button
                onClick={() => {
                  const target = Number(gotoPage)
                  if (!isNaN(target) && target >= 1 && target <= totalPages) {
                    setPage(target)
                  }
                  setGotoPage("")
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Lompat
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProdukList
