import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProdukList from "./pages/ProdukList"
import KategoriList from "./pages/KategoriList"
import ProdukForm from "./pages/ProdukForm"
import Layout from "./components/Layout"
import KategoriForm from "./pages/KategoriForm"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/produk"
          element={
            <Layout>
              <ProdukList />
            </Layout>
          }
        />

        <Route
          path="/kategori"
          element={
            <Layout>
              <KategoriList />
            </Layout>
          }
        />
        <Route
          path="/produk/tambah"
          element={
            <Layout>
              <ProdukForm />
            </Layout>
          }
        />
        <Route
          path="/produk/edit/:id"
          element={
            <Layout>
              <ProdukForm />
            </Layout>
          }
        />
        <Route
          path="/kategori"
          element={
            <Layout>
              <KategoriList />
            </Layout>
          }
        />
        <Route
          path="/kategori/tambah"
          element={
            <Layout>
              <KategoriForm />
            </Layout>
          }
        />
        <Route
          path="/kategori/edit/:id"
          element={
            <Layout>
              <KategoriForm />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
