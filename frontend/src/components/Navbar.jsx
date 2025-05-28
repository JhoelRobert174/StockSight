import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useSidebar } from "../hooks/useSidebar"

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { toggle } = useSidebar()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-white dark:bg-gray-900 shadow z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="sm:hidden text-2xl text-gray-800 dark:text-white"
        >
          ☰
        </button>
        <div className="text-lg font-bold text-gray-800 dark:text-white">StockSight</div>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-700"
      >
        Logout
      </button>
    </nav>
  )
}
