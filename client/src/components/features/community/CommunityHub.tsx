"use client"

import { useState } from "react"
import CommunityList from "@/components/community-hub/community-list"
import ChatArea from "@/components/community-hub/chat-area"
import useIsMobile from "@/hooks/use-mobile"
import { useNotifications } from "@/contexts/NotificationContext"

interface Community {
  id: string
  name: string
  description?: string
  member_count: number
  online_count: number
  user_role?: string
}

export function CommunityHub() {
  const { setActiveCommunityId } = useNotifications()
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const isMobile = useIsMobile()

  // On mobile, show either list or chat. On desktop, show both.
  const showList = !isMobile || !selectedCommunityId
  const showChat = !isMobile || selectedCommunityId
  const canShowChatArea = showChat && selectedCommunity && (selectedCommunity.id === "yenai-chat" || selectedCommunity.user_role)

  const handleSelectCommunity = (communityId: string | number, community?: Community) => {


    // Check if user is a member (except for YenAI)
    if (String(communityId) !== "yenai-chat" && community && !community.user_role) {

      // Don't allow non-members to open chat
      return
    }


    setSelectedCommunityId(String(communityId))

    // Set active community in notification context
    const idNum = typeof communityId === 'string' ? parseInt(communityId, 10) : communityId
    if (!isNaN(idNum)) {
      setActiveCommunityId(idNum)
    } else {
      setActiveCommunityId(null)
    }

    // Handle YenAI special case
    if (String(communityId) === "yenai-chat") {
      setSelectedCommunity({
        id: "yenai-chat",
        name: "Chat with YenAI",
        description: "Get instant assistance",
        member_count: 1,
        online_count: 1,
        user_role: "user"
      })
    } else if (community) {
      setSelectedCommunity(community)
    }
  }

  const handleCloseChatArea = () => {
    setSelectedCommunityId(null)
    setSelectedCommunity(null)
    setActiveCommunityId(null)
    // Trigger a refresh of the community list to reflect any changes
    window.location.reload()
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Community List */}
      {showList && (
        <div className={`${isMobile ? "w-full" : "w-1/3"} border-r border-gray-200 flex flex-col`}>
          <CommunityList selectedCommunity={selectedCommunityId} onSelectCommunity={handleSelectCommunity} />
        </div>
      )}

      {/* Chat Area */}
      {showChat && (
        <div className={`${isMobile ? "w-full" : "w-2/3"} flex flex-col`}>
          <ChatArea
            community={selectedCommunity}
            onBack={isMobile ? () => {
              setSelectedCommunityId(null)
              setActiveCommunityId(null)
            } : undefined}
            onClose={handleCloseChatArea}
          />
        </div>
      )}
    </div>
  )
}
