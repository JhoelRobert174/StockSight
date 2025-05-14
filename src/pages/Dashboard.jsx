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

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]

const produkData = [
  { id: 1, nama: "Sabun Mandi", kategori: "Kebutuhan Rumah", stok: 12, hargaHistory: [8000, 8200, 7900] },
  { id: 2, nama: "Buku Tulis", kategori: "Alat Tulis", stok: 35, hargaHistory: [4000, 4000, 3900] },
  { id: 3, nama: "Sapu", kategori: "Kebutuhan Rumah", stok: 10, hargaHistory: [10000, 10500, 9900] },
  { id: 4, nama: "Pensil", kategori: "Alat Tulis", stok: 20, hargaHistory: [1500, 1600, 1550] },
  { id: 4, nama: "Tidepod", kategori: "Makanan", stok: 50, hargaHistory: [2000, 4000, 10000] },
  { id: 5, nama: "Kertas A4", kategori: "Alat Tulis", stok: 15, hargaHistory: [5000, 5200, 5100] },
  { id: 6, nama: "Pasta Gigi", kategori: "Kebutuhan Rumah", stok: 8, hargaHistory: [12000, 12500, 11500] },
  // Tambahkan data simulasi...
]

// Hitung stok per kategori
const kategoriStokFull = produkData.reduce((acc, p) => {
  acc[p.kategori] = (acc[p.kategori] || 0) + p.stok
  return acc
}, {})

const kategoriStok = Object.entries(kategoriStokFull)
  .map(([kategori, stok]) => ({ kategori, stok }))
  .sort((a, b) => b.stok - a.stok)

// Maksimal 6 kategori, sisanya gabung jadi "Lainnya"
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

      {/* Grafik Total Stok Semua Produk */}
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

      {/* Split View: Pie + Produk List + Harga */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Kategori */}
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

        {/* Tabel Produk */}
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
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {produkFiltered.map((p) => (
              <li
                key={p.id}
                className="cursor-pointer hover:bg-gray-100 p-3 rounded border"
                onClick={() => setSelectedProduk(p)}
              >
                {p.nama} — {p.stok} stok
              </li>
            ))}
          </ul>
        </div>

        {/* Grafik Harga */}
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
