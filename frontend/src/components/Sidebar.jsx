import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSidebar } from "../hooks/useSidebar"
import { useAuth } from "../hooks/useAuth"
import useIsDesktop from "../hooks/useIsDesktop"
import { Button } from "@/components/ui"
import { useEffect } from "react"
import {
  FiGrid,
  FiBox,
  FiLayers,
  FiActivity,
  FiSettings,
  FiLogOut,
} from "react-icons/fi"

function Sidebar() {
  const location = useLocation()
  const { open, close } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    close()
  }, [location.pathname])

  useEffect(() => {
    if (open && !isDesktop) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [open, isDesktop])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 text-sm
    ${
      location.pathname === path
        ? "bg-blue-200 dark:bg-[#7F39FB] font-semibold text-blue-800 dark:text-white"
        : "hover:bg-blue-100 dark:hover:bg-[#6200EE] text-gray-700 dark:text-gray-200"
    }`

  return (
    <aside
      className={`
        bg-white dark:bg-[#1D1D1D] shadow-md w-64
        text-gray-800 dark:text-gray-100 flex flex-col justify-between z-40
        transition-transform duration-300
        fixed top-[60px] left-0 h-[calc(100vh-60px)] 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:fixed
      `}
    >
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 py-4 border-b text-base font-bold tracking-wide text-gray-700 dark:text-gray-100 uppercase">
          Navigasi
        </div>
        <nav className="flex flex-col px-4 py-4 space-y-2">
          <Link to="/dashboard" onClick={close} className={linkClass("/dashboard")}>
            <FiGrid size={18} /> Dashboard
          </Link>
          <Link to="/produk" onClick={close} className={linkClass("/produk")}>
            <FiBox size={18} /> Produk
          </Link>
          <Link to="/kategori" onClick={close} className={linkClass("/kategori")}>
            <FiLayers size={18} /> Kategori
          </Link>
          <Link to="/log" onClick={close} className={linkClass("/log")}>
            <FiActivity size={18} /> Log Aktivitas
          </Link>
          <Link to="/pengaturan" onClick={close} className={linkClass("/pengaturan")}>
            <FiSettings size={18} /> Pengaturan
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button onClick={handleLogout} color="red" variant="outline" className="w-full flex items-center gap-2 justify-center">
          <FiLogOut size={16} /> Logout
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
