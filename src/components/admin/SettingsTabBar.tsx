import { User, Bell, Shield, Settings, Lock } from "lucide-react";

interface SettingsTabBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsTabBar({ activeSection, onSectionChange }: SettingsTabBarProps) {
  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "notifications", label: "Notification Preferences", icon: Bell },
    { id: "roles", label: "Role Management", icon: Shield },
    { id: "configuration", label: "System Configuration", icon: Settings },
    { id: "security", label: "Security Logs", icon: Lock },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className="flex-1 relative px-6 py-4 transition-all group"
              style={{
                color: isActive ? "#20B2AA" : "#333333",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon 
                  className="w-4 h-4 transition-all" 
                  style={{
                    color: isActive ? "#20B2AA" : "#333333",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
                <span 
                  className="text-sm transition-all"
                  style={{
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {tab.label}
                </span>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#20B2AA" }}
                />
              )}
              
              {/* Hover Effect for Inactive Tabs */}
              {!isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "#20B2AA40" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
