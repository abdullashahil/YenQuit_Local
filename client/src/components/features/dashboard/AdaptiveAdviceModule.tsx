import { useState } from 'react';
import { Card } from "../../ui/card";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export function AdaptiveAdviceModule() {
  const [showAll, setShowAll] = useState(false);
  
  const advice = [
    {
      id: 1,
      title: "Morning Routine Tip",
      message: "Your data shows mornings are your strongest time. Use this energy to prepare for challenging afternoon hours.",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Trigger Alert",
      message: "You've logged stress 3 times this week. Try the breathing exercise in Learning Hub when you feel overwhelmed.",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Milestone Approaching",
      message: "You're 3 days away from your 2-week milestone! Consider planning a small reward to celebrate.",
      time: "Yesterday",
    },
    {
      id: 4,
      title: "Weekly Progress",
      message: "You've reduced your smoking by 40% this week compared to last week. Keep up the great work!",
      time: "2 days ago",
    },
  ];

  const visibleAdvice = showAll ? advice : advice.slice(0, 2);
  const hasMore = advice.length > 2 && !showAll;

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">  {/* Remove h-full from here */}
  <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#20B2AA20]">
              <Sparkles className="w-5 h-5 text-[#20B2AA]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Refresh insights"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Advice Cards */}
        <div className="space-y-3">
          {visibleAdvice.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#20B2AA]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All/Show Less Button */}
        {advice.length > 2 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2.5 text-sm font-medium text-[#20B2AA] hover:text-[#1a9c94] transition-colors"
          >
            {showAll ? 'Show Less' : `View All ${advice.length - 2} More`}
          </button>
        )}
      </div>
    </Card>
  );
}
