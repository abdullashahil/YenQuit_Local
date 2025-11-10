"use client"

import { useState } from "react"
import { Search, ChevronDown, Sparkles } from "lucide-react"
import { CommunityCard } from "./community-card"

interface Community {
  id: string
  name: string
  lastMessage: string
  lastMessageTime: string
  memberCount: number
  unreadCount?: number
  avatar: string
  isPublic?: boolean
}

const recentConversations: Community[] = [
  {
    id: "wequit-team",
    name: "WeQuit Team",
    lastMessage: "S sarah: The new anti-tobacco campaign is great!",
    lastMessageTime: "2m",
    memberCount: 12,
    unreadCount: 3,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "marketing-squad",
    name: "NoDrug Squad",
    lastMessage: "A lex: Let's schedule the campaign review",
    lastMessageTime: "1h",
    memberCount: 8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "dev-team",
    name: "Support Team",
    lastMessage: "Mike: Code review is complete",
    lastMessageTime: "3h",
    memberCount: 15,
    unreadCount: 1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
]

const publicCommunities: Community[] = [
  {
    id: "community-a",
    name: "Community A",
    lastMessage: "S sarah: The new mockups look great!",
    lastMessageTime: "2m",
    memberCount: 12,
    unreadCount: 3,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    isPublic: true,
  },
  {
    id: "quit-squad",
    name: "Quit Squad",
    lastMessage: "A lex: Let's schedule the campaign review",
    lastMessageTime: "1h",
    memberCount: 8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    isPublic: true,
  },
  {
    id: "journey-new-human",
    name: "Journey to new human",
    lastMessage: "Mike: Code review is complete",
    lastMessageTime: "3h",
    memberCount: 15,
    unreadCount: 1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    isPublic: true,
  },
]

interface CommunityListProps {
  selectedCommunity: string | null
  onSelectCommunity: (id: string) => void
}

export function CommunityList({ selectedCommunity, onSelectCommunity }: CommunityListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPublic, setShowPublic] = useState(true)

  const filteredPublic = publicCommunities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font- text-[#1C3B5E] mb-1">Communities</h1>
        <p className="text-sm text-gray-600">Discover new communities and find where you belong.</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Chat with YenAI Button */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <button
            onClick={() => onSelectCommunity("yenai-chat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              selectedCommunity === "yenai-chat"
                ? "bg-gradient-to-r from-[#B2E8D8] to-white border border-[#B2E8D8]"
                : "bg-gradient-to-r from-[#D4F5ED] to-white border border-[#D4F5ED] hover:from-[#B2E8D8] hover:to-white"
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#2D9B8F] flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-[#2D9B8F]">Chat with YenAI</p>
              <p className="text-xs text-[#2D9B8F]/70">Get instant assistance</p>
            </div>
          </button>
        </div>

        {/* Recent Conversations Section */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1C3B5E] mb-4">Recent Conversations</h2>
          <div className="space-y-2">
            {recentConversations.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                isSelected={selectedCommunity === community.id}
                onSelect={() => onSelectCommunity(community.id)}
              />
            ))}
          </div>
        </div>

        {/* Public Communities Section */}
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1C3B5E]">Public Communities</h2>
            <button
              onClick={() => setShowPublic(!showPublic)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle public communities"
            >
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showPublic ? "" : "-rotate-90"}`} />
            </button>
          </div>

          {showPublic && (
            <>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B8F]"
                />
              </div>

              {/* Communities List */}
              <div className="space-y-2">
                {filteredPublic.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    isSelected={selectedCommunity === community.id}
                    onSelect={() => onSelectCommunity(community.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
