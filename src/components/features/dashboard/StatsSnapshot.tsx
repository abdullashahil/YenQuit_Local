import { Card } from "../../ui/card";
import { DollarSign, Heart, Flame, Award } from "lucide-react";

export function StatsSnapshot() {
  const stats = [
    {
      label: "Current Streak",
      value: "12",
      unit: "days",
      icon: Flame,
      color: "#20B2AA",
    },
    {
      label: "Money Saved",
      value: "$84",
      unit: "USD",
      icon: DollarSign,
      color: "#20B2AA",
    },
    {
      label: "Health Score",
      value: "87",
      unit: "%",
      icon: Heart,
      color: "#20B2AA",
    },
    {
      label: "Milestones",
      value: "3",
      unit: "achieved",
      icon: Award,
      color: "#20B2AA",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${stat.color}20` }}>
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-sm" style={{ color: "#333333" }}>
                  {stat.unit}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#333333" }}>
                {stat.label}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
