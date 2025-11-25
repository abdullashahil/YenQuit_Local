import React, { useEffect, useState } from "react";
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
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setDisplayName(onboardingName || "");
          return;
        }
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setDisplayName(onboardingName || "");
          return;
        }
        const data = await res.json();
        const name = data?.profile?.full_name || data?.user?.full_name || data?.user?.name || onboardingName || "";
        setDisplayName(name);
      } catch {
        setDisplayName(onboardingName || "");
      }
    };
    run();
  }, [onboardingName]);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Welcome back, {displayName || onboardingName || "Sarah"}
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              Here's your progress overview for today
            </p>
          </div>

          // In DashboardPage.tsx
<div className="space-y-6">
  {/* Two Column Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Left Column */}
    <div className="lg:col-span-8 space-y-6">
      <QuitTrackerCard />
      <StatsSnapshot />
      <MotivationalContent />
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
