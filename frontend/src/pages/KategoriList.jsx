import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"

function KategoriList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [kategoriList, setKategoriList] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/kategori?page=${page}&limit=${limit}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data kategori"))
      .then(data => {
        setKategoriList(data.data || [])
        setTotalPages(Math.ceil((data.meta?.total || 0) / limit))
      })
      .catch(err => {
        console.error(err)
        setKategoriList([])
      })
      .finally(() => setLoading(false))
  }, [page, limit])


  const filtered = kategoriList
    .filter(kat => kat.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const valA = a.nama.toLowerCase()
      const valB = b.nama.toLowerCase()
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })

  const paginated = filtered.slice((page - 1) * limit, page * limit)

  const toggleSort = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
  }

  const confirmDelete = (id, nama) => {
    const ok = window.confirm(`Yakin ingin menghapus kategori ${nama}?`)
    if (!ok) return

    fetch(`${API_BASE}/kategori/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal hapus kategori")
        setKategoriList(prev => prev.filter(k => k.id !== id))
      })
      .catch(err => alert(err.message))
  }

  useEffect(() => {
    setPage(1) // Reset halaman saat pencarian berubah
  }, [searchTerm, limit])

  if (loading) return <div>Loading...</div>

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

      <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Cari kategori..."
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

      {paginated.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Tidak ada kategori yang cocok.</div>
      ) : (
        <>
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-md text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th onClick={toggleSort} className="cursor-pointer px-6 py-3 text-left">
                  Nama Kategori
                </th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginated.map((kat) => (
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
                      onClick={() => confirmDelete(kat.id, kat.nama)}
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
          <div className="flex justify-center items-center gap-2 mt-4">
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
        </>
      )}
    </div>
  )
}

export default KategoriList
