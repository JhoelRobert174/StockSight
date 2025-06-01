import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSidebar } from "../hooks/useSidebar"
import { useAuth } from "../hooks/useAuth"
import useIsDesktop from "../hooks/useIsDesktop"
import { Button } from "@/components/ui"
import { useEffect } from "react"

function Sidebar() {
  const location = useLocation()
  const { open, close } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()

  // Close sidebar on route change
  useEffect(() => {
    close()
  }, [location.pathname])

  // Lock scroll on mobile when sidebar open
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
    `block px-4 py-2 rounded transition ${
      location.pathname === path
        ? "bg-blue-200 dark:bg-blue-700 font-bold"
        : "hover:bg-blue-100 dark:hover:bg-blue-700"
    }`

  return (
<aside
  className={`
    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-md w-64
    flex flex-col justify-between z-40
    transition-transform duration-300
    fixed top-[60px] left-0 h-[calc(100vh-60px)] 
    ${open ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:fixed
  `}
>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 py-4 border-b text-lg font-bold text-gray-800 dark:text-white">
          Navigasi
        </div>
        <nav className="flex flex-col px-6 py-4 space-y-2">
          <Link to="/dashboard" onClick={close} className={linkClass("/dashboard")}>Dashboard</Link>
          <Link to="/produk" onClick={close} className={linkClass("/produk")}>Produk</Link>
          <Link to="/kategori" onClick={close} className={linkClass("/kategori")}>Kategori</Link>
          <Link to="/log" onClick={close} className={linkClass("/log")}>Log Aktivitas</Link>
          <Link to="/pengaturan" onClick={close} className={linkClass("/pengaturan")}>Pengaturan</Link>
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button onClick={handleLogout} color="red" variant="outline">
          Logout
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
