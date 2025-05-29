import { useEffect, useState } from "react"

export default function useNamaToko() {
  const [rawNama, setRawNama] = useState(() => {
    return localStorage.getItem("namaToko") || "StockSight"
  })

  useEffect(() => {
    localStorage.setItem("namaToko", rawNama)
  }, [rawNama])

  const namaToko = `${rawNama} Store`

  return [namaToko, setRawNama]
}
