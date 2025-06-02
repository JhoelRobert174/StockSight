import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Layout from "./Layout" 
import { Loading } from "@/components/ui"

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading text="Memuat data..." />
  if (!user || !user.id) return <Navigate to="/login" replace /> 

  return <Layout>{children}</Layout>
}

export default ProtectedLayout