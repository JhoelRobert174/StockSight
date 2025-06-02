import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"
import PageWrapper from "../components/ui/PageWrapper"
import { Button, Input, Select, Table, Thead, Tbody, Tr, Th, Td, PanelTitle, Loading, } from "@/components/ui"
import { FiClock, FiSearch } from "react-icons/fi"

function LogAktivitas() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [gotoPage, setGotoPage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/log-aktivitas?page=${page}&limit=${limit}`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : Promise.reject("Gagal memuat data log"))
      .then(data => {
        setLogs(data.data || [])
        setTotalPages(Math.ceil((data.total || 0) / limit))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, limit])

  const formatWaktu = (raw) => {
    try {
      const waktu = new Date(raw)
      if (isNaN(waktu.getTime()) || waktu.getFullYear() <= 1970) return "-"
      return waktu.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "-"
    }
  }

  const title = <PanelTitle icon={FiClock}>Log Aktivitas</PanelTitle>

  return (
    <PageWrapper title={title}>
      <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
<div className="relative w-full sm:w-auto">
  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
  <Input
    type="text"
    placeholder="Cari di Log..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-9" // Padding kiri biar teks nggak numpuk icon
    expand
  />
</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span>Tampilkan:</span>
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            variant="dry"
            minWidth="min-w-[50px]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
          </Select>
          <span>entri</span>
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <Loading text="Memuat log aktivitas..." />
      ) : error ? (
        <div className="text-center py-10 text-red-500 dark:text-red-400">❌ {error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md">
            <Table layout="fixed" minWidth="480">
              <Thead>
                <Tr>
                  <Th>Waktu</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs
                  .filter(log => log.aksi.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((log, i) => (
                    <Tr key={i}>
                      <Td className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatWaktu(log.waktu)}
                      </Td>
                      <Td className="text-gray-800 dark:text-white">
                        {log.aksi?.trim() || <em className="text-gray-400 italic">Tidak ada deskripsi</em>}
                      </Td>
                    </Tr>
                  ))}

                {logs.filter(log => log.aksi.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                  <Tr>
                    <Td colSpan={2} className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 italic">
                      Tidak ditemukan aksi dengan kata tersebut.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="flex flex-wrap justify-center items-center gap-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  color="gray"
                  variant="subtle"
                  className="dark:bg-gray-700"
                >
                  &larr;
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    onClick={() => setPage(p)}
                    color={p === page ? "purblue" : "gray"}
                    variant="subtle"
                    className={
                      p === page
                        ? "text-white"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500"
                    }
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  color="gray"
                  variant="subtle"
                  className="dark:bg-gray-700"
                >
                  &rarr;
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Lompat ke:</span>
                <Input
                  type="number"
                  variant="compact"
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value)}
                  className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7F39FB]"
                  min={1}
                  max={totalPages}
                />
                <Button
                  onClick={() => {
                    const target = Number(gotoPage)
                    if (!isNaN(target) && target >= 1 && target <= totalPages) {
                      setPage(target)
                    }
                    setGotoPage("")
                  }}
                  color="purblue"
                  variant="subtle"
                >
                  Lompat
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}

export default LogAktivitas
