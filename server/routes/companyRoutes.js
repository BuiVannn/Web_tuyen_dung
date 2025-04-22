import express from 'express'
import {
    ChangeJobApplicationsStatus,
    changeVisiblity,
    getCompanyData,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    loginCompany,
    postJob,
    registerCompany,
    getAllApplications,
    getApplicantsForJob,
    updateApplicationStatusByCompany,
    toggleJobVisibility,
    // Thêm controllers mới
    updateCompanyProfile,
    uploadCompanyImage,
    getCompanyStats
} from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/authMiddleware.js'

/**
 * @swagger
 * components:
 *   schemas:
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
 *           description: Email công ty
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại liên hệ
 *         website:
 *           type: string
 *           description: Website công ty
 *         location:
 *           type: string
 *           description: Địa chỉ công ty
 *         industry:
 *           type: string
 *           description: Lĩnh vực hoạt động
 *         companySize:
 *           type: string
 *           description: Quy mô công ty
 *         foundedYear:
 *           type: number
 *           description: Năm thành lập
 *         description:
 *           type: string
 *           description: Mô tả công ty
 *         image:
 *           type: string
 *           description: URL logo công ty
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *     
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của công việc
 *         title:
 *           type: string
 *           description: Tiêu đề công việc
 *         companyId:
 *           type: string
 *           description: ID của công ty đăng tin
 *         description:
 *           type: string
 *           description: Mô tả công việc
 *         requirements:
 *           type: string
 *           description: Yêu cầu công việc
 *         responsibilities:
 *           type: string
 *           description: Trách nhiệm công việc
 *         location:
 *           type: string
 *           description: Địa điểm làm việc
 *         salary:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *             max:
 *               type: number
 *             currency:
 *               type: string
 *               default: VND
 *           description: Mức lương
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, remote]
 *           description: Loại công việc
 *         expLevel:
 *           type: string
 *           enum: [entry, mid, senior, executive]
 *           description: Mức độ kinh nghiệm
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Kỹ năng yêu cầu
 *         isVisible:
 *           type: boolean
 *           default: true
 *           description: Trạng thái hiển thị công việc
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *           default: pending
 *           description: Trạng thái công việc
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian đăng tin
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
 *           type: object
 *           description: Thông tin người dùng
 *         companyId:
 *           type: string
 *           description: ID của công ty
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
 *   - name: Company Auth
 *     description: Đăng ký và đăng nhập tài khoản công ty
 *   - name: Company Profile
 *     description: Quản lý thông tin công ty
 *   - name: Company Stats
 *     description: Thống kê và dữ liệu của công ty
 *   - name: Job Management
 *     description: Quản lý các công việc đăng tuyển
 *   - name: Application Management
 *     description: Quản lý đơn ứng tuyển
 */

const router = express.Router()

// Auth routes
/**
 * @swagger
 * /api/companies/register:
 *   post:
 *     summary: Đăng ký tài khoản công ty
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
 *                 description: Email công ty
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
router.post('/register', upload.single('image'), registerCompany)

/**
 * @swagger
 * /api/companies/login:
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
 *               password:
 *                 type: string
 *                 format: password
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
router.post('/login', loginCompany)

// Protected routes
/**
 * @swagger
 * /api/companies/company:
 *   get:
 *     summary: Lấy thông tin công ty hiện tại
 *     tags: [Company Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin công ty
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
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/company', protectCompany, getCompanyData)

/**
 * @swagger
 * /api/companies/profile:
 *   get:
 *     summary: Lấy thông tin profile công ty
 *     description: Alias cho /company
 *     tags: [Company Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin công ty
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
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/profile', protectCompany, getCompanyData) // Alias cho /company

/**
 * @swagger
 * /api/companies/profile:
 *   put:
 *     summary: Cập nhật thông tin profile công ty
 *     tags: [Company Profile]
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
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *               industry:
 *                 type: string
 *               companySize:
 *                 type: string
 *               foundedYear:
 *                 type: number
 *               description:
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
 *                   example: "Company profile updated successfully"
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.put('/profile', protectCompany, updateCompanyProfile) // Thêm route mới để cập nhật profile

/**
 * @swagger
 * /api/companies/upload-image:
 *   post:
 *     summary: Tải lên logo công ty mới
 *     tags: [Company Profile]
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
 *                 description: Logo công ty
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
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 image:
 *                   type: string
 *                   description: URL của logo mới
 *       400:
 *         description: File không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/upload-image', protectCompany, upload.single('image'), uploadCompanyImage) // Thêm route mới để upload image

/**
 * @swagger
 * /api/companies/stats:
 *   get:
 *     summary: Lấy thống kê của công ty
 *     tags: [Company Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê của công ty
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
 *                     totalJobs:
 *                       type: number
 *                     activeJobs:
 *                       type: number
 *                     totalApplications:
 *                       type: number
 *                     applicationsByStatus:
 *                       type: object
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/stats', protectCompany, getCompanyStats) // Thêm route mới để lấy stats

// Jobs routes
/**
 * @swagger
 * /api/companies/post-job:
 *   post:
 *     summary: Đăng tin tuyển dụng mới
 *     tags: [Job Management]
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
 *               - requirements
 *               - location
 *               - jobType
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề công việc
 *               description:
 *                 type: string
 *                 description: Mô tả công việc
 *               requirements:
 *                 type: string
 *                 description: Yêu cầu công việc
 *               responsibilities:
 *                 type: string
 *                 description: Trách nhiệm công việc
 *               location:
 *                 type: string
 *                 description: Địa điểm làm việc
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                     default: VND
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, remote]
 *               expLevel:
 *                 type: string
 *                 enum: [entry, mid, senior, executive]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Đăng tin thành công
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
 *                   example: "Job posted successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/post-job', protectCompany, postJob)

/**
 * @swagger
 * /api/companies/applicants:
 *   get:
 *     summary: Lấy danh sách tất cả ứng viên của công ty
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *         description: Lọc theo trạng thái đơn
 *     responses:
 *       200:
 *         description: Danh sách ứng viên
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
router.get('/applicants', protectCompany, getCompanyJobApplicants)

/**
 * @swagger
 * /api/companies/list-jobs:
 *   get:
 *     summary: Lấy danh sách công việc đã đăng
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Lọc theo trạng thái công việc
 *     responses:
 *       200:
 *         description: Danh sách công việc
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
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

/**
 * @swagger
 * /api/companies/change-status:
 *   post:
 *     summary: Thay đổi trạng thái đơn ứng tuyển
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - status
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID của đơn ứng tuyển
 *               status:
 *                 type: string
 *                 enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
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
 *                   example: "Application status updated successfully"
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn ứng tuyển
 *       500:
 *         description: Lỗi server
 */
router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)

/**
 * @swagger
 * /api/companies/change-visiblity:
 *   post:
 *     summary: Thay đổi trạng thái hiển thị công việc
 *     tags: [Job Management]
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
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái hiển thị thành công
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
 *                   example: "Job visibility updated successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.post('/change-visiblity', protectCompany, changeVisiblity)

// Job specific routes
/**
 * @swagger
 * /api/companies/jobs/{jobId}/applicants:
 *   get:
 *     summary: Lấy danh sách ứng viên cho một công việc cụ thể
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *         description: Lọc theo trạng thái đơn
 *     responses:
 *       200:
 *         description: Danh sách ứng viên
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
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.get('/jobs/:jobId/applicants', protectCompany, getApplicantsForJob)

/**
 * @swagger
 * /api/companies/jobs/{jobId}/visibility:
 *   patch:
 *     summary: Bật/tắt hiển thị công việc
 *     tags: [Job Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVisible:
 *                 type: boolean
 *                 description: Trạng thái hiển thị mới
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái hiển thị thành công
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
 *                   example: "Job visibility updated successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền cập nhật công việc này
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.patch('/jobs/:jobId/visibility', protectCompany, toggleJobVisibility)

/**
 * @swagger
 * /api/companies/applications/{applicationId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn ứng tuyển
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn ứng tuyển
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
 *                 enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *                 description: Trạng thái mới
 *               feedback:
 *                 type: string
 *                 description: Phản hồi từ nhà tuyển dụng
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
 *                   example: "Application status updated successfully"
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền cập nhật đơn ứng tuyển này
 *       404:
 *         description: Không tìm thấy đơn ứng tuyển
 *       500:
 *         description: Lỗi server
 */
router.patch('/applications/:applicationId/status', protectCompany, updateApplicationStatusByCompany)

/**
 * @swagger
 * /api/companies/all-applications:
 *   get:
 *     summary: Lấy tất cả đơn ứng tuyển
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, interviewing, accepted]
 *         description: Lọc theo trạng thái đơn
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
 *     responses:
 *       200:
 *         description: Danh sách tất cả đơn ứng tuyển
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
router.get('/all-applications', protectCompany, getAllApplications);

export default router
// import express from 'express'
// import {
//     ChangeJobApplicationsStatus,
//     changeVisiblity,
//     getCompanyData,
//     getCompanyJobApplicants,
//     getCompanyPostedJobs,
//     loginCompany,
//     postJob,
//     registerCompany,
//     getAllApplications,
//     getApplicantsForJob,
//     updateApplicationStatusByCompany,
//     toggleJobVisibility,
//     // Thêm controllers mới
//     updateCompanyProfile,
//     uploadCompanyImage,
//     getCompanyStats
// } from '../controllers/companyController.js'
// import upload from '../config/multer.js'
// import { protectCompany } from '../middlewares/authMiddleware.js'

// const router = express.Router()

// // Auth routes
// router.post('/register', upload.single('image'), registerCompany)
// router.post('/login', loginCompany)

// // Protected routes
// router.get('/company', protectCompany, getCompanyData)
// router.get('/profile', protectCompany, getCompanyData) // Alias cho /company
// router.put('/profile', protectCompany, updateCompanyProfile) // Thêm route mới để cập nhật profile
// router.post('/upload-image', protectCompany, upload.single('image'), uploadCompanyImage) // Thêm route mới để upload image
// router.get('/stats', protectCompany, getCompanyStats) // Thêm route mới để lấy stats

// // Jobs routes
// router.post('/post-job', protectCompany, postJob)
// router.get('/applicants', protectCompany, getCompanyJobApplicants)
// router.get('/list-jobs', protectCompany, getCompanyPostedJobs)
// router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)
// router.post('/change-visiblity', protectCompany, changeVisiblity)

// // Job specific routes
// router.get('/jobs/:jobId/applicants', protectCompany, getApplicantsForJob)
// router.patch('/jobs/:jobId/visibility', protectCompany, toggleJobVisibility)
// router.patch('/applications/:applicationId/status', protectCompany, updateApplicationStatusByCompany)
// router.get('/applicants', protectCompany, getAllApplications);

// export default router
// // import express from 'express'
// // import {
// //     ChangeJobApplicationsStatus,
// //     changeVisiblity,
// //     getCompanyData,
// //     getCompanyJobApplicants,
// //     getCompanyPostedJobs,
// //     loginCompany,
// //     postJob,
// //     registerCompany,
// //     getAllApplications,
// //     getApplicantsForJob,
// //     updateApplicationStatusByCompany,
// //     toggleJobVisibility,
// //     updateCompanyProfile,
// //     uploadCompanyImage,
// //     getCompanyStats
// // } from '../controllers/companyController.js'
// // import upload from '../config/multer.js'
// // import { protectCompany } from '../middlewares/authMiddleware.js'

// // const router = express.Router()

// // // Auth routes
// // router.post('/register', upload.single('image'), registerCompany)
// // router.post('/login', loginCompany)

// // // Protected routes
// // router.get('/company', protectCompany, getCompanyData)
// // router.post('/post-job', protectCompany, postJob)
// // router.get('/applicants', protectCompany, getCompanyJobApplicants)

// // // Jobs related routes
// // router.get('/list-jobs', protectCompany, getCompanyPostedJobs) // This replaces the /jobs route
// // //router.get('/list-jobs', protectCompany, getCompanyJobs);
// // router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)
// // router.post('/change-visiblity', protectCompany, changeVisiblity)

// // // Job specific routes
// // router.get('/jobs/:jobId/applicants', protectCompany, getApplicantsForJob)
// // router.patch('/jobs/:jobId/visibility', protectCompany, toggleJobVisibility)
// // router.patch('/applications/:applicationId/status', protectCompany, updateApplicationStatusByCompany)
// // //router.get('/jobs/:jobId/applicants', protectCompany, getJobApplicants);
// // router.get('/applicants', protectCompany, getAllApplications);

// // export default router

// // import express from 'express'
// // import {
// //     ChangeJobApplicationsStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany, getApplicantsForJob,
// //     updateApplicationStatusByCompany, toggleJobVisibility
// // } from '../controllers/companyController.js'
// // import upload from '../config/multer.js'
// // import { protectCompany } from '../middlewares/authMiddleware.js'
// // import { authMiddleware } from '../middlewares/authMiddleware.js';
// // const router = express.Router()

// // // register a company

// // router.post('/register', upload.single('image'), registerCompany)


// // // company login

// // router.post('/login', loginCompany)

// // router.get('/jobs', authMiddleware, getCompanyJobs); // Changed from list-jobs to jobs
// // router.patch('/jobs/:jobId/visibility', authMiddleware, toggleJobVisibility);


// // // get company data
// // router.get('/company', protectCompany, getCompanyData)

// // // post a job

// // router.post('/post-job', protectCompany, postJob)

// // // get applicants data of company
// // router.get('/applicants', protectCompany, getCompanyJobApplicants)

// // // get company job list
// // router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// // // change applicantions status

// // router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)

// // // change applications visiblity
// // router.post('/change-visiblity', protectCompany, changeVisiblity)

// // // Lấy ứng viên cho MỘT job cụ thể
// // router.get('/jobs/:jobId/applicants', protectCompany, getApplicantsForJob);

// // // Cập nhật trạng thái cho MỘT application cụ thể (Dùng PATCH)
// // router.patch('/applications/:applicationId/status', protectCompany, updateApplicationStatusByCompany);

// // //router.patch('/jobs/:jobId/visibility', protectCompany, toggleJobVisibility);
// // //router.patch('/jobs/:id/visibility', protectCompany, toggleJobVisibility);
// // export default router