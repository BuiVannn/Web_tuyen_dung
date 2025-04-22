// server/controllers/adminController.js
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import Admin from '../models/Admin.js'; // *** Import Model Admin ***
import jwt from 'jsonwebtoken'; // *** Import jsonwebtoken để tạo token ***
import Blog from '../models/Blog.js'; // <<< Import model Blog
import Resource from '../models/Resource.js';
import { v2 as cloudinary } from 'cloudinary'; // <<< Import Cloudinary v2
import UserProfile from '../models/UserProfile.js'; // ADD THIS IMPORT
import fs from 'fs';
import mongoose from 'mongoose'; // ADD THIS IMPORT
import AdminActivity from '../models/AdminActivity.js';
import {
    logAdminLogin,
    logAdminLogout,
    logProfileUpdate,
    logPasswordChange,
    logJobActivity,
    logUserActivity,
    logCompanyActivity,
    logBlogActivity
} from '../utils/activityLogger.js';
// --- Admin Authentication ---

export const loginAdmin_0 = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // Tìm admin bằng email (đã chuyển thành lowercase trong model)
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        // Kiểm tra admin tồn tại VÀ so sánh mật khẩu bằng phương thức matchPassword
        if (admin && (await admin.matchPassword(password))) {
            // Mật khẩu khớp -> Tạo Admin JWT
            if (!process.env.ADMIN_JWT_SECRET) {
                console.error('ADMIN_JWT_SECRET is not defined in .env file');
                return res.status(500).json({ success: false, message: 'Server configuration error' });
            }

            const token = jwt.sign(
                { id: admin._id }, // Payload chứa ID của admin
                process.env.ADMIN_JWT_SECRET, // Sử dụng secret key riêng của Admin
                { expiresIn: '1d' } // Token hết hạn sau 1 ngày (có thể tùy chỉnh)
            );

            res.json({
                success: true,
                message: 'Admin login successful',
                token: token, // Trả về token cho client
                admin: { // Trả về một số thông tin cơ bản (không bao gồm password)
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                }
            });
        } else {
            // Sai email hoặc mật khẩu
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error during admin login' });
    }
};
// 1 
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp email và mật khẩu'
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Tạo token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Cập nhật lastLogin
        admin.lastLogin = Date.now();
        await admin.save();

        // Ghi nhận hoạt động đăng nhập
        await logAdminLogin(admin._id, req);
        // Log
        console.log(`Admin logged in: ${admin.name} (${admin._id})`);

        res.json({
            success: true,
            token,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,

            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const logoutAdmin = async (req, res) => {
    console.log("Logout request received:", {
        adminId: req.admin?._id
    });

    try {
        if (!req.admin || !req.admin._id) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin admin'
            });
        }

        // Gọi logAdminLogout CHỈ MỘT LẦN
        const logResult = await logAdminLogout(req.admin._id, req);
        console.log(`Admin logged out: ${req.admin._id}, log result: ${logResult}`);

        res.json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        console.error('Admin logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
// 2
// --- Admin Profile Management ---
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin profile không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin admin",
            error: error.message
        });
    }
};
// 3
// Cập nhật thông tin profile của admin đang đăng nhập
export const updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name và email là bắt buộc"
            });
        }

        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin profile không tồn tại"
            });
        }

        // Cập nhật thông tin
        admin.name = name;
        admin.email = email;

        // Lưu thay đổi
        await admin.save();

        await logProfileUpdate(req.admin._id, req);

        res.status(200).json({
            success: true,
            message: "Cập nhật profile thành công",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật thông tin admin",
            error: error.message
        });
    }
};
// 4
// Cập nhật mật khẩu của admin đang đăng nhập
export const updateAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự"
            });
        }

        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin không tồn tại"
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await admin.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu hiện tại không đúng"
            });
        }

        // Cập nhật mật khẩu mới
        admin.password = newPassword;
        await admin.save();

        // Ghi nhận hoạt động đổi mật khẩu
        await logPasswordChange(req.admin._id, req);

        res.status(200).json({
            success: true,
            message: "Cập nhật mật khẩu thành công"
        });
    } catch (error) {
        console.error("Error updating admin password:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật mật khẩu",
            error: error.message
        });
    }
};
// 5
// --- Dashboard Stats ---
export const getAdminStats = async (req, res) => {
    try {
        const totalCandidates = await User.countDocuments();
        const activeUsers = await User.countDocuments({ active: true });

        const totalRecruiters = await Company.countDocuments();
        const verifiedCompanies = await Company.countDocuments({ verified: true });

        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });

        const totalApplications = await JobApplication.countDocuments();
        const pendingApplications = await JobApplication.countDocuments({ status: 'pending' });

        // Get jobs posted today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const jobsToday = await Job.countDocuments({ createdAt: { $gte: today } });

        // Get applications submitted today
        const applicationsToday = await JobApplication.countDocuments({ createdAt: { $gte: today } });

        return res.json({
            success: true,
            stats: {
                users: {
                    total: totalCandidates,
                    active: activeUsers
                },
                companies: {
                    total: totalRecruiters,
                    verified: verifiedCompanies
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    today: jobsToday
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    today: applicationsToday
                }
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê",
            error: error.message
        });
    }
};
// 6
// --- User Management ---
export const getAllUsers = async (req, res) => {
    try {
        // Implement pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        // Get total count for pagination info
        const total = await User.countDocuments();

        // Query with pagination
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách người dùng",
            error: error.message
        });
    }
};
// 7
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        const profile = await UserProfile.findOne({ userId: req.params.userId }).lean();
        // Get user's applications
        const applications = await JobApplication.find({ userId: req.params.userId })
            .populate('jobId', 'title companyId')
            .populate('companyId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            user,
            profile,
            applications
        });
    } catch (error) {
        console.error("Error fetching user details:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID người dùng không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin người dùng",
            error: error.message
        });
    }
};
// 8
export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user first to check if exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        // Delete related applications
        await JobApplication.deleteMany({ userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        // Log action
        console.log(`Admin ${req.admin.name} deleted user: ${user.name} (${userId})`);

        await logUserActivity(
            req.admin._id,
            `Xóa người dùng ${user.name} thành công`,
            userId,
            user.name,
            req
        );
        return res.json({
            success: true,
            message: "Xóa người dùng và ứng tuyển liên quan thành công"
        });
    } catch (error) {
        console.error("Error deleting user:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID người dùng không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa người dùng",
            error: error.message
        });
    }
};
// 9
// --- Company Management ---
export const getAllCompanies = async (req, res) => {
    try {
        // Implement pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        // Get total count for pagination info
        const total = await Company.countDocuments();

        // Query with pagination
        const companies = await Company.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            companies,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching all companies:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách công ty",
            error: error.message
        });
    }
};
// 10
export const getCompanyDetails = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                success: false,
                message: "ID công ty không hợp lệ"
            });
        }

        // Lấy thông tin công ty
        const company = await Company.findById(companyId)
            .select('-password')
            .lean();

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công ty"
            });
        }

        // Tính toán thống kê (giữ lại phần này nếu bạn vẫn cần hiển thị thống kê)
        const jobsCount = await Job.countDocuments({ companyId });
        const activeJobsCount = await Job.countDocuments({ companyId, status: 'active' });
        const pendingJobsCount = await Job.countDocuments({ companyId, status: 'pending' });
        const inactiveJobsCount = jobsCount - activeJobsCount - pendingJobsCount;
        const applicationsCount = await JobApplication.countDocuments({ companyId });

        return res.json({
            success: true,
            company,
            stats: {
                jobsCount,
                activeJobsCount,
                pendingJobsCount,
                inactiveJobsCount,
                applicationsCount
            }
            // Đã bỏ phần trả về jobs
        });
    } catch (error) {
        console.error("Error fetching company details:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin công ty",
            error: error.message
        });
    }
};
// 11
export const deleteCompanyById = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Find company first to check if exists
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công ty"
            });
        }

        // Get all jobs by this company
        const jobs = await Job.find({ companyId });

        // Extract job IDs
        const jobIds = jobs.map(job => job._id);

        // Delete all applications for these jobs
        await JobApplication.deleteMany({ jobId: { $in: jobIds } });

        // Delete all jobs
        await Job.deleteMany({ companyId });

        // Delete company
        await Company.findByIdAndDelete(companyId);

        // Log action
        console.log(`Admin ${req.admin.name} deleted company: ${company.name} (${companyId})`);

        await logCompanyActivity(
            req.admin._id,
            `Xóa công ty ${company.name} thành công`,
            companyId,
            company.name,
            req
        );
        return res.json({
            success: true,
            message: "Xóa công ty, việc làm và ứng tuyển liên quan thành công",
            deletedData: {
                company: 1,
                jobs: jobs.length,
                applications: 'all related'
            }
        });
    } catch (error) {
        console.error("Error deleting company:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID công ty không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa công ty",
            error: error.message
        });
    }
};
// 12
// --- Job Management ---
export const getAllJobs = async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // 'all', 'active', 'pending', etc.

        // Build the query
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count for pagination
        const total = await Job.countDocuments(query);

        // Calculate pagination
        const startIndex = (page - 1) * limit;

        // Fetch jobs with pagination and populate company info
        const jobs = await Job.find(query)
            .populate('companyId', 'name image')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            jobs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            },
            filters: {
                status: status || 'all'
            }
        });
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách việc làm",
            error: error.message
        });
    }
};
// 13
export const getJobDetails = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "ID công việc không hợp lệ"
            });
        }

        const job = await Job.findById(jobId)
            .populate('companyId', 'name email phone location image website description')
            .lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy việc làm"
            });
        }

        // Get job's applications
        const applications = await JobApplication.find({ jobId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            job,
            applications,
            stats: {
                applicationsCount: applications.length
            }
        });
    } catch (error) {
        console.error("Error fetching job details:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin việc làm",
            error: error.message
        });
    }
};
export const getJobDetails_0 = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId)
            .populate('companyId', 'name email phone location image website')
            .lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy việc làm"
            });
        }

        // Get job's applications
        const applications = await JobApplication.find({ jobId: req.params.jobId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            job,
            applications,
            stats: {
                applicationsCount: applications.length
            }
        });
    } catch (error) {
        console.error("Error fetching job details:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID việc làm không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin việc làm",
            error: error.message
        });
    }
};
// 14
export const deleteJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Find job first to check if exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy việc làm"
            });
        }

        // Delete related applications
        const deletedApplications = await JobApplication.deleteMany({ jobId });

        // Delete job
        await Job.findByIdAndDelete(jobId);

        // Log action
        console.log(`Admin ${req.admin.name} deleted job: ${job.title} (${jobId})`);

        await logJobActivity(
            req.admin._id,
            `Xóa việc làm ${job.title} thành công`,
            jobId,
            job.title,
            req
        );
        return res.json({
            success: true,
            message: "Xóa việc làm và ứng tuyển liên quan thành công",
            deletedData: {
                job: 1,
                applications: deletedApplications.deletedCount
            }
        });
    } catch (error) {
        console.error("Error deleting job:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID việc làm không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa việc làm",
            error: error.message
        });
    }
};
// 15
export const updateJobStatus = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const { status } = req.body;

        // Validate status           
        const allowedStatuses = ['active', 'inactive', 'pending', 'approved', 'rejected'];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Trạng thái không hợp lệ. Các trạng thái cho phép: ${allowedStatuses.join(', ')}`
            });
        }

        // Define update data
        const updateData = { status };

        // If status is inactive or rejected, also set visible to false
        if (status === 'inactive' || status === 'rejected') {
            updateData.visible = false;
        }

        // If status is approved or active, set visible to true (default)
        if (status === 'approved' || status === 'active') {
            updateData.visible = true;
        }
        if (status === 'approved') {
            updateData.status = 'active';
        } else {
            updateData.status = status;
        }

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            updateData,
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy việc làm"
            });
        }


        // Log action
        console.log(`Admin ${req.admin.name} updated job status: ${updatedJob.title} to ${status}`);

        await logJobActivity(
            req.admin._id,
            `Cập nhật trạng thái việc làm thành ${status}`,
            jobId,
            updatedJob.title,
            req
        );
        return res.json({
            success: true,
            message: `Cập nhật trạng thái việc làm thành công: ${status}`,
            job: updatedJob
        });
    } catch (error) {
        console.error("Error updating job status:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID việc làm không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật trạng thái việc làm",
            error: error.message
        });
    }
};
// 16
export const approveJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        console.log('Approving job:', jobId);

        const job = await Job.findByIdAndUpdate(
            jobId,
            {
                status: 'active',
                visible: true
            },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy việc làm'
            });
        }

        console.log('Job approved:', job);

        await logJobActivity(
            req.admin._id,
            `Phê duyệt việc làm thành công`,
            jobId,
            job.title,
            req
        );
        return res.status(200).json({
            success: true,
            message: 'Phê duyệt việc làm thành công',
            job
        });
    } catch (error) {
        console.error('Error approving job:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi phê duyệt việc làm',
            error: error.message
        });
    }
};
// 17
// --- Application Management ---
export const getAllApplications = async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // 'all', 'pending', 'accepted', 'rejected'

        // Build the query
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count for pagination
        const total = await JobApplication.countDocuments(query);

        // Calculate pagination
        const startIndex = (page - 1) * limit;

        // Fetch applications with pagination and populate necessary info
        const applications = await JobApplication.find(query)
            .populate('userId', 'name email')
            .populate('jobId', 'title')
            .populate('companyId', 'name')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            applications,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            },
            filters: {
                status: status || 'all'
            }
        });
    } catch (error) {
        console.error("Error fetching all applications:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách ứng tuyển",
            error: error.message
        });
    }
};
// 18
// --- Blog Management ---
export const createBlogPost = async (req, res) => {
    const { title, content, status, tags, category } = req.body;
    const authorId = req.admin._id;

    // Validate input
    if (!title || !content) {
        // Clean up uploaded file if any
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error deleting uploaded file after validation fail:", err);
            }
        }
        return res.status(400).json({
            success: false,
            message: 'Tiêu đề và nội dung là bắt buộc'
        });
    }

    try {
        let featuredImageUrl = '';
        let featuredImagePublicId = '';

        // Handle image upload if exists
        if (req.file) {
            try {
                featuredImageUrl = req.file.path;
                featuredImagePublicId = req.file.filename;
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi tải ảnh lên'
                });
            }
        }

        // Create new blog post
        const newPost = new Blog({
            title,
            content,
            status: status || 'draft',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category: category || '',
            author: authorId,
            featuredImage: featuredImageUrl,
            featuredImagePublicId: featuredImagePublicId
        });

        const createdPost = await newPost.save();

        // Log action
        console.log(`Admin ${req.admin.name} created blog post: ${title}`);

        await logBlogActivity(
            req.admin._id,
            `Tạo bài viết "${title}" thành công`,
            createdPost._id,
            title,
            req
        );
        return res.status(201).json({
            success: true,
            message: 'Tạo bài viết mới thành công',
            post: createdPost
        });
    } catch (error) {
        console.error("Error creating blog post:", error);

        // Clean up uploaded image if any
        if (req.file?.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error deleting uploaded file after DB save fail:", err);
            }
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề hoặc slug đã tồn tại'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo bài viết',
            error: error.message
        });
    }
};
// 19
export const getAllBlogPostsAdmin = async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // 'all', 'published', 'draft'

        // Build the query
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count for pagination
        const total = await Blog.countDocuments(query);

        // Calculate pagination
        const startIndex = (page - 1) * limit;

        // Fetch blogs with pagination
        const posts = await Blog.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            .select('title slug status author createdAt updatedAt category tags')
            .lean();

        return res.json({
            success: true,
            posts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            },
            filters: {
                status: status || 'all'
            }
        });
    } catch (error) {
        console.error("Error fetching all blog posts:", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách bài viết',
            error: error.message
        });
    }
};
// 20
export const getBlogPostByIdAdmin = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id)
            .populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        return res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Error fetching blog post by ID:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID bài viết không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy chi tiết bài viết',
            error: error.message
        });
    }
};
// 21
export const updateBlogPost = async (req, res) => {
    try {
        const { title, content, status, tags, category } = req.body;
        const postId = req.params.id;

        // Find the post
        const post = await Blog.findById(postId);

        if (!post) {
            // Clean up uploaded file if any
            if (req.file) {
                try {
                    await cloudinary.uploader.destroy(req.file.filename);
                } catch (err) {
                    console.error("Error deleting new file after post not found:", err);
                }
            }
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        // Save old image info for deletion if needed
        const oldImagePublicId = post.featuredImagePublicId;

        // Update fields
        post.title = title || post.title;
        post.content = content || post.content;
        post.status = status || post.status;
        post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
        post.category = category !== undefined ? category : post.category;

        // Handle new image if uploaded
        if (req.file) {
            try {
                // Get new image info
                const newImageUrl = req.file.path;
                const newImagePublicId = req.file.filename;

                // Update post with new image info
                post.featuredImage = newImageUrl;
                post.featuredImagePublicId = newImagePublicId;

                // Delete old image if exists and is different
                if (oldImagePublicId && oldImagePublicId !== newImagePublicId) {
                    await cloudinary.uploader.destroy(oldImagePublicId);
                    console.log('Đã xóa ảnh cũ trên Cloudinary:', oldImagePublicId);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error during update:", uploadError);
            }
        }

        // Save updated post
        const updatedPost = await post.save();

        // Log action
        console.log(`Admin ${req.admin.name} updated blog post: ${updatedPost.title}`);

        await logBlogActivity(
            req.admin._id,
            `Cập nhật bài viết "${updatedPost.title}" thành công`,
            postId,
            updatedPost.title,
            req
        );
        return res.json({
            success: true,
            message: 'Cập nhật bài viết thành công',
            post: updatedPost
        });
    } catch (error) {
        console.error("Error updating blog post:", error);

        // Clean up uploaded file if error occurs
        if (req.file?.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error deleting new file after DB update fail:", err);
            }
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề hoặc slug đã tồn tại'
            });
        }

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID bài viết không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật bài viết',
            error: error.message
        });
    }
};
// 22
export const deleteBlogPost = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        // Delete image from Cloudinary if exists
        if (post.featuredImagePublicId) {
            try {
                await cloudinary.uploader.destroy(post.featuredImagePublicId);
                console.log('Đã xóa ảnh trên Cloudinary:', post.featuredImagePublicId);
            } catch (deleteError) {
                console.error("Cloudinary Delete Error:", deleteError);
            }
        }

        // Delete post from database
        await Blog.findByIdAndDelete(req.params.id);

        // Log action
        console.log(`Admin ${req.admin.name} deleted blog post: ${post.title}`);

        await logBlogActivity(
            req.admin._id,
            `Xóa bài viết "${post.title}" thành công`,
            req.params.id,
            post.title,
            req
        );
        return res.json({
            success: true,
            message: 'Đã xóa bài viết thành công'
        });
    } catch (error) {
        console.error("Error deleting blog post:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID bài viết không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa bài viết',
            error: error.message
        });
    }
};
// 23
export const uploadContentImage = async (req, res) => {
    try {
        if (!req.file) {
            console.log("Upload request received without file.");
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được tải lên'
            });
        }

        // Get image info from Cloudinary upload
        const imageUrl = req.file.path;
        const publicId = req.file.filename;

        console.log('Image uploaded successfully via editor:', { url: imageUrl, publicId });

        return res.status(200).json({
            success: true,
            url: imageUrl,
            publicId
        });
    } catch (error) {
        console.error("Error uploading content image:", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi tải ảnh lên',
            error: error.message
        });
    }
};
// 24
// --- Career Resources Management ---
export const getAllResourcesAdmin = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: resources.length,
            resources
        });
    } catch (error) {
        console.error("Error getting all resources:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách tài nguyên",
            error: error.message
        });
    }
};
// 25
// Lấy chi tiết resource theo ID
export const getResourceByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên với ID cung cấp"
            });
        }

        return res.status(200).json({
            success: true,
            resource
        });
    } catch (error) {
        console.error("Error getting resource by ID:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "ID tài nguyên không hợp lệ"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy chi tiết tài nguyên",
            error: error.message
        });
    }
};
// 26
// Thêm resource mới
// Tìm đến hàm createResource và sửa lại như sau:

export const createResource = async (req, res) => {
    try {
        const { type, title, description, items, relatedResources } = req.body;

        // Validation
        if (!type || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ type, title và description"
            });
        }

        // Check if resource with this type already exists
        const existingResource = await Resource.findOne({ type });

        if (existingResource) {
            return res.status(400).json({
                success: false,
                message: "Resource với type này đã tồn tại"
            });
        }

        // Tạo slug từ type
        const slug = type
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Create new resource với slug
        const newResource = new Resource({
            type,
            title,
            description,
            slug, // Thêm slug ở đây
            items: items || [],
            relatedResources: relatedResources || []
        });

        await newResource.save();

        // Log action
        console.log(`Admin ${req.admin.name} created resource: ${title} (${type})`);

        await logResourceActivity(
            req.admin._id,
            `Tạo tài nguyên "${title}" thành công`,
            newResource._id,
            title,
            req
        );
        return res.status(201).json({
            success: true,
            message: "Tạo tài nguyên mới thành công",
            resource: newResource
        });
    } catch (error) {
        console.error("Error creating resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo tài nguyên mới",
            error: error.message
        });
    }
};
// 27
// Cập nhật resource theo ID
export const updateResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate
        if (!updateData.title || !updateData.description) {
            return res.status(400).json({
                success: false,
                message: "Tiêu đề và mô tả là bắt buộc"
            });
        }

        // Find and update resource
        const updatedResource = await Resource.findByIdAndUpdate(
            id,
            {
                title: updateData.title,
                description: updateData.description,
                items: updateData.items || [],
                relatedResources: updateData.relatedResources || []
            },
            { new: true }
        );

        if (!updatedResource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên để cập nhật"
            });
        }

        await logResourceActivity(
            req.admin._id,
            `Cập nhật tài nguyên "${updatedResource.title}" thành công`,
            id,
            updatedResource.title,
            req
        );
        return res.status(200).json({
            success: true,
            message: "Cập nhật tài nguyên thành công",
            resource: updatedResource
        });
    } catch (error) {
        console.error("Error updating resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật tài nguyên",
            error: error.message
        });
    }
};

// 28

// Xóa resource theo ID
export const deleteResourceById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedResource = await Resource.findByIdAndDelete(id);

        if (!deletedResource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên để xóa"
            });
        }

        await logResourceActivity(
            req.admin._id,
            `Xóa tài nguyên "${deletedResource.title}" thành công`,
            id,
            deletedResource.title,
            req
        );

        return res.status(200).json({
            success: true,
            message: "Xóa tài nguyên thành công"
        });
    } catch (error) {
        console.error("Error deleting resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa tài nguyên",
            error: error.message
        });
    }
};

// Thêm/cập nhật item trong resource
export const updateResourceItem = async (req, res) => {
    try {
        const { resourceId, itemId } = req.params;
        const itemData = req.body;

        // Validation
        if (!itemData.title || !itemData.description || !itemData.image) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp title, description và image cho item"
            });
        }

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên"
            });
        }

        // Nếu là cập nhật item hiện có
        if (itemId !== 'new') {
            const itemIndex = resource.items.findIndex(item => item._id.toString() === itemId);

            if (itemIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy item trong tài nguyên"
                });
            }

            // Cập nhật item
            resource.items[itemIndex] = {
                ...resource.items[itemIndex].toObject(),
                ...itemData
            };
        } else {
            // Thêm item mới
            resource.items.push(itemData);
        }

        await resource.save();

        return res.status(200).json({
            success: true,
            message: itemId === 'new' ? "Thêm item mới thành công" : "Cập nhật item thành công",
            resource
        });
    } catch (error) {
        console.error("Error updating resource item:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật item",
            error: error.message
        });
    }
};

// Xóa item từ resource
export const deleteResourceItem = async (req, res) => {
    try {
        const { resourceId, itemId } = req.params;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên"
            });
        }

        // Tìm và xóa item
        const itemIndex = resource.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy item trong tài nguyên"
            });
        }

        // Xóa item khỏi mảng
        resource.items.splice(itemIndex, 1);

        await resource.save();

        return res.status(200).json({
            success: true,
            message: "Xóa item thành công",
            resource
        });
    } catch (error) {
        console.error("Error deleting resource item:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa item",
            error: error.message
        });
    }
};

// Lấy danh sách tất cả admin
// export const getAllAdmins = async (req, res) => {
// try {
//Chỉ admin cấp cao (super admin) mới có quyền xem danh sách admin
// if (req.admin.role !== 'super') {
// return res.status(403).json({
// success: false,
// message: "Không có quyền truy cập danh sách admin"
// });
// }
// 
// const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
// 
// return res.status(200).json({
// success: true,
// count: admins.length,
// admins
// });
// } catch (error) {
// console.error("Error getting all admins:", error);
// return res.status(500).json({
// success: false,
// message: "Lỗi server khi lấy danh sách admin",
// error: error.message
// });
// }
// };

// Tạo admin mới (chỉ super admin)
// export const createNewAdmin = async (req, res) => {
// try {
// Kiểm tra quyền (chỉ super admin có thể tạo admin mới)
// if (req.admin.role !== 'super') {
// return res.status(403).json({
// success: false,
// message: "Không có quyền tạo admin mới"
// });
// }
// 
// const { name, email, password, role } = req.body;
// 
//  Validation
// if (!name || !email || !password) {
// return res.status(400).json({
// success: false,
// message: "Vui lòng cung cấp đầy đủ name, email và password"
// });
// }
// 
// Kiểm tra email đã tồn tại chưa
// const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
// if (existingAdmin) {
// return res.status(400).json({
// success: false,
// message: "Email này đã được sử dụng"
// });
// }
// 
//Tạo admin mới
// const newAdmin = new Admin({
// name,
// email,
// password,
// role: role || 'editor' // Vai trò mặc định là editor
// });
// 
// await newAdmin.save();
// 
// return res.status(201).json({
// success: true,
// message: "Tạo admin mới thành công",
// admin: {
// _id: newAdmin._id,
// name: newAdmin.name,
// email: newAdmin.email,
// role: newAdmin.role
// }
// });
// } catch (error) {
// console.error("Error creating new admin:", error);
// return res.status(500).json({
// success: false,
// message: "Lỗi server khi tạo admin mới",
// error: error.message
// });
// }
// };

// Xóa admin (chỉ super admin)
// export const deleteAdmin = async (req, res) => {
// try {
//Kiểm tra quyền
// if (req.admin.role !== 'super') {
// return res.status(403).json({
// success: false,
// message: "Không có quyền xóa admin"
// });
// }
// 
// const { adminId } = req.params;
// 
//Không cho phép admin tự xóa chính mình
// if (adminId === req.admin._id.toString()) {
// return res.status(400).json({
// success: false,
// message: "Không thể tự xóa tài khoản admin của chính mình"
// });
// }
// 
// const deletedAdmin = await Admin.findByIdAndDelete(adminId);
// 
// if (!deletedAdmin) {
// return res.status(404).json({
// success: false,
// message: "Không tìm thấy admin để xóa"
// });
// }
// 
// return res.status(200).json({
// success: true,
// message: "Xóa admin thành công"
// });
// } catch (error) {
// console.error("Error deleting admin:", error);
// return res.status(500).json({
// success: false,
// message: "Lỗi server khi xóa admin",
// error: error.message
// });
// }
// };

// Thống kê chi tiết hơn
export const getDetailedStats = async (req, res) => {
    try {
        // Thống kê người dùng
        const totalUsers = await User.countDocuments();
        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        });

        // Thống kê công ty
        const totalCompanies = await Company.countDocuments();
        const newCompaniesToday = await Company.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        // Thống kê công việc
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const pendingJobs = await Job.countDocuments({ status: 'pending' });
        const newJobsToday = await Job.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        // Thống kê ứng tuyển
        const totalApplications = await JobApplication.countDocuments();
        const newApplicationsToday = await JobApplication.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        // Thống kê blog
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });

        // Thống kê resources
        const totalResources = await Resource.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    newToday: newUsersToday,
                    newThisWeek: newUsersThisWeek
                },
                companies: {
                    total: totalCompanies,
                    newToday: newCompaniesToday
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    pending: pendingJobs,
                    newToday: newJobsToday
                },
                applications: {
                    total: totalApplications,
                    newToday: newApplicationsToday
                },
                blogs: {
                    total: totalBlogs,
                    published: publishedBlogs
                },
                resources: {
                    total: totalResources
                }
            }
        });
    } catch (error) {
        console.error("Error fetching detailed stats:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê chi tiết",
            error: error.message
        });
    }
};

// Quản lý phiên đăng nhập (cần thêm model AdminLog)
export const getAdminLoginHistory = async (req, res) => {
    try {
        const logs = await AdminLog.find()
            .sort({ timestamp: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        console.error("Error fetching admin login history:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy lịch sử đăng nhập",
            error: error.message
        });
    }
};


// Quản lý banner trang chủ
export const updateHomeBanner = async (req, res) => {
    try {
        const { title, subtitle, imageUrl, ctaText, ctaLink, isActive } = req.body;

        // Validation
        if (!title || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Title và imageUrl là bắt buộc"
            });
        }

        // Tìm banner hiện tại hoặc tạo mới nếu chưa có
        let banner = await HomeBanner.findOne();

        if (!banner) {
            banner = new HomeBanner({
                title,
                subtitle,
                imageUrl,
                ctaText,
                ctaLink,
                isActive: isActive !== undefined ? isActive : true
            });
        } else {
            // Cập nhật banner
            banner.title = title;
            banner.subtitle = subtitle || banner.subtitle;
            banner.imageUrl = imageUrl;
            banner.ctaText = ctaText || banner.ctaText;
            banner.ctaLink = ctaLink || banner.ctaLink;
            banner.isActive = isActive !== undefined ? isActive : banner.isActive;
        }

        await banner.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật banner trang chủ thành công",
            banner
        });
    } catch (error) {
        console.error("Error updating home banner:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật banner trang chủ",
            error: error.message
        });
    }
};

// Quản lý công ty đối tác hiển thị trên trang chủ
export const updateTrustedCompanies = async (req, res) => {
    try {
        const { companies } = req.body;

        if (!companies || !Array.isArray(companies)) {
            return res.status(400).json({
                success: false,
                message: "companies phải là một mảng các công ty"
            });
        }

        // Validate mỗi công ty
        for (const company of companies) {
            if (!company.name || !company.logo) {
                return res.status(400).json({
                    success: false,
                    message: "Mỗi công ty phải có name và logo"
                });
            }
        }

        // Cập nhật danh sách công ty đối tác
        let trustedCompanies = await TrustedCompanies.findOne();

        if (!trustedCompanies) {
            trustedCompanies = new TrustedCompanies({
                companies
            });
        } else {
            trustedCompanies.companies = companies;
        }

        await trustedCompanies.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật danh sách công ty đối tác thành công",
            trustedCompanies
        });
    } catch (error) {
        console.error("Error updating trusted companies:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật danh sách công ty đối tác",
            error: error.message
        });
    }
};

// Quản lý thông tin thống kê trang chủ
export const updateHomeStats = async (req, res) => {
    try {
        const { stats } = req.body;

        if (!stats || !Array.isArray(stats)) {
            return res.status(400).json({
                success: false,
                message: "stats phải là một mảng các thống kê"
            });
        }

        // Validate mỗi mục thống kê
        for (const stat of stats) {
            if (!stat.label || !stat.value) {
                return res.status(400).json({
                    success: false,
                    message: "Mỗi mục thống kê phải có label và value"
                });
            }
        }

        // Cập nhật thống kê trang chủ
        let homeStats = await HomeStats.findOne();

        if (!homeStats) {
            homeStats = new HomeStats({
                stats
            });
        } else {
            homeStats.stats = stats;
        }

        await homeStats.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật thống kê trang chủ thành công",
            homeStats
        });
    } catch (error) {
        console.error("Error updating home stats:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật thống kê trang chủ",
            error: error.message
        });
    }
};

// Hàm lấy chi tiết một user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Lấy thông tin userProfile
        const userProfile = await UserProfile.findOne({ userId: id });

        // Lấy danh sách đơn ứng tuyển của user
        const applications = await JobApplication.find({ userId: id })
            .populate('companyId', 'name')
            .populate('jobId', 'title');

        res.json({
            success: true,
            user,
            userProfile,
            applications
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching user details"
        });
    }
};

export const updateResourceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['published', 'draft', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ. Chỉ chấp nhận: published, draft, archived."
            });
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedResource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên để cập nhật"
            });
        }

        await logResourceActivity(
            req.admin._id,
            `Cập nhật trạng thái tài nguyên "${updatedResource.title}" thành ${status}`,
            id,
            updatedResource.title,
            req
        );
        return res.status(200).json({
            success: true,
            message: `Cập nhật trạng thái tài nguyên thành ${status}`,
            resource: updatedResource
        });
    } catch (error) {
        console.error("Error updating resource status:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật trạng thái tài nguyên",
            error: error.message
        });
    }
};

export const getAdminActivities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const type = req.query.type || null;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        // Xây dựng query
        const query = { adminId: req.admin._id };

        if (type && type !== 'all') {
            query.type = type;
        }

        if (startDate && endDate) {
            query.timestamp = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.timestamp = { $gte: startDate };
        } else if (endDate) {
            query.timestamp = { $lte: endDate };
        }

        // Đếm tổng số bản ghi phù hợp với query
        const total = await AdminActivity.countDocuments(query);

        // Lấy dữ liệu theo phân trang
        const activities = await AdminActivity.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        return res.json({
            success: true,
            activities,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching admin activities:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy lịch sử hoạt động",
            error: error.message
        });
    }
};

// Lấy thông tin các thiết bị đã đăng nhập
export const getLoginDevices = async (req, res) => {
    try {
        // Lấy các hoạt động đăng nhập, nhóm theo IP và UserAgent
        const loginActivities = await AdminActivity.find({
            adminId: req.admin._id,
            type: 'auth',
            action: 'Đăng nhập thành công'
        })
            .sort({ timestamp: -1 })
            .limit(10);

        // Lấy IP hiện tại của người dùng
        let currentIp = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        // Xử lý trường hợp có nhiều IP
        if (currentIp && currentIp.includes(',')) {
            currentIp = currentIp.split(',')[0].trim();
        }

        // Xử lý trường hợp IPv6 localhost
        if (currentIp === '::1') {
            currentIp = '127.0.0.1';
        }

        // Xử lý IPv4 trong IPv6
        if (currentIp && currentIp.includes('::ffff:')) {
            currentIp = currentIp.replace('::ffff:', '');
        }

        // Tạo danh sách thiết bị, loại bỏ trùng lặp
        const uniqueDevices = {};
        const devices = [];

        loginActivities.forEach(activity => {
            const deviceKey = `${activity.ipAddress}-${activity.userAgent}`;

            if (!uniqueDevices[deviceKey]) {
                uniqueDevices[deviceKey] = true;
                devices.push({
                    id: activity._id,
                    ipAddress: activity.ipAddress,
                    userAgent: activity.userAgent,
                    lastLogin: activity.timestamp,
                    // Xác định nếu đây là phiên hiện tại
                    isCurrent: activity.ipAddress === currentIp
                        && activity.userAgent === req.headers['user-agent']
                });
            }
        });

        return res.json({
            success: true,
            devices,
            debug: { currentIp } // Thêm để debug
        });
    } catch (error) {
        console.error("Error fetching login devices:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin thiết bị đăng nhập",
            error: error.message
        });
    }
};