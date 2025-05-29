import { useSettings } from "../context/SettingsContext"
import { PageWrapper, Button } from "@/components/ui"

function Pengaturan() {
  const { rawNamaToko, setRawNamaToko } = useSettings()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Pengaturan disimpan!")
  }

  return (
    <PageWrapper title="Pengaturan">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Toko
          </label>
          <input
            value={rawNamaToko}
            onChange={(e) => setRawNamaToko(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <Button
          type="submit"
          color="blue"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          Simpan Pengaturan
        </Button>
      </form>
    </PageWrapper>
  )
}

export default Pengaturan
