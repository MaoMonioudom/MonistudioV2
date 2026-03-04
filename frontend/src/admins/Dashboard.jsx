import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiMenu, FiX, FiImage, FiLayers, FiUsers, FiUserPlus, FiBriefcase, FiCamera } from 'react-icons/fi';
import axios from 'axios';
import Services from './Services';
import Features from './Features';
import Banners from './Banners';
import TeamActivities from './TeamActivities';
import TeamMembers from './TeamMembers';
import Partners from './Partners';
import ContactBanners from './ContactBanners';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ features: 0, services: 0 });
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verify token with backend
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.data.success) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdminLoggedIn');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin/login');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [featuresRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/features`),
          axios.get(`${API_URL}/services`)
        ]);
        setStats({
          features: featuresRes.data.length,
          services: servicesRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/banners', icon: FiLayers, label: 'Banners' },
    { path: '/admin/services', icon: FiSettings, label: 'Services' },
    { path: '/admin/features', icon: FiImage, label: 'Features' },
    { path: '/admin/partners', icon: FiBriefcase, label: 'Trusted By' },
    { path: '/admin/contact-banners', icon: FiCamera, label: 'Contact Photos' },
    { path: '/admin/team-members', icon: FiUserPlus, label: 'Team Members' },
    { path: '/admin/team-activities', icon: FiUsers, label: 'Team Activities' },
  ];

  const isActive = (path) => location.pathname === path;

  // Determine which content to show
  const renderContent = () => {
    if (location.pathname === '/admin/banners') {
      return <Banners />;
    }
    if (location.pathname === '/admin/services') {
      return <Services />;
    }
    if (location.pathname === '/admin/features') {
      return <Features />;
    }
    if (location.pathname === '/admin/partners') {
      return <Partners />;
    }
    if (location.pathname === '/admin/contact-banners') {
      return <ContactBanners />;
    }
    if (location.pathname === '/admin/team-members') {
      return <TeamMembers />;
    }
    if (location.pathname === '/admin/team-activities') {
      return <TeamActivities />;
    }
    // Dashboard home
    return (
      <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Features</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.features}</h3>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <FiImage className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Services</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.services}</h3>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <FiSettings className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Manage Services</p>
                <h3 className="text-lg font-bold text-white mt-1">Quick Access</h3>
              </div>
              <Link
                to="/admin/services"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Go →
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Manage Features</p>
                <h3 className="text-lg font-bold text-white mt-1">Quick Access</h3>
              </div>
              <Link
                to="/admin/features"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Go →
              </Link>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">Welcome to Admin Dashboard</h3>
          <p className="text-gray-400 mb-6">
            Manage your portfolio content from this dashboard. You can add, edit, and delete services and features.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Services</h4>
              <p className="text-gray-400 text-sm">
                Create and manage service categories that organize your portfolio work.
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Features</h4>
              <p className="text-gray-400 text-sm">
                Add featured work items with images, descriptions, and link them to services.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Show loading spinner while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 transition-all duration-300 flex flex-col fixed h-full z-10`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition w-full"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-gray-800 p-4 sticky top-0 z-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="text-gray-400 hover:text-white transition text-sm"
              >
                View Website →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
