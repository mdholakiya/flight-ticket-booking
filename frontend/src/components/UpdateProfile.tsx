import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface UpdateProfileProps {
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ onClose, onUpdate }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success('Profile updated successfully');
        onUpdate();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full p-8 rounded-xl shadow-2xl border border-sky-400/20 bg-gradient-to-b from-sky-950 to-sky-900">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sky-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-sky-400/30 rounded-md 
                       bg-sky-900/40 text-white placeholder-sky-300/60
                       focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-sky-400/30 rounded-md 
                       bg-sky-900/40 text-white placeholder-sky-300/60
                       focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sky-300 hover:text-sky-200 
                       border border-sky-400/30 rounded-md bg-sky-900/40
                       hover:bg-sky-800/40 focus:outline-none focus:ring-2 
                       focus:ring-sky-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 
                       hover:bg-sky-500 rounded-md border border-transparent
                       focus:outline-none focus:ring-2 focus:ring-sky-400 
                       disabled:bg-sky-800 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile; 