// middleware/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

/**
 * Multer storage configuration for User profile photos.
 * Uploads to 'ddShop/users' folder in Cloudinary.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ddShop/users',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

export default upload;
