import UserModel from '../models/UserModel.js';

// Create new user (Admin only)
export async function createUser(req, res, next) {
  try {
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
    } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const newUser = await UserModel.create({
      email,
      password,
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
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
}

// Get all users with pagination and filters (Admin only)
export async function getAllUsers(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = ''
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const result = await UserModel.findAll(
      pageNum,
      limitNum,
      search,
      role,
      status
    );
    
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
}

// Get user by ID (Admin only)
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
}

// Update user (Admin only)
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Check if user exists
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If updating email, check if it's already taken by another user
    if (userData.email && userData.email !== existingUser.email) {
      const emailCheck = await UserModel.findByEmail(userData.email);
      if (emailCheck) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use by another user'
        });
      }
    }
    
    const updatedUser = await UserModel.update(id, userData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
}

// Delete user (Admin only)
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent self-deletion
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    const deletedUser = await UserModel.delete(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
}

// Get user statistics (Admin only)
export async function getUserStats(req, res, next) {
  try {
    const stats = await UserModel.getStats();
    
    res.json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    next(error);
  }
}
