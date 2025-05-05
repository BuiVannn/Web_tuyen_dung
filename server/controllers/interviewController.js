import Interview from '../models/Interview.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import mongoose from 'mongoose';
import { sendInterviewEmail } from '../utils/emailService.js';

// Lấy danh sách phỏng vấn cho company
export const getCompanyInterviews = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter parameters
        const filter = { companyId };

        // Filter by date range
        if (req.query.startDate) {
            filter.scheduledDate = { ...filter.scheduledDate, $gte: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            const endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999); // Set to end of day
            filter.scheduledDate = { ...filter.scheduledDate, $lte: endDate };
        }

        // Filter by status
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        // Filter by job
        if (req.query.jobId) {
            filter.jobId = new mongoose.Types.ObjectId(req.query.jobId);
        }

        // Search by candidate name (need to handle in aggregation)
        let interviews;
        let total;

        if (req.query.keyword) {
            // Using aggregation to search through populated fields
            const aggregationPipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'jobId',
                        foreignField: '_id',
                        as: 'jobDetails'
                    }
                },
                {
                    $match: {
                        companyId: new mongoose.Types.ObjectId(companyId),
                        $or: [
                            { 'userDetails.name': { $regex: req.query.keyword, $options: 'i' } },
                            { 'jobDetails.title': { $regex: req.query.keyword, $options: 'i' } }
                        ]
                    }
                }
            ];

            // Apply other filters to the aggregation pipeline
            if (filter.scheduledDate) {
                aggregationPipeline[2].$match.scheduledDate = filter.scheduledDate;
            }
            if (filter.status) {
                aggregationPipeline[2].$match.status = filter.status;
            }
            if (filter.jobId) {
                aggregationPipeline[2].$match.jobId = filter.jobId;
            }

            // Count total for pagination
            const countPipeline = [...aggregationPipeline, { $count: 'total' }];
            const countResult = await Interview.aggregate(countPipeline);
            total = countResult.length > 0 ? countResult[0].total : 0;

            // Get paginated results
            const resultPipeline = [
                ...aggregationPipeline,
                { $sort: { scheduledDate: 1, startTime: 1 } },
                { $skip: skip },
                { $limit: limit }
            ];

            interviews = await Interview.aggregate(resultPipeline);

            // Populate references after aggregation
            interviews = await Interview.populate(interviews, [
                { path: 'userId', select: 'name email image' },
                { path: 'jobId', select: 'title' },
                { path: 'applicationId', select: 'status' }
            ]);
        } else {
            // Standard query without keyword search
            // Get total count
            total = await Interview.countDocuments(filter);

            // Build sort options
            const sortField = req.query.sortBy || 'scheduledDate';
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            // If sorting by scheduledDate, add secondary sort by startTime
            if (sortField === 'scheduledDate') {
                sortOptions.startTime = sortOrder;
            }

            // Get paginated interviews
            interviews = await Interview.find(filter)
                .populate('userId', 'name email image')
                .populate('jobId', 'title')
                .populate('applicationId', 'status')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean();
        }

        res.json({
            success: true,
            interviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            },
            filters: {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                status: req.query.status || 'all',
                jobId: req.query.jobId,
                keyword: req.query.keyword,
                sortBy: req.query.sortBy || 'scheduledDate',
                sortOrder: req.query.sortOrder || 'asc'
            }
        });
    } catch (error) {
        console.error('Error getting company interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews',
            error: error.message
        });
    }
};
export const getCompanyInterviews_0 = async (req, res) => {
    try {
        const companyId = req.company._id;

        const interviews = await Interview.find({ companyId })
            .populate('userId', 'name email image')
            .populate('jobId', 'title')
            .populate('applicationId', 'status')
            .sort({ scheduledDate: 1, startTime: 1 })
            .lean();

        res.json({
            success: true,
            interviews
        });
    } catch (error) {
        console.error('Error getting company interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews',
            error: error.message
        });
    }
};

// Lấy danh sách phỏng vấn cho user
export const getUserInterviews = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter parameters
        const filter = { userId };

        // Filter by date range
        if (req.query.startDate) {
            filter.scheduledDate = { ...filter.scheduledDate, $gte: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            const endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999); // Set to end of day
            filter.scheduledDate = { ...filter.scheduledDate, $lte: endDate };
        }

        // Filter by status
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        // Search by company name or job title (need to handle in aggregation)
        let interviews;
        let total;

        if (req.query.keyword) {
            // Using aggregation to search through populated fields
            const aggregationPipeline = [
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'companyDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'jobId',
                        foreignField: '_id',
                        as: 'jobDetails'
                    }
                },
                {
                    $match: {
                        $or: [
                            { 'companyDetails.name': { $regex: req.query.keyword, $options: 'i' } },
                            { 'jobDetails.title': { $regex: req.query.keyword, $options: 'i' } }
                        ]
                    }
                }
            ];

            // Apply other filters to the aggregation pipeline
            if (filter.scheduledDate) {
                aggregationPipeline[3].$match = {
                    ...aggregationPipeline[3].$match,
                    scheduledDate: filter.scheduledDate
                };
            }
            if (filter.status) {
                aggregationPipeline[3].$match = {
                    ...aggregationPipeline[3].$match,
                    status: filter.status
                };
            }

            // Count total for pagination
            const countPipeline = [...aggregationPipeline, { $count: 'total' }];
            const countResult = await Interview.aggregate(countPipeline);
            total = countResult.length > 0 ? countResult[0].total : 0;

            // Get paginated results
            const resultPipeline = [
                ...aggregationPipeline,
                { $sort: { scheduledDate: 1, startTime: 1 } },
                { $skip: skip },
                { $limit: limit }
            ];

            interviews = await Interview.aggregate(resultPipeline);

            // Populate references after aggregation
            interviews = await Interview.populate(interviews, [
                { path: 'companyId', select: 'name email image' },
                { path: 'jobId', select: 'title' },
                { path: 'applicationId', select: 'status' }
            ]);
        } else {
            // Standard query without keyword search
            // Get total count
            total = await Interview.countDocuments(filter);

            // Build sort options
            const sortField = req.query.sortBy || 'scheduledDate';
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            // If sorting by scheduledDate, add secondary sort by startTime
            if (sortField === 'scheduledDate') {
                sortOptions.startTime = sortOrder;
            }

            // Get paginated interviews
            interviews = await Interview.find(filter)
                .populate('companyId', 'name email image')
                .populate('jobId', 'title')
                .populate('applicationId', 'status')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean();
        }

        res.json({
            success: true,
            interviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            },
            filters: {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                status: req.query.status || 'all',
                keyword: req.query.keyword,
                sortBy: req.query.sortBy || 'scheduledDate',
                sortOrder: req.query.sortOrder || 'asc'
            }
        });
    } catch (error) {
        console.error('Error getting user interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews',
            error: error.message
        });
    }
};
export const getUserInterviews_0 = async (req, res) => {
    try {
        const userId = req.user._id;

        const interviews = await Interview.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title')
            .sort({ scheduledDate: 1, startTime: 1 })
            .lean();

        res.json({
            success: true,
            interviews
        });
    } catch (error) {
        console.error('Error getting user interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews',
            error: error.message
        });
    }
};

// Lên lịch phỏng vấn mới (dành cho company)
export const scheduleInterview = async (req, res) => {
    try {
        const companyId = req.company._id;
        const {
            applicationId,
            jobId,
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink,
            meetingAddress,
            interviewType,
            notes
        } = req.body;

        // Kiểm tra đơn ứng tuyển tồn tại
        const application = await JobApplication.findById(applicationId)
            .populate('jobId')
            .populate('userId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Kiểm tra xem application có thuộc company này không
        if (application.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to schedule interview for this application'
            });
        }
        const actualJobId = jobId || (application.jobId ? application.jobId._id : null);

        if (!actualJobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required but not provided'
            });
        }

        // Tạo interview mới
        const interview = await Interview.create({
            jobId: application.jobId._id,
            companyId,
            userId: application.userId._id,
            applicationId,
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink: location === 'online' ? meetingLink : undefined,
            meetingAddress: location === 'onsite' ? meetingAddress : undefined,
            interviewType,
            notes
        });

        // Cập nhật trạng thái đơn ứng tuyển sang 'interviewing'
        await JobApplication.findByIdAndUpdate(applicationId, {
            status: 'interviewing'
        });

        // Gửi thông báo cho ứng viên


        res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            interview
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling interview',
            error: error.message
        });
    }
};

// Tìm hàm rescheduleInterview và sửa đổi như sau
export const rescheduleInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const companyId = req.company._id;
        const {
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink,
            meetingAddress,
            notes
        } = req.body;

        // Kiểm tra xem interview có tồn tại không
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cuộc phỏng vấn'
            });
        }

        // Kiểm tra quyền sở hữu
        if (interview.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền lên lịch lại cuộc phỏng vấn này'
            });
        }

        // Kiểm tra trạng thái
        if (interview.status === 'cancelled' || interview.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Không thể lên lịch lại cuộc phỏng vấn đã hủy hoặc đã hoàn thành'
            });
        }

        // Cập nhật thông tin phỏng vấn
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            {
                scheduledDate,
                startTime,
                endTime,
                location,
                meetingLink: location === 'online' ? meetingLink : undefined,
                meetingAddress: location === 'onsite' ? meetingAddress : undefined,
                notes,
                status: 'rescheduled',
                userConfirmed: false // Reset trạng thái xác nhận của người dùng
            },
            { new: true }
        );
        res.json({
            success: true,
            message: 'Đã lên lịch lại phỏng vấn thành công',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error rescheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lên lịch lại phỏng vấn',
            error: error.message
        });
    }
};
export const scheduleInterview_suadethemthongbao = async (req, res) => {
    try {
        const companyId = req.company._id;
        const {
            applicationId,
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink,
            meetingAddress,
            interviewType,
            notes
        } = req.body;

        // Kiểm tra đơn ứng tuyển tồn tại
        const application = await JobApplication.findById(applicationId)
            .populate('jobId')
            .populate('userId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Kiểm tra xem application có thuộc company này không
        if (application.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to schedule interview for this application'
            });
        }

        // Tạo interview mới
        const interview = await Interview.create({
            jobId: application.jobId._id,
            companyId,
            userId: application.userId._id,
            applicationId,
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink: location === 'online' ? meetingLink : undefined,
            meetingAddress: location === 'onsite' ? meetingAddress : undefined,
            interviewType,
            notes
        });

        // Cập nhật trạng thái đơn ứng tuyển sang 'interviewing'
        await JobApplication.findByIdAndUpdate(applicationId, {
            status: 'interviewing'
        });

        // Gửi email thông báo (giả định có hàm sendInterviewEmail)
        // Trong dự án thực tế, bạn cần triển khai hàm này
        // sendInterviewEmail(application.userId.email, interview);

        res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            interview
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling interview',
            error: error.message
        });
    }
};

// Cập nhật lịch phỏng vấn (dành cho company)
export const updateInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const companyId = req.company._id;
        const updateData = req.body;

        // Kiểm tra interview tồn tại và thuộc company
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        if (interview.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this interview'
            });
        }

        // Cập nhật interview
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            { ...updateData, status: 'rescheduled' },
            { new: true }
        );

        // Gửi email thông báo cập nhật
        // Trong dự án thực tế, bạn cần triển khai hàm này
        // const user = await User.findById(interview.userId);
        // sendInterviewUpdateEmail(user.email, updatedInterview);

        res.json({
            success: true,
            message: 'Interview updated successfully',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating interview',
            error: error.message
        });
    }
};

// Hủy lịch phỏng vấn (dành cho company)
export const cancelInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const companyId = req.company._id;

        // Kiểm tra interview tồn tại và thuộc company
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        if (interview.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this interview'
            });
        }

        // Cập nhật trạng thái interview
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            { status: 'cancelled' },
            { new: true }
        );

        // Gửi email thông báo hủy
        // Trong dự án thực tế, bạn cần triển khai hàm này
        // const user = await User.findById(interview.userId);
        // sendInterviewCancellationEmail(user.email, updatedInterview);

        res.json({
            success: true,
            message: 'Interview cancelled successfully',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error cancelling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling interview',
            error: error.message
        });
    }
};

// Xác nhận lịch phỏng vấn (dành cho user)
export const confirmInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user._id;

        // Kiểm tra interview tồn tại và thuộc user
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to confirm this interview'
            });
        }

        // Cập nhật trạng thái interview
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            {
                status: 'confirmed',
                userConfirmed: true
            },
            { new: true }
        );

        // Gửi email thông báo xác nhận cho company
        // Trong dự án thực tế, bạn cần triển khai hàm này
        // const company = await Company.findById(interview.companyId);
        // sendInterviewConfirmationEmail(company.email, updatedInterview);

        res.json({
            success: true,
            message: 'Interview confirmed successfully',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error confirming interview:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming interview',
            error: error.message
        });
    }
};

// Lấy chi tiết lịch phỏng vấn
export const getInterviewDetail = async (req, res) => {
    try {
        const { interviewId } = req.params;

        // Kiểm tra xem người yêu cầu là company hay user
        const isCompany = !!req.company;
        const isUser = !!req.user;

        if (!isCompany && !isUser) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const interview = await Interview.findById(interviewId)
            .populate('companyId', 'name email image')
            .populate('userId', 'name email image')
            .populate('jobId', 'title')
            .populate('applicationId');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Kiểm tra quyền truy cập
        if (isCompany && interview.companyId._id.toString() !== req.company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this interview'
            });
        }

        if (isUser && interview.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this interview'
            });
        }

        res.json({
            success: true,
            interview
        });
    } catch (error) {
        console.error('Error getting interview detail:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview detail',
            error: error.message
        });
    }
};

// Thêm feedback sau phỏng vấn (dành cho cả company và user)
export const addInterviewFeedback = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { feedback } = req.body;

        // Kiểm tra xem người yêu cầu là company hay user
        const isCompany = !!req.company;
        const isUser = !!req.user;

        if (!isCompany && !isUser) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Kiểm tra quyền truy cập
        if (isCompany && interview.companyId.toString() !== req.company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add feedback to this interview'
            });
        }

        if (isUser && interview.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add feedback to this interview'
            });
        }

        // Cập nhật feedback tùy theo người gửi
        const updateData = isCompany
            ? { companyFeedback: feedback }
            : { userFeedback: feedback };

        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: 'Feedback added successfully',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error adding interview feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding feedback',
            error: error.message
        });
    }
};

// Đánh dấu phỏng vấn đã hoàn thành (dành cho company)
export const markInterviewCompleted = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const companyId = req.company._id;

        // Kiểm tra interview tồn tại và thuộc company
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        if (interview.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this interview'
            });
        }
        if (interview.status === 'cancelled' || interview.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Không thể cập nhật trạng thái cho cuộc phỏng vấn đã hủy hoặc đã hoàn thành'
            });
        }
        // Kiểm tra xem người dùng đã xác nhận chưa
        if (!interview.userConfirmed) {
            return res.status(400).json({
                success: false,
                message: 'Ứng viên chưa xác nhận tham gia phỏng vấn'
            });
        }
        // Kiểm tra thời gian hiện tại so với thời gian phỏng vấn
        const now = new Date();
        const interviewDate = new Date(interview.scheduledDate);

        // Tách giờ và phút từ endTime (định dạng "HH:MM")
        const [endHours, endMinutes] = interview.endTime.split(':').map(Number);

        // Đặt giờ kết thúc vào ngày phỏng vấn
        interviewDate.setHours(endHours, endMinutes, 0, 0);

        // Kiểm tra xem thời gian hiện tại có sau thời gian kết thúc không
        if (now < interviewDate) {
            return res.status(400).json({
                success: false,
                message: 'Chưa thể hoàn thành cuộc phỏng vấn vì chưa đến giờ kết thúc'
            });
        }


        // Cập nhật trạng thái interview
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            { status: 'completed' },
            { new: true }
        );


        res.json({
            success: true,
            message: 'Interview marked as completed',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error marking interview as completed:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating interview status',
            error: error.message
        });
    }
};

// Thêm hàm mới để lên lịch lại phỏng vấn
export const rescheduleInterview_suadethemthongbao = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const companyId = req.company._id;
        const {
            scheduledDate,
            startTime,
            endTime,
            location,
            meetingLink,
            meetingAddress,
            notes
        } = req.body;

        // Kiểm tra xem interview có tồn tại không
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cuộc phỏng vấn'
            });
        }

        // Kiểm tra quyền sở hữu
        if (interview.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền lên lịch lại cuộc phỏng vấn này'
            });
        }

        // Kiểm tra trạng thái
        if (interview.status === 'cancelled' || interview.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Không thể lên lịch lại cuộc phỏng vấn đã hủy hoặc đã hoàn thành'
            });
        }

        // Cập nhật thông tin phỏng vấn
        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            {
                scheduledDate,
                startTime,
                endTime,
                location,
                meetingLink: location === 'online' ? meetingLink : undefined,
                meetingAddress: location === 'onsite' ? meetingAddress : undefined,
                notes,
                status: 'rescheduled',
                userConfirmed: false // Reset trạng thái xác nhận của người dùng
            },
            { new: true }
        );

        // Gửi email thông báo cho ứng viên (nếu có)
        // if (typeof sendRescheduledInterviewEmail === 'function') {
        //     try {
        //         await sendRescheduledInterviewEmail(updatedInterview);
        //     } catch (emailError) {
        //         console.error('Failed to send reschedule email:', emailError);
        //     }
        // }

        res.json({
            success: true,
            message: 'Đã lên lịch lại phỏng vấn thành công',
            interview: updatedInterview
        });
    } catch (error) {
        console.error('Error rescheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lên lịch lại phỏng vấn',
            error: error.message
        });
    }
};