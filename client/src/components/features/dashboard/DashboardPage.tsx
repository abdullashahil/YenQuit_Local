import React, { useEffect, useState } from "react";
import { Sidebar } from "../../layouts/Sidebar";
import { QuitTrackerCard } from "./QuitTrackerCard";
import { ProgressCalendar } from "./ProgressCalendar";
import { AdaptiveAdviceModule } from "./AdaptiveAdviceModule";
import { StatsSnapshot } from "./StatsSnapshot";
import { ResumeContent } from "./ResumeContent";
import userService from "../../../services/userService";

interface DashboardPageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onboardingName?: string;
}

export function DashboardPage({ activeTab, setActiveTab, onLogout, onboardingName }: DashboardPageProps) {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {

        const response = await userService.getProfile();


        if (response.success && response.data) {
          const name = response.data.full_name || onboardingName || "User";

          setDisplayName(name);
        } else {

          setDisplayName(onboardingName || "User");
        }
      } catch (err) {
        console.error('👤 Dashboard - Failed to load user profile:', err);
        setDisplayName(onboardingName || "User");
      }
    };

    loadUserProfile();
  }, [onboardingName]);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
                Welcome, {displayName || "User"}
              </h1>
              <p className="text-sm md:text-base" style={{ color: "#333333" }}>
                Here's your progress overview for today
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/fagerstrom-test'}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: '#20B2AA',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Retake Test</span>
              <span className="sm:hidden">Test</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                <QuitTrackerCard />
                <StatsSnapshot />
                <ResumeContent />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4">
                <AdaptiveAdviceModule />
              </div>
            </div>

            {/* Calendar - Full Width */}
            <div className="w-full">
              <ProgressCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
