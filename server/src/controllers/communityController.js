import CommunityModel from '../models/CommunityModel.js';
import ChatMessageModel from '../models/ChatMessageModel.js';

class CommunityController {
  // Get all communities
  static async getCommunities(req, res) {
    try {
      const userId = req.user?.userId || null;
      const communities = await CommunityModel.findAll(userId);

      res.json({
        success: true,
        data: communities
      });
    } catch (error) {
      console.error('Error fetching communities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch communities'
      });
    }
  }

  // Get community by ID
  static async getCommunity(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || null;

      const community = await CommunityModel.findById(id, userId);

      if (!community) {
        return res.status(404).json({
          success: false,
          error: 'Community not found'
        });
      }

      // Check if private and user is not a member
      if (community.is_private && !community.user_role) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. This is a private community.'
        });
      }

      res.json({
        success: true,
        data: community
      });
    } catch (error) {
      console.error('Error fetching community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch community'
      });
    }
  }

  // Create new community
  static async createCommunity(req, res) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Note: Any authenticated user can now create communities
      // The creator will automatically become the admin of their community

      const { name, description, avatar_url, is_private } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Community name is required'
        });
      }

      const communityData = {
        name: name.trim(),
        description: description?.trim() || null,
        avatar_url: avatar_url || null,
        created_by: userId,
        is_private: is_private || false,
        created_by_admin: userRole === 'admin' || userRole === 'super_admin'
      };

      const community = await CommunityModel.create(communityData);

      // Auto-add creator as admin
      await CommunityModel.joinCommunity(community.id, userId, 'admin');

      res.status(201).json({
        success: true,
        data: community
      });
    } catch (error) {
      console.error('Error creating community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create community'
      });
    }
  }

  // Join community
  static async joinCommunity(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { id } = req.params;

      // Check if community exists
      const community = await CommunityModel.findById(id);
      if (!community) {
        return res.status(404).json({
          success: false,
          error: 'Community not found'
        });
      }

      // Check if private
      if (community.is_private) {
        return res.status(403).json({
          success: false,
          error: 'Cannot join private community'
        });
      }

      const membership = await CommunityModel.joinCommunity(id, userId);

      res.json({
        success: true,
        data: membership,
        message: 'Successfully joined community'
      });
    } catch (error) {
      console.error('Error joining community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to join community'
      });
    }
  }

  // Leave community
  static async leaveCommunity(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { id } = req.params;

      const membership = await CommunityModel.leaveCommunity(id, userId);

      if (!membership) {
        return res.status(404).json({
          success: false,
          error: 'You are not a member of this community'
        });
      }

      res.json({
        success: true,
        message: 'Successfully left community'
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to leave community'
      });
    }
  }

  // Get community members
  static async getCommunityMembers(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || null;

      // Check if user is member
      const membership = await CommunityModel.isMember(id, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to view members.'
        });
      }

      const members = await CommunityModel.getMembers(id);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error fetching community members:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch community members'
      });
    }
  }

  // Update community
  static async updateCommunity(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { id } = req.params;
      const { name, description, avatar_url } = req.body;

      // Check if user is admin
      const membership = await CommunityModel.isMember(id, userId);
      if (!membership || membership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Only admins can update communities.'
        });
      }

      const updateData = {
        name: name?.trim() || undefined,
        description: description?.trim() || undefined,
        avatar_url: avatar_url || undefined
      };

      const community = await CommunityModel.update(id, updateData);

      res.json({
        success: true,
        data: community
      });
    } catch (error) {
      console.error('Error updating community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update community'
      });
    }
  }

  // Delete community
  static async deleteCommunity(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { id } = req.params;

      // Check if user is admin
      const membership = await CommunityModel.isMember(id, userId);
      if (!membership || membership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Only admins can delete communities.'
        });
      }

      const community = await CommunityModel.delete(id);

      res.json({
        success: true,
        message: 'Community deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting community:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete community'
      });
    }
  }

  // Mark messages as read (reset unread count)
  static async markMessagesAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      await CommunityModel.resetUnreadCount(id, userId);

      res.json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark messages as read'
      });
    }
  }
}

export default CommunityController;
