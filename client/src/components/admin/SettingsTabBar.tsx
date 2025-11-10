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
      <div className="flex items-center gap-0 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className="flex-1 min-w-[200px] relative px-6 py-5 transition-all group"
              style={{
                color: isActive ? "#20B2AA" : "#333333",
                backgroundColor: isActive ? "#20B2AA10" : "transparent",
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Icon 
                  className="w-5 h-5 transition-all" 
                  style={{
                    color: isActive ? "#20B2AA" : "#333333",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
                <span 
                  className="text-sm font-medium transition-all whitespace-nowrap"
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
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: "#20B2AA" }}
                />
              )}
              
              {/* Hover Effect for Inactive Tabs */}
              {!isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity"
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
