import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Contact from './pages/contact'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  )
} 