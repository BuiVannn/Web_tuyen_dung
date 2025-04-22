import Blog from '../models/Blog.js';
import { isValidObjectId } from 'mongoose';

// @desc    Lấy tất cả bài viết (có filter và phân trang)
// @route   GET /api/admin/blogs
// @access  Admin
export const getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status || '';
        const search = req.query.search || '';

        // Xây dựng query
        let query = {};

        // Lọc theo status nếu có
        if (status && ['draft', 'published', 'archived'].includes(status)) {
            query.status = status;
        }

        // Tìm kiếm theo từ khóa nếu có
        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } },
                { category: { $regex: new RegExp(search, 'i') } }
            ];
        }

        // Thực hiện truy vấn
        const blogs = await Blog.find(query)
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Đếm tổng số bài viết thỏa mãn
        const totalBlogs = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        res.json({
            success: true,
            blogs,
            currentPage: page,
            totalPages,
            totalBlogs
        });
    } catch (error) {
        console.error("Error getting blogs:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách bài viết',
            error: error.message
        });
    }
};

// @desc    Lấy chi tiết một bài viết theo ID
// @route   GET /api/admin/blogs/:id
// @access  Admin
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        const post = await Blog.findById(id)
            .populate('author', 'name')
            .lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Error getting blog by ID:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy chi tiết bài viết',
            error: error.message
        });
    }
};

// @desc    Tạo bài viết mới
// @route   POST /api/admin/blogs
// @access  Admin
export const createBlog = async (req, res) => {
    try {
        const { title, content, status, tags: tagsString, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề và nội dung là bắt buộc'
            });
        }

        // Xử lý tags từ string thành array
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

        // Lấy admin ID từ middleware auth
        const author = req.admin._id;

        // Xử lý ảnh featured (nếu có)
        const featuredImage = req.cloudinaryResult ? req.cloudinaryResult.secure_url : '';

        const newBlog = new Blog({
            title,
            content,
            status: status || 'draft',
            tags,
            category,
            author,
            featuredImage
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Bài viết đã được tạo thành công',
            post: savedBlog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi tạo bài viết',
            error: error.message
        });
    }
};

// @desc    Cập nhật bài viết
// @route   PUT /api/admin/blogs/:id
// @access  Admin
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, status, tags: tagsString, category } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        // Kiểm tra bài viết tồn tại
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        // Xử lý tags từ string thành array
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

        // Tạo object cập nhật
        const updateData = {
            title,
            content,
            status,
            tags,
            category,
        };

        // Cập nhật ảnh nếu có upload mới
        if (req.cloudinaryResult && req.cloudinaryResult.secure_url) {
            updateData.featuredImage = req.cloudinaryResult.secure_url;
        }

        // Cập nhật blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Bài viết đã được cập nhật thành công',
            post: updatedBlog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi cập nhật bài viết',
            error: error.message
        });
    }
};

// @desc    Xóa bài viết
// @route   DELETE /api/admin/blogs/:id
// @access  Admin
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        res.json({
            success: true,
            message: 'Bài viết đã được xóa thành công'
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa bài viết',
            error: error.message
        });
    }
};