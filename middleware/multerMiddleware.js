const multer = require('multer');
const path = require('path');

// Ensure upload directory exists
const fs = require('fs');
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);

  
    
    if (file.fieldname === 'barberImages') {
      cb(null, `barber-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === 'salonImages') {
      cb(null, `salon-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === 'ownerImage') {
      cb(null, `owner-${uniqueSuffix}${ext}`);
    } else {
      cb(new Error('Invalid field name'), false);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 15 // Maximum 15 files (10 barber + 5 salon images)
  }
}).fields([
  { name: 'barberImages', maxCount: 10 },
  { name: 'salonImages', maxCount: 5 },
  {name : 'ownerImages', maxCount: 1}
]);

module.exports = upload;