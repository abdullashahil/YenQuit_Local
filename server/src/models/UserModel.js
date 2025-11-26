import pool from '../db/index.js';

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT id, email, role, status, created_at, updated_at FROM users WHERE email = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Get all users with pagination, search, and filters
  static async findAll(page = 1, limit = 10, search = '', role = '', status = '') {
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;
    
    // Build WHERE conditions
    if (search) {
      whereConditions.push(`(
        u.email ILIKE $${paramIndex} OR 
        p.full_name ILIKE $${paramIndex} OR 
        p.phone ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (role && role !== 'all') {
      whereConditions.push(`u.role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }
    
    if (status && status !== 'all') {
      whereConditions.push(`u.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Main query
    const query = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.phone,
        p.age
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(limit, offset);
    
    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
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
      SELECT 
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.phone,
        p.age
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
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
      status = 'active',
      name,
      avatar_url,
      bio,
      phone,
      age,
      fagerstrom_score,
      addiction_level,
      join_date
    } = userData;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Hash password (simple implementation - in production use bcrypt)
      const password_hash = password; // TODO: Implement proper password hashing
      
      // Insert user
      const userQuery = `
        INSERT INTO users (email, password_hash, role, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, role, status, created_at, updated_at
      `;
      const userResult = await client.query(userQuery, [email, password_hash, role, status]);
      const user = userResult.rows[0];
      
      // Insert profile
      const profileQuery = `
        INSERT INTO profiles (user_id, name, avatar_url, bio, phone, age, fagerstrom_score, addiction_level, join_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const profileResult = await client.query(profileQuery, [
        user.id, name, avatar_url, bio, phone, age, fagerstrom_score, addiction_level, join_date
      ]);
      
      await client.query('COMMIT');
      
      // Return combined user + profile data
      return {
        ...user,
        ...profileResult.rows[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Update user and profile
  static async update(id, userData) {
    const {
      email,
      role,
      status,
      name,
      avatar_url,
      bio,
      phone,
      age,
      fagerstrom_score,
      addiction_level,
      join_date
    } = userData;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user if user fields provided
      if (email || role !== undefined || status !== undefined) {
        const userFields = [];
        const userValues = [];
        let userIndex = 1;
        
        if (email) {
          userFields.push(`email = $${userIndex}`);
          userValues.push(email);
          userIndex++;
        }
        
        if (role !== undefined) {
          userFields.push(`role = $${userIndex}`);
          userValues.push(role);
          userIndex++;
        }
        
        if (status !== undefined) {
          userFields.push(`status = $${userIndex}`);
          userValues.push(status);
          userIndex++;
        }
        
        if (userFields.length > 0) {
          userFields.push('updated_at = NOW()');
          userValues.push(id);
          
          const userQuery = `
            UPDATE users 
            SET ${userFields.join(', ')}
            WHERE id = $${userIndex}
            RETURNING id, email, role, status, created_at, updated_at
          `;
          await client.query(userQuery, userValues);
        }
      }
      
      // Update profile if profile fields provided
      if (name || avatar_url || bio !== undefined || phone || age !== undefined || 
          fagerstrom_score !== undefined || addiction_level !== undefined || join_date !== undefined) {
        const profileFields = [];
        const profileValues = [];
        let profileIndex = 1;
        
        if (name !== undefined) {
          profileFields.push(`name = $${profileIndex}`);
          profileValues.push(name);
          profileIndex++;
        }
        
        if (avatar_url !== undefined) {
          profileFields.push(`avatar_url = $${profileIndex}`);
          profileValues.push(avatar_url);
          profileIndex++;
        }
        
        if (bio !== undefined) {
          profileFields.push(`bio = $${profileIndex}`);
          profileValues.push(bio);
          profileIndex++;
        }
        
        if (phone !== undefined) {
          profileFields.push(`phone = $${profileIndex}`);
          profileValues.push(phone);
          profileIndex++;
        }
        
        if (age !== undefined) {
          profileFields.push(`age = $${profileIndex}`);
          profileValues.push(age);
          profileIndex++;
        }
        
        if (fagerstrom_score !== undefined) {
          profileFields.push(`fagerstrom_score = $${profileIndex}`);
          profileValues.push(fagerstrom_score);
          profileIndex++;
        }
        
        if (addiction_level !== undefined) {
          profileFields.push(`addiction_level = $${profileIndex}`);
          profileValues.push(addiction_level);
          profileIndex++;
        }
        
        if (join_date !== undefined) {
          profileFields.push(`join_date = $${profileIndex}`);
          profileValues.push(join_date);
          profileIndex++;
        }
        
        if (profileFields.length > 0) {
          profileFields.push('updated_at = NOW()');
          profileValues.push(id);
          
          const profileQuery = `
            UPDATE profiles 
            SET ${profileFields.join(', ')}
            WHERE user_id = $${profileIndex}
            RETURNING *
          `;
          await client.query(profileQuery, profileValues);
        }
      }
      
      await client.query('COMMIT');
      
      // Return updated user data
      return await this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Delete user (hard delete)
  static async delete(id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete profile first (due to foreign key constraint)
      await client.query('DELETE FROM profiles WHERE user_id = $1', [id]);
      
      // Delete user
      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Get user statistics
  static async getStats() {
    const queries = [
      // Total users
      pool.query('SELECT COUNT(*) as total FROM users'),
      // Users by role
      pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      // Users by status
      pool.query('SELECT status, COUNT(*) as count FROM users GROUP BY status'),
      // Recent registrations
      pool.query(`
        SELECT COUNT(*) as recent 
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `)
    ];
    
    try {
      const [totalResult, roleResult, statusResult, recentResult] = await Promise.all(queries);
      
      return {
        total: parseInt(totalResult.rows[0].total),
        byRole: roleResult.rows,
        byStatus: statusResult.rows,
        recentRegistrations: parseInt(recentResult.rows[0].recent)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    const {
      full_name,
      first_name,
      last_name,
      phone,
      age,
      gender,
      tobacco_type,
      avatar_url,
      bio,
      fagerstrom_score,
      addiction_level,
      join_date
    } = profileData;

    // Check if profile exists
    const checkQuery = 'SELECT id FROM profiles WHERE user_id = $1';
    const checkResult = await pool.query(checkQuery, [userId]);
    
    if (checkResult.rows.length === 0) {
      // Create profile if it doesn't exist
      const createQuery = `
        INSERT INTO profiles (
          user_id, full_name, first_name, last_name, phone, age, gender,
          tobacco_type, avatar_url, bio, fagerstrom_score, addiction_level, join_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;
      
      const createParams = [
        userId, full_name, first_name, last_name, phone, age, gender,
        tobacco_type, avatar_url, bio, fagerstrom_score, addiction_level, join_date
      ].filter(param => param !== undefined);
      
      const result = await pool.query(createQuery, createParams);
      return result.rows[0];
    } else {
      // Update existing profile
      const updateFields = [];
      const updateParams = [userId];
      let paramIndex = 2;
      
      if (full_name !== undefined) {
        updateFields.push(`full_name = $${paramIndex}`);
        updateParams.push(full_name);
        paramIndex++;
      }
      if (first_name !== undefined) {
        updateFields.push(`first_name = $${paramIndex}`);
        updateParams.push(first_name);
        paramIndex++;
      }
      if (last_name !== undefined) {
        updateFields.push(`last_name = $${paramIndex}`);
        updateParams.push(last_name);
        paramIndex++;
      }
      if (phone !== undefined) {
        updateFields.push(`phone = $${paramIndex}`);
        updateParams.push(phone);
        paramIndex++;
      }
      if (age !== undefined) {
        updateFields.push(`age = $${paramIndex}`);
        updateParams.push(age);
        paramIndex++;
      }
      if (gender !== undefined) {
        updateFields.push(`gender = $${paramIndex}`);
        updateParams.push(gender);
        paramIndex++;
      }
      if (tobacco_type !== undefined) {
        updateFields.push(`tobacco_type = $${paramIndex}`);
        updateParams.push(tobacco_type);
        paramIndex++;
      }
      if (avatar_url !== undefined) {
        updateFields.push(`avatar_url = $${paramIndex}`);
        updateParams.push(avatar_url);
        paramIndex++;
      }
      if (bio !== undefined) {
        updateFields.push(`bio = $${paramIndex}`);
        updateParams.push(bio);
        paramIndex++;
      }
      if (fagerstrom_score !== undefined) {
        updateFields.push(`fagerstrom_score = $${paramIndex}`);
        updateParams.push(fagerstrom_score);
        paramIndex++;
      }
      if (addiction_level !== undefined) {
        updateFields.push(`addiction_level = $${paramIndex}`);
        updateParams.push(addiction_level);
        paramIndex++;
      }
      if (join_date !== undefined) {
        updateFields.push(`join_date = $${paramIndex}`);
        updateParams.push(join_date);
        paramIndex++;
      }
      
      if (updateFields.length === 0) return null;
      
      updateFields.push('updated_at = NOW()');
      
      const updateQuery = `
        UPDATE profiles 
        SET ${updateFields.join(', ')}
        WHERE user_id = $1
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, updateParams);
      return result.rows[0];
    }
  }

  // Get profile by user ID (for fiveaController compatibility)
  static async getProfileByUserId(userId) {
    const query = 'SELECT * FROM profiles WHERE user_id = $1';
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      throw error;
    }
  }
}

export default UserModel;
