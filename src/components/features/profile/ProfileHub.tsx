import { UserProfileCard } from "./UserProfileCard";
import { ProgressSummaryPanel } from "../dashboard/ProgressSummaryPanel";
import { ActionBlock } from "../../admin/ActionBlock";
import { LearningActivityLog } from "../dashboard/LearningActivityLog";
import { SupportHistory } from "./SupportHistory";
// import { PsychologicalProfileStatus } from "./PsychologicalProfileStatus";

interface ProfileHubProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onLogout?: () => void;
}

export function ProfileHub({ activeTab, setActiveTab, onLogout }: ProfileHubProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              My Profile
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              View your progress, manage your account, and track your journey
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: User Identity & Settings */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6">
              {/* User Card */}
              <UserProfileCard />
              {/* Progress Summary Panel */}
              <ProgressSummaryPanel />

              {/* Action Block */}
              <ActionBlock />
            </div>

            {/* Right Column: Activity & Data */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              {/* Learning Hub Activity Log */}
              <LearningActivityLog />

              {/* Support Interaction History */}
              <SupportHistory />

              {/* Psychological Profile Status */}
              {/* <PsychologicalProfileStatus /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
