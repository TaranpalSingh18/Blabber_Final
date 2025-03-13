import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Camera, Mail, User as UserIcon, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to update user profile here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#3CEAA4]">Profile Settings</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}`}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-[#3CEAA4] rounded-full text-black">
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3CEAA4] text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3CEAA4] text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3CEAA4] text-black rounded-md font-medium"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#3CEAA4] text-black rounded-md font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}