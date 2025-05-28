import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors relative">
      <Navbar /> {/* Di paling atas */}
      
      <Sidebar /> {/* Sebagai panel tetap di kiri, posisinya absolute/fixed */}

      <main className="sm:ml-64 p-6 w-full overflow-x-hidden"> {/* pt-[60px] untuk offset Navbar */}
        {children}
      </main>
    </div>
  )
}

export default Layout
