import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/contact-submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSubmissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, isCurrentlyRead) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/contact-submissions/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedSubmission = response.data.data;
        setSubmissions(submissions.map(sub => 
          sub._id === id ? updatedSubmission : sub
        ));
        // Update selected submission if it's the one being updated
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(updatedSubmission);
        }
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${API_URL}/contact-submissions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSubmissions(submissions.filter(sub => sub._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'unread') return !sub.isRead;
    if (filter === 'read') return sub.isRead;
    return true;
  });

  const unreadCount = submissions.filter(sub => !sub.isRead).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Submissions</h1>
          <p className="text-gray-400 mt-1">Manage visitor messages and inquiries</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
          {unreadCount} Unread
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'all'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'unread'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'read'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Read ({submissions.filter(s => s.isRead).length})
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {filteredSubmissions.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No submissions to display
              </div>
            ) : (
              filteredSubmissions.map(submission => (
                <button
                  key={submission._id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full text-left border-b border-gray-700 last:border-b-0 p-4 hover:bg-gray-700/50 transition ${
                    selectedSubmission?._id === submission._id ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''
                  } ${!submission.isRead ? 'bg-gray-700/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm truncate ${!submission.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {submission.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{submission.email}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{submission.message}</p>
                    </div>
                    {!submission.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{formatDate(submission.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Submission Detail */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedSubmission.name}</h2>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    {selectedSubmission.email}
                  </a>
                  <p className="text-gray-500 text-sm mt-2">
                    {formatDate(selectedSubmission.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedSubmission._id, selectedSubmission.isRead)}
                    className={`px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium ${
                      selectedSubmission.isRead
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    title={selectedSubmission.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedSubmission.isRead ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    <span>{selectedSubmission.isRead ? 'Unread' : 'Read'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSubmission._id)}
                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Message</h3>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-400 text-lg">Select a submission to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
