import { useEffect, useState } from "react"

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) return saved === "true"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  // optional: handle system changes if no manual toggle
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e) => {
      const saved = localStorage.getItem("darkMode")
      if (saved === null) setDarkMode(e.matches)
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [])

  return [darkMode, setDarkMode]
}
