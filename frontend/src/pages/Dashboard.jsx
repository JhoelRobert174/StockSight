import { useState, useEffect } from "react"
import { FixedSizeList as List } from "react-window"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { API_BASE } from "../constants/config"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar} from "recharts"
import { PanelTitle, Input, Button, PageWrapper } from "@/components/ui"
import { FiBarChart2, FiPieChart, FiList, FiTrendingUp, FiGrid, FiX } from "react-icons/fi"

const PRODUK_COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#84CC16"]
const KATEGORI_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]



const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white dark:bg-[#2C2C2C] text-gray-800 dark:text-[#E4E4E4] p-3 rounded shadow text-sm">
      <div className="font-semibold">{label || name}</div>
      <div>
        <span className="text-gray-600 dark:text-gray-300">stok:</span>{" "}
        <span className="text-blue-600 dark:text-[#BB86FC]">{value}</span>
      </div>
    </div>
  )
}

const HargaTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { waktu, harga } = payload[0].payload
  return (
    <div className="bg-white dark:bg-[#2C2C2C] text-gray-800 dark:text-[#E4E4E4] p-3 rounded shadow text-sm">
      <div className="font-semibold">{waktu}</div>
      <div>
        <span className="text-gray-600 dark:text-gray-300">Harga:</span>{" "}
        <span className="text-blue-600 dark:text-[#BB86FC]">
          {harga.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
        </span>
      </div>
    </div>
  )
}


function Dashboard() {
  const { user, loading } = useAuth()
  const [produkList, setProdukList] = useState([])
  const [kategoriStok, setKategoriStok] = useState([])
  const [selectedKategori, setSelectedKategori] = useState(null)
  const [selectedProduk, setSelectedProduk] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const resetFilter = () => {
    setSelectedKategori(null)
    setSelectedProduk(null)
  }


  useEffect(() => {
    fetch(`${API_BASE}/produk`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject("Gagal fetch produk"))
      .then((data) => {
        const produk = data.data || []
        setProdukList(produk)

        const stokMap = produk.reduce((acc, p) => {
          acc[p.kategori] = (acc[p.kategori] || 0) + p.stok
          return acc
        }, {})

        const stokArray = Object.entries(stokMap)
          .map(([kategori, stok]) => ({ kategori, stok }))
          .sort((a, b) => b.stok - a.stok)

        const top6 = stokArray.slice(0, 6)
        const sisa = stokArray.slice(6)
        if (sisa.length) {
          const totalLain = sisa.reduce((sum, k) => sum + k.stok, 0)
          top6.push({ kategori: "Lainnya", stok: totalLain })
        }

        setKategoriStok(top6)
      })
      .catch(() => setProdukList([]))
  }, [])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const produkFiltered = selectedKategori
    ? produkList.filter(
      (p) =>
        p.kategori === selectedKategori &&
        p.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : []

  return (
    <PageWrapper title={<PanelTitle icon={FiGrid}>Dashboard</PanelTitle>}>
      <div className="space-y-8">
        {/* Chart Total Stok */}
        <div className="bg-white dark:bg-[#2C2C2C] p-6 rounded-xl shadow-md">
          <PanelTitle icon={FiBarChart2}>Total Stok Semua Produk</PanelTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={produkList}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stok">
  {produkList.map((_, index) => (
    <Cell key={`bar-${index}`} fill={PRODUK_COLORS[index % PRODUK_COLORS.length]} />
  ))}
</Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grid 3 Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-[#2C2C2C] p-6 rounded-xl shadow-md">
            <PanelTitle icon={FiPieChart}>Distribusi Stok per Kategori</PanelTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={kategoriStok}
                  dataKey="stok"
                  nameKey="kategori"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  onClick={(data) => {
                    setSelectedKategori(data.name)
                    setSelectedProduk(null)
                  }}
                >
                  {kategoriStok.map((_, index) => (
                    <Cell key={index} fill={KATEGORI_COLORS[index % KATEGORI_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Produk List by Kategori */}
          <div className="bg-white dark:bg-[#2C2C2C] p-6 rounded-xl shadow-md">
            <PanelTitle icon={FiList}>
              {selectedKategori ? `Produk: ${selectedKategori}` : "Pilih kategori"}
            </PanelTitle>

            {selectedKategori ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="text"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={resetFilter}
                    color="red"
                    variant="outline"
                    title="Hapus filter kategori"
                    className="p-2"
                  >
                    <FiX className="w-5 h-5" />
                  </Button>

                </div>


                <div className="max-h-64 overflow-y-auto">
                  <List
                    height={250}
                    itemCount={produkFiltered.length}
                    itemSize={50}
                    width={"100%"}
                  >
                    {({ index, style }) => (
                      <div
                        style={style}
                        key={produkFiltered[index].id}
                        onClick={() => setSelectedProduk(produkFiltered[index])}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 border-b text-gray-800 dark:text-white"
                      >
                        {produkFiltered[index].nama} —{" "}
                        <span className="text-blue-600 dark:text-[#BB86FC]">
                          {produkFiltered[index].stok.toLocaleString()} stok
                        </span>
                      </div>
                    )}
                  </List>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic mt-4 text-center">
                Pilih kategori dari diagram untuk melihat produk.
              </p>
            )}

          </div>

          {/* Line Chart Harga */}
          <div className="bg-white dark:bg-[#2C2C2C] p-6 rounded-xl shadow-md">
            <PanelTitle icon={FiTrendingUp}>
              {selectedProduk ? `Harga: ${selectedProduk.nama}` : "Pilih produk"}
            </PanelTitle>

            {selectedProduk ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={(selectedProduk.hargaHistory || []).map((h) => ({
                    waktu: new Date(h.waktu).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    harga: h.harga,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="waktu" />
                  <YAxis />
                  <Tooltip content={<HargaTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="harga"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic mt-4 text-center">
                Pilih produk di atas untuk melihat grafik harga.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Dashboard
