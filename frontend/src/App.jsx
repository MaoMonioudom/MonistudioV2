import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

const Home = lazy(() => import("./pages/Home"))
const Portfolio = lazy(() => import("./pages/Works"))
const Service = lazy(() => import("./pages/Service"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const FeatureDetail = lazy(() => import("./pages/FeatureDetail"))
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"))

// Admin imports
const Login = lazy(() => import("./admins/Login"))
const Dashboard = lazy(() => import("./admins/Dashboard"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
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
          <Route path="/admin/contact-submissions" element={<Dashboard />} />
          <Route path="/admin/team-members" element={<Dashboard />} />
          <Route path="/admin/team-activities" element={<Dashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* Fallback: redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
