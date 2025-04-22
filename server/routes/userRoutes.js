import express from 'express';
import {
    getUserData, // Lấy data cơ bản
    getUserProfile, // Lấy profile chi tiết
    updateUserProfile, // Cập nhật profile
    updateResume, // Cập nhật resume
    updateAvatar, // Cập nhật avatar
    getUserApplications,
    applyForJob,
    getRecommendedJobs,
    getUserDashboardData
} from '../controllers/userController.js';
import { protectUser } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';
import Interview from '../models/Interview.js'; // Thêm import

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
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
 *           description: Email của người dùng
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại
 *         image:
 *           type: string
 *           description: URL ảnh đại diện
 *         resume:
 *           type: string
 *           description: URL file CV
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Các kỹ năng của người dùng
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               fieldOfStudy:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               current:
 *                 type: boolean
 *               description:
 *                 type: string
 *         bio:
 *           type: string
 *           description: Giới thiệu bản thân
 *         location:
 *           type: string
 *           description: Địa điểm hiện tại
 *         jobTitle:
 *           type: string
 *           description: Chức danh nghề nghiệp
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
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
 *     Interview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         jobId:
 *           type: object
 *         companyId:
 *           type: object
 *         scheduledDate:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         location:
 *           type: string
 *           enum: [online, onsite, phone]
 *         meetingLink:
 *           type: string
 *         meetingAddress:
 *           type: string
 *         interviewType:
 *           type: string
 *         status:
 *           type: string
 *           enum: [scheduled, confirmed, completed, cancelled, rescheduled]
 * 
 * tags:
 *   - name: User Profile
 *     description: Quản lý thông tin cá nhân của người dùng
 *   - name: User Applications
 *     description: Quản lý đơn ứng tuyển của người dùng
 *   - name: User Dashboard
 *     description: Dữ liệu tổng quan cho dashboard người dùng
 */

const router = express.Router();

// --- User Profile & Data Routes (Áp dụng middleware bảo vệ) ---
router.use(protectUser);

/**
 * @swagger
 * /api/users/data:
 *   get:
 *     summary: Lấy thông tin cơ bản của người dùng
 *     description: Trả về thông tin cơ bản như tên, email cho header
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin cơ bản người dùng
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/data', getUserData);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Lấy profile đầy đủ của người dùng
 *     description: Trả về tất cả thông tin profile bao gồm kinh nghiệm, học vấn, kỹ năng
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile đầy đủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy profile
 *       500:
 *         description: Lỗi server
 */
router.get('/profile', getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Cập nhật thông tin profile
 *     description: Cập nhật các thông tin cá nhân, kinh nghiệm, học vấn, kỹ năng
 *     tags: [User Profile]
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
 *               phoneNumber:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     fieldOfStudy:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     location:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     current:
 *                       type: boolean
 *                     description:
 *                       type: string
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
 *                   example: "Profile updated successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.put('/profile', updateUserProfile);

/**
 * @swagger
 * /api/users/update-resume:
 *   post:
 *     summary: Cập nhật CV (resume)
 *     description: Tải lên CV mới dưới dạng file PDF hoặc DOCX
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: File CV (PDF hoặc DOCX)
 *     responses:
 *       200:
 *         description: Cập nhật CV thành công
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
 *                   example: "Resume updated successfully"
 *                 resume:
 *                   type: string
 *                   example: "https://res.cloudinary.com/example/file1.pdf"
 *       400:
 *         description: File không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/update-resume', upload.single('resume'), updateResume);

/**
 * @swagger
 * /api/users/update-avatar:
 *   post:
 *     summary: Cập nhật ảnh đại diện
 *     description: Tải lên ảnh đại diện mới
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh đại diện
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công
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
 *                   example: "Avatar updated successfully"
 *                 image:
 *                   type: string
 *                   example: "https://res.cloudinary.com/example/avatar1.jpg"
 *       400:
 *         description: File không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/update-avatar', upload.single('avatar'), updateAvatar);

/**
 * @swagger
 * /api/users/recommended-jobs:
 *   get:
 *     summary: Lấy danh sách việc làm được gợi ý
 *     description: Trả về danh sách việc làm phù hợp với kỹ năng và kinh nghiệm của người dùng
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách việc làm được gợi ý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendedJobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       companyName:
 *                         type: string
 *                       location:
 *                         type: string
 *                       salary:
 *                         type: object
 *                       jobType:
 *                         type: string
 *                       matchScore:
 *                         type: number
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/recommended-jobs', getRecommendedJobs);

/**
 * @swagger
 * /api/users/applications:
 *   get:
 *     summary: Lấy danh sách đơn ứng tuyển
 *     description: Trả về tất cả đơn ứng tuyển của người dùng hiện tại
 *     tags: [User Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *         description: Lọc theo trạng thái đơn ứng tuyển
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
router.get('/applications', getUserApplications);

/**
 * @swagger
 * /api/users/apply:
 *   post:
 *     summary: Nộp đơn ứng tuyển
 *     description: Ứng tuyển vào một công việc
 *     tags: [User Applications]
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
 *                 description: ID của công việc
 *               coverLetter:
 *                 type: string
 *                 description: Thư xin việc
 *               resumeOption:
 *                 type: string
 *                 enum: [useProfile, uploadNew]
 *                 description: Sử dụng CV có sẵn hoặc tải lên mới
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
 *         description: Dữ liệu không hợp lệ hoặc đã ứng tuyển trước đó
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.post('/apply', applyForJob);

/**
 * @swagger
 * /api/users/upcoming-interviews:
 *   get:
 *     summary: Lấy danh sách phỏng vấn sắp tới
 *     description: Trả về các cuộc phỏng vấn được lên lịch trong tương lai
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phỏng vấn sắp tới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 upcomingInterviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/upcoming-interviews', async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();

        // Tìm các phỏng vấn trong tương lai và chưa bị hủy
        const interviews = await Interview.find({
            userId,
            scheduledDate: { $gte: today },
            status: { $ne: 'cancelled' }
        })
            .sort({ scheduledDate: 1 })
            .limit(3)
            .populate('companyId', 'name')
            .populate('jobId', 'title');

        res.json({
            success: true,
            upcomingInterviews: interviews
        });
    } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming interviews'
        });
    }
});

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Lấy dữ liệu tổng quan cho dashboard
 *     description: Trả về các số liệu thống kê và dữ liệu quan trọng cho dashboard người dùng
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: number
 *                     applicationsByStatus:
 *                       type: object
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *                     upcomingInterviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/dashboard', getUserDashboardData);

export default router;


// import express from 'express';
// import {
//     getUserData, // Lấy data cơ bản
//     getUserProfile, // Lấy profile chi tiết
//     updateUserProfile, // Cập nhật profile
//     updateResume, // Cập nhật resume
//     updateAvatar, // Cập nhật avatar
//     getUserApplications,
//     applyForJob,
//     getRecommendedJobs,
//     getUserDashboardData
// } from '../controllers/userController.js';
// import { protectUser } from '../middlewares/authMiddleware.js'; // Đảm bảo middleware đúng tên
// import upload from '../config/multer.js'; // Import multer config

// const router = express.Router();

// // --- Authentication Routes (Thường nằm riêng, ví dụ authRoutes.js) ---
// // POST /api/auth/register
// // POST /api/auth/login

// // --- User Profile & Data Routes (Áp dụng middleware bảo vệ) ---
// router.use(protectUser); // Áp dụng middleware cho tất cả các route bên dưới

// router.get('/data', getUserData); // Lấy name, email
// router.get('/profile', getUserProfile); // Lấy profile đầy đủ
// router.put('/profile', updateUserProfile); // Cập nhật profile (dùng PUT hoặc PATCH)
// router.post('/update-resume', upload.single('resume'), updateResume); // Upload resume
// router.post('/update-avatar', upload.single('avatar'), updateAvatar); // Upload avatar
// router.get('/recommended-jobs', getRecommendedJobs);
// // --- Job Application Routes ---
// router.get('/applications', getUserApplications); // Lấy các đơn đã nộp
// router.post('/apply', applyForJob); // Nộp đơn ứng tuyển

// // Thêm route mới để kiểm tra lịch phỏng vấn sắp tới
// router.get('/upcoming-interviews', async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const today = new Date();

//         // Tìm các phỏng vấn trong tương lai và chưa bị hủy
//         const interviews = await Interview.find({
//             userId,
//             scheduledDate: { $gte: today },
//             status: { $ne: 'cancelled' }
//         })
//             .sort({ scheduledDate: 1 })
//             .limit(3)
//             .populate('companyId', 'name')
//             .populate('jobId', 'title');

//         res.json({
//             success: true,
//             upcomingInterviews: interviews
//         });
//     } catch (error) {
//         console.error('Error fetching upcoming interviews:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching upcoming interviews'
//         });
//     }
// });
// router.get('/dashboard', getUserDashboardData);
// export default router;
