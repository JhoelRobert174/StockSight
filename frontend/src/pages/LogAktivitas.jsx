import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"

function LogAktivitas() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [gotoPage, setGotoPage] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/log-aktivitas?page=${page}&limit=${limit}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal memuat data log")
        return res.json()
      })
      .then(data => {
        setLogs(data.data || [])
        setTotalPages(Math.ceil((data.total || 0) / limit))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [page, limit])

  if (loading) return <p className="text-center">Memuat log aktivitas...</p>
  if (error) return <p className="text-center text-red-500">❌ {error}</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header: Title + Limit Selector */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
        <div className="text-sm text-gray-600">
          Tampilkan{" "}
          <select
            value={limit}
            onChange={e => {
              setLimit(Number(e.target.value))
              setPage(1)
            }}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>{" "}
          entri
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white shadow-md rounded-xl divide-y">
        {logs.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">Tidak ada log ditemukan.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="p-4 hover:bg-gray-50">
              <div className="text-sm text-gray-600">
                {new Date(log.waktu).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
              <div className="font-medium text-gray-800">{log.aksi}</div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        {/* ← Nomor → */}
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

        {/* Lompat Halaman */}
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
    </div>
  )
}

export default LogAktivitas
