import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { DailyLogModal } from "./DailyLogModal";
import { useState } from "react";

export function QuitTrackerCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const daysSmokeFree = 12;
  const totalGoal = 30;
  const progressPercentage = (daysSmokeFree / totalGoal) * 100;

  return (
    <Card className="p-8 rounded-3xl shadow-lg border-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl" style={{ color: "#1C3B5E" }}>Your Journey Progress</h2>
            <p className="text-sm mt-1" style={{ color: "#333333" }}>Keep up the amazing work!</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: "#20B2AA20" }}>
            <TrendingUp className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
        </div>

        {/* Days Counter */}
        <div className="text-center py-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl" style={{ color: "#20B2AA" }}>{daysSmokeFree}</span>
            <span className="text-2xl" style={{ color: "#333333" }}>days</span>
          </div>
          <p className="mt-2" style={{ color: "#333333" }}>smoke-free and counting</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm" style={{ color: "#333333" }}>
            <span>Progress to 30-day goal</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: "#20B2AA"
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" style={{ color: "#20B2AA" }} />
              <span className="text-xs" style={{ color: "#333333" }}>Last Entry</span>
            </div>
            <p className="text-sm" style={{ color: "#1C3B5E" }}>Today, 8:30 AM</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: "#20B2AA" }} />
              <span className="text-xs" style={{ color: "#333333" }}>Success Rate</span>
            </div>
            <p className="text-sm" style={{ color: "#1C3B5E" }}>87%</p>
          </div>
        </div>

        {/* Log Daily Data Button */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-6 rounded-2xl text-white hover:opacity-90 transition-all shadow-md"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Log Daily Data
        </Button>
      </div>

      {/* Daily Log Modal */}
      <DailyLogModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </Card>
  );
}
