import { Link, useLocation } from "react-router-dom"
import useDarkMode from "../hooks/useDarkMode"
import { useSidebar } from "../hooks/useSidebar"

function Sidebar() {
  const { pathname } = useLocation()
  const [darkMode, setDarkMode] = useDarkMode()
  const { open, close } = useSidebar()

  const linkClass = (path) =>
    `block px-4 py-2 rounded transition ${pathname === path
      ? "bg-blue-200 dark:bg-blue-700 font-bold"
      : "hover:bg-blue-100 dark:hover:bg-blue-700"
    }`

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-900 
      text-gray-800 dark:text-gray-100 shadow-md pt-[60px] flex flex-col justify-between
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
    >
      <div>
        <div className="px-6 py-4 border-b text-lg font-bold text-gray-800 dark:text-white">Navigasi</div>
        <nav className="flex flex-col px-6 py-4 space-y-2" onClick={close}>
          <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link to="/produk" className={linkClass("/produk")}>Produk</Link>
          <Link to="/kategori" className={linkClass("/kategori")}>Kategori</Link>
          <Link to="/log" className={linkClass("/log")}>Log Aktivitas</Link>
          <Link to="/pengaturan" className={linkClass("/pengaturan")}>Pengaturan</Link>
        </nav>
      </div>


      <div className="p-4 border-t flex justify-start">
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={`Ubah ke mode ${darkMode ? "terang" : "gelap"}`}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-2xl"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
