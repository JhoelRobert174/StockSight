import { useSidebar } from "../hooks/useSidebar"
import { useSettings } from "@/hooks/useSettings"
import useDarkMode from "../hooks/useDarkMode"

export default function Navbar() {
  const { toggle } = useSidebar()
  const { namaToko } = useSettings()
  const [darkMode, setDarkMode] = useDarkMode()

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-white dark:bg-gray-900 shadow z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="md:hidden text-2xl text-gray-800 dark:text-white"
        >
          ☰
        </button>
        <div className="text-lg font-bold text-gray-800 dark:text-white">{namaToko}</div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={`Ubah ke mode ${darkMode ? "terang" : "gelap"}`}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-2xl text-gray-800 dark:text-white"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>
    </nav>
  )
}
