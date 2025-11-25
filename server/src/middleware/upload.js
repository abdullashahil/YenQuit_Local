import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const contentUploadDir = path.join(process.cwd(), 'uploads', 'content');
const avatarUploadDir = path.join(process.cwd(), 'uploads', 'avatars');

if (!fs.existsSync(contentUploadDir)) {
  fs.mkdirSync(contentUploadDir, { recursive: true });
}

if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

// Configure multer storage for content files
const contentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, contentUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Configure multer storage for avatar files
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `avatar-${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for content files (allows images, videos, PDFs)
const contentFileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${Object.values(allowedTypes).join(', ')} files are allowed.`), false);
  }
};

// File filter for avatar files (allows only images)
const avatarFileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${Object.values(allowedTypes).join(', ')} files are allowed for avatars.`), false);
  }
};

// Configure multer for content files
const contentUpload = multer({
  storage: contentStorage,
  fileFilter: contentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

// Configure multer for avatar files
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
    files: 1 // Only one file at a time
  }
});

// Middleware for single file upload (content)
export const uploadSingle = contentUpload.single('media');

// Middleware for avatar upload
export const uploadAvatar = avatarUpload.single('avatar');

// Helper function to get content file URL
export const getFileUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/content/${filename}`;
};

// Helper function to get avatar file URL
export const getAvatarUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/avatars/${filename}`;
};

// Helper function to delete content file
export const deleteFile = (filename) => {
  if (!filename) return;
  
  const filePath = path.join(contentUploadDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to delete avatar file
export const deleteAvatar = (filename) => {
  if (!filename) return;
  
  const filePath = path.join(avatarUploadDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB for content and 5MB for avatars.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

export default contentUpload;
