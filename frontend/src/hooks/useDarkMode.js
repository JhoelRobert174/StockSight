// hooks/useDarkMode.js
import { useEffect, useState } from "react"

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  return [darkMode, setDarkMode]
}
