import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Save, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    avatarUrl: user?.avatarUrl || ''
  });

  const isAdmin = user?.role === Role.ADMIN;

  const handleSave = () => {
    if (user) {
      updateProfile({
        ...user,
        ...formData
      });
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
          <p className="text-slate-500">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header / Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end">
              <img 
                src={formData.avatarUrl || user.avatarUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
              />
              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                <p className="text-slate-500">{user.position} • {user.department}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Email Address</label>
                    <p className="text-slate-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase">Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full mt-1 px-2 py-1 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                      />
                    ) : (
                      <p className="text-slate-800">{user.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase">Address</label>
                     {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full mt-1 px-2 py-1 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                      />
                    ) : (
                      <p className="text-slate-800">{user.address || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Employment Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Department</label>
                    <p className="text-slate-800">{user.department}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Date of Joining</label>
                    <p className="text-slate-800">{user.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Basic Salary</label>
                    <p className="text-slate-800">${user.salary?.toLocaleString()}/yr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;