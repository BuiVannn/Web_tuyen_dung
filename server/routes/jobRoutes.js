import express from 'express';
import { getJobById, getJobs, approveJob } from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * components:
 *   schemas:
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
 *           type: object
 *           description: Thông tin công ty đăng tin
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
 *           description: Trạng thái hiển thị công việc
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *           description: Trạng thái công việc
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian đăng tin
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *         applicationCount:
 *           type: number
 *           description: Số lượng đơn ứng tuyển
 * 
 * tags:
 *   - name: Jobs
 *     description: Quản lý công việc
 */

const router = express.Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Lấy danh sách công việc
 *     description: Trả về danh sách công việc với các bộ lọc và phân trang
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tiêu đề hoặc kỹ năng
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Lọc theo địa điểm
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, remote]
 *         description: Lọc theo loại công việc
 *       - in: query
 *         name: expLevel
 *         schema:
 *           type: string
 *           enum: [entry, mid, senior, executive]
 *         description: Lọc theo mức độ kinh nghiệm
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *         description: Mức lương tối thiểu
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *         description: Mức lương tối đa
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Danh sách kỹ năng (phân cách bởi dấu phẩy)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest, salary-high-low, salary-low-high]
 *         description: Sắp xếp kết quả
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
 *                 totalJobs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Lỗi server
 */
router.get('/', getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một công việc
 *     description: Trả về thông tin chi tiết của công việc theo ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Thông tin chi tiết công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 similarJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /api/jobs/{id}/approve:
 *   patch:
 *     summary: Phê duyệt công việc
 *     description: Chỉ admin mới có quyền phê duyệt công việc
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Phê duyệt thành công
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
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không phải là admin
 *       404:
 *         description: Không tìm thấy công việc
 *       500:
 *         description: Lỗi server
 */
router.patch('/:id/approve', authMiddleware, adminMiddleware, approveJob);

// Add error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

export default router;
// import express from 'express';
// import { getJobById, getJobs, approveJob } from '../controllers/jobController.js';
// import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Public routes
// router.get('/', getJobs);
// router.get('/:id', getJobById);

// // Protected routes
// router.patch('/:id/approve', authMiddleware, adminMiddleware, approveJob);

// // Add error handling middleware
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// export default router;

// // import express from 'express'
// // import { getJobById, getJobs, approveJob } from '../controllers/jobController.js';
// // import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

// // const router = express.Router()

// // // Route to get all jobs data
// // router.get('/', getJobs)

// // // Route to get a single job by ID
// // router.get('/:id', getJobById)

// // // Route for admin to approve job
// // router.patch('/:id/approve', authMiddleware, adminMiddleware, approveJob);

// // export default router;