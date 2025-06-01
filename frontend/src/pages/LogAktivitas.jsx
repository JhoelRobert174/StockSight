import { useEffect, useState } from "react"
import { API_BASE } from "../constants/config"
import PageWrapper from "../components/ui/PageWrapper"
import { Button, Input, Select, Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui"

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

  const title = "Log Aktivitas"

  return (
    <PageWrapper title={title}>
      <div className="flex flex-col justify-end sm:flex-row items-center mb-6 gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span>Tampilkan:</span>
          <Select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value))
              setPage(1)
            }}
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
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Memuat log...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 dark:text-red-400">❌ {error}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Tidak ada log ditemukan.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md">
            <Table minWidth="480">
              <Thead>
                <Tr>
                  <Th>Waktu</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs.map((log, i) => (
                  <Tr key={i}>
                    <Td className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {formatWaktu(log.waktu)}
                    </Td>
                    <Td className="text-gray-800 dark:text-white">{log.aksi}</Td>
                  </Tr>
                ))}
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
                >
                  ←
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    onClick={() => setPage(p)}
                    color={p === page ? "blue" : "gray"}
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
                >
                  →
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Lompat ke:</span>
                <Input
                  type="number"
                  variant="compact"
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value)}
                  className="w-20"
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
                  color="blue"
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
