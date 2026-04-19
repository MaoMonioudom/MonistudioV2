import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiMenu, FiX, FiImage, FiLayers, FiUsers, FiUserPlus, FiBriefcase, FiCamera, FiChevronDown, FiChevronRight, FiMail } from 'react-icons/fi';
import axios from 'axios';
import Services from './Services';
import Features from './Features';
import Banners from './Banners';
import TeamActivities from './TeamActivities';
import TeamMembers from './TeamMembers';
import Partners from './Partners';
import ContactBanners from './ContactBanners';
import ContactSubmissions from './ContactSubmissions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    features: 0, 
    services: 0,
    submissions: 0,
    teamMembers: 0,
    banners: 0,
    partners: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
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
        const token = localStorage.getItem('adminToken');
        const [featuresRes, servicesRes, submissionsRes, teamRes, bannersRes, partnersRes] = await Promise.all([
          axios.get(`${API_URL}/features`),
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/contact-submissions`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/team-members`),
          axios.get(`${API_URL}/banners`),
          axios.get(`${API_URL}/partners`)
        ]);
        
        const submissions = submissionsRes.data.data || [];
        
        setStats({
          features: featuresRes.data.length,
          services: servicesRes.data.length,
          submissions: submissions.length,
          teamMembers: teamRes.data.length,
          banners: bannersRes.data.length,
          partners: partnersRes.data.length
        });
        
        // Get recent submissions (last 3)
        setRecentSubmissions(submissions.slice(0, 3));
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

  const navigationLinks = [
    { path: '/admin/contact-submissions', label: 'Mail Box', icon: FiMail },
    { path: '/admin/banners', label: 'Banners', icon: FiLayers },
    { path: '/admin/partners', label: 'Trusted By', icon: FiBriefcase },
    { path: '/admin/features', label: 'Featured Works', icon: FiImage },
    { path: '/admin/services', label: 'Services', icon: FiSettings },
    { path: '/admin/contact-banners', label: 'Contact Banners', icon: FiCamera },
    { path: '/admin/team-members', label: 'Team Members', icon: FiUserPlus },
    { path: '/admin/team-activities', label: 'Team Activities', icon: FiUsers }
  ];

  // Determine which content to show
  const renderContent = () => {
    switch (location.pathname) {
      case '/admin/banners':
        return <Banners />;
      case '/admin/services':
        return <Services />;
      case '/admin/features':
        return <Features />;
      case '/admin/partners':
        return <Partners />;
      case '/admin/contact-banners':
        return <ContactBanners />;
      case '/admin/contact-submissions':
        return <ContactSubmissions />;
      case '/admin/team-members':
        return <TeamMembers />;
      case '/admin/team-activities':
        return <TeamActivities />;
      default:
        return (
          <>
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your portfolio overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Features */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Featured Works</p>
                  <FiImage className="text-blue-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.features}</h3>
                <Link to="/admin/features" className="text-blue-400 text-xs hover:text-blue-300 mt-2 inline-block">
                  View all →
                </Link>
              </div>

              {/* Services */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Services</p>
                  <FiSettings className="text-green-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.services}</h3>
                <Link to="/admin/services" className="text-green-400 text-xs hover:text-green-300 mt-2 inline-block">
                  View all →
                </Link>
              </div>

              {/* Contact Submissions */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Contact Messages</p>
                  <FiMail className="text-blue-400" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.submissions}</h3>
                <Link to="/admin/contact-submissions" className="text-blue-400 text-xs hover:text-blue-300 mt-2 inline-block">
                  View all →
                </Link>
              </div>

              {/* Team Members */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Team Members</p>
                  <FiUsers className="text-green-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.teamMembers}</h3>
                <Link to="/admin/team-members" className="text-green-400 text-xs hover:text-green-300 mt-2 inline-block">
                  View all →
                </Link>
              </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Banners */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Page Banners</p>
                  <FiLayers className="text-blue-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.banners}</h3>
                <Link to="/admin/banners" className="text-blue-400 text-xs hover:text-blue-300 mt-2 inline-block">
                  Manage →
                </Link>
              </div>

              {/* Partners */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">Trusted Partners</p>
                  <FiBriefcase className="text-green-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.partners}</h3>
                <Link to="/admin/partners" className="text-green-400 text-xs hover:text-green-300 mt-2 inline-block">
                  Manage →
                </Link>
              </div>
            </div>

            {/* Recent Submissions */}
            {recentSubmissions.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Messages</h2>
                  <Link to="/admin/contact-submissions" className="text-blue-400 text-sm hover:text-blue-300">
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => (
                    <div key={submission._id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{submission.name}</h3>
                          <p className="text-gray-400 text-sm">{submission.email}</p>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-1">{submission.message}</p>
                        </div>
                        {!submission.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  // Show loading spinner while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Always show sidebar layout for all admin pages
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col fixed h-full z-10 border-r border-gray-700">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            Admin
          </Link>
        </div>

        {/* Dashboard Link */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === '/admin/dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </Link>

          {/* Other Navigation Links */}
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition w-full"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-5">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {location.pathname === '/admin/dashboard'
                  ? 'Dashboard'
                  : navigationLinks.find(l => l.path === location.pathname)?.label || 'Admin Panel'}
              </h2>
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
