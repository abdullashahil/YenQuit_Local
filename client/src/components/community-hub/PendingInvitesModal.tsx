"use client"

import { useState } from "react"
import { X, Check, XCircle, Loader2, Users } from "lucide-react"
import axios from "axios"

interface PendingInvite {
    id: number
    community_id: number
    community_name: string
    community_description?: string
    community_avatar?: string
    inviter_id: string
    inviter_name?: string
    inviter_email: string
    created_at: string
    status: string
}

interface PendingInvitesModalProps {
    invites: PendingInvite[]
    onClose: () => void
    onInviteAction: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function PendingInvitesModal({
    invites,
    onClose,
    onInviteAction,
}: PendingInvitesModalProps) {
    const [processing, setProcessing] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAccept = async (inviteId: number) => {
        setProcessing(inviteId)
        setError(null)

        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                setError("Not authenticated")
                return
            }

            await axios.post(
                `${API_BASE_URL}/user-invites/${inviteId}/accept`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )

            onInviteAction()
        } catch (err) {
            console.error("Error accepting invite:", err)
            setError("Failed to accept invite")
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (inviteId: number) => {
        setProcessing(inviteId)
        setError(null)

        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                setError("Not authenticated")
                return
            }

            await axios.post(
                `${API_BASE_URL}/user-invites/${inviteId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )

            onInviteAction()
        } catch (err) {
            console.error("Error rejecting invite:", err)
            setError("Failed to reject invite")
        } finally {
            setProcessing(null)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#20B2AA]" />
                        <h2 className="text-xl font-semibold text-gray-900">Pending Invites</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-4 mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Invites List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {invites.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No pending invites</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-[#20B2AA] transition-colors"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        {/* Community Avatar */}
                                        {invite.community_avatar ? (
                                            <img
                                                src={invite.community_avatar}
                                                alt={invite.community_name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#20B2AA] to-[#189a92] rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {invite.community_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Invite Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {invite.community_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">
                                                Invited by {invite.inviter_name || invite.inviter_email}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDate(invite.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(invite.id)}
                                            disabled={processing === invite.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing === invite.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Accept
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(invite.id)}
                                            disabled={processing === invite.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing === invite.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
