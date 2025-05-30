import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useSidebar } from "../hooks/useSidebar"
import useIsDesktop from "../hooks/useIsDesktop"

export default function Layout({ children }) {
  const { open, close } = useSidebar()
  const isDesktop = useIsDesktop()

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Mobile overlay */}
      {!isDesktop && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={close}
        />
      )}

      <div className="flex flex-1 pt-[60px]">
        {/* Sidebar always rendered */}
        <Sidebar />

        {/* Main always rendered */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
