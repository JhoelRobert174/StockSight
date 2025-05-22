import { useState } from "react"

function Pengaturan() {
  const [namaToko, setNamaToko] = useState("StockSight Store")
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Pengaturan disimpan (simulasi).")
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pengaturan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
          <input
            value={namaToko}
            onChange={(e) => setNamaToko(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="darkMode" className="text-sm text-gray-700">
            Aktifkan Mode Gelap
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          Simpan Pengaturan
        </button>
      </form>
    </div>
  )
}

export default Pengaturan
