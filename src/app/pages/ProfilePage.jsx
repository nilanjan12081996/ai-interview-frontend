import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, updateAvatar } from '../Reducer/ProfileSlice';
import { Camera, Mail, Phone, User, Loader2, Edit3, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const dispatch = useDispatch();
  const { profileData, loading, updateLoading, updateAvatarLoading } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstname || profileData.firstName || profileData.f_name || profileData.name || '',
        lastName: profileData.lastname || profileData.lastName || profileData.l_name || '',
        mobile: profileData.mobile || '',
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        fristName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
      };
      const res = await dispatch(updateProfile(payload)).unwrap();
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      dispatch(getProfile());
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      await dispatch(updateAvatar(data)).unwrap();
      setSuccessMsg('Avatar updated successfully!');
      dispatch(getProfile());
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update avatar', err);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#800080]" />
      </div>
    );
  }

  const avatarUrl = profileData?.avatarUrl || profileData?.avatar || profileData?.profileImage;
  const displayName = profileData?.firstname || profileData?.firstName || profileData?.f_name
    ? `${profileData.firstname || profileData.firstName || profileData.f_name} ${profileData.lastname || profileData.lastName || profileData.l_name || ''}`.trim()
    : (profileData?.name || 'User');

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="h-5 w-5" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Left Column: Avatar & Basic Info */}
        <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm border border-gray-100 h-fit">
          <div className="relative group mb-6">
            <div
              className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-purple-100 ring-4 ring-white shadow-lg transition-transform duration-300 ${updateAvatarLoading ? 'opacity-50' : ''}`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#800080]">{getInitials(displayName)}</span>
              )}
            </div>

            <button
              onClick={handleAvatarClick}
              disabled={updateAvatarLoading}
              className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#800080] text-white shadow-md hover:bg-purple-800 transition-colors"
            >
              {updateAvatarLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center">{displayName}</h2>
          <p className="text-sm text-gray-500 mt-1 mb-4 flex items-center justify-center gap-2 text-center">
            {profileData?.email || "admin@interviewer.ai"}
          </p>

          <div className="w-full flex justify-center">
            <span className="px-3 py-1 bg-purple-50 text-[#800080] text-xs font-semibold rounded-full border border-purple-100">
              {sessionStorage.getItem("role") === "SUPER_ADMIN" ? "Super Admin" : "HR Manager"}
            </span>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-sm font-medium text-[#800080] hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {isEditing ? 'Cancel Edit' : <><Edit3 className="h-4 w-4" /> Edit Profile</>}
            </button>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-900 transition-colors focus:border-[#800080] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
                placeholder="Enter first name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-900 transition-colors focus:border-[#800080] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
                placeholder="Enter last name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                value={profileData?.email || ''}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 p-3 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" /> Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-900 transition-colors focus:border-[#800080] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
                placeholder="Enter mobile number"
              />
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateLoading}
                  className="bg-[#800080] hover:bg-purple-800 text-white min-w-[140px] shadow-md shadow-purple-200"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
