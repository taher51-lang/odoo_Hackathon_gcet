import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { User, UserRole } from '../types';
import { Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, login, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call to update
      const updatedUser = await mockService.updateUser(user.id, formData);
      login(updatedUser); // Update context
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end">
              <div className="relative">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
                />
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div className="ml-6 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.position} • {user.department}</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="pl-10 block w-full bg-gray-50 border-gray-300 rounded-md sm:text-sm text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        disabled={!isEditing}
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className={`pl-10 block w-full rounded-md sm:text-sm ${
                          isEditing ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        disabled={!isEditing}
                        value={formData.address || ''}
                        onChange={handleChange}
                        className={`pl-10 block w-full rounded-md sm:text-sm ${
                          isEditing ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled
                        value={user.employeeId}
                        className="pl-10 block w-full bg-gray-50 border-gray-300 rounded-md sm:text-sm text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled
                        value={user.joinDate}
                        className="pl-10 block w-full bg-gray-50 border-gray-300 rounded-md sm:text-sm text-gray-500"
                      />
                    </div>
                  </div>

                  {(isAdmin || user.role === UserRole.EMPLOYEE) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Base Salary</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          disabled
                          value={`$${user.salary.toLocaleString()}`}
                          className="pl-10 block w-full bg-gray-50 border-gray-300 rounded-md sm:text-sm text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
