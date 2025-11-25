import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { User, Settings, X, Camera } from "lucide-react";
import userService from "../../../services/userService";

export function UserProfileCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    age: "",
    gender: "",
    country: "",
    bio: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          full_name: response.data.full_name || "",
          phone: response.data.phone || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
          country: response.data.country || "",
          bio: response.data.bio || ""
        });
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      const response = await userService.updateProfile(updateData);
      if (response.success) {
        setSuccess("Profile updated successfully!");
        setProfile(response.data);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const response = await userService.uploadAvatar(file);
      if (response.success) {
        setProfile(prev => ({ ...prev, avatar_url: response.data.avatar_url }));
        setSuccess("Avatar updated successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setSaving(false);
    }
  };

  // Disable background scroll and preserve scrollbar width to prevent layout shift
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (loading) {
    return (
      <Card className="rounded-3xl shadow-lg border-0 p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-3xl shadow-lg border-0 p-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-24 h-24 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 overflow-hidden"
              style={{ backgroundColor: "#20B2AA20" }}
            >
              {profile?.avatar_url ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${profile.avatar_url}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 sm:w-10 sm:h-10" style={{ color: "#20B2AA" }} />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-[#20B2AA] text-white p-1 rounded-full cursor-pointer hover:opacity-90">
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                disabled={saving}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full mt-4 sm:mt-0">
            <h2 className="text-2xl sm:text-2xl mb-2" style={{ color: "#1C3B5E" }}>
              {profile?.full_name || "User"}
            </h2>

            <div className="mb-4">
              {/* Email */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2 mb-2">
                <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Email:
                </span>
                <span className="text-sm" style={{ color: "#333333" }}>
                  {profile?.email || "N/A"}
                </span>
              </div>

              {/* Phone */}
              {profile?.phone && (
                <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2 mb-2">
                  <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                    Phone:
                  </span>
                  <span className="text-sm" style={{ color: "#333333" }}>
                    {profile.phone}
                  </span>
                </div>
              )}

              {/* Member Since */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2">
                <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Member Since:
                </span>
                <span className="text-sm" style={{ color: "#333333" }}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full rounded-2xl transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2 sm:mt-0"
              style={{ backgroundColor: "#20B2AA", color: "white" }}
              disabled={saving}
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal Popup - transparent overlay so background color doesn't change */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
        >
          {/* Transparent overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Box with full shadow on all sides */}
          <div
            className="relative bg-white rounded-3xl p-6 w-[90%] sm:w-[400px] max-h-[90vh] overflow-y-auto"
            style={{
              zIndex: 51,
              boxShadow: "0 0 25px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close edit profile"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4" style={{ color: "#1C3B5E" }}>
              Edit Profile
            </h2>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                />
              </div>

              {/* Age */}
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                  min="1"
                  max="120"
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                />
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Bio / About
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                  disabled={saving}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                className="w-full rounded-2xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#20B2AA", color: "white" }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
