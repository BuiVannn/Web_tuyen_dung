import express from 'express';
import {
    getCompanyInterviews,
    getUserInterviews,
    scheduleInterview,
    updateInterview,
    cancelInterview,
    confirmInterview,
    getInterviewDetail,
    addInterviewFeedback,
    markInterviewCompleted,
    rescheduleInterview
} from '../controllers/interviewController.js';
import { protectCompany, protectUser } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Interview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của cuộc phỏng vấn
 *         jobId:
 *           type: string
 *           description: ID của công việc được phỏng vấn
 *         companyId:
 *           type: string
 *           description: ID của công ty
 *         userId:
 *           type: string
 *           description: ID của ứng viên
 *         applicationId:
 *           type: string
 *           description: ID của đơn ứng tuyển
 *         scheduledDate:
 *           type: string
 *           format: date
 *           description: Ngày phỏng vấn
 *         startTime:
 *           type: string
 *           description: Thời gian bắt đầu (định dạng HH:MM)
 *         endTime:
 *           type: string
 *           description: Thời gian kết thúc (định dạng HH:MM)
 *         location:
 *           type: string
 *           enum: [online, onsite, phone]
 *           description: Địa điểm phỏng vấn
 *         meetingLink:
 *           type: string
 *           description: Link cuộc họp (khi location là online)
 *         meetingAddress:
 *           type: string
 *           description: Địa chỉ phỏng vấn (khi location là onsite)
 *         interviewType:
 *           type: string
 *           enum: [technical, hr, culture, screening, final]
 *           description: Loại phỏng vấn
 *         notes:
 *           type: string
 *           description: Ghi chú về cuộc phỏng vấn
 *         status:
 *           type: string
 *           enum: [scheduled, confirmed, completed, cancelled, rescheduled]
 *           description: Trạng thái của cuộc phỏng vấn
 *         userConfirmed:
 *           type: boolean
 *           description: Ứng viên đã xác nhận tham gia hay chưa
 *         companyFeedback:
 *           type: string
 *           description: Phản hồi từ công ty sau phỏng vấn
 *         userFeedback:
 *           type: string
 *           description: Phản hồi từ ứng viên sau phỏng vấn
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo cuộc phỏng vấn
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *   
 * tags:
 *   - name: Interviews
 *     description: Quản lý phỏng vấn
 */

const router = express.Router();

// Company routes
/**
 * @swagger
 * /api/interviews/company:
 *   get:
 *     summary: Lấy danh sách phỏng vấn của công ty
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phỏng vấn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 interviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/company', protectCompany, getCompanyInterviews);

/**
 * @swagger
 * /api/interviews/schedule:
 *   post:
 *     summary: Tạo lịch phỏng vấn mới
 *     tags: [Interviews]
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
 *               - scheduledDate
 *               - startTime
 *               - endTime
 *               - location
 *               - interviewType
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID của đơn ứng tuyển
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *                 description: Ngày phỏng vấn
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *                 description: Thời gian bắt đầu
 *               endTime:
 *                 type: string
 *                 example: "10:00"
 *                 description: Thời gian kết thúc
 *               location:
 *                 type: string
 *                 enum: [online, onsite, phone]
 *                 description: Địa điểm phỏng vấn
 *               meetingLink:
 *                 type: string
 *                 description: Link họp (yêu cầu khi location là online)
 *               meetingAddress:
 *                 type: string
 *                 description: Địa chỉ phỏng vấn (yêu cầu khi location là onsite)
 *               interviewType:
 *                 type: string
 *                 enum: [technical, hr, culture, screening, final]
 *                 description: Loại phỏng vấn
 *               notes:
 *                 type: string
 *                 description: Ghi chú về cuộc phỏng vấn
 *     responses:
 *       201:
 *         description: Lịch phỏng vấn đã được tạo
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
 *                   example: "Interview scheduled successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền tạo phỏng vấn cho đơn ứng tuyển này
 *       404:
 *         description: Không tìm thấy đơn ứng tuyển
 *       500:
 *         description: Lỗi server
 */
router.post('/schedule', protectCompany, scheduleInterview);

/**
 * @swagger
 * /api/interviews/{interviewId}:
 *   put:
 *     summary: Cập nhật thông tin cuộc phỏng vấn
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               location:
 *                 type: string
 *                 enum: [online, onsite, phone]
 *               meetingLink:
 *                 type: string
 *               meetingAddress:
 *                 type: string
 *               interviewType:
 *                 type: string
 *                 enum: [technical, hr, culture, screening, final]
 *               notes:
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
 *                   example: "Interview updated successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền cập nhật phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.put('/:interviewId', protectCompany, updateInterview);

/**
 * @swagger
 * /api/interviews/{interviewId}/cancel:
 *   put:
 *     summary: Hủy cuộc phỏng vấn
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     responses:
 *       200:
 *         description: Hủy thành công
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
 *                   example: "Interview cancelled successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền hủy phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.put('/:interviewId/cancel', protectCompany, cancelInterview);

/**
 * @swagger
 * /api/interviews/{interviewId}/complete:
 *   put:
 *     summary: Đánh dấu phỏng vấn đã hoàn thành
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyFeedback:
 *                 type: string
 *                 description: Phản hồi của công ty sau phỏng vấn
 *     responses:
 *       200:
 *         description: Đánh dấu hoàn thành thành công
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
 *                   example: "Interview marked as completed"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thực hiện hành động này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.put('/:interviewId/complete', protectCompany, markInterviewCompleted);

/**
 * @swagger
 * /api/interviews/{interviewId}/reschedule:
 *   put:
 *     summary: Lên lịch lại phỏng vấn
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledDate
 *               - startTime
 *               - endTime
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 example: "15:00"
 *               location:
 *                 type: string
 *                 enum: [online, onsite, phone]
 *               meetingLink:
 *                 type: string
 *               meetingAddress:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lên lịch lại thành công
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
 *                   example: "Interview rescheduled successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền lên lịch lại phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.put('/:interviewId/reschedule', protectCompany, rescheduleInterview);

/**
 * @swagger
 * /api/interviews/company/{interviewId}:
 *   get:
 *     summary: Lấy chi tiết phỏng vấn (cho công ty)
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     responses:
 *       200:
 *         description: Chi tiết phỏng vấn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền xem phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.get('/company/:interviewId', protectCompany, getInterviewDetail);

/**
 * @swagger
 * /api/interviews/company/{interviewId}/feedback:
 *   post:
 *     summary: Thêm phản hồi từ công ty sau phỏng vấn
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedback
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: Nội dung phản hồi
 *     responses:
 *       200:
 *         description: Thêm phản hồi thành công
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
 *                   example: "Feedback added successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thêm phản hồi cho phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.post('/company/:interviewId/feedback', protectCompany, addInterviewFeedback);

// User routes
/**
 * @swagger
 * /api/interviews/user:
 *   get:
 *     summary: Lấy danh sách phỏng vấn của ứng viên
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phỏng vấn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 interviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/user', protectUser, getUserInterviews);

/**
 * @swagger
 * /api/interviews/{interviewId}/confirm:
 *   put:
 *     summary: Xác nhận tham gia phỏng vấn (cho ứng viên)
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     responses:
 *       200:
 *         description: Xác nhận thành công
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
 *                   example: "Interview confirmed successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền xác nhận phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.put('/:interviewId/confirm', protectUser, confirmInterview);

/**
 * @swagger
 * /api/interviews/user/{interviewId}:
 *   get:
 *     summary: Lấy chi tiết phỏng vấn (cho ứng viên)
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     responses:
 *       200:
 *         description: Chi tiết phỏng vấn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền xem phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.get('/user/:interviewId', protectUser, getInterviewDetail);

/**
 * @swagger
 * /api/interviews/user/{interviewId}/feedback:
 *   post:
 *     summary: Thêm phản hồi từ ứng viên sau phỏng vấn
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc phỏng vấn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedback
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: Nội dung phản hồi
 *     responses:
 *       200:
 *         description: Thêm phản hồi thành công
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
 *                   example: "Feedback added successfully"
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thêm phản hồi cho phỏng vấn này
 *       404:
 *         description: Không tìm thấy phỏng vấn
 *       500:
 *         description: Lỗi server
 */
router.post('/user/:interviewId/feedback', protectUser, addInterviewFeedback);

export default router;

// import express from 'express';
// import {
//     getCompanyInterviews,
//     getUserInterviews,
//     scheduleInterview,
//     updateInterview,
//     cancelInterview,
//     confirmInterview,
//     getInterviewDetail,
//     addInterviewFeedback,
//     markInterviewCompleted,
//     rescheduleInterview
// } from '../controllers/interviewController.js';
// import { protectCompany, protectUser } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Company routes
// /**
//  * @swagger
//  * /api/interviews/company:
//  *   get:
//  *     summary: Lấy danh sách phỏng vấn của công ty
//  *     tags: [Interviews]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Danh sách phỏng vấn
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 interviews:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  */
// router.get('/company', protectCompany, getCompanyInterviews);
// router.post('/schedule', protectCompany, scheduleInterview);
// router.put('/:interviewId', protectCompany, updateInterview);
// router.put('/:interviewId/cancel', protectCompany, cancelInterview);
// router.put('/:interviewId/complete', protectCompany, markInterviewCompleted);
// // Thêm route mới cho reschedule
// router.put('/:interviewId/reschedule', protectCompany, rescheduleInterview);
// router.get('/company/:interviewId', protectCompany, getInterviewDetail);
// router.post('/company/:interviewId/feedback', protectCompany, addInterviewFeedback);

// // User routes
// router.get('/user', protectUser, getUserInterviews);
// router.put('/:interviewId/confirm', protectUser, confirmInterview);
// router.get('/user/:interviewId', protectUser, getInterviewDetail);
// router.post('/user/:interviewId/feedback', protectUser, addInterviewFeedback);

// export default router;