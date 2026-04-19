import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailDescription: '',
    serviceId: '',
    image: null,
    moreImages: [],
    showOnHome: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [existingMoreImages, setExistingMoreImages] = useState([]);
  const [newMoreImagePreviews, setNewMoreImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuresRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/features`),
        axios.get(`${API_URL}/services`),
      ]);
      setFeatures(featuresRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (feature = null) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        title: feature.title,
        description: feature.description,
        detailDescription: feature.detailDescription || '',
        serviceId: feature.serviceId?._id || '',
        image: null,
        moreImages: [],
        showOnHome: feature.showOnHome || false,
      });
      setImagePreview(feature.imageUrl);
      setExistingMoreImages(feature.moreImages || []);
      setNewMoreImagePreviews([]);
    } else {
      setEditingFeature(null);
      setFormData({
        title: '',
        description: '',
        detailDescription: '',
        serviceId: '',
        image: null,
        moreImages: [],
        showOnHome: false,
      });
      setImagePreview(null);
      setExistingMoreImages([]);
      setNewMoreImagePreviews([]);
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFeature(null);
    setFormData({
      title: '',
      description: '',
      detailDescription: '',
      serviceId: '',
      image: null,
      moreImages: [],
      showOnHome: false,
    });
    setImagePreview(null);
    setExistingMoreImages([]);
    setNewMoreImagePreviews([]);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMoreImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData({ ...formData, moreImages: [...formData.moreImages, ...files] });
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setNewMoreImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMoreImage = (index, isExisting = false) => {
    if (isExisting) {
      const updated = [...existingMoreImages];
      updated.splice(index, 1);
      setExistingMoreImages(updated);
    } else {
      const updatedFiles = [...formData.moreImages];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, moreImages: updatedFiles });

      const updatedPreviews = [...newMoreImagePreviews];
      updatedPreviews.splice(index, 1);
      setNewMoreImagePreviews(updatedPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('detailDescription', formData.detailDescription);
      data.append('showOnHome', formData.showOnHome);
      if (formData.serviceId) {
        data.append('serviceId', formData.serviceId);
      }
      if (formData.image) {
        data.append('image', formData.image);
      }
      formData.moreImages.forEach((file) => {
        data.append('moreImages', file);
      });
      if (editingFeature) {
        data.append('existingMoreImages', JSON.stringify(existingMoreImages));
      }

      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingFeature) {
        await axios.put(`${API_URL}/features/${editingFeature._id}`, data, config);
      } else {
        await axios.post(`${API_URL}/features`, data, config);
      }

      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/features/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      console.error('Error deleting feature:', err);
      alert('Failed to delete feature');
    }
  };

  const handleToggleShowOnHome = async (feature) => {
    // Check if trying to turn ON and already at 6 limit
    if (!feature.showOnHome) {
      const countShowingOnHome = features.filter(f => f.showOnHome).length;
      if (countShowingOnHome >= 6) {
        alert('You can only show maximum 6 featured works on the home page. Please remove one first.');
        return;
      }
    }

    // Optimistic update - update UI immediately
    const updatedFeatures = features.map(f =>
      f._id === feature._id ? { ...f, showOnHome: !f.showOnHome } : f
    );
    setFeatures(updatedFeatures);

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        `${API_URL}/features/${feature._id}`,
        { showOnHome: !feature.showOnHome },
        config
      );
      // API call succeeded, no need to refetch since we already updated state
    } catch (err) {
      console.error('Error toggling show on home:', err);
      // Revert the optimistic update on error
      setFeatures(features);
      alert('Failed to update feature');
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
          <h2 className="text-2xl font-bold text-white">Features</h2>
          <p className="text-gray-400 mt-1">Manage your featured work items</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus size={20} />
          Add Feature
        </button>
      </div>

      {/* Home Featured Works Section */}
      {features.filter(f => f.showOnHome).length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Featured on Home Page</h3>
            <span className="text-xs bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
              {features.filter(f => f.showOnHome).length}/6
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.filter(f => f.showOnHome).map((feature) => (
              <div key={feature._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition group">
                <img src={feature.imageUrl} alt={feature.title} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                <div className="p-2">
                  <p className="text-white text-xs font-semibold truncate">{feature.title}</p>
                  {feature.serviceId && (
                    <p className="text-gray-500 text-xs truncate">{feature.serviceId.title}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Grid */}
      {features.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
          <FiImage className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No features yet</h3>
          <p className="text-gray-400 mb-4">Start by adding your first featured work</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiPlus size={20} />
            Add Feature
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature._id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition"
            >
              {feature.imageUrl ? (
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <FiImage className="text-gray-500" size={48} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <div className="flex gap-2">
                    {feature.showOnHome && (
                      <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                        On Home
                      </span>
                    )}
                    {feature.serviceId && (
                      <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                        {feature.serviceId.title}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {feature.description}
                </p>
                {feature.moreImages?.length > 0 && (
                  <p className="text-gray-500 text-xs mb-3">
                    +{feature.moreImages.length} additional images
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleShowOnHome(feature)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium ${
                      feature.showOnHome
                        ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={feature.showOnHome ? 'Hide from home' : 'Show on home'}
                  >
                    {feature.showOnHome ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    {feature.showOnHome ? 'On Home' : 'Show Home'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(feature)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition text-sm"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feature._id)}
                    className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 px-3 py-2 rounded-lg transition text-sm"
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
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
              <h3 className="text-xl font-semibold text-white">
                {editingFeature ? 'Edit Feature' : 'Add Feature'}
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    placeholder="Feature title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Service Category
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">No category</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <input
                  type="checkbox"
                  id="showOnHome"
                  checked={formData.showOnHome}
                  onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-500 cursor-pointer"
                />
                <label htmlFor="showOnHome" className="text-gray-300 font-medium cursor-pointer flex-1">
                  Show on Home Page
                </label>
                <span className="text-xs text-gray-400">
                  {formData.showOnHome ? '✓ Visible' : '○ Hidden'}
                </span>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Brief description"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Detail Description
                </label>
                <textarea
                  value={formData.detailDescription}
                  onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Extended description for detail page"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Main Image *
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
                    required={!editingFeature}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Additional Images
                </label>
                <div className="space-y-3">
                  {existingMoreImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {existingMoreImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeMoreImage(index, true)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {newMoreImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {newMoreImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={preview}
                            alt={`New additional ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeMoreImage(index, false)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMoreImagesChange}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
                  />
                </div>
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
                  {submitting ? 'Saving...' : editingFeature ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
