import express from 'express';
import {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogAdminController.js';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';
import { adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware xác thực admin
router.use(adminMiddleware);

// Routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', uploadSingleImage('featuredImage'), createBlog);
router.put('/:id', uploadSingleImage('featuredImage'), updateBlog);
router.delete('/:id', deleteBlog);

export default router;