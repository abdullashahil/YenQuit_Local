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
        console.log('👤 Dashboard - Loading user profile...');
        const response = await userService.getProfile();
        console.log('👤 Dashboard - Profile response:', response);
        
        if (response.success && response.data) {
          const name = response.data.full_name || onboardingName || "User";
          console.log('👤 Dashboard - Setting display name:', name);
          setDisplayName(name);
        } else {
          console.log('👤 Dashboard - No profile data, using fallback');
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
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Welcome, {displayName || "User"}
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              Here's your progress overview for today
            </p>
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
