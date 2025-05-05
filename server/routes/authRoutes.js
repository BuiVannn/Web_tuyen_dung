import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/userController.js';
// import {
// loginCompany,
// registerCompany
// } from '../controllers/companyController.js';
import { loginAdmin, logoutAdmin } from '../controllers/adminController.js';
import { adminMiddleware, protectUser, protectCompany } from '../middlewares/authMiddleware.js';
import { loginCompany, registerCompany, logoutCompany } from '../controllers/companyController.js';
import {
    getUserApplications,
    applyForJob,
    getUserProfile
} from '../controllers/userController.js';
import upload from '../config/multer.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của người dùng
 *         name:
 *           type: string
 *           description: Tên người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email đăng nhập của người dùng
 *         image:
 *           type: string
 *           description: URL ảnh đại diện
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *     
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của công ty
 *         name:
 *           type: string
 *           description: Tên công ty
 *         email:
 *           type: string
 *           format: email
 *           description: Email đăng nhập của công ty
 *         image:
 *           type: string
 *           description: URL logo công ty
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *     
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của admin
 *         name:
 *           type: string
 *           description: Tên admin
 *         email:
 *           type: string
 *           format: email
 *           description: Email đăng nhập của admin
 *         role:
 *           type: string
 *           enum: [admin, super_admin]
 *           description: Vai trò của admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *     
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của đơn ứng tuyển
 *         jobId:
 *           type: object
 *           description: Thông tin công việc
 *         userId:
 *           type: string
 *           description: ID của người dùng
 *         companyId:
 *           type: object
 *           description: Thông tin công ty
 *         coverLetter:
 *           type: string
 *           description: Thư xin việc
 *         resume:
 *           type: string
 *           description: URL file CV
 *         status:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *           description: Trạng thái đơn ứng tuyển
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian nộp đơn
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *
 * tags:
 *   - name: User Auth
 *     description: Đăng ký và đăng nhập tài khoản người dùng
 *   - name: Company Auth
 *     description: Đăng ký và đăng nhập tài khoản công ty
 *   - name: Admin Auth
 *     description: Đăng nhập và đăng xuất tài khoản admin
 *   - name: User Management
 *     description: Quản lý thông tin người dùng
 */

const router = express.Router();

// User auth routes
/**
 * @swagger
 * /api/auth/users/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện (tùy chọn)
 *     responses:
 *       201:
 *         description: Đăng ký thành công
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
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã được sử dụng
 *       500:
 *         description: Lỗi server
 */
//router.post('/users/register', upload.single('image'), registerUser);
router.post('/users/register', registerUser);

/**
 * @swagger
 * /api/auth/users/login:
 *   post:
 *     summary: Đăng nhập tài khoản người dùng
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post('/users/login', loginUser);

router.post('/users/logout', protectUser, logoutUser);

/**
 * @swagger
 * /api/auth/users/profile:
 *   get:
 *     summary: Lấy thông tin profile người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     resume:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     education:
 *                       type: array
 *                       items:
 *                         type: object
 *                     experience:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
//router.get('/users/profile', protectUser, getUserProfile);

/**
 * @swagger
 * /api/auth/users/applications:
 *   get:
 *     summary: Lấy danh sách đơn ứng tuyển của người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
//router.get('/users/applications', protectUser, getUserApplications);

/**
 * @swagger
 * /api/auth/users/apply:
 *   post:
 *     summary: Nộp đơn ứng tuyển việc làm
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID công việc muốn ứng tuyển
 *               coverLetter:
 *                 type: string
 *                 description: Thư xin việc
 *               resumeOption:
 *                 type: string
 *                 enum: [useProfile, uploadNew]
 *                 description: Lựa chọn sử dụng CV hiện có hoặc tải lên mới
 *     responses:
 *       201:
 *         description: Nộp đơn thành công
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
 *                   example: "Application submitted successfully"
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã ứng tuyển công việc này
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
//router.post('/users/apply', protectUser, applyForJob);

// Company auth routes
/**
 * @swagger
 * /api/auth/companies/register:
 *   post:
 *     summary: Đăng ký tài khoản công ty mới
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên công ty
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *               phoneNumber:
 *                 type: string
 *                 description: Số điện thoại liên hệ
 *               website:
 *                 type: string
 *                 description: Website công ty
 *               location:
 *                 type: string
 *                 description: Địa chỉ công ty
 *               industry:
 *                 type: string
 *                 description: Lĩnh vực hoạt động
 *               companySize:
 *                 type: string
 *                 description: Quy mô công ty
 *               foundedYear:
 *                 type: number
 *                 description: Năm thành lập
 *               description:
 *                 type: string
 *                 description: Mô tả công ty
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Logo công ty
 *     responses:
 *       201:
 *         description: Đăng ký thành công
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
 *                   example: "Company registered successfully"
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã được sử dụng
 *       500:
 *         description: Lỗi server
 */
router.post('/companies/register', upload.single('image'), registerCompany);

/**
 * @swagger
 * /api/auth/companies/login:
 *   post:
 *     summary: Đăng nhập tài khoản công ty
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post('/companies/login', loginCompany);

router.post('/companies/logout', protectCompany, logoutCompany);
// Admin auth route
/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Đăng nhập tài khoản admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post('/admin/login', loginAdmin);

/**
 * @swagger
 * /api/auth/admin/logout:
 *   post:
 *     summary: Đăng xuất tài khoản admin
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
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
 *                   example: "Logged out successfully"
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/admin/logout', adminMiddleware, logoutAdmin);

export default router;
// import express from 'express';
// import { loginUser, registerUser } from '../controllers/userController.js'; // Sửa đường dẫn đúng
// import {
//     loginCompany,
//     registerCompany
// } from '../controllers/companyController.js';
// import { loginAdmin, logoutAdmin } from '../controllers/adminController.js';
// import { adminMiddleware, protectUser } from '../middlewares/authMiddleware.js';
// import {
//     getUserApplications,
//     applyForJob,
//     getUserProfile
// } from '../controllers/userController.js';

// const router = express.Router();

// // User auth routes
// router.post('/users/register', registerUser);
// router.post('/users/login', loginUser); // Endpoint cần test
// router.get('/users/profile', protectUser, getUserProfile);
// router.get('/users/applications', protectUser, getUserApplications);
// router.post('/users/apply', protectUser, applyForJob);

// // Company auth routes
// router.post('/companies/register', registerCompany);
// router.post('/companies/login', loginCompany);

// // Admin auth route
// router.post('/admin/login', loginAdmin);
// router.post('/admin/logout', adminMiddleware, logoutAdmin);
// export default router;
// // import express from 'express';
// // import {
// //     registerUser,
// //     loginUser,
// //     registerCompany,
// //     loginCompany,
// //     loginAdmin,
// //     getUserProfile,
// // } from '../controllers/authController.js';
// // import {
// //     getUserApplications,
// //     applyForJob
// // } from '../controllers/userController.js';
// // import { protectUser } from '../middlewares/authMiddleware.js';
// // const router = express.Router();

// // // User auth routes
// // router.post('/users/register', registerUser);
// // router.post('/users/login', loginUser);
// // router.get('/users/profile', protectUser, getUserProfile);
// // router.get('/users/applications', protectUser, getUserApplications);
// // router.post('/users/apply', protectUser, applyForJob);

// // // Company auth routes
// // router.post('/companies/register', registerCompany);
// // router.post('/companies/login', loginCompany);

// // // Admin auth route
// // router.post('/admin/login', loginAdmin);

// // export default router;

// // // server/routes/authRoutes.js
// // import express from 'express';
// // import { loginAdmin } from '../controllers/adminController.js'; // Import loginAdmin
// // // Bạn cũng có thể import loginCompany từ companyController và thêm route vào đây nếu muốn gộp chung

// // const router = express.Router();

// // // Route đăng nhập cho Admin
// // router.post('/admin/login', loginAdmin);

// // // Route đăng nhập cho Company (ví dụ nếu bạn muốn chuyển từ companyRoutes sang đây)
// // // import { loginCompany } from '../controllers/companyController.js';
// // // router.post('/company/login', loginCompany);

// // export default router;