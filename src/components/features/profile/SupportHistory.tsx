import { Card } from "../../ui/card";
import { MessageCircle, Bot, Phone } from "lucide-react";

export function SupportHistory() {
  const interactions = [
    {
      id: 1,
      type: "ai",
      icon: Bot,
      title: "AI Check-in Complete",
      description: "Daily wellness assessment and craving support",
      date: "Oct 16, 2025",
    },
    {
      id: 2,
      type: "chat",
      icon: MessageCircle,
      title: "Chat with Alex M.",
      description: "Peer support conversation about managing stress",
      date: "Oct 15, 2025",
    },
    {
      id: 3,
      type: "staff",
      icon: Phone,
      title: "Live Support Session",
      description: "15-minute check-in with counselor",
      date: "Oct 13, 2025",
    },
    {
      id: 4,
      type: "ai",
      icon: Bot,
      title: "AI Check-in Complete",
      description: "Evening motivation and progress review",
      date: "Oct 12, 2025",
    },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      <div className="mb-5">
        <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
          Support Interactions
        </h3>
        <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.6 }}>
          Recent support and community activity
        </p>
      </div>

      <div className="space-y-3">
        {interactions.map((interaction) => {
          const Icon = interaction.icon;
          
          return (
            <div
              key={interaction.id}
              className="flex items-start gap-3 p-4 rounded-2xl border"
              style={{ borderColor: "#f0f0f0" }}
            >
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{ backgroundColor: "#20B2AA10" }}
              >
                <Icon className="w-4 h-4" style={{ color: "#20B2AA" }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  {interaction.title}
                </p>
                <p className="text-xs mb-2" style={{ color: "#333333", opacity: 0.6 }}>
                  {interaction.description}
                </p>
                <p className="text-xs" style={{ color: "#333333", opacity: 0.5 }}>
                  {interaction.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
