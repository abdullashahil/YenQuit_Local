"use client"

interface Community {
  id: string
  name: string
  lastMessage: string
  lastMessageTime: string
  memberCount: number
  unreadCount?: number
  avatar: string
}

interface CommunityCardProps {
  community: Community
  isSelected: boolean
  onSelect: () => void
}

export function CommunityCard({ community, isSelected, onSelect }: CommunityCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg transition-colors text-left ${
        isSelected ? "bg-[#E0F7F6] border border-[#20B2AA]" : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img
          src={community.avatar || "/placeholder.svg"}
          alt={community.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
            <span className="text-xs text-gray-500 flex-shrink-0">{community.lastMessageTime}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{community.lastMessage}</p>
          <p className="text-xs text-gray-500 mt-1">{community.memberCount} members</p>
        </div>

        {/* Unread Badge */}
        {community.unreadCount && (
          <div className="flex-shrink-0 w-6 h-6 bg-[#20B2AA] text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {community.unreadCount}
          </div>
        )}
      </div>
    </button>
  )
}
