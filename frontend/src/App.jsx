import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Works from "./pages/Works"
import Service from "./pages/Service"
import About from "./pages/About"
import Contact from "./pages/Contact"
import FeatureDetail from "./pages/FeatureDetail"
import ServiceDetail from "./pages/ServiceDetail"

// Admin imports
import Login from "./admins/Login"
import Dashboard from "./admins/Dashboard"
import AdminServices from "./admins/Services"
import AdminFeatures from "./admins/Features"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
        <Route path="/service" element={<Service />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feature/:id" element={<FeatureDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/banners" element={<Dashboard />} />
        <Route path="/admin/services" element={<Dashboard />} />
        <Route path="/admin/features" element={<Dashboard />} />
        <Route path="/admin/partners" element={<Dashboard />} />
        <Route path="/admin/contact-banners" element={<Dashboard />} />
        <Route path="/admin/team-members" element={<Dashboard />} />
        <Route path="/admin/team-activities" element={<Dashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* Fallback: redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
