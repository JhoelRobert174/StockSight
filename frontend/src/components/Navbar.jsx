import { useSidebar } from "@/hooks/useSidebar"
import { useSettings } from "@/hooks/useSettings"
import useDarkMode from "../hooks/useDarkMode"
import { FiSun, FiMoon, FiMenu } from "react-icons/fi"


export default function Navbar() {
  const { toggle } = useSidebar()
  const { namaToko } = useSettings()
  const [darkMode, setDarkMode] = useDarkMode()

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-white dark:bg-[#1D1D1D] shadow z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="md:hidden text-2xl text-gray-800 dark:text-white"
        >
          <FiMenu />
        </button>

        <div className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">{namaToko}</div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={`Ubah ke mode ${darkMode ? "terang" : "gelap"}`}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition text-2xl text-gray-800 dark:text-white"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  )
}
