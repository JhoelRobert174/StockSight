import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../constants/config"
import { Button, Input, PageWrapper, Select, Table, Thead, Tbody, Tr, Th, Td, PanelTitle, Loading } from "@/components/ui"
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi"

function KategoriList() {
  const navigate = useNavigate()
  const [kategoriList, setKategoriList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [gotoPage, setGotoPage] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/kategori?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`, {
      credentials: "include"
    })
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
  }, [page, limit, searchTerm])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, limit])

  const confirmDelete = async (id, nama) => {
    const ok = window.confirm(`Yakin ingin menghapus kategori ${nama}?`)
    if (!ok) return

    try {
      const res = await fetch(`${API_BASE}/kategori/${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal hapus kategori")

      setKategoriList(prev => prev.filter(k => k.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const title = <PanelTitle icon={FiLayers}>Daftar Kategori</PanelTitle>
  const actions = (
    <Button onClick={() => navigate("/kategori/tambah")} color="purblue">
      <FiPlus className="mr-2" />
      Tambah Kategori
    </Button>
  )

  if (loading && kategoriList.length === 0) {
    return <Loading text="Mengambil data kategori..." />
  }


  return (
    <PageWrapper title={title} actions={actions}>
      <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
        <div className="relative w-full sm:w-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Cari Kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
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

      {!loading && kategoriList.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          Tidak ada kategori yang cocok atau data tidak ditemukan.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md">
            <Table minWidth="480">
              <Thead>
                <Tr>
                  <Th>Nama Kategori</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {kategoriList.map((kat) => (
                  <Tr key={kat.id}>
                    <Td>{kat.nama}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/kategori/edit/${kat.id}`)}
                          color="yellow"
                          variant="subtle"
                        >
                          <FiEdit2 className="mr-1" size={16} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => confirmDelete(kat.id, kat.nama)}
                          color="red"
                          variant="subtle"
                        >
                          <FiTrash2 className="mr-1" />
                          Hapus
                        </Button>

                      </div>
                    </Td>
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

export default KategoriList
