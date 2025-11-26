import ContentModel from '../models/Content.js';

// GET /api/content/public
export const getPublicContent = async (req, res) => {
  try {
    const { type, page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));

    if (type) {
      const result = await ContentModel.findPublic({ page: pageNum, limit: limitNum, type });
      return res.status(200).json({ success: true, message: 'Public content retrieved', data: result.data, pagination: result.pagination });
    }

    const grouped = await ContentModel.findPublicGrouped({ page: pageNum, limit: limitNum });
    return res.status(200).json({ success: true, message: 'Public content retrieved', data: grouped });
  } catch (error) {
    console.error('Error in getPublicContent:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch public content' });
  }
};

// GET /api/content/public/:id
export const getPublicContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentModel.findPublicById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    return res.status(200).json({ success: true, message: 'Content retrieved', data: item });
  } catch (error) {
    console.error('Error in getPublicContentById:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch content' });
  }
};
