import React from "react";
import { Sidebar } from "../../layouts/Sidebar";
import { QuitTrackerCard } from "./QuitTrackerCard";
import { ProgressCalendar } from "./ProgressCalendar";
import { AdaptiveAdviceModule } from "./AdaptiveAdviceModule";
import { StatsSnapshot } from "./StatsSnapshot";
import { MotivationalContent } from "./MotivationalContent";

interface DashboardPageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onboardingName?: string;
}

export function DashboardPage({ activeTab, setActiveTab, onLogout, onboardingName }: DashboardPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Welcome back, {onboardingName || "Sarah"}
            </h1>
            <p style={{ color: "#333333" }}>
              Here's your progress overview for today
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              <QuitTrackerCard />
              <StatsSnapshot />
              <MotivationalContent />
              <ProgressCalendar />
            </div>
            <div className="col-span-4">
              <AdaptiveAdviceModule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
