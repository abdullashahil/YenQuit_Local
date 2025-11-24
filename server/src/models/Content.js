import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class ContentModel {
  // Create new content
  static async create(contentData) {
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
    } = contentData;

    const query = `
      INSERT INTO contents (title, category, description, content, status, publish_date, end_date, media_url, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      title,
      category,
      description || null,
      content,
      status,
      publish_date || null,
      end_date || null,
      media_url || null,
      tags || null
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating content: ${error.message}`);
    }
  }

  // Get all content with pagination, search, and filtering
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status
    } = options;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Build WHERE conditions
    if (search) {
      paramCount++;
      whereConditions.push(`title ILIKE $${paramCount}`);
      queryParams.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Main query
    const query = `
      SELECT * FROM contents 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total FROM contents ${whereClause}
    `;

    try {
      // Add pagination parameters
      queryParams.push(limit, offset);

      const [result, countResult] = await Promise.all([
        pool.query(query, queryParams),
        pool.query(countQuery, queryParams.slice(0, -2))
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error fetching contents: ${error.message}`);
    }
  }

  // Get content by ID
  static async findById(id) {
    const query = 'SELECT * FROM contents WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching content: ${error.message}`);
    }
  }

  // Update content by ID
  static async update(id, updateData) {
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
    } = updateData;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
    }
    if (category !== undefined) {
      paramCount++;
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
    }
    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (content !== undefined) {
      paramCount++;
      updateFields.push(`content = $${paramCount}`);
      values.push(content);
    }
    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
    }
    if (publish_date !== undefined) {
      paramCount++;
      updateFields.push(`publish_date = $${paramCount}`);
      values.push(publish_date);
    }
    if (end_date !== undefined) {
      paramCount++;
      updateFields.push(`end_date = $${paramCount}`);
      values.push(end_date);
    }
    if (media_url !== undefined) {
      paramCount++;
      updateFields.push(`media_url = $${paramCount}`);
      values.push(media_url);
    }
    if (tags !== undefined) {
      paramCount++;
      updateFields.push(`tags = $${paramCount}`);
      values.push(tags);
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE contents 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    values.push(id);

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating content: ${error.message}`);
    }
  }

  // Delete content by ID
  static async delete(id) {
    const query = 'DELETE FROM contents WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error deleting content: ${error.message}`);
    }
  }

  // Get content statistics
  static async getStats() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM contents',
      byStatus: 'SELECT status, COUNT(*) as count FROM contents GROUP BY status',
      byCategory: 'SELECT category, COUNT(*) as count FROM contents GROUP BY category',
      recent: 'SELECT COUNT(*) as count FROM contents WHERE created_at >= NOW() - INTERVAL \'7 days\''
    };

    try {
      const [totalResult, statusResult, categoryResult, recentResult] = await Promise.all([
        pool.query(queries.total),
        pool.query(queries.byStatus),
        pool.query(queries.byCategory),
        pool.query(queries.recent)
      ]);

      return {
        total: parseInt(totalResult.rows[0].count),
        byStatus: statusResult.rows,
        byCategory: categoryResult.rows,
        recent: parseInt(recentResult.rows[0].count)
      };
    } catch (error) {
      throw new Error(`Error fetching stats: ${error.message}`);
    }
  }
}

export default ContentModel;
