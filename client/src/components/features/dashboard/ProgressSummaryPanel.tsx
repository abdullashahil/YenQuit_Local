import { Card } from "../../ui/card";
import { Trophy, Calendar } from "lucide-react";
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
  needsQuestionnaire?: boolean;
  hasCompletedPreSelfEfficacy?: boolean;
  hasCompletedPostSelfEfficacy?: boolean;
  isQuitDatePassed?: boolean;
  assistPlanData?: any;
}

export function ProgressSummaryPanel() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [longestStreak, setLongestStreak] = useState(0);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      
      const progressData = await quitTrackerService.getProgress();
      setProgress(progressData);
      
      // Calculate longest streak from logs
      if (progressData.logs && progressData.logs.length > 0) {
        const streak = calculateLongestStreak(progressData.logs);
        setLongestStreak(streak);
      }
    } catch (err: any) {
      console.error('Failed to fetch progress data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate longest streak from logs
  const calculateLongestStreak = (logs: any[]) => {
    if (!logs || logs.length === 0) return 0;
    
    // Sort logs by date (oldest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
    );
    
    let currentStreak = 0;
    let maxStreak = 0;
    let previousDate: Date | null = null;
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.log_date);
      logDate.setHours(0, 0, 0, 0); // Normalize to start of day
      
      if (!log.smoked) {
        if (previousDate) {
          const daysDiff = Math.floor((logDate.getTime() - previousDate.getTime()) / (24 * 60 * 60 * 1000));
          
          if (daysDiff === 1) {
            // Consecutive day
            currentStreak++;
          } else if (daysDiff > 1) {
            // Gap in days, reset streak
            currentStreak = 1;
          }
          // daysDiff === 0 means same day, continue current streak
        } else {
          // First smoke-free day
          currentStreak = 1;
        }
        
        maxStreak = Math.max(maxStreak, currentStreak);
        previousDate = logDate;
      } else {
        // Smoked day, reset streak
        currentStreak = 0;
        previousDate = null;
      }
    }
    
    return maxStreak;
  };

  // Load data on component mount
  useEffect(() => {
    fetchProgress();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
          Progress Summary
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((index) => (
            <Card key={index} className="rounded-2xl border-0 p-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gray-100">
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Trophy,
      label: "Longest Streak",
      value: `${longestStreak} Days`,
      highlight: true,
      iconColor: "#20B2AA",
      bgColor: "#20B2AA10",
    },
    {
      icon: Calendar,
      label: "Total Days Logged",
      value: `${progress?.logs?.length || 0} Days`,
      highlight: false,
      iconColor: "#1C3B5E",
      bgColor: "#1C3B5E10",
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
