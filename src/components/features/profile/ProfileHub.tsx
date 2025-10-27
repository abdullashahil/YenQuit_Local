import { Sidebar } from "../../layouts/Sidebar";
import { UserProfileCard } from "./UserProfileCard";
import { ProgressSummaryPanel } from "../dashboard/ProgressSummaryPanel";
import { ActionBlock } from "../../admin/ActionBlock";
import { LearningActivityLog } from "../dashboard/LearningActivityLog";
import { SupportHistory } from "./SupportHistory";
import { PsychologicalProfileStatus } from "./PsychologicalProfileStatus";

interface ProfileHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function ProfileHub({ activeTab, setActiveTab, onLogout }: ProfileHubProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="ml-64 p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              My Profile
            </h1>
            <p style={{ color: "#333333" }}>
              View your progress, manage your account, and track your journey
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: User Identity & Settings */}
            <div className="col-span-5 space-y-6">
              {/* User Card */}
              <UserProfileCard />

              {/* Progress Summary Panel */}
              <ProgressSummaryPanel />

              {/* Action Block */}
              <ActionBlock />
            </div>

            {/* Right Column: Activity & Data */}
            <div className="col-span-7 space-y-6">
              {/* Learning Hub Activity Log */}
              <LearningActivityLog />

              {/* Support Interaction History */}
              <SupportHistory />

              {/* Psychological Profile Status */}
              <PsychologicalProfileStatus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
