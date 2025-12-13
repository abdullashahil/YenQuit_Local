"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Users, MessageCircle, Eye } from "lucide-react"
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
  last_message?: string
  last_message_time?: string
  unread_count?: number
  avatar?: string
  created_by?: string
}

interface Props {
  onEditCommunity?: (community: Community) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function AdminCommunityManagement({ onEditCommunity }: Props) {
  const [communitiesRaw, setCommunitiesRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
        setCommunitiesRaw(res.data)
      } else {
        setCommunitiesRaw([])
      }
    } catch (err: any) {
      setError("Failed to load communities")
      setCommunitiesRaw([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  // Delete community
  const handleDeleteCommunity = async (communityId: string) => {
    if (!confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const res = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      setSuccessMessage("Community deleted successfully")
      fetchCommunities()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to delete community")
      setTimeout(() => setError(null), 3000)
    }
  }

  // Map server community shape to UICommunity
  const uiCommunities: Community[] = useMemo(() => {
    return communitiesRaw.map((c: any) => ({
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
      avatar: c.avatar_url ?? c.avatar,
      created_by: c.created_by
    } as Community))
  }, [communitiesRaw])

  // Filter communities by search
  const filteredCommunities = useMemo(() => {
    return uiCommunities.filter((c) => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return (
        c.name.toLowerCase().includes(s) ||
        (c.description && String(c.description).toLowerCase().includes(s))
      )
    })
  }, [uiCommunities, searchQuery])

  function tryFormatTime(value: string) {
    try {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
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

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Management</h1>
          <p className="text-gray-600">Manage all communities in the system</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Community
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Communities List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredCommunities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? "No communities found matching your search." : "No communities found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Community
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommunities.map((community) => (
                  <tr key={community.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{community.name}</div>
                          {community.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {community.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {community.member_count}
                        {community.online_count > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            {community.online_count} online
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                        {community.message_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        community.is_private 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {community.is_private ? 'Private' : 'Public'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {community.last_message_time 
                        ? tryFormatTime(community.last_message_time)
                        : 'No activity'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditCommunity?.(community)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit community"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCommunity(community.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete community"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchCommunities()
            setSuccessMessage("Community created successfully")
            setTimeout(() => setSuccessMessage(null), 3000)
          }}
        />
      )}
    </div>
  )
}

// Create Community Modal Component
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
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/communities`, {
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
      
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to create community")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Create Community</h3>
        
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Community Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter community name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter community description"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
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
