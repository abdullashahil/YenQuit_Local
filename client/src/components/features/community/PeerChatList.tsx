import { Card } from "../../ui/card";
import { Avatar } from "../../ui/avatar";
import { MessageCircle, User } from "lucide-react";

export function PeerChatList() {
  const recentChats = [
    {
      id: 1,
      name: "Alex M.",
      lastMessage: "Thanks for the support yesterday! Feeling stronger today.",
      time: "5 min ago",
      unread: 2,
      avatar: "AM",
    },
    {
      id: 2,
      name: "Jordan P.",
      lastMessage: "How are you managing your cravings today?",
      time: "1 hour ago",
      unread: 0,
      avatar: "JP",
    },
    {
      id: 3,
      name: "Sam K.",
      lastMessage: "We can do this together! Day 15 for me 💪",
      time: "3 hours ago",
      unread: 1,
      avatar: "SK",
    },
  ];

  return (
    <div className="space-y-3">
      {recentChats.map((chat) => (
        <Card
          key={chat.id}
          className="p-4 rounded-2xl shadow-md border-0 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
            >
              <span>{chat.avatar}</span>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm" style={{ color: "#1C3B5E" }}>
                  {chat.name}
                </h4>
                <span className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                  {chat.time}
                </span>
              </div>
              <p
                className="text-sm line-clamp-1"
                style={{ color: "#333333", opacity: 0.7 }}
              >
                {chat.lastMessage}
              </p>
            </div>

            {/* Unread Badge */}
            {chat.unread > 0 && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#20B2AA" }}
              >
                <span className="text-xs text-white">{chat.unread}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
