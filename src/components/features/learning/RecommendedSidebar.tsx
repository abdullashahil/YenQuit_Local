import { Card } from "../../ui/card";
import { Sparkles, Play, Headphones, Image as ImageIcon } from "lucide-react";

export function RecommendedSidebar() {
  const recommendations = [
    {
      type: "video",
      icon: Play,
      title: "Managing Evening Cravings",
      reason: "Based on your daily logs",
    },
    {
      type: "podcast",
      icon: Headphones,
      title: "Week 2 Success Stories",
      reason: "Popular in your stage",
    },
    {
      type: "image",
      icon: ImageIcon,
      title: "Daily Affirmations",
      reason: "Trending this week",
    },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-0 sticky top-8">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
            <Sparkles className="w-5 h-5" style={{ color: "#20B2AA" }} />
          </div>
          <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
            Recommended for You
          </h3>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          {recommendations.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className="p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: "#20B2AA20" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#20B2AA" }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug mb-1" style={{ color: "#1C3B5E" }}>
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                      {item.reason}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <button 
          className="w-full py-3 rounded-2xl text-sm transition-all hover:opacity-80"
          style={{ color: "#20B2AA", backgroundColor: "#20B2AA10" }}
        >
          View All Recommendations
        </button>
      </div>
    </Card>
  );
}
