import { AdminSidebar } from "./AdminSidebar";
import { SettingsTabBar } from "./SettingsTabBar";
import { ProfileSettings } from "./ProfileSettings";
import { NotificationPreferences } from "./NotificationPreferences";
import { RoleManagement } from "./RoleManagement";
import { SystemConfiguration } from "./SystemConfiguration";
import { SecurityLogs } from "./SecurityLogs";
import { useState } from "react";

interface SystemSettingsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
}

export function SystemSettings({ activeTab, setActiveTab, onExitAdmin }: SystemSettingsProps) {
  const [activeSettingsSection, setActiveSettingsSection] = useState("profile");

  const renderSettingsContent = () => {
    switch (activeSettingsSection) {
      case "profile":
        return <ProfileSettings />;
      case "notifications":
        return <NotificationPreferences />;
      case "roles":
        return <RoleManagement />;
      case "configuration":
        return <SystemConfiguration />;
      case "security":
        return <SecurityLogs />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
      />

      {/* Main Content Area */}
      <div className="ml-64">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              System Settings
            </h1>
            <p style={{ color: "#333333" }}>
              Manage your profile, security, and global system configuration
            </p>
          </div>

          {/* Horizontal Tab Navigation */}
          <SettingsTabBar
            activeSection={activeSettingsSection}
            onSectionChange={setActiveSettingsSection}
          />

          {/* Content Area */}
          <div className="px-8 py-8">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
