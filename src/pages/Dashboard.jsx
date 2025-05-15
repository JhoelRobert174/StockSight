import { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import { FixedSizeList as List } from "react-window"

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]

const produkData = [
  { id: 1, nama: "Sabun Mandi", kategori: "Kebutuhan Rumah", stok: 12, hargaHistory: [8000, 8200, 7900] },
  { id: 2, nama: "Buku Tulis", kategori: "Alat Tulis", stok: 35, hargaHistory: [4000, 4000, 3900] },
  { id: 3, nama: "Sapu", kategori: "Kebutuhan Rumah", stok: 10, hargaHistory: [10000, 10500, 9900] },
  { id: 4, nama: "Pensil", kategori: "Alat Tulis", stok: 20, hargaHistory: [1500, 1600, 1550] },
  { id: 5, nama: "Roti Tawar", kategori: "Makanan", stok: 25, hargaHistory: [12000, 12500, 11800] },
  { id: 6, nama: "Mi Instan", kategori: "Makanan", stok: 100, hargaHistory: [2500, 2600, 2400] },
  { id: 7, nama: "Telur Ayam", kategori: "Makanan", stok: 60, hargaHistory: [28000, 28500, 27500] },
  { id: 8, nama: "Air Mineral 1L", kategori: "Minuman", stok: 50, hargaHistory: [4000, 4200, 4100] },
  { id: 9, nama: "Teh Botol", kategori: "Minuman", stok: 30, hargaHistory: [5000, 5100, 4900] },
  { id: 10, nama: "Kopi Sachet", kategori: "Minuman", stok: 70, hargaHistory: [1500, 1600, 1500] },
  { id: 11, nama: "Pel Lantai", kategori: "Kebutuhan Rumah", stok: 15, hargaHistory: [18000, 17500, 17000] },
  { id: 12, nama: "Pulpen", kategori: "Alat Tulis", stok: 40, hargaHistory: [3000, 3200, 3100] },
  { id: 13, nama: "Sereal", kategori: "Makanan", stok: 20, hargaHistory: [22000, 23000, 21500] },
  { id: 14, nama: "Susu UHT", kategori: "Minuman", stok: 35, hargaHistory: [10000, 10500, 10200] },
];


const kategoriStokFull = produkData.reduce((acc, p) => {
  acc[p.kategori] = (acc[p.kategori] || 0) + p.stok
  return acc
}, {})

const kategoriStok = Object.entries(kategoriStokFull)
  .map(([kategori, stok]) => ({ kategori, stok }))
  .sort((a, b) => b.stok - a.stok)

const kategoriTertinggi = kategoriStok.slice(0, 6)
const kategoriLain = kategoriStok.slice(6)

if (kategoriLain.length) {
  const totalLain = kategoriLain.reduce((sum, k) => sum + k.stok, 0)
  kategoriTertinggi.push({ kategori: "Lainnya", stok: totalLain })
}

function Dashboard() {
  const [selectedKategori, setSelectedKategori] = useState(null)
  const [selectedProduk, setSelectedProduk] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const produkFiltered = selectedKategori
    ? produkData.filter((p) => p.kategori === selectedKategori && p.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Stok Semua Produk</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={produkData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nama" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stok" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Distribusi Stok per Kategori
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kategoriTertinggi}
                dataKey="stok"
                nameKey="kategori"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                onClick={(data) => {
                  setSelectedKategori(data.kategori)
                  setSelectedProduk(null)
                }}
              >
                {kategoriTertinggi.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {selectedKategori ? `Produk: ${selectedKategori}` : "Pilih kategori"}
          </h2>
          {selectedKategori && (
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
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
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 border-b"
                >
                  {produkFiltered[index].nama} — {produkFiltered[index].stok} stok
                </div>
              )}
            </List>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {selectedProduk ? `Harga: ${selectedProduk.nama}` : "Pilih produk"}
          </h2>
          {selectedProduk ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedProduk.hargaHistory.map((h, i) => ({ waktu: `T${i + 1}`, harga: h }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waktu" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="harga" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Pilih produk untuk melihat grafik harga.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
