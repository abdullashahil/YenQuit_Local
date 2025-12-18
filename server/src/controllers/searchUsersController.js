import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import pool from '../db/index.js';

// Search users for invites (public endpoint for authenticated users)
export async function searchUsers(req, res, next) {
    try {
        const { search = '', limit = 20 } = req.query;
        const currentUserId = req.user.userId;

        let sql = `
      SELECT id, email, full_name, avatar_url
      FROM users
      WHERE id != $1
    `;

        const params = [currentUserId];

        if (search && search.trim()) {
            sql += ` AND (email ILIKE $2 OR full_name ILIKE $2)`;
            params.push(`%${search.trim()}%`);
        }

        sql += ` ORDER BY full_name, email LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await pool.query(sql, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
        });
    }
}
