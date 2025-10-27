import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    systemUpdates: {
      email: true,
      push: true,
      inApp: true,
    },
    lowProgressAlerts: {
      email: true,
      push: false,
      inApp: true,
    },
    newUserRegistrations: {
      email: false,
      push: false,
      inApp: true,
    },
    contentPublished: {
      email: true,
      push: false,
      inApp: true,
    },
    securityAlerts: {
      email: true,
      push: true,
      inApp: true,
    },
    weeklyReports: {
      email: true,
      push: false,
      inApp: false,
    },
  });

  const handleToggle = (category: string, type: string) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !prev[category as keyof typeof prev][type as keyof typeof prev.systemUpdates],
      },
    }));
  };

  const notificationTypes = [
    { id: "systemUpdates", label: "System Updates", description: "Important system maintenance and updates" },
    { id: "lowProgressAlerts", label: "Low Progress Alerts", description: "Notifications when users show concerning patterns" },
    { id: "newUserRegistrations", label: "New User Registrations", description: "Alert when new users join the platform" },
    { id: "contentPublished", label: "Content Published", description: "When new content goes live" },
    { id: "securityAlerts", label: "Security Alerts", description: "Failed login attempts and security issues" },
    { id: "weeklyReports", label: "Weekly Reports", description: "Summary of platform activity and statistics" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
          Notification Preferences
        </h2>
        <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
          Configure how you receive administrative notifications
        </p>
      </div>

      {/* Notification Settings */}
      <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#20B2AA20" }}
            >
              <Bell className="w-5 h-5" style={{ color: "#20B2AA" }} />
            </div>
            <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
              Notification Channels
            </h3>
          </div>
        </div>

        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: "#f8f8f8" }}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <p className="text-xs uppercase tracking-wider" style={{ color: "#1C3B5E", opacity: 0.7 }}>
                Notification Type
              </p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs uppercase tracking-wider" style={{ color: "#1C3B5E", opacity: 0.7 }}>
                Email
              </p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs uppercase tracking-wider" style={{ color: "#1C3B5E", opacity: 0.7 }}>
                Push
              </p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs uppercase tracking-wider" style={{ color: "#1C3B5E", opacity: 0.7 }}>
                In-App
              </p>
            </div>
          </div>
        </div>

        {/* Notification Rows */}
        <div className="divide-y divide-gray-50">
          {notificationTypes.map((notification, index) => (
            <div
              key={notification.id}
              className="px-6 py-5 hover:bg-gray-50 transition-colors"
              style={{
                backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
              }}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6">
                  <p className="text-sm mb-1" style={{ color: "#1C3B5E" }}>
                    {notification.label}
                  </p>
                  <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                    {notification.description}
                  </p>
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={preferences[notification.id as keyof typeof preferences].email}
                    onCheckedChange={() => handleToggle(notification.id, "email")}
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={preferences[notification.id as keyof typeof preferences].push}
                    onCheckedChange={() => handleToggle(notification.id, "push")}
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={preferences[notification.id as keyof typeof preferences].inApp}
                    onCheckedChange={() => handleToggle(notification.id, "inApp")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
