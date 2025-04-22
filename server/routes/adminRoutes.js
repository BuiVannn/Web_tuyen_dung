import express from 'express';
import { adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

// Import controllers
import {
    // API hiện tại
    getAdminStats,
    getAllUsers,
    getAllCompanies,
    getAllJobs,
    getUserDetails,
    getCompanyDetails,
    getJobDetails,
    deleteUserById,
    deleteCompanyById,
    deleteJobById,
    updateJobStatus,
    getAllApplications,
    uploadContentImage,
    approveJob,

    // API mới
    getAdminProfile,
    updateAdminProfile,
    updateAdminPassword,
    getAllResourcesAdmin,
    getResourceByIdAdmin,
    createResource,
    updateResourceById,
    deleteResourceById,
    updateResourceItem,
    deleteResourceItem,
    updateResourceStatus,
    getAdminActivities,
    getLoginDevices

} from '../controllers/adminController.js';
import blogAdminRoutes from './blogAdminRoutes.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của admin
 *         name:
 *           type: string
 *           description: Tên của admin
 *         email:
 *           type: string
 *           format: email
 *           description: Email đăng nhập của admin
 *         role:
 *           type: string
 *           enum: [admin, super_admin]
 *           description: Vai trò của admin
 *         avatar:
 *           type: string
 *           description: URL ảnh đại diện của admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *     
 *
 *     Resource:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của tài nguyên
 *         title:
 *           type: string
 *           description: Tiêu đề tài nguyên
 *         description:
 *           type: string
 *           description: Mô tả tài nguyên
 *         type:
 *           type: string
 *           enum: [article, template, guide, tool]
 *           description: Loại tài nguyên
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           description: Danh sách các mục trong tài nguyên
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Trạng thái tài nguyên
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *
 * tags:
 *   - name: Admin Profile
 *     description: Quản lý thông tin và mật khẩu admin
 *   - name: Admin Dashboard
 *     description: Thống kê và dữ liệu tổng quan
 *   - name: User Management
 *     description: Quản lý người dùng
 *   - name: Company Management
 *     description: Quản lý công ty
 *   - name: Job Management
 *     description: Quản lý việc làm
 *   - name: Application Management
 *     description: Quản lý đơn ứng tuyển
 *   - name: Resource Management
 *     description: Quản lý tài nguyên hỗ trợ sự nghiệp
 */

const router = express.Router();

// Áp dụng middleware adminMiddleware cho tất cả routes
router.use(adminMiddleware);

// Admin Profile Routes
/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Lấy thông tin profile của admin
 *     tags: [Admin Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/profile', getAdminProfile);

/**
 * @swagger
 * /api/admin/profile:
 *   put:
 *     summary: Cập nhật thông tin profile admin
 *     tags: [Admin Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin profile updated successfully"
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.put('/profile', updateAdminProfile);

/**
 * @swagger
 * /api/admin/change-password:
 *   put:
 *     summary: Đổi mật khẩu admin
 *     tags: [Admin Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Mật khẩu hiện tại không đúng hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.put('/change-password', updateAdminPassword);

// Dashboard Stats
/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Lấy thống kê tổng quan cho dashboard
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   $ref: '#/components/schemas/AdminStats'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/stats', getAdminStats);

// User Management
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên hoặc email
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get('/users/:userId', getUserDetails);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Xóa một người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete('/users/:userId', deleteUserById);

// Company Management
/**
 * @swagger
 * /api/admin/companies:
 *   get:
 *     summary: Lấy danh sách tất cả công ty
 *     tags: [Company Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên công ty hoặc email
 *     responses:
 *       200:
 *         description: Danh sách công ty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalCompanies:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/companies', getAllCompanies);

/**
 * @swagger
 * /api/admin/companies/{companyId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một công ty
 *     tags: [Company Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công ty
 *     responses:
 *       200:
 *         description: Thông tin chi tiết công ty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy công ty
 *       500:
 *         description: Lỗi server
 */
router.get('/companies/:companyId', getCompanyDetails);

/**
 * @swagger
 * /api/admin/companies/{companyId}:
 *   delete:
 *     summary: Xóa một công ty
 *     tags: [Company Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công ty
 *     responses:
 *       200:
 *         description: Xóa công ty thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Company deleted successfully"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy công ty
 *       500:
 *         description: Lỗi server
 */
router.delete('/companies/:companyId', deleteCompanyById);

// Job Management
/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Lấy danh sách tất cả việc làm
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tiêu đề công việc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách việc làm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalJobs:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/jobs', getAllJobs);

/**
 * @swagger
 * /api/admin/jobs/{jobId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một việc làm
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của việc làm
 *     responses:
 *       200:
 *         description: Thông tin chi tiết việc làm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 *       500:
 *         description: Lỗi server
 */
router.get('/jobs/:jobId', getJobDetails);

/**
 * @swagger
 * /api/admin/jobs/{jobId}:
 *   delete:
 *     summary: Xóa một việc làm
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của việc làm
 *     responses:
 *       200:
 *         description: Xóa việc làm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Job deleted successfully"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 *       500:
 *         description: Lỗi server
 */
router.delete('/jobs/:jobId', deleteJobById);

/**
 * @swagger
 * /api/admin/jobs/{jobId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái của việc làm
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của việc làm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 description: Trạng thái mới của việc làm
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Job status updated successfully"
 *                 job:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 *       500:
 *         description: Lỗi server
 */
router.patch('/jobs/:jobId/status', updateJobStatus);

/**
 * @swagger
 * /api/admin/jobs/{id}/approve:
 *   patch:
 *     summary: Phê duyệt một việc làm
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của việc làm
 *     responses:
 *       200:
 *         description: Phê duyệt việc làm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Job approved successfully"
 *                 job:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 *       500:
 *         description: Lỗi server
 */
router.patch('/jobs/:id/approve', approveJob);

// Application Management
/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Lấy danh sách tất cả đơn ứng tuyển
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *         description: Lọc theo trạng thái đơn
 *     responses:
 *       200:
 *         description: Danh sách đơn ứng tuyển
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalApplications:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/applications', getAllApplications);

// Image Upload for content
/**
 * @swagger
 * /api/admin/images/upload:
 *   post:
 *     summary: Tải lên hình ảnh cho nội dung
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File hình ảnh
 *     responses:
 *       200:
 *         description: Tải lên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/images/upload/123456.jpg"
 *       400:
 *         description: Lỗi khi tải lên
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/images/upload', upload.single('image'), uploadContentImage);

// Blog Management - Sử dụng blogAdminRoutes
router.use('/blogs', blogAdminRoutes);

// Career Resources Management
/**
 * @swagger
 * /api/admin/resources:
 *   get:
 *     summary: Lấy danh sách tất cả tài nguyên (admin view)
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [article, template, guide, tool]
 *         description: Lọc theo loại tài nguyên
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách tài nguyên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 resources:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalResources:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/resources', getAllResourcesAdmin);

/**
 * @swagger
 * /api/admin/resources/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một tài nguyên (admin view)
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *     responses:
 *       200:
 *         description: Thông tin chi tiết tài nguyên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên
 *       500:
 *         description: Lỗi server
 */
router.get('/resources/:id', getResourceByIdAdmin);

/**
 * @swagger
 * /api/admin/resources:
 *   post:
 *     summary: Tạo tài nguyên mới
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề tài nguyên
 *               description:
 *                 type: string
 *                 description: Mô tả tài nguyên
 *               type:
 *                 type: string
 *                 enum: [article, template, guide, tool]
 *                 description: Loại tài nguyên
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Danh sách các mục trong tài nguyên
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Trạng thái tài nguyên
 *     responses:
 *       201:
 *         description: Tạo tài nguyên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource created successfully"
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/resources', createResource);

/**
 * @swagger
 * /api/admin/resources/{id}:
 *   put:
 *     summary: Cập nhật thông tin tài nguyên
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề tài nguyên
 *               description:
 *                 type: string
 *                 description: Mô tả tài nguyên
 *               type:
 *                 type: string
 *                 enum: [article, template, guide, tool]
 *                 description: Loại tài nguyên
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Danh sách các mục trong tài nguyên
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource updated successfully"
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên
 *       500:
 *         description: Lỗi server
 */
router.put('/resources/:id', updateResourceById);

/**
 * @swagger
 * /api/admin/resources/{id}:
 *   delete:
 *     summary: Xóa một tài nguyên
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *     responses:
 *       200:
 *         description: Xóa tài nguyên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource deleted successfully"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên
 *       500:
 *         description: Lỗi server
 */
router.delete('/resources/:id', deleteResourceById);

/**
 * @swagger
 * /api/admin/resources/{resourceId}/items/{itemId}:
 *   put:
 *     summary: Cập nhật một mục trong tài nguyên
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               url:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource item updated successfully"
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên hoặc mục
 *       500:
 *         description: Lỗi server
 */
router.put('/resources/:resourceId/items/:itemId', updateResourceItem);

/**
 * @swagger
 * /api/admin/resources/{resourceId}/items/{itemId}:
 *   delete:
 *     summary: Xóa một mục trong tài nguyên
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mục
 *     responses:
 *       200:
 *         description: Xóa mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource item deleted successfully"
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên hoặc mục
 *       500:
 *         description: Lỗi server
 */
router.delete('/resources/:resourceId/items/:itemId', deleteResourceItem);

/**
 * @swagger
 * /api/admin/resources/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái của tài nguyên
 *     tags: [Resource Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài nguyên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Trạng thái mới
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resource status updated successfully"
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài nguyên
 *       500:
 *         description: Lỗi server
 */
router.patch('/resources/:id/status', updateResourceStatus);

router.get('/activities', getAdminActivities);

router.get('/login-devices', getLoginDevices);

export default router;

// import express from 'express';
// import { adminMiddleware } from '../middlewares/authMiddleware.js';
// import upload from '../config/multer.js';

// // Import controllers
// import {
//     // API hiện tại
//     getAdminStats,
//     getAllUsers,
//     getAllCompanies,
//     getAllJobs,
//     getUserDetails,
//     getCompanyDetails,
//     getJobDetails,
//     deleteUserById,
//     deleteCompanyById,
//     deleteJobById,
//     updateJobStatus,
//     getAllApplications,
//     uploadContentImage,
//     approveJob,

//     // API mới
//     getAdminProfile,
//     updateAdminProfile,
//     updateAdminPassword,
//     getAllResourcesAdmin,
//     getResourceByIdAdmin,
//     createResource,
//     updateResourceById,
//     deleteResourceById,
//     updateResourceItem,
//     deleteResourceItem,
//     updateResourceStatus,
//     getAdminActivities,
//     getLoginDevices

// } from '../controllers/adminController.js';
// import blogAdminRoutes from './blogAdminRoutes.js';

// const router = express.Router();

// // Áp dụng middleware adminMiddleware cho tất cả routes
// router.use(adminMiddleware);

// // Admin Profile Routes
// router.get('/profile', getAdminProfile);
// router.put('/profile', updateAdminProfile);
// router.put('/change-password', updateAdminPassword);

// // Dashboard Stats
// router.get('/stats', getAdminStats);

// // User Management
// router.get('/users', getAllUsers);
// router.get('/users/:userId', getUserDetails);
// router.delete('/users/:userId', deleteUserById);

// // Company Management
// router.get('/companies', getAllCompanies);
// router.get('/companies/:companyId', getCompanyDetails);
// router.delete('/companies/:companyId', deleteCompanyById);

// // Job Management
// router.get('/jobs', getAllJobs);
// router.get('/jobs/:jobId', getJobDetails);
// router.delete('/jobs/:jobId', deleteJobById);
// router.patch('/jobs/:jobId/status', updateJobStatus);
// router.patch('/jobs/:id/approve', approveJob);

// // Application Management
// router.get('/applications', getAllApplications);

// // Image Upload for content
// router.post('/images/upload', upload.single('image'), uploadContentImage);

// // Blog Management - Sử dụng blogAdminRoutes
// router.use('/blogs', blogAdminRoutes);

// // Career Resources Management
// router.get('/resources', getAllResourcesAdmin);
// router.get('/resources/:id', getResourceByIdAdmin);
// router.post('/resources', createResource);
// router.put('/resources/:id', updateResourceById);
// router.delete('/resources/:id', deleteResourceById);
// router.put('/resources/:resourceId/items/:itemId', updateResourceItem);
// router.delete('/resources/:resourceId/items/:itemId', deleteResourceItem);
// router.patch('/resources/:id/status', updateResourceStatus);
// router.get('/activities', getAdminActivities);
// router.get('/login-devices', getLoginDevices);

// export default router;
