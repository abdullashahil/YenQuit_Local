import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { TrendingUp, Calendar, Target, Loader2 } from "lucide-react";
import { DailyLogModal } from "./DailyLogModal";
import { useState, useEffect } from "react";
import quitTrackerService from "../../../services/quitTrackerService";

interface ProgressData {
  quitDate: string | null;
  daysSmokeFree: number;
  totalGoal: number;
  progressPercentage: number;
  lastEntry: string | null;
  successRate: number;
  logs: any[];
}

export function QuitTrackerCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const progressData = await quitTrackerService.getProgress();
      setProgress(progressData);
    } catch (err: any) {
      setError(err.message || 'Failed to load progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProgress();
  }, []);

  // Handle log created/updated/deleted
  const handleLogChange = () => {
    fetchProgress(); // Refresh progress data
  };

  // Format last entry date
  const formatLastEntry = (lastEntry: string | null) => {
    if (!lastEntry) return 'No entries yet';
    
    const date = new Date(lastEntry);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#20B2AA" }} />
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProgress} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // Show no quit date state
  if (!progress?.quitDate) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="text-center py-12">
          <div className="p-4 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: "#20B2AA20" }}>
            <Target className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
          <h2 className="text-xl md:text-2xl mb-2" style={{ color: "#1C3B5E" }}>Start Your Journey</h2>
          <p className="text-sm mb-6" style={{ color: "#333333" }}>Set your quit date to begin tracking your progress</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-6 rounded-2xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Set Quit Date & Start Tracking
          </Button>
        </div>
        <DailyLogModal open={isModalOpen} onOpenChange={setIsModalOpen} onLogChange={handleLogChange} />
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl md:text-2xl" style={{ color: "#1C3B5E" }}>Your Journey Progress</h2>
            <p className="text-sm mt-1" style={{ color: "#333333" }}>Keep up the amazing work!</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: "#20B2AA20" }}>
            <TrendingUp className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
        </div>

        {/* Days Counter */}
        <div className="text-center py-4 md:py-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl" style={{ color: "#20B2AA" }}>{progress.daysSmokeFree}</span>
            <span className="text-xl md:text-2xl" style={{ color: "#333333" }}>days</span>
          </div>
          <p className="mt-2 text-sm md:text-base" style={{ color: "#333333" }}>smoke-free and counting</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm" style={{ color: "#333333" }}>
            <span>Progress to {progress.totalGoal}-day goal</span>
            <span>{progress.progressPercentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress.progressPercentage}%`,
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
            <p className="text-sm" style={{ color: "#1C3B5E" }}>{formatLastEntry(progress.lastEntry)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: "#20B2AA" }} />
              <span className="text-xs" style={{ color: "#333333" }}>Success Rate</span>
            </div>
            <p className="text-sm" style={{ color: "#1C3B5E" }}>{progress.successRate}%</p>
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
      <DailyLogModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onLogChange={handleLogChange}
        quitDate={progress.quitDate}
      />
    </Card>
  );
}
