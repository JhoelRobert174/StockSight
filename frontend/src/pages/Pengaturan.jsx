import { useSettings } from "@/hooks/useSettings"
import { PageWrapper, Button, Input, PanelTitle } from "@/components/ui"
import { FiSave, FiTrash2, FiSettings } from "react-icons/fi"

function Pengaturan() {
  const { rawNamaToko, setRawNamaToko, saveStoreName } = useSettings()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await saveStoreName(rawNamaToko)
      alert("Nama toko disimpan!")
    } catch (err) {
      alert("Gagal menyimpan nama toko: " + err.message)
    }
  }

  const { deleteAccount } = useSettings()

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Yakin ingin menghapus akun secara permanen?")
    if (!confirm) return

    try {
      await deleteAccount()
    } catch (err) {
      alert("Gagal menghapus akun: " + err.message)
    }
  }

  return (
    <PageWrapper
      title={
        <PanelTitle icon={FiSettings}>
          Pengaturan
        </PanelTitle>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Toko
          </label>
          <Input
            type="text"
            value={rawNamaToko}
            onChange={(e) => setRawNamaToko(e.target.value)}
          />
        </div>
        <Button
          color="purblue"
          variant="default"
          type="submit"
        >
          <FiSave className="mr-2" />
          Simpan
        </Button>

      </form>
      <div className="mt-8 border-t pt-6 border-red-300">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Hapus Akun</h2>
        <p className="text-sm text-red-600 dark:text-red-400 mb-3">
          Tindakan ini akan menghapus seluruh data akun Anda secara permanen.
        </p>
        <Button
          color="red"
          variant="outline"
          onClick={handleDeleteAccount}
        >
          <FiTrash2 className="mr-2" />
          Hapus Akun
        </Button>

      </div>

    </PageWrapper>
  )
}

export default Pengaturan
