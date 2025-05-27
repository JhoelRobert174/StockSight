import { useState, useEffect } from "react"
import { useAuth } from "../context/useAuth"
import { Navigate } from "react-router-dom"
import { API_BASE } from "../constants/config"

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

function Dashboard() {
  const { user, loading } = useAuth()
  const [produkList, setProdukList] = useState([])
  const [kategoriStok, setKategoriStok] = useState([])
  const [selectedKategori, setSelectedKategori] = useState(null)
  const [selectedProduk, setSelectedProduk] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Total Stok Semua Produk
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={produkList}>
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
                data={kategoriStok}
                dataKey="stok"
                nameKey="kategori"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                onClick={(data) => {
                  setSelectedKategori(data.name) // ← nameKey="kategori" maps to data.name
                  setSelectedProduk(null)
                }}
              >
                {kategoriStok.map((_, index) => (
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
            <>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setSelectedKategori(null)}
                className="text-sm text-blue-600 underline mb-4"
              >
                Hapus filter
              </button>
            </>
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
                  {produkFiltered[index].nama} —{" "}
                  {produkFiltered[index].stok.toLocaleString()} stok
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
              <LineChart
                data={(selectedProduk.hargaHistory || []).map((h) => ({
                  waktu: new Date(h.waktu).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  }),
                  harga: h.harga,
                }))}

              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waktu" />
                <YAxis />
                <Tooltip
                  formatter={(val) =>
                    val.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="harga"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">
              Pilih produk untuk melihat grafik harga.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
