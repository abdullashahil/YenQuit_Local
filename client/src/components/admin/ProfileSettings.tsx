import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function ProfileSettings() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@quittingjourney.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveChanges = () => {
    console.log({ name, email, currentPassword, newPassword, confirmPassword });
  };

  const PasswordInput = ({ value, onChange, placeholder, showPassword, setShowPassword }: any) => (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="rounded-2xl h-12 pr-12"
        style={{ borderColor: "#D9534F40" }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card className="p-8 rounded-3xl border-0 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#1C3B5E20" }}>
              <User className="w-6 h-6" style={{ color: "#1C3B5E" }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              Basic Information
            </h3>
          </div>

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
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-8 rounded-3xl border-0 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
              <Lock className="w-6 h-6" style={{ color: "#D9534F" }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              Change Password
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                Current Password
              </Label>
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium" style={{ color: "#1C3B5E" }}>
                <Lock className="w-4 h-4" />
                Confirm New Password
              </Label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
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

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSaveChanges}
          className="px-12 py-6 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
