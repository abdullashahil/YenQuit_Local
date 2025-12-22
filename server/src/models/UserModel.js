import pool from '../db/index.js';

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    // Now querying only users table
    const query = 'SELECT * FROM users WHERE email = $1';

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Get all users with pagination, search, and filters
  static async findAll(page = 1, limit = 10, search = '', role = '') {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (search) {
      whereConditions.push(`(
        u.email ILIKE $${paramIndex} OR 
        u.full_name ILIKE $${paramIndex} OR 
        u.phone ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role && role !== 'all') {
      whereConditions.push(`u.role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Main query
    const query = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at,
        u.updated_at,
        u.full_name,
        u.phone,
        u.age
      FROM users u
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;

    const countParams = params.slice(0, -2); // Remove limit and offset

    try {
      const [usersResult, countResult] = await Promise.all([
        pool.query(query, params),
        pool.query(countQuery, countParams)
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        data: usersResult.rows,
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
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get user by ID with profile
  static async findById(id) {
    const query = `
      SELECT *
      FROM users u
      WHERE u.id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Create new user with profile
  static async create(userData) {
    const {
      email,
      password,
      role = 'user',
      name,
      phone,
      age,
      fagerstrom_score,
      join_date
    } = userData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const password_hash = password;

      // Insert user
      const userQuery = `
        INSERT INTO users (
            email, password_hash, role, full_name, phone, age, fagerstrom_score, join_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const userResult = await client.query(userQuery, [
        email, password_hash, role, name, phone, age, fagerstrom_score, join_date
      ]);
      const user = userResult.rows[0];

      await client.query('COMMIT');

      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Update user and profile (Unified)
  static async update(id, userData) {
    const client = await pool.connect();

    try {
      const fields = [];
      const values = [];
      let idx = 1;

      const mappings = {
        email: 'email',
        role: 'role',
        full_name: 'full_name',
        name: 'full_name', // alias
        phone: 'phone',
        age: 'age',
        fagerstrom_score: 'fagerstrom_score',
        join_date: 'join_date',
        gender: 'gender',
        tobacco_type: 'tobacco_type'
      };

      for (const [key, val] of Object.entries(userData)) {
        if (mappings[key] && val !== undefined) {
          fields.push(`${mappings[key]} = $${idx++}`);
          values.push(val);
        }
      }

      if (fields.length === 0) return await this.findById(id);

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const userQuery = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = $${idx}
        RETURNING *
      `;

      const res = await client.query(userQuery, values);
      return res.rows[0];

    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete user (hard delete)
  static async delete(id) {
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }

  // Get user statistics
  static async getStats() {
    const queries = [
      // Total users
      pool.query('SELECT COUNT(*) as total FROM users'),
      // Users by role
      pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      // Recent registrations
      pool.query(`
        SELECT COUNT(*) as recent 
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `)
    ];

    try {
      const [totalResult, roleResult, recentResult] = await Promise.all(queries);

      return {
        total: parseInt(totalResult.rows[0].total),
        byRole: roleResult.rows,
        recentRegistrations: parseInt(recentResult.rows[0].recent)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Update user profile (Legacy wrapper for update)
  static async updateProfile(userId, profileData) {
    return this.update(userId, profileData);
  }

  // Get profile by user ID (Legacy wrapper for findById)
  static async getProfileByUserId(userId) {
    return this.findById(userId);
  }

  // Find user by ID with password (for password change)
  static async findByIdWithPassword(id) {
    const query = `
      SELECT *
      FROM users u
      WHERE u.id = $1
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID with password:', error);
      throw error;
    }
  }

  // Update user password
  static async updatePassword(userId, hashedPassword) {
    const query = `
      UPDATE users 
      SET password_hash = $2, updated_at = NOW() 
      WHERE id = $1 
      RETURNING id, email, role, updated_at
    `;
    try {
      const result = await pool.query(query, [userId, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // Get all admins
  static async getAllAdmins() {
    const query = `
      SELECT *
      FROM users u
      WHERE u.role = 'admin'
      ORDER BY u.created_at DESC
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all admins:', error);
      throw error;
    }
  }

  // Promote user to admin
  static async promoteUser(userId) {
    const query = `
      UPDATE users 
      SET role = 'admin', updated_at = NOW() 
      WHERE id = $1 AND role = 'user'
      RETURNING id, email, role, updated_at
    `;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error promoting user:', error);
      throw error;
    }
  }

  // Demote admin to user
  static async demoteAdmin(userId) {
    const query = `
      UPDATE users 
      SET role = 'user', updated_at = NOW() 
      WHERE id = $1 AND role = 'admin'
      RETURNING id, email, role, updated_at
    `;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error demoting admin:', error);
      throw error;
    }
  }

  // Get users for promotion (non-admin users)
  static async getNonAdminUsers() {
    const query = `
      SELECT *
      FROM users u
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching non-admin users:', error);
      throw error;
    }
  }
}

export default UserModel;
