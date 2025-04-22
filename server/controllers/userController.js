import mongoose from 'mongoose';
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js";
import UserProfile from '../models/UserProfile.js';
import { v2 as cloudinary } from "cloudinary"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from 'fs';
// User Authentication
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Registering user:', { name, email }); // Debug log

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        console.log('User created:', user._id); // Debug log

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error); // Debug log
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const registerUser_0 = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra user đã tồn tại
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Tạo user mới
        const user = await User.create({
            name,
            email,
            password
        });

        // Tạo token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email); // Debug log

        // Thêm .select('+password') để lấy cả trường password trong query
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token with consistent id field
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('Login successful for user:', user._id); // Debug log

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};
export const loginUser_1 = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email); // Debug log

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token with consistent id field
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('Login successful for user:', user._id); // Debug log

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};
// get user data
// Lấy thông tin cơ bản của user (tên, email) - có thể dùng cho header
export const getUserData = async (req, res) => {
    try {
        // req.user được gắn từ middleware protectUser
        const user = await User.findById(req.user.id).select('name email'); // Chỉ lấy name, email
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error in getUserData:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserData_1 = async (req, res) => {
    try {
        // req.user đã được set bởi authMiddleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Get User Data Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getUserData_0 = async (req, res) => {

    const userId = req.auth.userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Lấy thông tin chi tiết profile của user
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy từ token đã verify
        let userProfile = await UserProfile.findOne({ userId }).populate('userId', 'name email');

        // Nếu chưa có profile, tạo mới profile rỗng
        if (!userProfile) {
            console.log(`Profile not found for user ${userId}, creating one.`);
            const user = await User.findById(userId).select('name email');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            userProfile = await UserProfile.create({ userId });
            // Gắn lại thông tin user vào profile vừa tạo để trả về client
            userProfile = userProfile.toObject();
            userProfile.userId = { _id: user._id, name: user.name, email: user.email };
        }

        res.json({
            success: true,
            profile: userProfile
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};
export const getUserProfile_1 = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ token đã verify
        let userProfile = await UserProfile.findOne({ userId }).populate('userId', 'name email'); // Lấy cả name, email từ User model

        // Nếu chưa có profile, tạo mới profile rỗng
        if (!userProfile) {
            console.log(`Profile not found for user ${userId}, creating one.`);
            const user = await User.findById(userId).select('name email');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            userProfile = await UserProfile.create({ userId });
            // Gắn lại thông tin user vào profile vừa tạo để trả về client
            userProfile = userProfile.toObject(); // Chuyển sang object thường để thêm thuộc tính
            userProfile.userId = { _id: user._id, name: user.name, email: user.email };
        }

        res.json({ success: true, profile: userProfile });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ success: false, message: 'Server error fetching profile' });
    }
};
// Cập nhật profile của user
// Thêm các hàm để xử lý profile

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            title,
            bio,
            phone,
            location,
            skills,
            socialLinks,
            education,
            experience,
            projects,
            languages,
            certificates,
            interests,
            availability
        } = req.body;

        // Tìm profile hiện tại hoặc tạo mới nếu chưa có
        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            userProfile = new UserProfile({
                userId,
                title: title || '',
                bio: bio || '',
                phone: phone || '',
                location: location || '',
                skills: skills || [],
                socialLinks: socialLinks || { linkedin: '', github: '', portfolio: '' },
                education: education || [],
                experience: experience || [],
                projects: projects || [],
                languages: languages || [],
                certificates: certificates || [],
                interests: interests || [],
                availability: availability || 'Đang tìm việc'
            });
        } else {
            // Cập nhật các trường nếu profile đã tồn tại
            userProfile.title = title !== undefined ? title : userProfile.title;
            userProfile.bio = bio !== undefined ? bio : userProfile.bio;
            userProfile.phone = phone !== undefined ? phone : userProfile.phone;
            userProfile.location = location !== undefined ? location : userProfile.location;
            userProfile.skills = skills !== undefined ? skills : userProfile.skills;
            userProfile.socialLinks = socialLinks !== undefined ? socialLinks : userProfile.socialLinks;
            userProfile.education = education !== undefined ? education : userProfile.education;
            userProfile.experience = experience !== undefined ? experience : userProfile.experience;
            userProfile.projects = projects !== undefined ? projects : userProfile.projects;
            userProfile.languages = languages !== undefined ? languages : userProfile.languages;
            userProfile.certificates = certificates !== undefined ? certificates : userProfile.certificates;
            userProfile.interests = interests !== undefined ? interests : userProfile.interests;
            userProfile.availability = availability !== undefined ? availability : userProfile.availability;
        }

        await userProfile.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            userProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
export const updateUserProfile_0 = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;

        // Không cho phép cập nhật userId
        delete profileData.userId;
        // Không cho phép cập nhật _id
        delete profileData._id;
        // Không cho phép cập nhật trực tiếp resume qua đây (dùng route riêng)
        delete profileData.resume;
        // Không cho phép cập nhật trực tiếp avatar qua đây (dùng route riêng)
        delete profileData.avatar;

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: profileData },
            { new: true, runValidators: true, upsert: true } // upsert: true sẽ tạo nếu chưa có
        ).populate('userId', 'name email');

        if (!updatedProfile) {
            // Trường hợp upsert=true thì không vào đây, nhưng để phòng ngừa
            return res.status(404).json({ success: false, message: 'Profile not found and could not be created' });
        }

        res.json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};
// Cập nhật resume (giữ nguyên hoặc sửa đổi nếu cần)
// Sửa hàm updateResume trong controllers/userController.js
export const updateResume = async (req, res) => {
    try {
        const userId = req.user.id;

        // Kiểm tra có file hay không
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No resume file uploaded'
            });
        }

        console.log('File received:', req.file);
        console.log('Local file path:', req.file.path);

        // Upload file lên Cloudinary - THAY ĐỔI CHỖ NÀY
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'resumes',
            resource_type: 'auto',  // Thay vì 'raw', sử dụng 'auto' để Cloudinary tự nhận diện
            public_id: `resume_${userId}_${Date.now()}`,
            format: 'pdf',  // Chỉ định rõ định dạng là PDF
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            // QUAN TRỌNG: Không sử dụng flags: 'attachment' vì nó sẽ buộc tải xuống
        });

        console.log('Cloudinary upload result:', result);

        // Lưu URL gốc, không cần thêm fl_inline
        const resumeUrl = result.secure_url;

        // Xem đường dẫn PDF trực tiếp từ Cloudinary:
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/v{version}/{public_id}.pdf
        console.log('Final resume URL:', resumeUrl);

        // Cập nhật URL vào UserProfile
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: { resume: resumeUrl } },
            { new: true, upsert: true }
        );

        // Xóa file local sau khi đã upload lên Cloudinary
        try {
            fs.unlinkSync(req.file.path);
            console.log('Local file deleted');
        } catch (err) {
            console.error('Error deleting local file:', err);
        }

        res.json({
            success: true,
            message: 'Resume updated successfully',
            resume: resumeUrl
        });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating resume',
            error: error.message
        });
    }
};
export const updateResume_1 = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No resume file uploaded' });
        }
        const resumeUrl = req.file.path; // Hoặc URL từ cloud storage

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: { resume: resumeUrl } },
            { new: true, upsert: true } // Tạo profile nếu chưa có khi upload resume
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Could not update resume' });
        }

        res.json({ success: true, message: 'Resume updated successfully', resume: updatedProfile.resume });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ success: false, message: 'Server error updating resume' });
    }
};

// Cập nhật avatar
export const updateAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No avatar file uploaded' });
        }
        const avatarUrl = req.file.path; // Hoặc URL từ cloud storage

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: { avatar: avatarUrl } },
            { new: true, upsert: true } // Tạo profile nếu chưa có khi upload avatar
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Could not update avatar' });
        }

        res.json({ success: true, message: 'Avatar updated successfully', avatar: updatedProfile.avatar });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ success: false, message: 'Server error updating avatar' });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        // Debug log
        console.log('Fetching applications for user:', req.user._id);

        const applications = await JobApplication.find({
            userId: req.user._id
        })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .sort({ date: -1 }) // Sắp xếp mới nhất lên đầu
            .exec();

        console.log('Found applications:', applications);

        return res.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getUserApplications_1 = async (req, res) => {
    try {
        const applications = await JobApplication.find({ user: req.user._id })
            .populate('company', 'name email image')
            .populate('job', 'title description location category level salary')
            .exec();

        if (!applications) {
            return res.status(404).json({
                success: false,
                message: 'No job applications found for this user'
            });
        }

        return res.json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getUserApplications_0 = async (req, res) => {
    try {
        const applications = await JobApplication.find({ userId: req.user._id })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec();

        if (!applications) {
            return res.json({
                success: false,
                message: 'No job applications found for this user'
            });
        }

        return res.json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        // Debug logs
        console.log('Application request:', { jobId, userId });

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(jobId) ||
            !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        // Check if user exists and has required fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.resume) {
            return res.status(400).json({
                success: false,
                message: 'Please upload your resume before applying'
            });
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({
            jobId,
            userId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Get job details and validate
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (!job.visible || job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This job is not available for applications'
            });
        }

        // Start a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create application
            const application = await JobApplication.create([{
                companyId: job.companyId,
                userId,
                jobId,
                status: 'pending',
                date: new Date()
            }], { session });

            // Increment applicationsCount
            await Job.findByIdAndUpdate(
                jobId,
                { $inc: { applicationsCount: 1 } },
                { session }
            );

            // Commit the transaction
            await session.commitTransaction();

            // Populate application data
            const populatedApplication = await JobApplication.findById(application[0]._id)
                .populate('companyId', 'name email image')
                .populate('jobId', 'title description location category level salary')
                .populate('userId', 'name email resume')
                .lean();

            console.log('Application created:', populatedApplication._id);

            return res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                application: populatedApplication
            });

        } catch (error) {
            // If error occurs, abort transaction
            await session.abortTransaction();
            throw error;
        } finally {
            // End session
            session.endSession();
        }

    } catch (error) {
        console.error('Apply job error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error submitting application'
        });
    }
};
export const applyForJob_khongcapnhatmongo = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        // Debug logs
        console.log('Application request:', { jobId, userId });

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(jobId) ||
            !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        // Check if user exists and has required fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.resume) {
            return res.status(400).json({
                success: false,
                message: 'Please upload your resume before applying'
            });
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({
            jobId,
            userId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Get job details and validate
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (!job.visible || job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This job is not available for applications'
            });
        }

        // Create application
        const application = await JobApplication.create({
            companyId: job.companyId,
            userId,
            jobId,
            status: 'pending',
            date: new Date()
        });

        // Populate application data
        const populatedApplication = await JobApplication.findById(application._id)
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .populate('userId', 'name email resume')
            .lean();

        console.log('Application created:', populatedApplication._id);

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: populatedApplication
        });

    } catch (error) {
        console.error('Apply job error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error submitting application'
        });
    }
};
// Add this function to userController.js
export const getUserProfile_0 = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume || '',
                image: user.image
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user profile',
            error: error.message
        });
    }
};
// apply for a job
export const applyForJob_0 = async (req, res) => {

    const { jobId } = req.body
    const userId = req.auth.userId


    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })
        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' })

        }


        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({ success: false, message: 'Job not found' })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()

        })
        res.json({ success: true, message: 'Applied successfully' })
    } catch (error) {
        console.log("loi roi ni");

        res.json({ success: false, message: error.message })
    }
}

// get user applied applications

export const getUserJobApplications_0 = async (req, res) => {
    try {
        const userId = req.auth.userId

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job application found for this user' })
        }

        return res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// update user profile (resume)
export const updateResume_3 = async (req, res) => {
    try {
        // Debug logs
        console.log('Files in request:', req.files);
        console.log('File in request:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'resumes',
            resource_type: 'raw'
        });

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { resume: result.secure_url },
            { new: true }
        );

        // Delete file from local storage after upload
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: {
                resumeUrl: result.secure_url
            }
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading resume'
        });
    }
};
export const updateResume_0 = async (req, res) => {
    try {
        // Debug logs
        console.log('Files in request:', req.files);
        console.log('File in request:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'resumes',
            resource_type: 'raw'
        });

        // Update user in database and get updated user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { resume: result.secure_url },
            { new: true }
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete file from local storage after upload
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: {
                resumeUrl: result.secure_url,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    resume: updatedUser.resume
                }
            }
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading resume'
        });
    }
};
export const updateResume_2 = async (req, res) => {
    try {
        if (!req.files || !req.files.resume) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
            folder: 'resumes',
            resource_type: 'auto'
        });

        // Cập nhật URL resume trong database
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { resume: result.secure_url },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: {
                resumeUrl: result.secure_url  // Trả về URL của file đã upload
            }
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading resume'
        });
    }
};
export const updateUserResume_1 = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // File URL is automatically generated by Cloudinary
        //user.resume = req.file.path;
        //user.resume = req.file.secure_url || req.file.path;
        //console.log('Saving resume URL:', user.resume);

        // const resumeUrl = req.file.secure_url || req.file.path;
        // user.resume = resumeUrl.replace('http://', 'https://');

        // await user.save();
        user.resume = req.file.secure_url;
        await user.save();

        res.json({
            success: true,
            message: 'Resume updated successfully',
            resume: user.resume
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateUserResume_0 = async (req, res) => {
    try {
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({ success: true, message: 'Resume Updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// delete
// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm user cần xóa
        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Xóa tất cả đơn ứng tuyển liên quan đến user này
        await JobApplication.deleteMany({ userId: id });

        // Xóa người dùng
        await User.findByIdAndDelete(id);

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        // Tìm profile của user để lấy thông tin kỹ năng
        const userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            return res.status(200).json({
                success: true,
                jobs: [] // Không có profile, không cần gợi ý việc làm
            });
        }

        // Tìm các công việc tương tự dựa trên kỹ năng, nếu có
        const userSkills = userProfile.skills || [];

        // Sử dụng mongoose để tìm việc làm phù hợp
        // Chỉ lấy các job đã được admin duyệt (status='active')
        let jobs = [];

        if (userSkills.length > 0) {
            jobs = await Job.find({
                status: 'active', // Chỉ lấy job đã được admin duyệt
                visible: true,    // Chỉ lấy job đang hiển thị
                $or: [
                    { requiredSkills: { $in: userSkills } }, // Skills khớp với skill của user
                    { preferredSkills: { $in: userSkills } }, // Skills ưu tiên khớp với skill của user
                ]
            })
                .populate('companyId', 'name image')
                .sort({ createdAt: -1 }) // Mới nhất trước
                .limit(10); // Giới hạn 10 job
        } else {
            // Nếu không có skill, lấy các job mới nhất đã được duyệt
            jobs = await Job.find({
                status: 'active', // Chỉ lấy job đã được admin duyệt
                visible: true
            })
                .populate('companyId', 'name image')
                .sort({ createdAt: -1 })
                .limit(5);
        }

        // Tính toán độ phù hợp cho mỗi job
        const jobsWithMatchScore = jobs.map(job => {
            // Chuyển đổi job từ Mongoose document sang object để thêm field
            const jobObj = job.toObject();

            // Tính match score dựa trên số lượng skills khớp
            let matchScore = 0;
            const jobRequiredSkills = job.requiredSkills || [];
            const jobPreferredSkills = job.preferredSkills || [];

            if (userSkills.length > 0 && (jobRequiredSkills.length > 0 || jobPreferredSkills.length > 0)) {
                // Đếm số skills match với required skills (trọng số x2)
                jobRequiredSkills.forEach(skill => {
                    if (userSkills.includes(skill)) {
                        matchScore += 2;
                    }
                });

                // Đếm số skills match với preferred skills (trọng số x1)
                jobPreferredSkills.forEach(skill => {
                    if (userSkills.includes(skill)) {
                        matchScore += 1;
                    }
                });

                // Tính match score dạng phần trăm
                const totalPossibleScore = jobRequiredSkills.length * 2 + jobPreferredSkills.length;
                jobObj.matchScore = totalPossibleScore > 0
                    ? Math.min(Math.round((matchScore / totalPossibleScore) * 100), 100)
                    : 0;
            } else {
                jobObj.matchScore = 0;
            }

            return jobObj;
        });

        // Sắp xếp theo match score từ cao xuống thấp
        jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({
            success: true,
            jobs: jobsWithMatchScore
        });

    } catch (error) {
        console.error('Error getting recommended jobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error getting recommended jobs'
        });
    }
};

// Thêm vào cuối file, sau các hàm khác
export const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Tìm tất cả ứng tuyển của user
        const applications = await JobApplication.find({ userId })
            .populate('jobId', 'title companyId status')
            .populate({
                path: 'companyId',
                select: 'name image'
            })
            .sort({ date: -1 })
            .lean();

        // Đếm các ứng tuyển theo trạng thái
        const totalApplications = applications.length;

        // Lấy số lượng interviews
        const interviews = await JobApplication.countDocuments({
            userId,
            status: { $in: ['interviewing', 'interview_scheduled'] }
        });

        // Lấy các đơn ứng tuyển gần đây
        const recentApplications = applications.slice(0, 5);

        // Lấy phỏng vấn sắp tới (nếu có model Interview)
        let upcomingInterviews = [];
        try {
            const Interview = mongoose.model('Interview');
            upcomingInterviews = await Interview.find({
                candidateId: userId,
                scheduledTime: { $gte: new Date() }
            })
                .populate('jobId', 'title')
                .populate('companyId', 'name image')
                .sort({ scheduledTime: 1 })
                .limit(5)
                .lean();
        } catch (error) {
            // Model Interview không tồn tại, bỏ qua
            console.log('Interview model not found, skipping upcoming interviews');
        }

        // Trả về kết quả
        return res.status(200).json({
            success: true,
            stats: {
                applications: totalApplications,
                interviews: interviews,
                savedJobs: 0 // Client sẽ cập nhật số này từ localStorage
            },
            recentApplications,
            upcomingInterviews
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data',
            error: error.message
        });
    }
};