"use client"

import { useState } from "react"
import EnhancedCommunityList from "../components/community-hub/enhanced-community-list"
import EnhancedChatArea from "../components/community-hub/enhanced-chat-area"

interface Community {
  id: string
  name: string
  description?: string
  avatar_url?: string
  member_count: number
  online_count: number
  message_count: number
  user_role?: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export default function CommunityHub() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)

  const handleCommunitySelect = (community: Community) => {
    setSelectedCommunity(community)
  }

  const handleBackToList = () => {
    setSelectedCommunity(null)
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Community List Sidebar */}
      <div className={`${selectedCommunity ? 'hidden md:block' : 'block'} md:w-80 bg-white border-r`}>
        <EnhancedCommunityList onSelectCommunity={handleCommunitySelect} />
      </div>

      {/* Chat Area */}
      <div className={`${selectedCommunity ? 'block' : 'hidden md:block'} flex-1`}>
        <EnhancedChatArea
          community={selectedCommunity}
          onBack={selectedCommunity ? handleBackToList : undefined}
        />
      </div>

      {/* Mobile: Show chat area when community is selected */}
      {selectedCommunity && (
        <div className="md:hidden block flex-1">
          <EnhancedChatArea
            community={selectedCommunity}
            onBack={handleBackToList}
          />
        </div>
      )}
    </div>
  )
}
