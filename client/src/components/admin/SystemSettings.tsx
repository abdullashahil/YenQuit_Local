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
      <div>
        <div className="max-w-[1600px] ml-5 mx-auto">
          {/* Page Header */}
          <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#1C3B5E" }}>
              System Settings
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333", opacity: 0.8 }}>
              Manage your profile, security, and global system configuration
            </p>
          </div>

          {/* Horizontal Tab Navigation */}
          <SettingsTabBar
            activeSection={activeSettingsSection}
            onSectionChange={setActiveSettingsSection}
          />

          {/* Content Area */}
          <div className="px-4 md:px-8 py-8">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
}