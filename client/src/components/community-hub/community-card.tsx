"use client"

import React, { useState } from "react"
import { Users, MessageCircle, Lock, Crown, Shield, UserPlus } from "lucide-react"
import axios from "axios"

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
  created_at?: string
  updated_at?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  avatar?: string
}

interface CommunityCardProps {
  community: Community
  isSelected?: boolean
  onClick?: () => void
  onSelect?: () => void
  onJoin?: (communityId: string | number) => void
}

export function CommunityCard({ community, isSelected = false, onClick, onSelect, onJoin }: CommunityCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const handleClick = async () => {
    if (onClick) return onClick()

    // If user is not a member and onJoin is provided, show join prompt
    if (!community.user_role && onJoin) {
      onJoin(community.id)
      return
    }

    if (onSelect) return onSelect()
  }

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isJoining) return

    setIsJoining(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("No auth token found")
        return
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await axios.post(`${API_BASE}/communities/${community.id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data?.success) {
        // Refresh the page or update the community list to show the user as a member
        window.location.reload()
      }
    } catch (error) {
      console.error("Error joining community:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0"
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const avatarSrc = community.avatar_url || community.avatar || undefined
  const subtitle = community.description ?? community.lastMessage ?? ""
  const isMember = !!community.user_role

  return (
    <button
      onClick={handleClick}
      className={`w-full p-3 rounded-lg transition-colors text-left flex items-start gap-3 ${isSelected
          ? "bg-[#E0F7F6] border border-[#20B2AA]"
          : "hover:bg-gray-50 border border-transparent"
        }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={community.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {community.name?.charAt(0)?.toUpperCase() ?? "C"}
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
            {community.is_private && <Lock className="h-4 w-4 text-gray-400" />}
            {getRoleIcon(community.user_role)}
          </div>

          {/* right-side actions */}
          <div className="flex items-center space-x-2">
            {!isMember && (
              <button
                onClick={handleJoinClick}
                disabled={isJoining}
                className="flex-shrink-0 px-3 py-1 bg-[#20B2AA] text-white text-xs rounded-full hover:bg-[#189a92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <UserPlus className="h-3 w-3" />
                {isJoining ? "Joining..." : "Join"}
              </button>
            )}

            {typeof community.unreadCount === "number" && community.unreadCount > 0 ? (
              <div className="flex-shrink-0 w-6 h-6 bg-[#20B2AA] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {community.unreadCount > 99 ? "99+" : community.unreadCount}
              </div>
            ) : typeof community.lastMessageTime === "string" ? (
              <span className="text-xs text-gray-500">{community.lastMessageTime}</span>
            ) : null}
          </div>
        </div>

        {subtitle && (
          <p className="text-sm text-gray-600 truncate mt-1">{subtitle}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{formatNumber(community.member_count)}</span>
          </div>

          {community.online_count > 0 && (
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{formatNumber(community.online_count)} online</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{formatNumber(community.message_count)}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default CommunityCard
