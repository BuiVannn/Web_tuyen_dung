// register a new company

import Company from "../models/Company.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import bcryptjs from 'bcryptjs';
import User from '../models/User.js'; // Cần để populate thông tin ứng viên
import mongoose from 'mongoose';
export const registerCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        console.log('Register attempt:', { name, email, hasImage: !!imageFile }); // Debug log

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if company exists
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(400).json({
                success: false,
                message: 'Company already registered'
            });
        }

        // Hash password
        //const salt = await bcryptjs.genSalt(10);
        //const hashedPassword = await bcryptjs.hash(password, salt);
        //console.log('Password hashed:', { original: password, hashed: hashedPassword });
        //const hashedPassword = await bcrypt.hash(password, 12);

        // Upload image if provided
        let imageUrl = '';
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            imageUrl = result.secure_url;
        }

        const company = new Company({
            name,
            email,
            password, // Không hash ở đây, để mongoose middleware xử lý
            image: imageUrl || 'default_company_image_url'
        });

        await company.save();
        console.log('Company saved with hashed password');
        const token = generateToken(company._id);
        // Create company
        // const company = await Company.create({
        // name,
        // email,
        // password: hashedPassword,
        // image: imageUrl || 'default_company_image_url'
        // });

        //const token = generateToken(company._id);
        // Generate token
        // const token = jwt.sign(
        // { companyId: company._id },
        // process.env.JWT_SECRET,
        // { expiresIn: '30d' }
        // );

        // Send response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
}

export const registerCompany_0 = async (req, res) => {

    const { name, email, password } = req.body

    const imageFile = req.file

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {

        const companyExists = await Company.findOne({ email })

        if (companyExists) {
            return res.json({ success: false, message: 'company already registed' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// company login
export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Debug log

        // Kiểm tra email tồn tại
        const company = await Company.findOne({ email });
        if (!company) {
            console.log('Company not found for email:', email); // Debug log
            return res.status(404).json({
                success: false,
                message: 'Company not found with this email'
            });
        }

        // Kiểm tra password
        console.log('Found company:', company.name);
        console.log('Stored hash:', company.password);
        console.log('Entered password:', password);
        //const isMatch = await bcryptjs.compare(password, company.password);
        const isMatch = await company.comparePassword(password);
        //const isMatch = await bcryptjs.compare(password, company.password);
        console.log('Password comparison:', {
            entered: password,
            stored: company.password,
            match: isMatch
        });
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
        const token = generateToken(company._id);

        // Tạo token
        // Trong hàm loginCompany
        // const token = jwt.sign(
        // { companyId: company._id }, // Đảm bảo dùng companyId
        // process.env.JWT_SECRET,
        // { expiresIn: '30d' }
        // );
        // Log success
        console.log('Login successful for company:', company.name);

        // Trả về response
        res.json({
            success: true,
            message: 'Login successful',
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in company login',
            error: error.message
        });
    }
};
export const loginCompany_1 = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const loginCompany_0 = async (req, res) => {
    const { email, password } = req.body
    try {
        const company = await Company.findOne({ email })
        if (await bcrypt.compare(password, company.password)) {

            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })

        }
        else {
            res.json({ success: false, message: 'Invalid email or password' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// get company data
// Sửa hàm getCompanyData để trả về đầy đủ thông tin
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company;
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Trả về đầy đủ thông tin company
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
                phone: company.phone || "",
                website: company.website || "",
                location: company.location || "",
                foundedYear: company.foundedYear || "",
                industry: company.industry || "",
                employees: company.employees || "",
                description: company.description || "",
                benefits: company.benefits || [],
                status: company.status,
                subscription: company.subscription || "free"
            }
        });
    } catch (error) {
        console.error('Error in getCompanyData:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCompanyData_1 = async (req, res) => {
    try {
        const company = req.company;
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
                // Thêm các trường mở rộng vào response
                phone: company.phone,
                website: company.website,
                location: company.location,
                foundedYear: company.foundedYear,
                industry: company.industry,
                employees: company.employees,
                description: company.description,
                benefits: company.benefits,
                status: company.status,
                subscription: company.subscription
            }
        });
    } catch (error) {
        console.error('Error in getCompanyData:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCompanyData_0 = async (req, res) => {
    try {
        const company = req.company;
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        });
    } catch (error) {
        console.error('Error in getCompanyData:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// export const getCompanyData = async (req, res) => {
// try {
// const company = req.company
// res.json({ success: true, company })
// } catch (error) {
// res.json({ success: false, message: error.message })
// }
// }

// post a new job
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            salary,
            type,
            experience,
            category
        } = req.body;

        const companyId = req.company._id;

        // Validation
        if (!title || !description || !location || !salary || !type || !experience || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Validate enum values
        const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
        const validExperience = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job type"
            });
        }

        if (!validExperience.includes(experience)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience level"
            });
        }

        // Create new job
        const newJob = await Job.create({
            title,
            description,
            location,
            salary,
            type,
            experience,
            category,
            companyId,
            companyName: req.company.name, // Thêm tên công ty để hiển thị trong thông báo
            status: 'pending',  // Default status for new jobs
            visible: false      // Default visibility
        });

        console.log('New job created:', newJob._id);

        // THÊM ĐOẠN NÀY: Gửi thông báo cho admin
        try {
            await notifyNewJobCreated(newJob);
            console.log('Admin notification sent for new job:', newJob._id);
        } catch (notifyError) {
            console.error('Error sending notification for new job:', notifyError);
            // Vẫn tiếp tục xử lý ngay cả khi gửi thông báo lỗi
        }

        res.status(201).json({
            success: true,
            message: "Job đã được tạo và đang chờ admin duyệt",
            job: newJob
        });

    } catch (error) {
        console.error('Post job error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const postJob_1 = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body
    const companyId = req.company._id

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category,
            status: 'pending', // Job mới tạo sẽ ở trạng thái pending
            visible: false // Mặc định ẩn cho đến khi admin duyệt
        })

        await newJob.save()
        res.json({
            success: true,
            message: "Job đã được tạo và đang chờ admin duyệt",
            job: newJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const postJob_0 = async (req, res) => {

    const { title, description, location, salary, level, category } = req.body

    const companyId = req.company._id

    console.log(companyId, { title, description, location, salary, level, category });

    try {

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()
        res.json({ success: true, newJob })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get company job applicant
export const getCompanyJobApplicants_2 = async (req, res) => {
    try {
        console.log('Company ID:', req.company._id);

        const applications = await JobApplication.find({
            company: req.company._id
        })
            .populate({
                path: 'user',
                select: 'name email resume',
                // Add match condition if needed
                match: { _id: { $type: 'string' } }
            })
            .populate('job', 'title')
            .sort('-createdAt')
            .lean();

        console.log('Found applications:', applications.length);

        // Filter out any null populated fields
        const validApplications = applications.filter(app => app.user != null);

        res.json({
            success: true,
            applications: validApplications
        });
    } catch (error) {
        console.error('Error in getCompanyJobApplicants:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id;
        console.log('Finding applications for company:', companyId);

        // Get all applications for this company
        const applications = await JobApplication.find({ companyId })
            .populate({
                path: 'userId',
                select: 'name email image resume education experience skills phone',
                model: 'User'
            })
            .populate({
                path: 'jobId',
                select: 'title description location category salary type experience',
                model: 'Job'
            })
            .sort({ createdAt: -1 })
            .lean();

        const formattedApplications = applications.map(app => ({
            _id: app._id,
            status: app.status,
            date: app.date, // Thêm ngày nộp đơn
            userId: {
                _id: app.userId._id,
                name: app.userId.name || 'N/A',
                email: app.userId.email || 'N/A',
                image: app.userId.image || app.userId.avatar || '/default-avatar.jpg',
                resume: app.userId.resume || null,
                education: app.userId.education || [],
                experience: app.userId.experience || [],
                skills: app.userId.skills || [],
                phone: app.userId.phone || 'N/A'
            },
            jobId: {
                _id: app.jobId._id,
                title: app.jobId.title || 'N/A',
                location: app.jobId.location || 'N/A',
                category: app.jobId.category || 'N/A',
                salary: app.jobId.salary || 'N/A',
                type: app.jobId.type || 'N/A',
                experience: app.jobId.experience || 'N/A'
            }
        }));
        // Filter out invalid applications and format response
        const validApplications = applications
            .filter(app => app.userId && app.jobId)
            .map(app => ({
                _id: app._id,
                status: app.status,
                date: app.createdAt,
                user: {
                    _id: app.userId._id,
                    name: app.userId.name,
                    email: app.userId.email,
                    resume: app.userId.resume,
                    education: app.userId.education,
                    experience: app.userId.experience,
                    skills: app.userId.skills
                },
                job: {
                    _id: app.jobId._id,
                    title: app.jobId.title,
                    location: app.jobId.location,
                    category: app.jobId.category,
                    salary: app.jobId.salary,
                    type: app.jobId.type,
                    experience: app.jobId.experience
                }
            }));

        // Debug logs
        console.log('Found valid applications:', validApplications.length);

        return res.json({
            success: true,
            count: formattedApplications.length,
            applications: formattedApplications
        });

    } catch (error) {
        console.error('Error in getCompanyJobApplicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
export const getCompanyJobApplicants_loi = async (req, res) => {
    try {
        const companyId = req.company._id;
        console.log('Finding applications for company:', companyId);

        const applications = await JobApplication.find({ companyId })
            .populate({
                path: 'userId',
                select: 'name email image resume phone education experience skills',
                match: { _id: { $type: 'objectId' } } // Only match MongoDB ObjectIds
            })
            .populate({
                path: 'jobId',
                select: 'title description location category level salary status'
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log('Found applications:', applications.length);
        console.log('Application IDs:', applications.map(app => ({
            appId: app._id,
            userId: app.userId?._id,
            jobId: app.jobId?._id
        })));

        const validApplications = applications.filter(app =>
            app.userId && mongoose.Types.ObjectId.isValid(app.userId._id)
        );

        // Group applications by job
        const applicationsByJob = applications.reduce((acc, app) => {
            const jobId = app.jobId._id.toString();
            if (!acc[jobId]) {
                acc[jobId] = {
                    jobTitle: app.jobId.title,
                    applications: []
                };
            }
            acc[jobId].applications.push(app);
            return acc;
        }, {});

        return res.json({
            success: true,
            count: validApplications.length,
            applications: validApplications.map(app => ({
                _id: app._id,
                status: app.status,
                date: app.date,
                user: app.userId ? {
                    _id: app.userId._id,
                    name: app.userId.name,
                    email: app.userId.email,
                    phone: app.userId.phone,
                    image: app.userId.image,
                    resume: app.userId.resume
                } : null,
                job: app.jobId ? {
                    _id: app.jobId._id,
                    title: app.jobId.title,
                    location: app.jobId.location,
                    category: app.jobId.category,
                    level: app.jobId.level,
                    salary: app.jobId.salary
                } : null
            }))
        });
        // return res.json({
        // success: true,
        // count: applications.length,
        // applicationsByJob,
        // applications: applications.map(app => ({
        // _id: app._id,
        // status: app.status,
        // date: app.date,
        // user: {
        // _id: app.userId?._id,
        // name: app.userId?.name,
        // email: app.userId?.email,
        // phone: app.userId?.phone,
        // image: app.userId?.image,
        // resume: app.userId?.resume
        // },
        // job: {
        // _id: app.jobId?._id,
        // title: app.jobId?.title,
        // location: app.jobId?.location,
        // category: app.jobId?.category,
        // level: app.jobId?.level,
        // salary: app.jobId?.salary
        // }
        // }))
        // });

    } catch (error) {
        console.error('Error in getCompanyJobApplicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
export const getCompanyJobApplicants_1 = async (req, res) => {
    try {
        const companyId = req.company._id;

        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name email image resume phone education experience skills')
            .populate('jobId', 'title description location category level salary status')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        console.error('Error in getCompanyJobApplicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
};
export const getCompanyJobApplicants_0 = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Find all applications for the company
        const applications = await JobApplication.find({ companyId })
            .populate({
                path: 'userId',
                select: 'name email image resume phone education experience skills'
            })
            .populate({
                path: 'jobId',
                select: 'title description location category level salary status'
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!applications) {
            return res.status(404).json({
                success: false,
                message: 'No applications found'
            });
        }

        // Format the response data
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            status: app.status,
            date: app.date,
            coverLetter: app.coverLetter,
            portfolio: app.portfolio,
            userId: {
                _id: app.userId?._id,
                name: app.userId?.name,
                email: app.userId?.email,
                phone: app.userId?.phone,
                image: app.userId?.image,
                resume: app.userId?.resume,
                education: app.userId?.education,
                experience: app.userId?.experience,
                skills: app.userId?.skills
            },
            jobId: {
                _id: app.jobId?._id,
                title: app.jobId?.title,
                location: app.jobId?.location,
                category: app.jobId?.category,
                level: app.jobId?.level,
                salary: app.jobId?.salary,
                status: app.jobId?.status
            }
        }));

        return res.json({
            success: true,
            count: formattedApplications.length,
            applications: formattedApplications
        });

    } catch (error) {
        console.error('Error in getCompanyJobApplicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
// export const getCompanyJobApplicants = async (req, res) => {
// try {
// const companyId = req.company._id
// 
//find job application for the user and populate related data
// const applications = await JobApplication.find({ companyId })
// .populate('userId', 'name email image resume createdAt')
// .populate('jobId', 'title location category level salary')
// .sort({ date: -1 }) // Thêm sắp xếp nếu muốn
// .lean(); // Thêm lean()
//.exec()
// 
// return res.json({ success: true, applications })
// } catch (error) {
// res.json({ success: false, message: error.message })
// }
// }

// get company posted jobs

export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Aggregate để lấy jobs và count applications
        const jobs = await Job.aggregate([
            // Match jobs của company
            {
                $match: {
                    companyId: new mongoose.Types.ObjectId(companyId)
                }
            },

            // Lookup để join với applications
            {
                $lookup: {
                    from: 'jobapplications',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'applicationsList'
                }
            },

            // Add fields để tính toán
            {
                $addFields: {
                    applicationsCount: { $size: "$applicationsList" },
                    applicationStats: {
                        pending: {
                            $size: {
                                $filter: {
                                    input: "$applicationsList",
                                    as: "app",
                                    cond: { $eq: ["$$app.status", "pending"] }
                                }
                            }
                        },
                        viewed: {
                            $size: {
                                $filter: {
                                    input: "$applicationsList",
                                    as: "app",
                                    cond: { $eq: ["$$app.status", "viewed"] }
                                }
                            }
                        },
                        shortlisted: {
                            $size: {
                                $filter: {
                                    input: "$applicationsList",
                                    as: "app",
                                    cond: { $eq: ["$$app.status", "shortlisted"] }
                                }
                            }
                        }
                    }
                }
            },

            // Remove applicationsList từ output
            {
                $project: {
                    applicationsList: 0
                }
            }
        ]);

        console.log('Jobs with applications count:', jobs);

        res.json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error('Error in getCompanyPostedJobs:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCompanyPostedJobs_3 = async (req, res) => {
    try {
        const companyId = req.company._id; // Get from middleware
        console.log('Fetching jobs for company:', companyId);

        const jobs = await Job.find({ companyId })
            .sort({ createdAt: -1 })
            .populate('companyId', 'name image location')
            .lean();

        console.log(`Found ${jobs.length} jobs for company ${companyId}`);

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error in getCompanyPostedJobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company jobs',
            error: error.message
        });
    }
};
export const getCompanyPostedJobs_2 = async (req, res) => {
    try {
        const companyId = req.user._id; // Get from protectCompany middleware

        const jobs = await Job.find({ companyId })
            .sort({ createdAt: -1 })
            .populate('companyId', 'name image location');

        console.log(`Found ${jobs.length} jobs for company ${companyId}`);

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error in getCompanyPostedJobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company jobs'
        });
    }
};
export const getCompanyPostedJobs_1 = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId }).lean();

        // Lấy số lượng ứng viên cho mỗi job
        const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
            const applicantsCount = await JobApplication.countDocuments({ jobId: job._id });
            return {
                ...job,
                applicants: applicantsCount // Thêm số lượng ứng viên vào mỗi job
            };
        }));

        res.json({
            success: true,
            jobs: jobsWithApplicants
        });
    } catch (error) {
        console.error('Error in getCompanyPostedJobs:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCompanyPostedJobs_0 = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId })
            .sort({ createdAt: -1 })
            .lean();

        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const applications = await JobApplication.find({ jobId: job._id });
            const applicationStats = {
                total: applications.length,
                pending: applications.filter(app => app.status === 'pending').length,
                shortlisted: applications.filter(app => app.status === 'shortlisted').length,
                interviewing: applications.filter(app => app.status === 'interviewing').length,
                hired: applications.filter(app => app.status === 'hired').length
            };

            return {
                ...job,
                applicationStats,
                applicantsCount: applications.length
            };
        }));

        res.json({
            success: true,
            count: jobsWithStats.length,
            jobs: jobsWithStats
        });
    } catch (error) {
        console.error('Error in getCompanyPostedJobs:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// export const getCompanyPostedJobs = async (req, res) => {
// try {
// 
// const companyId = req.company._id
// const jobs = await Job.find({ companyId })
// 
//(todo) adding no. of applicants info in data
// const jobsData = await Promise.all(jobs.map(async (job) => {
// const applicants = await JobApplication.find({ jobId: job._id })
// return { ...job.toObject(), applicants: applicants.length }
// }))
// 
// res.json({ success: true, jobsData })
// 
// } catch (error) {
// res.json({ success: false, message: error.message })
// }
// }

// change job applications status

export const ChangeJobApplicationsStatus = async (req, res) => {
    try {

        const { id, status } = req.body
        // find job application and update status
        await JobApplication.findOneAndUpdate({ _id: id }, { status })
        res.json({ success: true, message: "status changed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// change job visiblity
export const changeVisiblity = async (req, res) => {
    try {
        const { id } = req.body
        const companyId = req.company._id

        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()

        res.json({ success: true, job })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



// Lấy tất cả đơn ứng tuyển (dành cho admin hoặc nhà tuyển dụng)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find()
            .populate({
                path: 'userId',
                select: 'name email image resume phone education experience skills'
            })
            .populate({
                path: 'jobId',
                select: 'title description location category level salary'
            })
            .populate({
                path: 'companyId',
                select: 'name email image'
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log('Found all applications:', applications.length);

        res.json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error('Error in getAllApplications:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAllApplications_0 = async (req, res) => {
    try {
        const applications = await JobApplication.find()
            .populate('userId', 'name email')
            .populate('jobId', 'title companyId')
            .populate('companyId', 'name');

        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await JobApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getApplicantsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.company._id;

        // Kiểm tra job có thuộc về company không
        const job = await Job.findOne({
            _id: jobId,
            companyId: companyId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not authorized'
            });
        }

        // Lấy ứng viên chỉ của job này
        const applications = await JobApplication.find({
            jobId: jobId,
            companyId: companyId
        })
            .populate('userId', 'name email image resume phone education experience skills')
            .populate('jobId', 'title description location category level salary')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            jobTitle: job.title,
            applications: applications
        });

    } catch (error) {
        console.error('Error in getApplicantsForJob:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
};
export const getApplicantsForJob_2 = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.company._id;

        // First verify that the job belongs to this company
        const job = await Job.findOne({
            _id: jobId,
            companyId: companyId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not authorized'
            });
        }

        // Get applications only for this specific job
        const applications = await JobApplication.find({
            jobId: jobId,
            companyId: companyId
        })
            .populate('userId', 'name email image resume phone education experience skills')
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            jobTitle: job.title,
            applications: applications
        });

    } catch (error) {
        console.error('Error in getApplicantsForJob:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
export const getApplicantsForJob_1 = async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.company._id;

    try {
        // Kiểm tra job có tồn tại và thuộc về company không
        const job = await Job.findOne({
            _id: jobId,
            companyId: companyId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc hoặc không có quyền truy cập'
            });
        }

        // Lấy danh sách ứng viên chỉ của job này
        const applications = await JobApplication.find({
            jobId: jobId,
            companyId: companyId
        })
            .populate('userId', 'name email image resume phone education experience skills')
            .populate('jobId', 'title description location category level salary')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            count: applications.length,
            jobTitle: job.title,
            applications: applications
        });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách ứng viên'
        });
    }
};
export const getApplicantsForJob_0 = async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.company._id; // Lấy từ middleware protectCompany

    // Kiểm tra xem jobId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ success: false, message: 'Job ID không hợp lệ' });
    }

    try {
        // 1. Kiểm tra xem Job có tồn tại và thuộc công ty này không
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy công việc' });
        }
        if (job.companyId.toString() !== companyId.toString()) {
            console.log(`Authorization Failed: Company ${companyId} tried to access job ${jobId} owned by ${job.companyId}`);
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xem ứng viên của công việc này' });
        }

        // 2. Lấy danh sách đơn ứng tuyển cho job đó và populate thông tin user
        const applications = await JobApplication.find({ jobId: jobId })
            .populate({
                path: 'userId', // Tên trường trong JobApplication model tham chiếu đến User
                select: 'name email image resume createdAt' // Các trường của User muốn lấy (bỏ password)
                // Đảm bảo model User của bạn có các trường này (name, image, resume, createdAt từ timestamps)
            })
            .populate('jobId', 'title')
            .select('date status userId jobId') // Chọn các trường từ JobApplication (date là ngày ứng tuyển)
            .sort({ date: -1 }) // Sắp xếp theo ngày ứng tuyển mới nhất
            .lean(); // Dùng lean() cho hiệu năng tốt hơn

        res.json({ success: true, applications });
        // console.log('API Response - Applications:', applications);
    } catch (error) {
        console.error(`Error fetching applicants for job ${jobId}:`, error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách ứng viên' });
    }
};


// @desc    Cập nhật trạng thái đơn ứng tuyển bởi công ty
// @route   PATCH /api/company/applications/:applicationId/status
// @access  Private/Company
// ...existing code...
export const updateApplicationStatusByCompany = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status: newStatus } = req.body;
        const companyId = req.company._id;

        // Kiểm tra applicationId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID'
            });
        }

        // Định nghĩa các trạng thái hợp lệ mà nhà tuyển dụng có thể đặt
        const allowedStatuses = ['viewed', 'shortlisted', 'interviewing', 'rejected', 'hired', 'pending'];

        if (!newStatus || !allowedStatuses.includes(newStatus.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        // Tìm đơn ứng tuyển
        const application = await JobApplication.findById(applicationId)
            .populate('jobId', 'title');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Kiểm tra quyền - chỉ công ty sở hữu job mới có quyền cập nhật
        if (application.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        // Cập nhật trạng thái
        application.status = newStatus.toLowerCase();
        await application.save();


        return res.json({
            success: true,
            message: 'Application status updated successfully',
            application: {
                _id: application._id,
                status: application.status,
                jobTitle: application.jobId.title
            }
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error updating application status',
            error: error.message
        });
    }
};
export const updateApplicationStatusByCompany_suadethemthongbao = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const companyId = req.company._id;

        // Validate status value
        const validStatuses = ['pending', 'viewed', 'shortlisted', 'interviewing', 'rejected', 'hired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Find and update the application
        const application = await JobApplication.findOneAndUpdate(
            {
                _id: applicationId,
                companyId: companyId // Ensure company owns this application
            },
            { status },
            { new: true }
        ).populate('userId', 'name email')
            .populate('jobId', 'title');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn ứng tuyển hoặc không có quyền cập nhật'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            application
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error.message
        });
    }
};
export const updateApplicationStatusByCompany_0 = async (req, res) => {
    const { applicationId } = req.params;
    const { status: newStatus } = req.body; // Lấy status mới từ body request
    const companyId = req.company._id;

    // Kiểm tra applicationId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ success: false, message: 'Application ID không hợp lệ' });
    }

    // Định nghĩa các trạng thái hợp lệ mà nhà tuyển dụng có thể đặt
    const allowedStatuses = ['viewed', 'shortlisted', 'interviewing', 'rejected', 'hired', 'pending']; // Thêm/bớt tùy logic của bạn
    if (!newStatus || !allowedStatuses.includes(newStatus.toLowerCase())) {
        return res.status(400).json({ success: false, message: `Trạng thái không hợp lệ. Các trạng thái cho phép: ${allowedStatuses.join(', ')}` });
    }

    try {
        // 1. Tìm đơn ứng tuyển
        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn ứng tuyển' });
        }

        // 2. Kiểm tra quyền: Đơn ứng tuyển này có thuộc công ty đang đăng nhập không?
        if (application.companyId.toString() !== companyId.toString()) {
            console.log(`Authorization Failed: Company ${companyId} tried to update application ${applicationId} owned by ${application.companyId}`);
            return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật đơn ứng tuyển này' });
        }

        // 3. Cập nhật trạng thái
        application.status = newStatus.toLowerCase(); // Cập nhật trường status
        const updatedApplication = await application.save(); // Lưu lại thay đổi

        // Hoặc dùng findByIdAndUpdate:
        // const updatedApplication = await JobApplication.findByIdAndUpdate(
        //     applicationId,
        //     { status: newStatus.toLowerCase() },
        //     { new: true } // Trả về document đã được cập nhật
        // ).lean();
        // if (!updatedApplication) { /* Xử lý nếu không tìm thấy trong lúc update */ }

        res.json({ success: true, message: `Trạng thái đơn ứng tuyển đã được cập nhật thành "${newStatus}"`, application: updatedApplication });

    } catch (error) {
        console.error(`Error updating application status for ${applicationId}:`, error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái' });
    }
};

export const toggleJobVisibility = async (req, res) => {
    try {
        const jobId = req.params.id;
        const companyId = req.company._id;

        //console.log('Toggle visibility for job:', jobId);
        // Tìm job và verify ownership
        const job = await Job.findOne({
            _id: jobId,
            companyId,
            //status: 'approved' // Chỉ cho phép toggle khi job đã được approve
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not approved yet'
            });
        }
        //console.log('Current job status:', job.status);
        // Kiểm tra status approved     
        if (job.status !== 'active' && job.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Chỉ những công việc đã được duyệt hoặc đang hoạt động mới có thể thay đổi trạng thái hiển thị"
            });
        }

        // Toggle visibility
        job.visible = !job.visible;
        await job.save();

        //console.log('Updated job visibility:', job.visible);

        res.json({
            success: true,
            message: `Job ${job.visible ? 'visible' : 'hidden'} successfully`,
            job
        });
    } catch (error) {
        console.error('Error toggling job visibility:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job visibility'
        });
    }
};
export const toggleJobVisibility_1 = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { visible } = req.body;
        const companyId = req.company._id;

        // Find job and verify ownership
        const job = await Job.findOne({ _id: jobId, companyId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not owned by company'
            });
        }

        // Update visibility
        job.visible = visible;
        await job.save();

        res.json({
            success: true,
            message: `Job ${visible ? 'visible' : 'hidden'} successfully`,
            job
        });
    } catch (error) {
        console.error('Error toggling job visibility:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job visibility'
        });
    }
};
export const toggleJobVisibility_0 = async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ success: false, message: 'Job ID không hợp lệ' });
    }

    try {
        // 1. Tìm job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy công việc' });
        }

        // 2. Kiểm tra quyền sở hữu
        if (job.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thay đổi công việc này' });
        }

        // 3. Đảo ngược trạng thái isVisible
        job.visible = !job.visible; // Lật trạng thái true/false

        // 4. Lưu lại
        await job.save();

        res.json({
            success: true,
            message: `Đã ${job.visible ? 'bật hiển thị' : 'tắt hiển thị'} công việc "${job.title}"`,
            job: { _id: job._id, visible: job.visible } // Trả về trạng thái mới
        });

    } catch (error) {
        console.error(`Error toggling visibility for job ${jobId}:`, error);
        res.status(500).json({ success: false, message: 'Lỗi server khi thay đổi trạng thái hiển thị' });
    }
};


// Thêm vào file d:\Job_portal_website\server\controllers\companyController.js

// Thêm 3 controller mới
export const updateCompanyProfile = async (req, res) => {
    try {
        const companyId = req.company._id;
        const {
            name,
            email,
            phone,
            website,
            location,
            foundedYear,
            industry,
            employees,
            description,
            benefits,
            image
        } = req.body;

        // Validate email format if provided
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Find and update company
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Update allowed fields
        if (name) company.name = name;
        if (email) company.email = email;
        if (phone !== undefined) company.phone = phone;
        if (website !== undefined) company.website = website;
        if (location !== undefined) company.location = location;
        if (foundedYear !== undefined) company.foundedYear = foundedYear;
        if (industry !== undefined) company.industry = industry;
        if (employees !== undefined) company.employees = employees;
        if (description !== undefined) company.description = description;
        if (benefits !== undefined) company.benefits = benefits;
        if (image) company.image = image;

        await company.save();

        // Return updated company data
        res.json({
            success: true,
            message: 'Company profile updated successfully',
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                phone: company.phone,
                website: company.website,
                location: company.location,
                foundedYear: company.foundedYear,
                industry: company.industry,
                employees: company.employees,
                description: company.description,
                benefits: company.benefits,
                image: company.image,
                status: company.status,
                subscription: company.subscription
            }
        });
    } catch (error) {
        console.error('Error updating company profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating company profile',
            error: error.message
        });
    }
};

export const uploadCompanyImage = async (req, res) => {
    try {
        const companyId = req.company._id;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to Cloudinary or your preferred storage
        const result = await cloudinary.uploader.upload(imageFile.path, {
            folder: 'company_logos',
            width: 400,
            crop: "limit"
        });

        // Update company with new image URL
        const company = await Company.findByIdAndUpdate(
            companyId,
            { image: result.secure_url },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Company logo uploaded successfully',
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Error uploading company image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading company image',
            error: error.message
        });
    }
};

// Cập nhật hàm getCompanyStats để trả về thêm thông tin cho dashboard
// Cập nhật hàm getCompanyStats để trả về thông tin phân tích

// Cập nhật hàm getCompanyStats hoặc thêm nếu chưa có

export const getCompanyStats = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Tìm tất cả công việc của công ty
        const jobs = await Job.find({
            companyId,
            status: 'approved',
            visible: true
        });

        // Đếm số công việc đang hoạt động
        const activeJobs = jobs.length;

        // Tìm tất cả đơn ứng tuyển cho công ty này
        const applications = await JobApplication.find({ companyId })
            .populate('jobId')
            .populate('userId');

        // Đếm tổng số đơn ứng tuyển
        const totalApplications = applications.length;

        // Đếm số ứng viên đã được tuyển
        const hiredCandidates = applications.filter(app => app.status === 'hired').length;

        // Đếm số đơn ứng tuyển mới (trong vòng 7 ngày)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newApplications = applications.filter(app => {
            const appDate = app.date || app.createdAt;
            return new Date(appDate) >= sevenDaysAgo;
        }).length;

        // Tổng lượt xem của tất cả công việc
        const viewCount = jobs.reduce((total, job) => total + (job.viewCount || 0), 0);

        // Tỷ lệ chuyển đổi (số đơn ứng tuyển / lượt xem)
        const conversionRate = viewCount ? Math.round((totalApplications / viewCount) * 100) : 0;

        // Tìm job có hiệu suất tốt nhất
        let topPerformingJob = null;
        if (jobs.length > 0) {
            // Sort jobs by applications count
            const jobsWithStats = jobs.map(job => {
                const jobApplications = applications.filter(app =>
                    app.jobId && app.jobId._id.toString() === job._id.toString()
                ).length;
                const conversion = job.viewCount ? (jobApplications / job.viewCount) * 100 : 0;
                return {
                    _id: job._id,
                    title: job.title,
                    applications: jobApplications,
                    views: job.viewCount || 0,
                    conversion
                };
            });

            // Get top job by conversion rate or applications if tie
            jobsWithStats.sort((a, b) => {
                if (b.conversion === a.conversion) {
                    return b.applications - a.applications;
                }
                return b.conversion - a.conversion;
            });

            if (jobsWithStats.length > 0) {
                topPerformingJob = jobsWithStats[0];
            }
        }

        // Application timeline (dummy data if not available)
        const applicationTimeline = generateTimelineData(applications, 4);

        // Views timeline (dummy data if not available)
        const viewsTimeline = generateViewsTimeline(jobs, 4);

        // Applications by job (dummy data if not available)
        const conversionByJob = generateConversionByJob(jobs, applications);

        // Top skills from applicants (dummy data if not available)
        const topSkills = generateTopSkills(applications);

        // Trả về kết quả
        res.json({
            success: true,
            stats: {
                activeJobs,
                totalApplications,
                hiredCandidates,
                newApplications,
                viewCount,
                conversionRate,
                topPerformingJob,
                applicationTimeline,
                viewsTimeline,
                conversionByJob,
                topSkills,
                pendingReviews: Math.floor(Math.random() * 5) // Dummy data for pending reviews
            }
        });
    } catch (error) {
        console.error('Error in getCompanyStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving company stats',
            error: error.message
        });
    }
};

// Helper functions to generate timeline data
function generateTimelineData(applications, weeksCount) {
    const timeline = [];
    const today = new Date();

    for (let i = 0; i < weeksCount; i++) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - ((weeksCount - i - 1) * 7 + 7));

        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (weeksCount - i - 1) * 7);

        // Count applications in this week range
        const weekApps = applications.filter(app => {
            const appDate = app.date || app.createdAt;
            return appDate >= weekStart && appDate < weekEnd;
        }).length;

        timeline.push({
            name: `Week ${i + 1}`,
            applications: weekApps || Math.floor(Math.random() * 10) + 1 // Fallback to dummy data
        });
    }

    return timeline;
}

function generateViewsTimeline(jobs, weeksCount) {
    // In a real implementation, you would use actual view data with timestamps
    // For now, we'll generate dummy data
    const timeline = [];

    for (let i = 0; i < weeksCount; i++) {
        timeline.push({
            name: `Week ${i + 1}`,
            views: Math.floor(Math.random() * 60) + 20
        });
    }

    return timeline;
}

function generateConversionByJob(jobs, applications) {
    if (jobs.length === 0) {
        // Return dummy data if no jobs
        return [
            { name: 'Frontend Developer', value: 28 },
            { name: 'UI Designer', value: 20 },
            { name: 'Project Manager', value: 15 },
            { name: 'DevOps Engineer', value: 12 }
        ];
    }

    const jobApplicationCounts = {};

    // Count applications per job
    applications.forEach(app => {
        if (app.jobId) {
            const jobId = app.jobId._id.toString();
            const jobTitle = app.jobId.title;

            if (!jobApplicationCounts[jobId]) {
                jobApplicationCounts[jobId] = {
                    name: jobTitle,
                    value: 0
                };
            }

            jobApplicationCounts[jobId].value++;
        }
    });

    // Convert to array and get top 5
    const conversionData = Object.values(jobApplicationCounts)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Return dummy data if no applications found
    if (conversionData.length === 0) {
        return [
            { name: 'Frontend Developer', value: 28 },
            { name: 'UI Designer', value: 20 },
            { name: 'Project Manager', value: 15 },
            { name: 'DevOps Engineer', value: 12 }
        ];
    }

    return conversionData;
}

function generateTopSkills(applications) {
    const skillsCount = {};

    // Count skills from applicant profiles
    applications.forEach(app => {
        if (app.userId && app.userId.skills && Array.isArray(app.userId.skills)) {
            app.userId.skills.forEach(skill => {
                if (!skillsCount[skill]) {
                    skillsCount[skill] = 0;
                }
                skillsCount[skill]++;
            });
        }
    });

    // Convert to array and get top 5
    const topSkills = Object.entries(skillsCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Return dummy data if no skills found
    if (topSkills.length === 0) {
        return [
            { name: 'React', count: 25 },
            { name: 'JavaScript', count: 18 },
            { name: 'Node.js', count: 12 },
            { name: 'SQL', count: 10 },
            { name: 'Python', count: 8 }
        ];
    }

    return topSkills;
}
export const getCompanyStats_2 = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Tìm tất cả công việc của công ty
        const jobs = await Job.find({
            companyId,
            status: 'approved',
            visible: true
        });

        // Đếm số công việc đang hoạt động
        const activeJobs = jobs.length;

        // Tìm tất cả đơn ứng tuyển cho công ty này
        const applications = await JobApplication.find({ companyId })
            .populate('jobId')
            .populate('userId');

        // Đếm tổng số đơn ứng tuyển
        const totalApplications = applications.length;

        // Đếm số ứng viên đã được tuyển
        const hiredCandidates = applications.filter(app => app.status === 'hired').length;

        // Đếm số đơn ứng tuyển mới (trong vòng 7 ngày)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newApplications = applications.filter(app => {
            const appDate = app.date || app.createdAt;
            return new Date(appDate) >= sevenDaysAgo;
        }).length;

        // Tổng lượt xem của tất cả công việc
        const viewCount = jobs.reduce((total, job) => total + (job.viewCount || 0), 0);

        // Tỷ lệ chuyển đổi (số đơn ứng tuyển / lượt xem)
        const conversionRate = viewCount ? Math.round((totalApplications / viewCount) * 100) : 0;

        // Tìm job có hiệu suất tốt nhất
        let topPerformingJob = null;
        if (jobs.length > 0) {
            // Sort jobs by applications count
            const jobsWithStats = jobs.map(job => {
                const jobApplications = applications.filter(app =>
                    app.jobId && app.jobId._id.toString() === job._id.toString()
                ).length;
                const conversion = job.viewCount ? (jobApplications / job.viewCount) * 100 : 0;
                return {
                    _id: job._id,
                    title: job.title,
                    applications: jobApplications,
                    views: job.viewCount || 0,
                    conversion
                };
            });

            // Get top job by conversion rate or applications if tie
            jobsWithStats.sort((a, b) => {
                if (b.conversion === a.conversion) {
                    return b.applications - a.applications;
                }
                return b.conversion - a.conversion;
            });

            topPerformingJob = jobsWithStats[0];
        }

        // Ứng dụng theo tuần (4 tuần gần nhất)
        const applicationTimeline = [];
        const today = new Date();

        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - (i * 7 + 7));

            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() - (i * 7));

            const weekApps = applications.filter(app => {
                const appDate = app.date || app.createdAt;
                return new Date(appDate) >= weekStart && new Date(appDate) < weekEnd;
            }).length;

            applicationTimeline.push({
                name: `Week ${4 - i}`,
                applications: weekApps
            });
        }

        // Lượt xem theo tuần
        const viewsTimeline = [];
        // Giả định chúng ta có dữ liệu lượt xem theo ngày (hoặc tính toán từ viewCount tổng)
        // Đây chỉ là dữ liệu mẫu
        for (let i = 0; i < 4; i++) {
            viewsTimeline.push({
                name: `Week ${i + 1}`,
                views: Math.floor(Math.random() * 50) + 20 // Random data for demonstration
            });
        }

        // Đơn ứng tuyển theo công việc
        const conversionByJob = [];
        const jobApplicationCounts = {};

        applications.forEach(app => {
            if (app.jobId) {
                const jobId = app.jobId._id.toString();
                const jobTitle = app.jobId.title;

                if (!jobApplicationCounts[jobId]) {
                    jobApplicationCounts[jobId] = {
                        name: jobTitle,
                        value: 0
                    };
                }

                jobApplicationCounts[jobId].value++;
            }
        });

        // Convert to array and get top 5
        conversionByJob.push(...Object.values(jobApplicationCounts)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5));

        // Kỹ năng hàng đầu từ đơn ứng tuyển
        const skillsCount = {};

        applications.forEach(app => {
            if (app.userId && app.userId.skills) {
                app.userId.skills.forEach(skill => {
                    if (!skillsCount[skill]) {
                        skillsCount[skill] = 0;
                    }

                    skillsCount[skill]++;
                });
            }
        });

        const topSkills = Object.entries(skillsCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Trả về kết quả
        res.json({
            success: true,
            stats: {
                activeJobs,
                totalApplications,
                hiredCandidates,
                newApplications,
                viewCount,
                conversionRate,
                topPerformingJob,
                applicationTimeline,
                viewsTimeline,
                conversionByJob,
                topSkills
            }
        });
    } catch (error) {
        console.error('Error in getCompanyStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving company stats',
            error: error.message
        });
    }
};
export const getCompanyStats_1 = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Tìm tất cả công việc của công ty
        const jobs = await Job.find({
            companyId,
            status: 'approved', // Chỉ đếm các job đã được duyệt
            visible: true // Chỉ đếm các job đang hiện
        });

        // Đếm số công việc đang hoạt động
        const activeJobs = jobs.length;

        // Tìm tất cả đơn ứng tuyển cho công ty này
        const applications = await JobApplication.find({ companyId });

        // Đếm tổng số đơn ứng tuyển
        const totalApplications = applications.length;

        // Đếm số ứng viên đã được tuyển
        const hiredCandidates = applications.filter(app => app.status === 'hired').length;

        // Đếm số đơn ứng tuyển mới (trong vòng 7 ngày)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newApplications = applications.filter(app => {
            const appDate = app.date || app.createdAt;
            return new Date(appDate) >= sevenDaysAgo;
        }).length;

        // Trả về kết quả
        res.json({
            success: true,
            stats: {
                activeJobs,
                totalApplications,
                hiredCandidates,
                newApplications
            }
        });
    } catch (error) {
        console.error('Error in getCompanyStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving company stats',
            error: error.message
        });
    }
};
export const getCompanyStats_0 = async (req, res) => {
    try {
        const companyId = req.company._id;

        // Get active jobs count
        const activeJobs = await Job.countDocuments({
            companyId,
            status: 'active',
            visible: true
        });

        // Get total applications
        const totalApplications = await JobApplication.countDocuments({
            companyId
        });

        // Get hired candidates
        const hiredCandidates = await JobApplication.countDocuments({
            companyId,
            status: 'hired'
        });

        // Get recent applications (optional)
        const recentApplications = await JobApplication.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email image')
            .populate('jobId', 'title');

        res.json({
            success: true,
            stats: {
                activeJobs,
                totalApplications,
                hiredCandidates,
                recentApplications
            }
        });
    } catch (error) {
        console.error('Error fetching company stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company stats',
            error: error.message
        });
    }
};