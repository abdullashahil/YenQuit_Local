import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from "../../services/adminProfileService";
import { useRouter } from "next/navigation";

export function ProfileSettings() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Load admin profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getAdminProfile();
      if (response.success && response.data) {
        setName(response.data.name);
        setEmail(response.data.email);
      }
    } catch (err: any) {
      setProfileError(err.message || "Failed to load profile");
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  };

  const getPasswordValidationMessage = () => {
    if (!newPassword) return null;
    
    const validation = validatePassword(newPassword);
    const errors = [];
    
    if (!validation.minLength) errors.push("At least 8 characters");
    if (!validation.hasUppercase) errors.push("One uppercase letter");
    if (!validation.hasLowercase) errors.push("One lowercase letter");
    if (!validation.hasNumber) errors.push("One number");
    if (!validation.hasSpecialChar) errors.push("One special character");
    
    return errors.length > 0 ? errors.join(", ") : null;
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      // Validate profile data
      if (!name.trim()) {
        setProfileError("Name is required");
        setProfileLoading(false);
        return;
      }

      if (!email.trim()) {
        setProfileError("Email is required");
        setProfileLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setProfileError("Please enter a valid email address");
        setProfileLoading(false);
        return;
      }

      // Update profile
      const profileResponse = await updateAdminProfile({ name, email });
      if (!profileResponse.success) {
        setProfileError(profileResponse.message || "Failed to update profile");
        setProfileLoading(false);
        return;
      }

      setProfileSuccess("Profile updated successfully!");
      
      // Reload profile to get updated data
      await loadProfile();
      
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      // Validate password fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All password fields are required");
        setPasswordLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        setPasswordLoading(false);
        return;
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        setPasswordError("Password must meet all requirements");
        setPasswordLoading(false);
        return;
      }

      const passwordResponse = await changeAdminPassword({
        currentPassword,
        newPassword
      });

      if (!passwordResponse.success) {
        setPasswordError(passwordResponse.message || "Failed to change password");
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const passwordValidationMessage = getPasswordValidationMessage();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold" style={{ color: "#1C3B5E" }}>
          Profile Settings
        </h2>
        <p className="text-lg" style={{ color: "#333333", opacity: 0.7 }}>
          Manage your admin account information and credentials
        </p>
      </div>

      {/* Error and Success Messages */}
      {(error || success) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
          {error || success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card className="p-8 rounded-3xl border-0 shadow-xl relative">
          {/* Save Button - Top Right Corner */}
          <div className="absolute top-6 right-6">
            <Button
              onClick={handleSaveProfile}
              disabled={profileLoading}
              className="px-4 py-2 rounded-xl text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: "#20B2AA" }}
            >
              <Save className="w-4 h-4" />
              {profileLoading ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#1C3B5E20" }}>
              <User className="w-6 h-6" style={{ color: "#1C3B5E" }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              Basic Information
            </h3>
          </div>

          {/* Profile Error and Success Messages */}
          {profileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl mb-4">
              {profileError}
            </div>
          )}
          
          {profileSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl mb-4">
              {profileSuccess}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-8 rounded-3xl border-0 shadow-xl relative">
          {/* Save Button - Top Right Corner */}
          <div className="absolute top-6 right-6">
            <Button
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="px-4 py-2 rounded-xl text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: "#D9534F" }}
            >
              <Save className="w-4 h-4" />
              {passwordLoading ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
              <Lock className="w-6 h-6" style={{ color: "#D9534F" }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              Change Password
            </h3>
          </div>

          {/* Password Error and Success Messages */}
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl mb-4">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl mb-4">
              {passwordSuccess}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                Current Password
              </Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-2xl h-12 pr-12"
                  style={{ borderColor: "#D9534F40" }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-2xl h-12 pr-12"
                  style={{ borderColor: "#D9534F40" }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordValidationMessage && (
                <p className="text-xs text-red-600">{passwordValidationMessage}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-2xl h-12 pr-12"
                  style={{ borderColor: "#D9534F40" }}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-sm font-medium mb-2" style={{ color: "#1C3B5E" }}>
                Password Requirements:
              </p>
              <ul className="text-xs space-y-1" style={{ color: "#333333", opacity: 0.7 }}>
                <li>• At least 8 characters long</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
                <li>• One special character</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
