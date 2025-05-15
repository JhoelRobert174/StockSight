function LogAktivitas() {
  const dummyLogs = [
    { waktu: "15 Mei 2025, 10:34", aksi: "Menambahkan Produk: Sapu" },
    { waktu: "15 Mei 2025, 09:15", aksi: "Menghapus Kategori: Elektronik" },
    { waktu: "14 Mei 2025, 16:02", aksi: "Mengubah Produk: Buku Tulis" },
    { waktu: "14 Mei 2025, 12:45", aksi: "Menambahkan Kategori: Peralatan Dapur" },
    { waktu: "13 Mei 2025, 18:30", aksi: "Menambahkan Produk: Pensil 2B" },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Log Aktivitas</h1>
      <div className="bg-white shadow-md rounded-xl divide-y">
        {dummyLogs.map((log, i) => (
          <div key={i} className="p-4 hover:bg-gray-50">
            <div className="text-sm text-gray-600">{log.waktu}</div>
            <div className="font-medium text-gray-800">{log.aksi}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LogAktivitas
