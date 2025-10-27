import { Sidebar } from "../../layouts/Sidebar";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { PeerChatList } from "./PeerChatList";
import { CommunityGroupCard } from "./CommunityGroupCard";
import { AIHelperChat } from "../community/AIHelperChat";
import { MessageCircle, UserPlus, Users, Plus } from "lucide-react";

interface CommunityHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function CommunityHub({ activeTab, setActiveTab, onLogout }: CommunityHubProps) {
  const communityGroups = [
    {
      image: "https://images.unsplash.com/photo-1556159916-26bf2ce06da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0JTIwZ3JvdXAlMjBwZW9wbGV8ZW58MXx8fHwxNzYwNzA4OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "First Two Weeks Warriors",
      description: "Support group for those in their crucial first 14 days of quitting.",
      members: 234,
    },
    {
      image: "https://images.unsplash.com/photo-1721059050924-eaf014837bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB0ZWFtd29ya3xlbnwxfHx8fDE3NjA3MDg5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "Young Adults Unite",
      description: "A community for young adults navigating their quit journey together.",
      members: 187,
    },
    {
      image: "https://images.unsplash.com/photo-1758797316117-8d133af25f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHJlY292ZXJ5JTIwZ3JvdXB8ZW58MXx8fHwxNzYwNzA4OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "Wellness & Recovery",
      description: "Holistic approach to quitting - mind, body, and spirit.",
      members: 312,
    },
    {
      image: "https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwc3VwcG9ydCUyMGNpcmNsZXxlbnwxfHx8fDE3NjA3MDg5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "Long-Term Success Circle",
      description: "For those who've quit for 6+ months. Share wisdom and stay strong.",
      members: 156,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Uphold Community
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              Connect with peers and get personalized AI support on your journey
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Community Connection */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              {/* Section 1: Direct Support */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl" style={{ color: "#1C3B5E" }}>
                    Direct Support
                  </h2>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="w-full py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#20B2AA" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start New Chat
                  </Button>
                  <Button
                    className="w-full py-6 rounded-2xl transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: "#20B2AA10",
                      color: "#20B2AA",
                    }}
                  >
                    <UserPlus className="w-5 h-5" />
                    Stranger Talk
                  </Button>
                </div>

                {/* Recent Chats */}
                <div>
                  <h3 className="text-sm mb-3" style={{ color: "#333333", opacity: 0.7 }}>
                    Recent Conversations
                  </h3>
                  <PeerChatList />
                </div>
              </div>

              {/* Section 2: Public Communities */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl" style={{ color: "#1C3B5E" }}>
                    Public Communities
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-2xl text-sm transition-all hover:opacity-80 flex items-center gap-2"
                      style={{ 
                        backgroundColor: "#20B2AA10",
                        color: "#20B2AA"
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Create New Group
                    </button>
                    <button
                      className="px-4 py-2 rounded-2xl text-sm transition-all hover:opacity-80"
                      style={{ 
                        backgroundColor: "#20B2AA",
                        color: "white"
                      }}
                    >
                      View More
                    </button>
                  </div>
                </div>

                {/* Community Group Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {communityGroups.map((group, index) => (
                    <div key={index}>
                      <CommunityGroupCard {...group} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Personal Helper */}
            <div className="col-span-5">
              <div className="sticky top-8">
                <AIHelperChat />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
