import { Card } from "../../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProgressCalendar() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Mock calendar data for October 2025
  const calendarDays = [
    { day: 1, status: "smoke-free" },
    { day: 2, status: "smoke-free" },
    { day: 3, status: "high" },
    { day: 4, status: "smoke-free" },
    { day: 5, status: "smoke-free" },
    { day: 6, status: "smoke-free" },
    { day: 7, status: "smoke-free" },
    { day: 8, status: "smoke-free" },
    { day: 9, status: "smoke-free" },
    { day: 10, status: "smoke-free" },
    { day: 11, status: "smoke-free" },
    { day: 12, status: "smoke-free" },
    { day: 13, status: "high" },
    { day: 14, status: "smoke-free" },
    { day: 15, status: "smoke-free" },
    { day: 16, status: "smoke-free" },
    { day: 17, status: "current" },
    { day: 18, status: null },
    { day: 19, status: null },
    { day: 20, status: null },
    { day: 21, status: null },
    { day: 22, status: null },
    { day: 23, status: null },
    { day: 24, status: null },
    { day: 25, status: null },
    { day: 26, status: null },
    { day: 27, status: null },
    { day: 28, status: null },
    { day: 29, status: null },
    { day: 30, status: null },
    { day: 31, status: null },
  ];

  // Add empty cells for the start of month (assuming Oct 1 is on a Wednesday)
  const startEmptyCells = 3;
  
  const getDayStyle = (status: string | null) => {
    if (status === "smoke-free") {
      return { backgroundColor: "#20B2AA", color: "white" };
    } else if (status === "high") {
      return { backgroundColor: "#E57373", color: "white" };
    } else if (status === "current") {
      return { backgroundColor: "#1C3B5E", color: "white" };
    }
    return { backgroundColor: "white", color: "#333333" };
  };

  return (
    <Card className="rounded-3xl shadow-lg border-0 overflow-hidden">
      {/* Header */}
      <div className="p-6" style={{ backgroundColor: "#1C3B5E" }}>
        <div className="flex items-center justify-between text-white">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg">October 2025</h3>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs" style={{ color: "#333333" }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for start of month */}
          {Array.from({ length: startEmptyCells }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          
          {/* Actual days */}
          {calendarDays.map((dayData) => (
            <div
              key={dayData.day}
              className="aspect-square flex items-center justify-center rounded-xl text-sm cursor-pointer hover:opacity-80 transition-all"
              style={getDayStyle(dayData.status)}
            >
              {dayData.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#20B2AA" }} />
            <span className="text-xs" style={{ color: "#333333" }}>Smoke-free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#E57373" }} />
            <span className="text-xs" style={{ color: "#333333" }}>High-risk day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#1C3B5E" }} />
            <span className="text-xs" style={{ color: "#333333" }}>Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
