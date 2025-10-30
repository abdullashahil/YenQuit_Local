"use client"

import { useState } from "react"
import { CommunityList } from "@/components/community-hub/community-list"
import { ChatArea } from "@/components/community-hub/chat-area"
import useIsMobile from "@/hooks/use-mobile"

export function CommunityHub() {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // On mobile, show either list or chat. On desktop, show both.
  const showList = !isMobile || !selectedCommunity
  const showChat = !isMobile || selectedCommunity

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Community List */}
      {showList && (
        <div className={`${isMobile ? "w-full" : "w-1/3"} border-r border-gray-200 flex flex-col`}>
          <CommunityList selectedCommunity={selectedCommunity} onSelectCommunity={setSelectedCommunity} />
        </div>
      )}

      {/* Chat Area */}
      {showChat && (
        <div className={`${isMobile ? "w-full" : "w-2/3"} flex flex-col`}>
          <ChatArea
            communityId={selectedCommunity}
            onBack={isMobile ? () => setSelectedCommunity(null) : undefined}
            onClose={!isMobile ? () => setSelectedCommunity(null) : undefined}
          />
        </div>
      )}
    </div>
  )
}
