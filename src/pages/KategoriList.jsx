import { useNavigate } from "react-router-dom"

function KategoriList() {
  const navigate = useNavigate()

  const dummyKategori = [
    { id: 1, nama: "Kebutuhan Rumah" },
    { id: 2, nama: "Alat Tulis" },
    { id: 3, nama: "Makanan" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Kategori</h1>
        <button
          onClick={() => navigate("/kategori/tambah")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          + Tambah Kategori
        </button>
      </div>

      {dummyKategori.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Belum ada kategori.</div>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-md text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Nama Kategori</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyKategori.map((kat) => (
              <tr key={kat.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{kat.nama}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => navigate(`/kategori/edit/${kat.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl shadow-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert(`Hapus kategori ${kat.nama}?`)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl shadow-md transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default KategoriList
