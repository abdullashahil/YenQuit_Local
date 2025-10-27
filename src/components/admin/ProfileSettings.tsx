import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";

export function ProfileSettings() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@quittingjourney.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = () => {
    console.log({ name, email, currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
          Profile Settings
        </h2>
        <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
          Manage your admin account information and credentials
        </p>
      </div>

      {/* Basic Information */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <h3 className="text-lg mb-6" style={{ color: "#1C3B5E" }}>
          Basic Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2" style={{ color: "#1C3B5E" }}>
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border-gray-200 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2" style={{ color: "#1C3B5E" }}>
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border-gray-200 h-12"
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <h3 className="text-lg mb-6" style={{ color: "#1C3B5E" }}>
          Change Password
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2" style={{ color: "#1C3B5E" }}>
              <Lock className="w-4 h-4" />
              Current Password
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-2xl h-12"
              style={{ borderColor: "#D9534F40" }}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2" style={{ color: "#1C3B5E" }}>
              <Lock className="w-4 h-4" />
              New Password
            </Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-2xl h-12"
              style={{ borderColor: "#D9534F40" }}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2" style={{ color: "#1C3B5E" }}>
              <Lock className="w-4 h-4" />
              Confirm New Password
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-2xl h-12"
              style={{ borderColor: "#D9534F40" }}
              placeholder="Confirm new password"
            />
          </div>

          <div className="pt-2">
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveChanges}
          className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
