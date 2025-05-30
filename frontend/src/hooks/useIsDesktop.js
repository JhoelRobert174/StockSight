// hooks/useIsDesktop.js
import { useEffect, useState } from "react"

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return isDesktop
}
