"use client"

import { useState, useEffect } from "react"
import { X, Search, Loader2 } from "lucide-react"
import axios from "axios"

interface User {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
}

interface InviteUsersModalProps {
    communityId: string
    communityName: string
    onClose: () => void
    onComplete: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function InviteUsersModal({
    communityId,
    communityName,
    onClose,
    onComplete,
}: InviteUsersModalProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Load all users on mount and when search changes
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true)
            setError(null)

            try {
                const token = localStorage.getItem("accessToken")
                if (!token) {
                    setError("Not authenticated")
                    return
                }

                const response = await axios.get(`${API_BASE_URL}/users/search`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: searchQuery.trim() ? { search: searchQuery, limit: 20 } : { limit: 20 },
                })

                if (response.data?.success && Array.isArray(response.data.data)) {
                    setUsers(response.data.data)
                } else if (Array.isArray(response.data)) {
                    setUsers(response.data)
                } else {
                    setUsers([])
                }
            } catch (err) {
                console.error("Error loading users:", err)
                setError("Failed to load users")
                setUsers([])
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(loadUsers, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleInviteUser = async (userId: string) => {
        setSending(userId)
        setError(null)

        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                setError("Not authenticated")
                return
            }

            await axios.post(
                `${API_BASE_URL}/user-invites/communities/${communityId}`,
                { invitee_ids: [userId] },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            // Add to invited users
            setInvitedUsers(prev => new Set(Array.from(prev).concat(userId)))
        } catch (err) {
            console.error("Error sending invite:", err)
            setError("Failed to send invite")
        } finally {
            setSending(null)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Invite Users</h2>
                        <p className="text-sm text-gray-500">to {communityName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#20B2AA]" />
                        </div>
                    )}

                    {!loading && users.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No users found</p>
                        </div>
                    )}

                    {!loading && users.length > 0 && (
                        <div className="space-y-2">
                            {users.map((user) => {
                                const isInvited = invitedUsers.has(user.id)
                                const isSending = sending === user.id

                                return (
                                    <div
                                        key={user.id}
                                        className="w-full p-3 rounded-lg border border-gray-200 flex items-center gap-3"
                                    >
                                        {/* Avatar */}
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.full_name || user.email}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {user.full_name || "User"}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        {/* Invite Button */}
                                        <button
                                            onClick={() => handleInviteUser(user.id)}
                                            disabled={isInvited || isSending}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isInvited
                                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                                : isSending
                                                    ? "bg-gray-100 text-gray-400 cursor-wait"
                                                    : "bg-[#20B2AA] text-white hover:bg-[#189a92]"
                                                }`}
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : isInvited ? (
                                                "Invited"
                                            ) : (
                                                "Invite"
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex items-center justify-end gap-3">
                    <button
                        onClick={onComplete}
                        className="px-6 py-2 bg-[#20B2AA] text-white rounded-lg hover:bg-[#189a92] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
