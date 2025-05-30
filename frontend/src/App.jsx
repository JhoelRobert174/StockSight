import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedLayout from "./components/ProtectedLayout"
import Dashboard from "./pages/Dashboard"
import ProdukList from "./pages/ProdukList"
import KategoriList from "./pages/KategoriList"
import ProdukForm from "./pages/ProdukForm"
import KategoriForm from "./pages/KategoriForm"
import LogAktivitas from './pages/LogAktivitas'
import Pengaturan from './pages/Pengaturan'
import MutasiProdukForm from "./pages/MutasiProdukForm"
import IdentityVerifyForm from "./pages/IdentityVerifyForm"
import ResetPasswordForm from "./pages/ResetPasswordForm"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/verify" element={<IdentityVerifyForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/produk"
          element={
            <ProtectedLayout>
              <ProdukList />
            </ProtectedLayout>
          }
        />
        <Route
          path="/kategori"
          element={
            <ProtectedLayout>
              <KategoriList />
            </ProtectedLayout>
          }
        />
        <Route
          path="/produk/tambah"
          element={
            <ProtectedLayout>
              <ProdukForm />
            </ProtectedLayout>
          }
        />
        <Route
          path="/produk/edit/:id"
          element={
            <ProtectedLayout>
              <ProdukForm />
            </ProtectedLayout>
          }
        />
        <Route
          path="/kategori/tambah"
          element={
            <ProtectedLayout>
              <KategoriForm />
            </ProtectedLayout>
          }
        />
        <Route
          path="/kategori/edit/:id"
          element={
            <ProtectedLayout>
              <KategoriForm />
            </ProtectedLayout>
          }
        />
        <Route
          path="/produk/:id/mutasi"
          element={
            <ProtectedLayout>
              <MutasiProdukForm />
            </ProtectedLayout>
          }
        />

        <Route
          path="/log"
          element={
            <ProtectedLayout>
              <LogAktivitas />
            </ProtectedLayout>
          }
        />
        <Route
          path="/pengaturan"
          element={
            <ProtectedLayout>
              <Pengaturan />
            </ProtectedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
