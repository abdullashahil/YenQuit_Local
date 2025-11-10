import { useState, useRef, useEffect } from "react";
import { Card } from "../../ui/card";
import { Sparkles, Play, Headphones, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/components/ui/utils";

export function RecommendedSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="relative" ref={sidebarRef}>
      {/* Collapsed Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-0 top-10 z-50 transition-all duration-300",
          "px-4 py-3 rounded-l-lg shadow-lg flex items-center",
          "hover:bg-teal-600 active:bg-teal-700",
          isOpen ? "bg-white" : "bg-teal-500"
        )}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        aria-label={isOpen ? 'Close recommendations' : 'Open recommendations'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "white" }}/>
            <span className="text-sm font-medium text-white">Recommended for You</span>
          </div>
        )}
      </button>

      {/* Sidebar */}
      <Card
        className={cn(
          "fixed right-0 top-0 h-full z-30 transition-all duration-300 overflow-y-auto",
          "border-0 rounded-l-3xl shadow-xl bg-white",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          height: 'calc(100% - 2rem)'
        }}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="sticky top-0 pt-4 pb-2 px-4 bg-white z-10 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
                <Sparkles className="w-5 h-5" style={{ color: "#20B2AA" }} />
              </div>
              <h3 className="text-2xl font-semibold mb-1" style={{ color: "#1C3B5E" }}>
                Recommended for You
              </h3>
            </div>
            <p className="text-sm mt-1 ml-11" style={{ color: "#666" }}>
              Personalized content based on your journey
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            {recommendations.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="p-4 mx-4 my-2 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
                  style={{
                    border: "1px solid #f0f0f0",
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
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
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
            <button
              className="w-full py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-90"
              style={{
                color: "#20B2AA",
                backgroundColor: "#20B2AA10",
                border: '1px solid rgba(32, 178, 170, 0.2)'
              }}
            >
              View All Recommendations
            </button>
          </div>
        </div>
        
      </Card>
    </div>
  );
}
