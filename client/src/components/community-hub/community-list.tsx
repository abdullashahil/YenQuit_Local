"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Search, ChevronDown, Sparkles } from "lucide-react"
import axios from "axios"
import CommunityCard from "./community-card" // default export from your CommunityCard file
import { useNotifications } from "@/contexts/NotificationContext"

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
  last_message?: string
  last_message_time?: string
  unread_count?: number
  avatar?: string
}

interface Props {
  selectedCommunity: string | null
  onSelectCommunity: (id: string, community?: Community) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function CommunityList({ selectedCommunity, onSelectCommunity }: Props) {
  const [communitiesRaw, setCommunitiesRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPublic, setShowPublic] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { unreadCounts, markAsRead } = useNotifications()

  // Fetch communities from backend
  const fetchCommunities = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No authentication token found")
      }
      const res = await axios.get(`${API_BASE_URL}/communities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCommunitiesRaw(res.data.data)
      } else if (Array.isArray(res.data)) {
        // fallback in case API returns raw array
        setCommunitiesRaw(res.data)
      } else {
        setCommunitiesRaw([])
      }
    } catch (err) {
      console.error("Error fetching communities:", err)
      setError("Failed to load communities")
      setCommunitiesRaw([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Map server community shape to UICommunity used by CommunityCard
  const uiCommunities: Community[] = useMemo(() => {
    return communitiesRaw.map((c: any) => {
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        avatar_url: c.avatar_url,
        member_count: c.member_count ?? 0,
        online_count: c.online_count ?? 0,
        message_count: c.message_count ?? 0,
        user_role: c.user_role,
        is_private: c.is_private ?? false,
        created_at: c.created_at,
        updated_at: c.updated_at,
        last_message: c.last_message,
        last_message_time: c.last_message_time,
        unread_count: c.unread_count,
        avatar: c.avatar_url ?? c.avatar
      } as Community
    })
  }, [communitiesRaw])

  // derive recent conversations (top 3 by updated_at)
  const recentConversations = useMemo(() => {
    return [...uiCommunities]
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.last_message_time || a.created_at || 0).getTime()
        const dateB = new Date(b.updated_at || b.last_message_time || b.created_at || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 3)
  }, [uiCommunities])

  // public communities filtered by search
  const publicCommunities = useMemo(() => {
    return uiCommunities.filter((c) => !c.is_private && matchesSearch(c, searchQuery))
  }, [uiCommunities, searchQuery])

  // filtered list for the main list (search)
  const filteredMainList = useMemo(() => {
    return uiCommunities.filter((c) => matchesSearch(c, searchQuery))
  }, [uiCommunities, searchQuery])

  function matchesSearch(c: Community, q: string) {
    if (!q) return true
    const s = q.toLowerCase()
    return (
      c.name.toLowerCase().includes(s) ||
      (c.last_message && c.last_message.toLowerCase().includes(s)) ||
      (c.description && String(c.description).toLowerCase().includes(s))
    )
  }

  function tryFormatTime(value: string) {
    // Try to parse ISO date or unix timestamp; fallback to original string
    try {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
        // show relative short (e.g., "2h") when within 24h, else locale date
        const now = Date.now()
        const diff = now - d.getTime()
        const oneHour = 1000 * 60 * 60
        const oneDay = oneHour * 24
        if (diff < oneHour) {
          const mins = Math.max(1, Math.floor(diff / (1000 * 60)))
          return `${mins}m`
        } else if (diff < oneDay) {
          const hrs = Math.max(1, Math.floor(diff / oneHour))
          return `${hrs}h`
        } else {
          return d.toLocaleDateString()
        }
      }
      return value
    } catch {
      return value
    }
  }

  // handle select -> send id back to parent
  const handleSelect = (id: string, community?: Community) => {
    // Check if user is a member before allowing selection
    if (community && !community.user_role && id !== "yenai-chat") {
      // Don't allow non-members to open chat, show join prompt instead
      return
    }
    
    // Mark messages as read when selecting a community
    if (id !== "yenai-chat") {
      markAsRead(id)
    }
    
    onSelectCommunity(id, community)
  }

  // handle join community
  const handleJoinCommunity = async (communityId: number) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("No auth token found")
        return
      }
      
      const response = await axios.post(`${API_BASE_URL}/communities/${communityId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (response.data?.success) {
        // Refresh communities list to show updated membership
        fetchCommunities()
      }
    } catch (error) {
      console.error("Error joining community:", error)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1C3B5E]">Communities</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B8F]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* YenAI */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <button
            onClick={() => handleSelect("yenai-chat")}
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

        {/* Recent Conversations */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1C3B5E] mb-4">Recent Conversations</h2>
          <div className="space-y-2">
            {recentConversations.length === 0 ? (
              <div className="text-sm text-gray-500">No recent conversations</div>
            ) : (
              recentConversations.map((c) => (
                <CommunityCard
                  key={c.id}
                  community={{
                    id: c.id,
                    name: c.name,
                    description: c.description,
                    avatar_url: c.avatar_url,
                    member_count: c.member_count,
                    online_count: c.online_count,
                    message_count: c.message_count,
                    user_role: c.user_role,
                    is_private: c.is_private,
                    created_at: c.created_at,
                    updated_at: c.updated_at,
                    lastMessage: c.last_message,
                    lastMessageTime: tryFormatTime(c.last_message_time || c.updated_at || c.created_at),
                    unreadCount: unreadCounts[c.id] || c.unread_count || 0,
                    avatar: c.avatar_url ?? c.avatar
                  }}
                  isSelected={selectedCommunity === c.id}
                  onSelect={() => handleSelect(c.id, c)}
                  onJoin={handleJoinCommunity}
                />
              ))
            )}
          </div>
        </div>

        {/* Public Communities */}
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1C3B5E]">Public Communities</h2>
            <button
              onClick={() => setShowPublic((s) => !s)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle public communities"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${showPublic ? "" : "-rotate-90"}`}
              />
            </button>
          </div>

          {showPublic && (
            <>
              {/* Search inside public list is already shared */}
              <div className="space-y-2">
                {publicCommunities.length === 0 ? (
                  <div className="text-sm text-gray-500">No public communities found</div>
                ) : (
                  publicCommunities.map((c) => (
                    <CommunityCard
                      key={c.id}
                      community={{
                        id: c.id,
                        name: c.name,
                        description: c.description,
                        avatar_url: c.avatar_url,
                        member_count: c.member_count,
                        online_count: c.online_count,
                        message_count: c.message_count,
                        user_role: c.user_role,
                        is_private: c.is_private,
                        created_at: c.created_at,
                        updated_at: c.updated_at,
                        lastMessage: c.last_message,
                        lastMessageTime: tryFormatTime(c.last_message_time || c.updated_at || c.created_at),
                        unreadCount: unreadCounts[c.id] || c.unread_count || 0,
                        avatar: c.avatar_url ?? c.avatar
                      }}
                      isSelected={selectedCommunity === c.id}
                      onSelect={() => handleSelect(c.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* All communities (search results) */}
        <div className="p-2">
          <h3 className="text-sm text-gray-500 mb-2">All Communities</h3>

          {filteredMainList.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No communities found matching your search" : "No communities available"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMainList.map((c) => (
                <CommunityCard
                  key={c.id}
                  community={{
                    id: c.id,
                    name: c.name,
                    description: c.description,
                    avatar_url: c.avatar_url,
                    member_count: c.member_count,
                    online_count: c.online_count,
                    message_count: c.message_count,
                    user_role: c.user_role,
                    is_private: c.is_private,
                    created_at: c.created_at,
                    updated_at: c.updated_at,
                    lastMessage: c.last_message,
                    lastMessageTime: tryFormatTime(c.last_message_time || c.updated_at || c.created_at),
                    unreadCount: unreadCounts[c.id] || c.unread_count || 0,
                    avatar: c.avatar_url ?? c.avatar
                  }}
                  isSelected={selectedCommunity === c.id}
                  onSelect={() => handleSelect(c.id, c)}
                  onJoin={handleJoinCommunity}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchCommunities()
          }}
        />
      )}
    </div>
  )
}

/* -----------------------
   CreateCommunityModal
   ----------------------- */

function CreateCommunityModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No authentication token found. Please log in again.")
      }
      
      console.log("Creating community with token:", token.substring(0, 20) + "...")
      
      // Use fetch to completely bypass any axios interceptors
      const res = await fetch(`${API_BASE_URL}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          is_private: !!isPrivate,
        })
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }
      
      const data = await res.json()

      if (data?.success) {
        onSuccess()
      } else {
        // accept other shapes too
        onSuccess()
      }
    } catch (err: any) {
      console.error("Error creating community:", err)
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError("Authentication failed. Please log in again.")
        // Clear invalid token
        localStorage.removeItem("accessToken")
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Failed to create community")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Create Community</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Community Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Private Community</span>
            </label>
          </div>

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
