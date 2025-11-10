import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export function NotificationPreferences() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSave = () => {
    console.log({ emailNotifications, pushNotifications, smsNotifications });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
          Notification Preferences
        </h2>
        <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
          Manage how you receive notifications and alerts
        </p>
      </div>

      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <h3 className="text-lg mb-6" style={{ color: "#1C3B5E" }}>
          Notification Channels
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: "#1C3B5E" }} />
              <div>
                <Label style={{ color: "#1C3B5E" }}>Email Notifications</Label>
                <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                  Receive updates and alerts via email
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: "#1C3B5E" }} />
              <div>
                <Label style={{ color: "#1C3B5E" }}>Push Notifications</Label>
                <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                  Receive push notifications in your browser
                </p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" style={{ color: "#1C3B5E" }} />
              <div>
                <Label style={{ color: "#1C3B5E" }}>SMS Notifications</Label>
                <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                  Receive text messages on your phone
                </p>
              </div>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}