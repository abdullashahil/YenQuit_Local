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
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Welcome back, {onboardingName || "Sarah"}
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              Here's your progress overview for today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              <QuitTrackerCard />
              <StatsSnapshot />
              <MotivationalContent />
              <ProgressCalendar />
            </div>
            <div className="lg:col-span-4">
              <AdaptiveAdviceModule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
