import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../constants/config"
import { Loading, PageWrapper, Select, Button, Input, Table, Thead, Tbody, Tr, Th, Td, PanelTitle } from "@/components/ui"
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiRepeat, FiSearch } from "react-icons/fi"


function ProdukList() {
  const navigate = useNavigate()
  const [produkList, setProdukList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [gotoPage, setGotoPage] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 400)

  function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

useEffect(() => {
  setLoading(true)
  fetch(`${API_BASE}/produk?page=${page}&limit=${limit}&q=${encodeURIComponent(debouncedSearch)}`, {
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
}, [page, limit, debouncedSearch])


  useEffect(() => {
    setPage(1)
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

  const title = <PanelTitle icon={FiPackage}>Daftar Produk</PanelTitle>
  const actions = (
    <>
      <Button onClick={() => navigate("/produk/tambah")} color="purblue">
        <FiPlus className="mr-2" />
        Tambah Produk
      </Button>

    </>
  )


  if (loading) return <Loading text="Mengambil data produk..." />

  return (
    <PageWrapper title={title} actions={actions}>
      <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
        <div className="relative w-full sm:w-auto">
  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
  <Input
    type="text"
    placeholder="Cari produk..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-9" // Padding kiri biar teks nggak numpuk icon
    expand
  />
</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          Tampilkan: {" "}
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            variant="dry"
            minWidth="min-w-[50px]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
          </Select>{" "}
          entri
        </div>
      </div>

      {produkList.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          Tidak ada produk yang cocok.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md">
            <Table>
              <Thead>
                <Tr>
                  <Th>Nama</Th>
                  <Th>Kategori</Th>
                  <Th>Stok</Th>
                  <Th>Harga</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {produkList.map((produk) => (
                  <Tr key={produk.id}>
                    <Td >{produk.nama}</Td>
                    <Td >{produk.kategori}</Td>
                    <Td >{produk.stok}</Td>
                    <Td >Rp {produk.harga.toLocaleString()}</Td>
                    <Td className="flex gap-2">
                      <Button onClick={() => navigate(`/produk/${produk.id}/mutasi`)} color="green" variant="subtle">
                        <FiRepeat className="mr-1" />
                        Mutasi
                      </Button>
                      <Button onClick={() => navigate(`/produk/edit/${produk.id}`)} color="yellow" variant="subtle">
                        <FiEdit2 className="mr-1" />
                        Edit
                      </Button>
                      <Button onClick={() => confirmDelete(produk.id, produk.nama)} color="red" variant="subtle">
                        <FiTrash2 className="mr-1" />
                        Hapus
                      </Button>

                    </Td>

                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                color="gray"
                variant="subtle"
                className="dark:bg-gray-700"
              >
                ←
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
                →
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Lompat ke halaman:</span>
              <Input
                type="number"
                variant="compact"
                value={gotoPage}
                onChange={(e) => setGotoPage(e.target.value)}
                className="w-20 px-2 py-1 rounded bg-white dark:bg-[#2C2C2C] text-gray-800 dark:text-white text-sm"
                min={1}
                max={totalPages}
              />
              <Button
                onClick={() => {
                  if (gotoPage.trim() === "" || isNaN(Number(gotoPage))) return;
                  const target = Number(gotoPage);
                  if (target >= 1 && target <= totalPages) {
                    setPage(target)
                    window.scrollTo(0, 0)
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
        </>
      )}
    </PageWrapper>
  )

}

export default ProdukList
