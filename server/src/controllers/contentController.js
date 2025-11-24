import ContentModel from '../models/Content.js';
import { getFileUrl, deleteFile } from '../middleware/upload.js';

class ContentController {
  // Create new content
  static async createContent(req, res) {
    try {
      const {
        title,
        category,
        description,
        content,
        status = 'Draft',
        publish_date,
        end_date,
        media_url,
        tags
      } = req.body;

      // Validation
      if (!title || !category || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title, category, and content are required fields'
        });
      }

      // Parse tags if it's a string
      let parsedTags = tags;
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Handle media URL (from file upload or external URL)
      let finalMediaUrl = media_url;
      if (req.file) {
        finalMediaUrl = getFileUrl(req.file.filename);
      }

      const contentData = {
        title: title.trim(),
        category,
        description: description?.trim() || null,
        content: content.trim(),
        status,
        publish_date: publish_date || null,
        end_date: end_date || null,
        media_url: finalMediaUrl || null,
        tags: parsedTags || null
      };

      const newContent = await ContentModel.create(contentData);

      res.status(201).json({
        success: true,
        message: 'Content created successfully',
        data: newContent
      });
    } catch (error) {
      console.error('Error creating content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all content with pagination and filtering
  static async getAllContent(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        status
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search?.trim(),
        category,
        status
      };

      const result = await ContentModel.findAll(options);

      res.status(200).json({
        success: true,
        message: 'Content retrieved successfully',
        ...result
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get single content by ID
  static async getContentById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Content ID is required'
        });
      }

      const content = await ContentModel.findById(id);

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content retrieved successfully',
        data: content
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update content by ID
  static async updateContent(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        category,
        description,
        content,
        status,
        publish_date,
        end_date,
        media_url,
        tags
      } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Content ID is required'
        });
      }

      // Check if content exists
      const existingContent = await ContentModel.findById(id);
      if (!existingContent) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Parse tags if it's a string
      let parsedTags = tags;
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Handle media URL (from file upload or external URL)
      let finalMediaUrl = media_url;
      if (req.file) {
        // Delete old file if exists
        if (existingContent.media_url) {
          const oldFilename = existingContent.media_url.split('/').pop();
          deleteFile(oldFilename);
        }
        finalMediaUrl = getFileUrl(req.file.filename);
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (content !== undefined) updateData.content = content.trim();
      if (status !== undefined) updateData.status = status;
      if (publish_date !== undefined) updateData.publish_date = publish_date || null;
      if (end_date !== undefined) updateData.end_date = end_date || null;
      if (finalMediaUrl !== undefined) updateData.media_url = finalMediaUrl || null;
      if (parsedTags !== undefined) updateData.tags = parsedTags || null;

      const updatedContent = await ContentModel.update(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        data: updatedContent
      });
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete content by ID
  static async deleteContent(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Content ID is required'
        });
      }

      // Check if content exists
      const existingContent = await ContentModel.findById(id);
      if (!existingContent) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Delete associated file if exists
      if (existingContent.media_url) {
        const filename = existingContent.media_url.split('/').pop();
        deleteFile(filename);
      }

      const deletedContent = await ContentModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully',
        data: deletedContent
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get content statistics
  static async getContentStats(req, res) {
    try {
      const stats = await ContentModel.getStats();

      res.status(200).json({
        success: true,
        message: 'Stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default ContentController;
