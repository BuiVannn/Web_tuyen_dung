// server/routes/blogPublicRoutes.js

import express from 'express';
import {
    getPublishedBlogPosts,
    getPublishedBlogPostBySlug
} from '../controllers/blogPublicController.js'; // Import controller công khai

const router = express.Router();

// Route lấy danh sách bài viết (có phân trang qua query params ?page=...&limit=...)
router.get('/', getPublishedBlogPosts);

// Route lấy chi tiết bài viết bằng slug
router.get('/:slug', getPublishedBlogPostBySlug);

// Các route công khai khác liên quan đến blog (nếu có, ví dụ: lấy theo tag, category) có thể thêm ở đây

export default router;