import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBriefcase, FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo: null,
    order: 0,
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_URL}/partners/all`);
      setPartners(response.data);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        website: partner.website || '',
        logo: null,
        order: partner.order,
        isActive: partner.isActive,
      });
      setImagePreview(partner.logoUrl);
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        website: '',
        logo: null,
        order: partners.length,
        isActive: true,
      });
      setImagePreview(null);
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      website: '',
      logo: null,
      order: 0,
      isActive: true,
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('website', formData.website);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingPartner) {
        await axios.put(`${API_URL}/partners/${editingPartner._id}`, data, config);
      } else {
        await axios.post(`${API_URL}/partners`, data, config);
      }

      await fetchPartners();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/partners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPartners();
    } catch (err) {
      console.error('Error deleting partner:', err);
      alert('Failed to delete partner');
    }
  };

  const handleToggleActive = async (partner) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/partners/${partner._id}`,
        { isActive: !partner.isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPartners();
    } catch (err) {
      console.error('Error toggling partner status:', err);
    }
  };

  const handleReorder = async (index, direction) => {
    const newPartners = [...partners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPartners.length) return;

    // Swap the partners
    [newPartners[index], newPartners[targetIndex]] = [newPartners[targetIndex], newPartners[index]];

    // Update order values
    const partnerOrders = newPartners.map((partner, idx) => ({
      id: partner._id,
      order: idx,
    }));

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/partners/reorder`,
        { partnerOrders },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPartners();
    } catch (err) {
      console.error('Error reordering partners:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trusted By</h2>
          <p className="text-gray-400 mt-1">Manage companies and organizations you have worked with</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus size={20} />
          Add Partner
        </button>
      </div>

      {/* Partners List */}
      {partners.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
          <FiBriefcase className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No partners yet</h3>
          <p className="text-gray-400 mb-4">Start by adding companies or organizations you have worked with</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiPlus size={20} />
            Add Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, index) => (
            <div
              key={partner._id}
              className={`bg-gray-800 rounded-xl overflow-hidden border ${
                partner.isActive ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
              } hover:border-gray-600 transition`}
            >
              {/* Logo */}
              <div className="h-32 bg-white flex items-center justify-center p-4">
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <FiBriefcase className="text-gray-400" size={48} />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                  {!partner.isActive && (
                    <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm flex items-center gap-1 hover:underline mb-2"
                  >
                    <FiExternalLink size={14} />
                    Website
                  </a>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                  {/* Reorder buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <FiArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === partners.length - 1}
                      className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <FiArrowDown size={14} />
                    </button>
                  </div>

                  <div className="flex-1"></div>

                  <button
                    onClick={() => handleToggleActive(partner)}
                    className={`p-1.5 rounded transition ${
                      partner.isActive
                        ? 'bg-green-600/20 hover:bg-green-600/40 text-green-500'
                        : 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500'
                    }`}
                    title={partner.isActive ? 'Hide' : 'Show'}
                  >
                    {partner.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>

                  <button
                    onClick={() => handleOpenModal(partner)}
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-500 rounded transition"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
              <h3 className="text-xl font-semibold text-white">
                {editingPartner ? 'Edit Partner' : 'Add Partner'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company/Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g., Google, Microsoft, NGO Name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Logo *
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
                    required={!editingPartner}
                  />
                  <p className="text-gray-500 text-xs">Recommended: PNG with transparent background</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-gray-300 text-sm">Active (visible on homepage)</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPartner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
