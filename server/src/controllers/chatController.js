import ChatMessageModel from '../models/ChatMessageModel.js';
import CommunityModel from '../models/CommunityModel.js';

class ChatController {
  // Get messages for a community
  static async getMessages(req, res) {
    try {
      const { communityId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user?.userId || null;
      
      // Check if user is member
      const membership = await CommunityModel.isMember(communityId, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to view messages.'
        });
      }

      const messages = await ChatMessageModel.getMessages(
        communityId, 
        parseInt(page), 
        parseInt(limit)
      );
      
      res.json({
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  }

  // Get latest messages for a community
  static async getLatestMessages(req, res) {
    try {
      const { communityId } = req.params;
      const { limit = 50 } = req.query;
      const userId = req.user?.userId || null;
      
      // Check if user is member
      const membership = await CommunityModel.isMember(communityId, userId);
      
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to view messages.'
        });
      }

      const messages = await ChatMessageModel.getLatestMessages(
        communityId, 
        parseInt(limit)
      );
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  }

  // Send a message
  static async sendMessage(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { communityId } = req.params;
      const { content, message_type = 'text', file_url = null, reply_to = null } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message content is required'
        });
      }

      // Check if user is member
      const membership = await CommunityModel.isMember(communityId, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to send messages.'
        });
      }

      const messageData = {
        community_id: communityId,
        user_id: userId,
        content: content.trim(),
        message_type,
        file_url,
        reply_to
      };

      const message = await ChatMessageModel.create(messageData);
      
      // Get full message with user details
      const fullMessage = await ChatMessageModel.findById(message.id);
      
      res.status(201).json({
        success: true,
        data: fullMessage
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  }

  // Edit a message
  static async editMessage(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { messageId } = req.params;
      const { content } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message content is required'
        });
      }

      const message = await ChatMessageModel.editMessage(messageId, userId, content.trim());
      
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found or you do not have permission to edit it'
        });
      }

      // Get full message with user details
      const fullMessage = await ChatMessageModel.findById(messageId);
      
      res.json({
        success: true,
        data: fullMessage
      });
    } catch (error) {
      console.error('Error editing message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to edit message'
      });
    }
  }

  // Delete a message
  static async deleteMessage(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { messageId } = req.params;
      
      const message = await ChatMessageModel.deleteMessage(messageId, userId);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found or you do not have permission to delete it'
        });
      }
      
      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete message'
      });
    }
  }

  // Add reaction to message
  static async addReaction(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { messageId } = req.params;
      const { emoji } = req.body;
      
      if (!emoji) {
        return res.status(400).json({
          success: false,
          error: 'Emoji is required'
        });
      }

      // Check if message exists and user has access
      const message = await ChatMessageModel.findById(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      // Check if user is member of the community
      const membership = await CommunityModel.isMember(message.community_id, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to react to messages.'
        });
      }

      const reaction = await ChatMessageModel.addReaction(messageId, userId, emoji);
      
      res.status(201).json({
        success: true,
        data: reaction
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add reaction'
      });
    }
  }

  // Remove reaction from message
  static async removeReaction(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { messageId } = req.params;
      const { emoji } = req.body;
      
      if (!emoji) {
        return res.status(400).json({
          success: false,
          error: 'Emoji is required'
        });
      }

      const reaction = await ChatMessageModel.removeReaction(messageId, userId, emoji);
      
      if (!reaction) {
        return res.status(404).json({
          success: false,
          error: 'Reaction not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Reaction removed successfully'
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove reaction'
      });
    }
  }

  // Get reactions for a message
  static async getReactions(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user?.userId || null;
      
      // Check if message exists and user has access
      const message = await ChatMessageModel.findById(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      // Check if user is member of the community
      const membership = await CommunityModel.isMember(message.community_id, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to view reactions.'
        });
      }

      const reactions = await ChatMessageModel.getReactions(messageId);
      
      res.json({
        success: true,
        data: reactions
      });
    } catch (error) {
      console.error('Error fetching reactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reactions'
      });
    }
  }

  // Get online users for a community
  static async getOnlineUsers(req, res) {
    try {
      const { communityId } = req.params;
      const userId = req.user?.userId || null;
      
      // Check if user is member
      const membership = await CommunityModel.isMember(communityId, userId);
      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You must be a member to view online users.'
        });
      }

      const onlineUsers = await ChatMessageModel.getOnlineUsers(communityId);
      
      res.json({
        success: true,
        data: onlineUsers
      });
    } catch (error) {
      console.error('Error fetching online users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch online users'
      });
    }
  }
}

export default ChatController;
