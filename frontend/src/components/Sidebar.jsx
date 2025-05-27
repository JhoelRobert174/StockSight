import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function Sidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${pathname === path ? "bg-blue-200 font-bold" : ""}`

  const handleLogout = async () => {
    await logout()         // 🔥 API call ke /logout + setUser(null)
    navigate("/login")     // 🚪 Redirect manual
  }

  return (
    <aside className="w-64 h-screen bg-white shadow-md fixed">
      <div className="text-2xl font-bold p-4 border-b">StockSight</div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
        <Link to="/produk" className={linkClass("/produk")}>Produk</Link>
        <Link to="/kategori" className={linkClass("/kategori")}>Kategori</Link>
        <Link to="/log" className={linkClass("/log")}>Log Aktivitas</Link>
        <Link to="/pengaturan" className={linkClass("/pengaturan")}>Pengaturan</Link>

        <button
          onClick={handleLogout}
          className="block text-left px-4 py-2 rounded text-red-500 hover:bg-red-100 mt-4"
        >
          Logout
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
