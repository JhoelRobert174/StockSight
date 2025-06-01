import { useEffect } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useSidebar } from "../hooks/useSidebar"
import useIsDesktop from "../hooks/useIsDesktop"

export default function Layout({ children }) {
  const { open, close } = useSidebar()
  const isDesktop = useIsDesktop()

  // Auto-close sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop && open) {
      close()
    }
  }, [isDesktop, open, close])

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Mobile click-catcher (no dimming) */}
      {!isDesktop && open && (
        <div
          className="fixed inset-0 z-30"
          onClick={close}
        />
      )}

      <div className="flex flex-1 pt-[60px]">
        <Sidebar />
<main className="flex-1 overflow-y-auto p-6 md:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
