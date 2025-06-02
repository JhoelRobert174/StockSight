import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {Loading} from "@/components/ui"


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading text="Loading..." />
  if (!user) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
