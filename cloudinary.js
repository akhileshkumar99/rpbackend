const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('🔧 Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rp-school',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      return Date.now() + '-' + Math.round(Math.random() * 1E9);
    },
    resource_type: 'auto'
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
