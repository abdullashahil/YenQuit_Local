import { Card } from "../../ui/card";
import { Sparkles, RefreshCw } from "lucide-react";

export function AdaptiveAdviceModule() {
  const advice = [
    {
      title: "Morning Routine Tip",
      message: "Your data shows mornings are your strongest time. Use this energy to prepare for challenging afternoon hours.",
      time: "2 hours ago",
    },
    {
      title: "Trigger Alert",
      message: "You've logged stress 3 times this week. Try the breathing exercise in Learning Hub when you feel overwhelmed.",
      time: "5 hours ago",
    },
    {
      title: "Milestone Approaching",
      message: "You're 3 days away from your 2-week milestone! Consider planning a small reward to celebrate.",
      time: "Yesterday",
    },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-0 h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#20B2AA" }} />
            </div>
            <h3 className="text-lg" style={{ color: "#1C3B5E" }}>AI Insights</h3>
          </div>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <RefreshCw className="w-4 h-4" style={{ color: "#333333" }} />
          </button>
        </div>

        {/* Advice Cards */}
        <div className="space-y-4">
          {advice.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "#20B2AA" }} />
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ color: "#1C3B5E" }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#333333" }}>
                    {item.message}
                  </p>
                  <p className="text-xs mt-2 opacity-60" style={{ color: "#333333" }}>
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button 
          className="w-full py-3 rounded-2xl text-sm transition-all hover:opacity-80"
          style={{ color: "#20B2AA", backgroundColor: "#20B2AA10" }}
        >
          View All Insights
        </button>
      </div>
    </Card>
  );
}
