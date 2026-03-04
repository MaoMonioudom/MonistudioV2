import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiArrowUp, FiArrowDown, FiEye, FiEyeOff } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    order: 0,
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners/all`);
      setBanners(response.data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: null,
        order: banner.order,
        isActive: banner.isActive,
      });
      setImagePreview(banner.imageUrl);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: null,
        order: banners.length,
        isActive: true,
      });
      setImagePreview(null);
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: null,
      order: 0,
      isActive: true,
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingBanner) {
        await axios.put(`${API_URL}/banners/${editingBanner._id}`, data, config);
      } else {
        await axios.post(`${API_URL}/banners`, data, config);
      }

      await fetchBanners();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('Failed to delete banner');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/banners/${banner._id}`,
        { isActive: !banner.isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchBanners();
    } catch (err) {
      console.error('Error toggling banner status:', err);
    }
  };

  const handleReorder = async (index, direction) => {
    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBanners.length) return;

    // Swap the banners
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];

    // Update order values
    const bannerOrders = newBanners.map((banner, idx) => ({
      id: banner._id,
      order: idx,
    }));

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/banners/reorder`,
        { bannerOrders },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchBanners();
    } catch (err) {
      console.error('Error reordering banners:', err);
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
          <h2 className="text-2xl font-bold text-white">Banners</h2>
          <p className="text-gray-400 mt-1">Manage your homepage banner slides</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus size={20} />
          Add Banner
        </button>
      </div>

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
          <FiImage className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No banners yet</h3>
          <p className="text-gray-400 mb-4">Start by adding your first banner slide</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiPlus size={20} />
            Add Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`bg-gray-800 rounded-xl overflow-hidden border ${
                banner.isActive ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
              } hover:border-gray-600 transition`}
            >
              <div className="flex items-stretch">
                {/* Image */}
                <div className="w-48 flex-shrink-0">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
                      <FiImage className="text-gray-500" size={32} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{banner.title}</h3>
                      {!banner.isActive && (
                        <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    {banner.subtitle && (
                      <p className="text-gray-400 text-sm line-clamp-1">{banner.subtitle}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">Order: {banner.order + 1}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === banners.length - 1}
                        className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <FiArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                        banner.isActive
                          ? 'bg-green-600/20 hover:bg-green-600/40 text-green-500'
                          : 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500'
                      }`}
                      title={banner.isActive ? 'Hide banner' : 'Show banner'}
                    >
                      {banner.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>

                    <button
                      onClick={() => handleOpenModal(banner)}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition text-sm"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 px-3 py-2 rounded-lg transition text-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
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
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
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
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Banner title (e.g., MONI IMAGE)"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Subtitle text (e.g., Visual storytelling through design & code)"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Banner Image *
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
                    required={!editingBanner}
                  />
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
                  {submitting ? 'Saving...' : editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
