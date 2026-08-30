const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists with absolute path
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate clean unique filename with timestamp & safe extension
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `thesis_${uniqueSuffix}${ext}`);
  }
});

// File filter for PDF documents and images
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedDocExts = ['.pdf'];
  const allowedImgExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedDocExts.includes(fileExt) || allowedImgExts.includes(fileExt) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์เอกสาร .PDF และรูปภาพ .JPG, .PNG, .WEBP เท่านั้น'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB maximum size
  }
});

module.exports = upload;
