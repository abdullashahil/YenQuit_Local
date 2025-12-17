import { query } from '../db/index.js';

// Get user's last 3 visited content items
export const getUserLearningProgress = async (req, res) => {
  try {
    console.log('GET Controller - req.user:', req.user);
    console.log('GET Controller - req.user.userId:', req.user?.userId);

    if (!req.user || !req.user.userId) {
      console.log('GET Controller - No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId; // Changed from req.user.id to req.user.userId
    console.log('GET Controller - userId:', userId);

    // Get user's learning progress
    const progressResult = await query(
      'SELECT content_ids FROM user_learning_progress WHERE user_id = $1',
      [userId]
    );

    if (progressResult.rows.length === 0 || !progressResult.rows[0].content_ids) {
      return res.json({ items: [] });
    }

    console.log('GET Controller - contentIds from DB:', progressResult.rows[0].content_ids);
    console.log('GET Controller - contentIds type:', typeof progressResult.rows[0].content_ids);

    const contentIds = progressResult.rows[0].content_ids;
    if (!Array.isArray(contentIds) || contentIds.length === 0) {
      console.log('GET Controller - No content IDs found, returning empty array');
      return res.json({ items: [] });
    }

    // Get last 3 content IDs (most recent)
    // Filter out any non-integer IDs (legacy UUIDs) to avoid SQL errors
    const lastThreeIds = contentIds
      .slice(-3)
      .reverse()
      .filter(id => {
        const num = Number(id);
        return Number.isInteger(num) && num > 0;
      });

    console.log('GET Controller - lastThreeIds (filtered):', lastThreeIds);

    if (lastThreeIds.length === 0) {
      return res.json({ items: [] });
    }

    // Fetch content details from contents table
    const contentResult = await query(
      `SELECT 
        id, 
        title, 
        content, 
        category, 
        media_url, 
        media_url as thumbnail_url, 
        NULL as author, 
        NULL as duration
       FROM contents 
       WHERE id = ANY($1::integer[]) 
       ORDER BY array_position($1::integer[], id)`,
      [lastThreeIds]
    );

    res.json({ items: contentResult.rows });
  } catch (error) {
    console.error('Error fetching user learning progress:', error);
    res.status(500).json({ message: 'Failed to fetch learning progress' });
  }
};

// Get user's learning progress count for milestone tracking
export const getLearningProgressCount = async (req, res) => {
  try {
    console.log('GET Count Controller - req.user:', req.user);
    console.log('GET Count Controller - req.user.userId:', req.user?.userId);

    if (!req.user || !req.user.userId) {
      console.log('GET Count Controller - No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId;
    console.log('GET Count Controller - userId:', userId);

    // Get user's learning progress
    const progressResult = await query(
      'SELECT content_ids FROM user_learning_progress WHERE user_id = $1',
      [userId]
    );

    if (progressResult.rows.length === 0 || !progressResult.rows[0].content_ids) {
      return res.json({
        count: 0,
        hasCompletedMilestone: false,
        milestoneThreshold: 15
      });
    }

    const contentIds = progressResult.rows[0].content_ids;
    const count = Array.isArray(contentIds) ? contentIds.length : 0;
    const hasCompletedMilestone = count >= 15;

    console.log('GET Count Controller - content count:', count, 'milestone achieved:', hasCompletedMilestone);

    res.json({
      count,
      hasCompletedMilestone,
      milestoneThreshold: 15
    });
  } catch (error) {
    console.error('Error fetching learning progress count:', error);
    res.status(500).json({ message: 'Failed to fetch learning progress count' });
  }
};

// Add content ID to user's learning progress
export const addContentToProgress = async (req, res) => {
  try {
    console.log('Controller - req.user:', req.user);
    console.log('Controller - req.user.userId:', req.user?.userId);

    if (!req.user || !req.user.userId) {
      console.log('Controller - No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId; // Changed from req.user.id to req.user.userId
    const { contentId } = req.body;

    console.log('Controller - userId:', userId, 'contentId:', contentId);

    if (!contentId) {
      return res.status(400).json({ message: 'Content ID is required' });
    }

    // Check if user has existing progress
    const existingProgress = await query(
      'SELECT content_ids FROM user_learning_progress WHERE user_id = $1',
      [userId]
    );

    let updatedContentIds;

    if (existingProgress.rows.length === 0) {
      // Create new entry with this content ID
      updatedContentIds = [contentId];
      await query(
        'INSERT INTO user_learning_progress (user_id, content_ids) VALUES ($1, $2)',
        [userId, JSON.stringify(updatedContentIds)]
      );
    } else {
      // Update existing entry
      const currentContentIds = existingProgress.rows[0].content_ids || [];

      // Remove the content ID if it already exists (to avoid duplicates)
      const filteredIds = currentContentIds.filter(id => id !== contentId);
      // Add the content ID to the end (most recent)
      updatedContentIds = [...filteredIds, contentId];

      await query(
        'UPDATE user_learning_progress SET content_ids = $1 WHERE user_id = $2',
        [JSON.stringify(updatedContentIds), userId]
      );
    }

    res.json({
      message: 'Content added to progress successfully',
      contentIds: updatedContentIds
    });
  } catch (error) {
    console.error('Error adding content to progress:', error);
    res.status(500).json({ message: 'Failed to add content to progress' });
  }
};
