import UserInviteModel from '../models/UserInviteModel.js';
import CommunityModel from '../models/CommunityModel.js';

class UserInviteController {
    // Send invites to users
    static async sendInvites(req, res) {
        try {
            const { id: communityId } = req.params;
            const { invitee_ids } = req.body;
            const inviterId = req.user.userId;

            console.log('=== SEND INVITES DEBUG ===');
            console.log('Community ID:', communityId);
            console.log('Inviter ID:', inviterId);
            console.log('Invitee IDs:', invitee_ids);

            if (!Array.isArray(invitee_ids) || invitee_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'invitee_ids must be a non-empty array'
                });
            }

            // Check if inviter is a member of the community
            console.log('Checking membership...');
            const membership = await CommunityModel.isMember(communityId, inviterId);
            console.log('Membership result:', membership);

            if (!membership) {
                console.log('ERROR: User is not a member!');
                return res.status(403).json({
                    success: false,
                    error: 'You must be a member to invite others'
                });
            }

            // Create invites for each user
            const invites = [];
            for (const inviteeId of invitee_ids) {
                try {
                    console.log(`Creating invite for user ${inviteeId}...`);
                    const invite = await UserInviteModel.create(communityId, inviterId, inviteeId);
                    console.log('Invite created:', invite);
                    invites.push(invite);
                } catch (error) {
                    console.error(`Error creating invite for user ${inviteeId}:`, error);
                }
            }

            console.log(`Total invites created: ${invites.length}`);
            console.log('=== END DEBUG ===');

            res.json({
                success: true,
                data: invites,
                message: `${invites.length} invite(s) sent successfully`
            });
        } catch (error) {
            console.error('Error sending invites:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send invites'
            });
        }
    }

    // Get pending invites for current user
    static async getPendingInvites(req, res) {
        try {
            const userId = req.user.userId;
            const invites = await UserInviteModel.getPendingInvites(userId);

            res.json({
                success: true,
                data: invites
            });
        } catch (error) {
            console.error('Error fetching pending invites:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch pending invites'
            });
        }
    }

    // Accept invite
    static async acceptInvite(req, res) {
        try {
            const { id: inviteId } = req.params;
            const userId = req.user.userId;

            const invite = await UserInviteModel.acceptInvite(inviteId, userId);

            if (!invite) {
                return res.status(404).json({
                    success: false,
                    error: 'Invite not found or already responded to'
                });
            }

            // Add user to community
            await CommunityModel.joinCommunity(invite.community_id, userId, 'member');

            res.json({
                success: true,
                data: invite,
                message: 'Invite accepted successfully'
            });
        } catch (error) {
            console.error('Error accepting invite:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to accept invite'
            });
        }
    }

    // Reject invite
    static async rejectInvite(req, res) {
        try {
            const { id: inviteId } = req.params;
            const userId = req.user.userId;

            const invite = await UserInviteModel.rejectInvite(inviteId, userId);

            if (!invite) {
                return res.status(404).json({
                    success: false,
                    error: 'Invite not found or already responded to'
                });
            }

            res.json({
                success: true,
                data: invite,
                message: 'Invite rejected'
            });
        } catch (error) {
            console.error('Error rejecting invite:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to reject invite'
            });
        }
    }

    // Cancel invite (by inviter)
    static async cancelInvite(req, res) {
        try {
            const { id: inviteId } = req.params;
            const inviterId = req.user.userId;

            const invite = await UserInviteModel.cancelInvite(inviteId, inviterId);

            if (!invite) {
                return res.status(404).json({
                    success: false,
                    error: 'Invite not found or already responded to'
                });
            }

            res.json({
                success: true,
                data: invite,
                message: 'Invite cancelled'
            });
        } catch (error) {
            console.error('Error cancelling invite:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to cancel invite'
            });
        }
    }

    // Get community invites
    static async getCommunityInvites(req, res) {
        try {
            const { id: communityId } = req.params;
            const userId = req.user.userId;

            // Check if user is a member
            const membership = await CommunityModel.isMember(communityId, userId);
            if (!membership) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }

            const invites = await UserInviteModel.getCommunityInvites(communityId);

            res.json({
                success: true,
                data: invites
            });
        } catch (error) {
            console.error('Error fetching community invites:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch community invites'
            });
        }
    }
}

export default UserInviteController;
