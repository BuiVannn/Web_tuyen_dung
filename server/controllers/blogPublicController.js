import Blog from '../models/Blog.js';

// @desc    Lấy danh sách các bài viết đã xuất bản (có phân trang và lọc)
// @route   GET /api/blogs
// @access  Public
export const getPublishedBlogPosts = async (req, res) => {
    try {
        // Lấy các tham số từ query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;
        const category = req.query.category || '';
        const tag = req.query.tag || '';
        const search = req.query.search || '';

        // Xây dựng query
        let query = { status: 'published' };

        // Thêm điều kiện lọc theo category nếu có
        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        // Thêm điều kiện lọc theo tag nếu có
        if (tag) {
            query.tags = { $in: [new RegExp(tag, 'i')] };
        }

        // Thêm điều kiện tìm kiếm theo từ khóa nếu có
        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } }
            ];
        }

        console.log("Blog query:", JSON.stringify(query));

        // Thực hiện truy vấn
        const posts = await Blog.find(query)
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .select('title slug featuredImage author createdAt tags category content')
            .limit(limit)
            .skip(skip)
            .lean();

        // Đếm tổng số bài viết thỏa mãn
        const totalPosts = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            posts,
            currentPage: page,
            totalPages,
            totalPosts
        });
    } catch (error) {
        console.error("Error fetching published blog posts:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách bài viết',
            error: error.message
        });
    }
};

// @desc    Lấy chi tiết một bài viết đã xuất bản bằng slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getPublishedBlogPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        console.log("Fetching blog with slug:", slug);

        const post = await Blog.findOne({
            slug: slug,
            status: 'published'
        })
            .populate('author', 'name')
            .select('-__v -updatedAt')
            .lean();

        if (!post) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }

        res.json({ success: true, post });
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy chi tiết bài viết',
            error: error.message
        });
    }
};
// // server/controllers/blogPublicController.js

// import Blog from '../models/Blog.js'; // Import Blog model

// // @desc    Lấy danh sách các bài viết đã xuất bản (có phân trang)
// // @route   GET /api/blogs
// // @access  Public
// export const getPublishedBlogPosts = async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại từ query param, mặc định là 1
//     const limit = parseInt(req.query.limit) || 9; // Lấy số lượng bài viết mỗi trang, mặc định là 9
//     const skip = (page - 1) * limit; // Tính số bài viết cần bỏ qua

//     try {
//         // Lấy các bài viết có status là 'published'
//         const posts = await Blog.find({ status: 'published' })
//             .populate('author', 'name') // Lấy tên tác giả
//             .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
//             .select('title slug featuredImage author createdAt tags category') // Chỉ lấy các trường cần cho list view
//             .limit(limit) // Giới hạn số lượng
//             .skip(skip)   // Bỏ qua các bài viết của trang trước
//             .lean();      // Dùng lean để tối ưu

//         // Đếm tổng số bài viết đã published để tính số trang
//         const totalPosts = await Blog.countDocuments({ status: 'published' });
//         const totalPages = Math.ceil(totalPosts / limit);

//         res.json({
//             success: true,
//             posts,
//             currentPage: page,
//             totalPages,
//             totalPosts
//         });
//     } catch (error) {
//         console.error("Error fetching published blog posts:", error);
//         res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách bài viết' });
//     }
// };

// // @desc    Lấy chi tiết một bài viết đã xuất bản bằng slug
// // @route   GET /api/blogs/:slug
// // @access  Public
// export const getPublishedBlogPostBySlug = async (req, res) => {
//     try {
//         const post = await Blog.findOne({
//             slug: req.params.slug, // Tìm theo slug từ URL
//             status: 'published'    // Chỉ lấy bài đã xuất bản
//         })
//             .populate('author', 'name image') // Lấy tên và ảnh tác giả (nếu có)
//             .select('-__v -updatedAt') // Bỏ qua các trường không cần thiết cho public view
//             .lean();

//         if (!post) {
//             return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
//         }

//         // TODO: Có thể thêm logic đếm lượt xem ở đây nếu muốn

//         res.json({ success: true, post });
//     } catch (error) {
//         console.error("Error fetching blog post by slug:", error);
//         res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết bài viết' });
//     }
// };