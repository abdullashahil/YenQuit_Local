import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Lightbulb, Bell, X, Send, TrendingUp } from "lucide-react";
import { useState } from "react";

export function InsightsNotifications() {
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [insightMessage, setInsightMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");

  const recentNotifications = [
    {
      id: 1,
      title: "Weekly Progress Update",
      message: "Check your weekly progress report!",
      sentDate: "Oct 14, 2025",
      recipients: 1247,
    },
    {
      id: 2,
      title: "New Learning Content",
      message: "Explore our latest articles on coping strategies",
      sentDate: "Oct 12, 2025",
      recipients: 1247,
    },
    {
      id: 3,
      title: "Community Event",
      message: "Join our live support session tomorrow at 3 PM",
      sentDate: "Oct 10, 2025",
      recipients: 856,
    },
  ];

  const handleShareInsight = () => {
    console.log({ insightMessage });
    setIsInsightModalOpen(false);
    setInsightMessage("");
  };

  const handleSendNotification = () => {
    console.log({ notificationTitle, notificationBody });
    setIsNotificationModalOpen(false);
    setNotificationTitle("");
    setNotificationBody("");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Insights Sharing */}
        <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "#20B2AA20" }}
              >
                <Lightbulb className="w-5 h-5" style={{ color: "#20B2AA" }} />
              </div>
              <div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
                  Insights Sharing
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#333333", opacity: 0.6 }}>
                  Share success stories and statistics
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: "#8BC34A20" }}>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 mt-0.5" style={{ color: "#8BC34A" }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: "#8BC34A" }}>
                    Current Insight (Live on Dashboard)
                  </p>
                  <p className="text-sm" style={{ color: "#333333" }}>
                    "90% of users hit their smoke-free goal this week! Keep up the amazing work!"
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsInsightModalOpen(true)}
              className="w-full py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Share New Insight
            </Button>
          </div>
        </Card>

        {/* Notifications Center */}
        <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "#20B2AA20" }}
              >
                <Bell className="w-5 h-5" style={{ color: "#20B2AA" }} />
              </div>
              <div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
                  Notifications Center
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#333333", opacity: 0.6 }}>
                  Recent push notifications
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-2xl border"
                style={{ borderColor: "#f0f0f0" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm" style={{ color: "#1C3B5E" }}>
                    {notification.title}
                  </h4>
                  <span className="text-xs" style={{ color: "#333333", opacity: 0.5 }}>
                    {notification.sentDate}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                  {notification.message}
                </p>
                <div className="text-xs" style={{ color: "#20B2AA" }}>
                  Sent to {notification.recipients} users
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100">
            <Button
              onClick={() => setIsNotificationModalOpen(true)}
              className="w-full py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              <Send className="w-5 h-5 mr-2" />
              Send New Notification
            </Button>
          </div>
        </Card>
      </div>

      {/* Share Insight Modal */}
      <Dialog open={isInsightModalOpen} onOpenChange={setIsInsightModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
                Share New Insight
              </h2>
              <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
                Create a motivational message to display on user dashboards
              </p>
            </div>
            <button
              onClick={() => setIsInsightModalOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" style={{ color: "#333333" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Insight Message <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Textarea
                value={insightMessage}
                onChange={(e) => setInsightMessage(e.target.value)}
                placeholder="e.g., 90% of users hit their goal this week! Keep up the amazing work!"
                className="rounded-2xl border-gray-200 min-h-24 resize-none"
              />
              <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                Keep it short, positive, and encouraging (max 200 characters)
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <Button
              onClick={() => setIsInsightModalOpen(false)}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
              style={{ color: "#333333" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShareInsight}
              className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              Share Insight
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Notification Modal */}
      <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
                Send New Notification
              </h2>
              <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
                Create and send a push notification to all users
              </p>
            </div>
            <button
              onClick={() => setIsNotificationModalOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" style={{ color: "#333333" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Notification Title <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="e.g., New Learning Content Available"
                className="rounded-2xl border-gray-200 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Notification Body <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Textarea
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
                placeholder="Enter the notification message..."
                className="rounded-2xl border-gray-200 min-h-24 resize-none"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <Button
              onClick={() => setIsNotificationModalOpen(false)}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
              style={{ color: "#333333" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              Send to All Users
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
