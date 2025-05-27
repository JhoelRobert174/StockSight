import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import Layout from "./Layout"  // Komponen layout kamu sekarang

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user || !user.id) return <Navigate to="/login" replace />  // ⬅️ Tambahkan cek ID

  return <Layout>{children}</Layout>
}

export default ProtectedLayout