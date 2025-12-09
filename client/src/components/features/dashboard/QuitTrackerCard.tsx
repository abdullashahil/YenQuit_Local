import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { TrendingUp, Calendar, Target, Loader2, Play } from "lucide-react";
import { DailyLogModal } from "./DailyLogModal";
import { SelfEfficacyModal } from "./SelfEfficacyModal";
import { NewTrackerModal } from "./NewTrackerModal";
import { LogsModal } from "./LogsModal";
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

export function QuitTrackerCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isPostSelfEfficacyOpen, setIsPostSelfEfficacyOpen] = useState(false);
  const [isNewTrackerOpen, setIsNewTrackerOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
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
      setError(err.message || 'Failed to fetch progress data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProgress();
  }, []);

  // Handle questionnaire completion
  const handleQuestionnaireComplete = () => {
    setIsQuestionnaireOpen(false);
    fetchProgress(); // Refresh progress data
  };

  // Handle post self-efficacy completion
  const handlePostSelfEfficacyComplete = () => {
    setIsPostSelfEfficacyOpen(false);
    fetchProgress(); // Refresh progress data
  };

  // Handle new tracker creation
  const handleNewTrackerComplete = () => {
    setIsNewTrackerOpen(false);
    fetchProgress(); // Refresh progress data
  };

  // Handle start tracking journey
  const handleStartTracking = () => {
    setIsQuestionnaireOpen(true);
  };

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
      return `Today`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
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

  // Show needs questionnaire state
  if (progress?.needsQuestionnaire) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="text-center py-12">
          <div className="p-4 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: "#20B2AA20" }}>
            <Play className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
          <h2 className="text-xl md:text-2xl mb-2" style={{ color: "#1C3B5E" }}>Start Your Tracking Journey</h2>
          <p className="text-sm mb-6" style={{ color: "#333333" }}>
            Answer a few questions to personalize your quit tracking experience
          </p>
          <Button 
            onClick={handleStartTracking}
            className="w-full py-6 rounded-2xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Start Tracking Journey
          </Button>
        </div>
        <SelfEfficacyModal 
          open={isQuestionnaireOpen} 
          onOpenChange={setIsQuestionnaireOpen} 
          onComplete={handleQuestionnaireComplete}
        />
      </Card>
    );
  }

  // Show completed plan state
  if (progress?.isQuitDatePassed && !progress?.hasCompletedPostSelfEfficacy) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="text-center py-12">
          <div className="p-4 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: "#20B2AA20" }}>
            <Target className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
          <h2 className="text-xl md:text-2xl mb-2" style={{ color: "#1C3B5E" }}>You have completed your quit plan.</h2>
          <p className="text-sm mb-6" style={{ color: "#333333" }}>
            Congratulations! You've reached your quit date. Let's review your progress.
          </p>
          
          {/* Progress Graph */}
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#F8F9FA" }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: "#1C3B5E" }}>Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#333333" }}>Days Smoke-Free</span>
                <span className="font-semibold" style={{ color: "#20B2AA" }}>{progress.daysSmokeFree}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#333333" }}>Success Rate</span>
                <span className="font-semibold" style={{ color: "#20B2AA" }}>{progress.successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progress.progressPercentage}%`,
                    backgroundColor: "#20B2AA"
                  }}
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsPostSelfEfficacyOpen(true)}
            className="w-full py-6 rounded-2xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Start Post Self-Efficacy Questions
          </Button>
        </div>
        <SelfEfficacyModal 
          open={isPostSelfEfficacyOpen} 
          onOpenChange={setIsPostSelfEfficacyOpen} 
          onComplete={handlePostSelfEfficacyComplete}
          isPostSelfEfficacy={true}
        />
      </Card>
    );
  }

  // Show post-completion state
  if (progress?.isQuitDatePassed && progress?.hasCompletedPostSelfEfficacy) {
    return (
      <Card className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-0">
        <div className="text-center py-12">
          <div className="p-4 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: "#20B2AA20" }}>
            <Target className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </div>
          <h2 className="text-xl md:text-2xl mb-2" style={{ color: "#1C3B5E" }}>Congratulations on Completing Your Plan!</h2>
          <p className="text-sm mb-6" style={{ color: "#333333" }}>
            You've successfully completed your quit journey. Here's your progress summary.
          </p>
          
          {/* Progress Graph */}
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#F8F9FA" }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: "#1C3B5E" }}>Your Progress Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#333333" }}>Days Smoke-Free</span>
                <span className="font-semibold" style={{ color: "#20B2AA" }}>{progress.daysSmokeFree}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#333333" }}>Success Rate</span>
                <span className="font-semibold" style={{ color: "#20B2AA" }}>{progress.successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progress.progressPercentage}%`,
                    backgroundColor: "#20B2AA"
                  }}
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsNewTrackerOpen(true)}
            className="w-full py-6 rounded-2xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Would you like to keep a tracker?
          </Button>
        </div>
        <NewTrackerModal 
          open={isNewTrackerOpen} 
          onOpenChange={setIsNewTrackerOpen} 
          onComplete={handleNewTrackerComplete}
        />
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
          <h2 className="text-xl md:text-2xl mb-2" style={{ color: "#1C3B5E" }}>Set Your Quit Date</h2>
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
          <button
            onClick={() => setIsLogsModalOpen(true)}
            className="p-4 rounded-2xl transition-all hover:opacity-80 hover:shadow-md"
            style={{ backgroundColor: "#20B2AA20" }}
            title="View all logs"
          >
            <TrendingUp className="w-8 h-8" style={{ color: "#20B2AA" }} />
          </button>
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
            <span>
              {progress.assistPlanData && progress.quitDate ? (
                new Date(progress.quitDate) > new Date() ? 
                  `Progress to Quit Date` : 
                  `Journey Progress`
              ) : (
                'Progress to 30-day goal'
              )}
            </span>
            <span>{progress.progressPercentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(progress.progressPercentage, 100)}%`,
                backgroundColor: "#20B2AA"
              }}
            />
          </div>
          {/* Always show date information when quit date is available */}
          {progress.quitDate && (
            <div className="text-xs text-center space-y-1" style={{ color: "#666666" }}>
              <div>
                {progress.assistPlanData ? (
                  new Date(progress.quitDate) > new Date() ? 
                    `Quit date: ${new Date(progress.quitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 
                    `Quit since ${new Date(progress.quitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                ) : (
                  new Date(progress.quitDate) > new Date() ? 
                    `Quit date: ${new Date(progress.quitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 
                    `Quit since ${new Date(progress.quitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                )}
              </div>
              {progress.assistPlanData && (
                <div>
                  Started: {new Date(progress.assistPlanData.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          )}
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
          {progress?.logs?.some(log => {
            const logDate = new Date(log.log_date).toDateString();
            const today = new Date().toDateString();
            return logDate === today;
          }) ? "Update Today's Log" : "Log Daily Data"}
        </Button>
      </div>

      {/* Daily Log Modal */}
      <DailyLogModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onLogChange={handleLogChange}
        quitDate={progress.quitDate}
      />
      
      {/* Self-Efficacy Modal */}
      <SelfEfficacyModal 
        open={isQuestionnaireOpen} 
        onOpenChange={setIsQuestionnaireOpen} 
        onComplete={handleQuestionnaireComplete}
      />
      
      {/* Logs Modal */}
      <LogsModal 
        open={isLogsModalOpen} 
        onOpenChange={setIsLogsModalOpen}
      />
    </Card>
  );
}
