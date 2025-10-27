import { Card } from "../../ui/card";
import { Trophy, Calendar, DollarSign } from "lucide-react";

export function ProgressSummaryPanel() {
  const stats = [
    {
      icon: Trophy,
      label: "Longest Streak",
      value: "12 Days",
      highlight: true,
      iconColor: "#20B2AA",
      bgColor: "#20B2AA10",
    },
    {
      icon: Calendar,
      label: "Total Days Logged",
      value: "38 Days",
      highlight: false,
      iconColor: "#1C3B5E",
      bgColor: "#1C3B5E10",
    },
    {
      icon: DollarSign,
      label: "Money Saved",
      value: "$152.00",
      highlight: false,
      iconColor: "#8BC34A",
      bgColor: "#8BC34A10",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
        Progress Summary
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card
              key={index}
              className={`rounded-2xl border-0 p-5 transition-all hover:shadow-lg ${
                stat.highlight ? "shadow-lg" : "shadow-md"
              }`}
              style={
                stat.highlight
                  ? { borderLeft: `4px solid #20B2AA` }
                  : {}
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ color: "#333333", opacity: 0.7 }}>
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl"
                    style={{ color: stat.highlight ? "#20B2AA" : "#1C3B5E" }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
