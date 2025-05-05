import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import mongoose from "mongoose"
// Get all jobs
export const getJobs_ok2 = async (req, res) => {
    try {
        console.log('Fetching jobs with parameters:', req.query);

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {
            visible: true,
            status: { $in: ['active', 'approved'] }
        };

        // Add keyword search if provided
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Location filter
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Job type filter
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Salary range filter - Sửa đổi để sử dụng minSalary và maxSalary
        if (req.query.minSalary) {
            // Tìm các công việc có maxSalary lớn hơn hoặc bằng minSalary đã chọn
            filter.maxSalary = { $gte: parseInt(req.query.minSalary) };
        }
        if (req.query.maxSalary) {
            // Tìm các công việc có minSalary nhỏ hơn hoặc bằng maxSalary đã chọn
            filter.minSalary = { ...filter.minSalary, $lte: parseInt(req.query.maxSalary) };
        }

        // Experience level filter
        if (req.query.level) {
            filter.level = req.query.level;
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first

        if (req.query.sort) {
            switch (req.query.sort) {
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'salary-high-low':
                    sortOption = { maxSalary: -1, minSalary: -1 }; // Sửa để dùng trường số
                    break;
                case 'salary-low-high':
                    sortOption = { minSalary: 1, maxSalary: 1 }; // Sửa để dùng trường số
                    break;
                case 'title-az':
                    sortOption = { title: 1 };
                    break;
                case 'title-za':
                    sortOption = { title: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }

        // Get total count for pagination info
        const total = await Job.countDocuments(filter);

        // Execute query with pagination
        const jobs = await Job.find(filter)
            .populate('companyId', 'name image location')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        console.log(`Found ${jobs.length} jobs (page ${page}/${Math.ceil(total / limit)})`);

        return res.status(200).json({
            success: true,
            jobs: jobs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error in getJobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};
export const getJobs_ok1 = async (req, res) => {
    try {
        console.log('Fetching jobs with parameters:', req.query);

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {
            visible: true,
            status: { $in: ['active', 'approved'] }
        };

        // Add keyword search if provided
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Location filter
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Job type filter
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Salary range filter
        if (req.query.minSalary) {
            filter.salary = { ...filter.salary, $gte: parseInt(req.query.minSalary) };
        }
        if (req.query.maxSalary) {
            filter.salary = { ...filter.salary, $lte: parseInt(req.query.maxSalary) };
        }

        // Experience level filter
        if (req.query.level) {
            filter.level = req.query.level;
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first

        if (req.query.sort) {
            switch (req.query.sort) {
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'salary-high-low':
                    sortOption = { salary: -1 };
                    break;
                case 'salary-low-high':
                    sortOption = { salary: 1 };
                    break;
                case 'title-az':
                    sortOption = { title: 1 };
                    break;
                case 'title-za':
                    sortOption = { title: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }

        // Get total count for pagination info
        const total = await Job.countDocuments(filter);

        // Execute query with pagination
        const jobs = await Job.find(filter)
            .populate('companyId', 'name image location')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        console.log(`Found ${jobs.length} jobs (page ${page}/${Math.ceil(total / limit)})`);

        return res.status(200).json({
            success: true,
            jobs: jobs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error in getJobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};
export const getJobs_ok = async (req, res) => {
    try {
        console.log('Fetching jobs...');

        // Chỉ lấy các jobs active và visible      
        const jobs = await Job.find({
            status: { $in: ['active', 'approved'] },
            visible: true
        })
            .populate('companyId', 'name image location')
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${jobs.length} jobs`);

        return res.status(200).json({
            success: true,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error in getJobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};
export const getJobs_2 = async (req, res) => {
    try {
        console.log('Fetching jobs...'); // Debug log

        const jobs = await Job.find({
            status: 'active',
            visible: true
        })
            .populate('companyId', 'name image location')
            .lean()  // Convert to plain JS object for better performance
            .timeout(15000); // Set timeout to 15 seconds

        console.log(`Found ${jobs.length} jobs`); // Debug log

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error in getJobs:', error);

        // Handle specific timeout error
        if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
            return res.status(503).json({
                success: false,
                message: 'Database timeout. Please try again.',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};
export const getJobs_1 = async (req, res) => {
    try {
        console.log('Fetching jobs...'); // Debug log

        const query = {
            status: 'active',
            visible: true
        };

        const jobs = await Job.find(query)
            .populate({
                path: 'companyId',
                select: 'name image location -_id'
            });

        console.log(`Found ${jobs.length} jobs`); // Debug log

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error in getJobs:', error); // Debug log
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
}
export const getJobs_0 = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {
            visible: true,
            status: 'active'

        };

        // Nếu có query status, thêm vào điều kiện tìm kiếm
        // if (status) {
        // query.status = status;
        // }

        const jobs = await Job.find(query)
            .populate({ path: 'companyId', select: '-password' });

        res.json({ success: true, jobs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// export const getJobs = async (req, res) => {
// try {
// 
// const jobs = await Job.find({ visible: true })
// .populate({ path: 'companyId', select: '-password' })
// 
// res.json({ success: true, jobs })
// } catch (error) {
// res.json({ success: false, message: error.message })
// }
// }

// Get a single job by ID
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format'
            });
        }

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: 'name email image location'
            })
            .lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Get applications count
        const applicationsCount = await JobApplication.countDocuments({ jobId: id });
        console.log(`Applications count for job ${id}:`, applicationsCount);

        // Add applications count to job data
        const jobWithCount = {
            ...job,
            applicationsCount
        };

        res.json({
            success: true,
            job: jobWithCount
        });

    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job details',
            error: error.message
        });
    }
};
export const getJobById_1 = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Get actual applications count
        const applicationsCount = await JobApplication.countDocuments({ jobId: id });
        console.log(`Applications count for job ${id}:`, applicationsCount);

        // Update job's applicationsCount if different
        if (job.applicationsCount !== applicationsCount) {
            job.applicationsCount = applicationsCount;
            await job.save();
            console.log('Updated job applications count to:', applicationsCount);
        }

        res.json({
            success: true,
            job: {
                ...job.toObject(),
                applicationsCount
            }
        });

    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getJobById_0 = async (req, res) => {
    try {

        const { id } = req.params

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            })

        if (!job) {
            return res.json({
                success: false,
                message: 'Job not found'
            })
        }
        res.json({
            success: true,
            job
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// Delete a job by ID
// export const deleteJob = async (req, res) => {
// try {
// const { id } = req.params;
// 
//Tìm công việc cần xóa
// const job = await Job.findById(id);
// if (!job) {
// return res.json({ success: false, message: "Job not found" });
// }
// 
//Xóa công việc
// await Job.findByIdAndDelete(id);
// 
// res.json({ success: true, message: "Job deleted successfully" });
// } catch (error) {
// res.json({ success: false, message: error.message });
// }
// };


// Sửa hàm updateJob để xử lý cập nhật mức lương mới
// Sửa hàm updateJob để xử lý cập nhật mức lương mới
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log("Dữ liệu cập nhật:", updateData);

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID công việc không hợp lệ'
            });
        }

        // Tìm công việc hiện tại để lấy thông tin
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công việc"
            });
        }

        // Kiểm tra và xử lý dữ liệu lương
        if ((updateData.minSalary !== undefined || updateData.maxSalary !== undefined) &&
            updateData.currency === undefined) {
            // Nếu cập nhật minSalary hoặc maxSalary mà không có currency, lấy currency hiện tại
            updateData.currency = existingJob.currency;
        }

        // Đảm bảo minSalary và maxSalary là số
        if (updateData.minSalary !== undefined) {
            updateData.minSalary = Number(updateData.minSalary);
        }
        if (updateData.maxSalary !== undefined) {
            updateData.maxSalary = Number(updateData.maxSalary);
        }

        // Kiểm tra minSalary <= maxSalary
        const minSalary = updateData.minSalary !== undefined ? updateData.minSalary : existingJob.minSalary;
        const maxSalary = updateData.maxSalary !== undefined ? updateData.maxSalary : existingJob.maxSalary;

        if (minSalary > maxSalary) {
            return res.status(400).json({
                success: false,
                message: "Mức lương tối thiểu không thể lớn hơn mức lương tối đa"
            });
        }

        // Tạo salaryDisplay nếu cập nhật thông tin lương
        if (updateData.minSalary !== undefined || updateData.maxSalary !== undefined || updateData.currency !== undefined) {
            const formatNumber = (num) => {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            const displayMinSalary = formatNumber(minSalary);
            const displayMaxSalary = formatNumber(maxSalary);
            const displayCurrency = updateData.currency || existingJob.currency;

            if (minSalary === maxSalary) {
                updateData.salaryDisplay = `${displayMinSalary} ${displayCurrency}`;
            } else {
                updateData.salaryDisplay = `${displayMinSalary} - ${displayMaxSalary} ${displayCurrency}`;
            }
        }

        // Thực hiện cập nhật
        const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        console.log("Công việc sau khi cập nhật:", updatedJob);

        res.json({
            success: true,
            message: "Cập nhật công việc thành công",
            job: updatedJob
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật công việc:", error);

        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật công việc",
            error: error.message
        });
    }
};

// Cập nhật hàm getJobs để xử lý lọc theo mức lương mới
export const getJobs = async (req, res) => {
    try {
        console.log('Fetching jobs with parameters:', req.query);

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {
            visible: true,
            status: { $in: ['active', 'approved'] }
        };

        // Add keyword search if provided
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Location filter
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Job type filter
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Currency filter
        if (req.query.currency) {
            filter.currency = req.query.currency;
        }

        // Salary range filter - Cải thiện tìm kiếm theo lương
        if (req.query.minSalary) {
            // Tìm các công việc có mức lương tối đa >= minSalary người dùng yêu cầu
            filter.maxSalary = { $gte: parseInt(req.query.minSalary) };
        }
        if (req.query.maxSalary) {
            // Tìm các công việc có mức lương tối thiểu <= maxSalary người dùng yêu cầu
            filter.minSalary = { $lte: parseInt(req.query.maxSalary) };
        }

        // Experience level filter
        if (req.query.experience) {
            filter.experience = req.query.experience;
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first

        if (req.query.sort) {
            switch (req.query.sort) {
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'salary-high-low':
                    sortOption = { maxSalary: -1, minSalary: -1 };
                    break;
                case 'salary-low-high':
                    sortOption = { minSalary: 1, maxSalary: 1 };
                    break;
                case 'title-az':
                    sortOption = { title: 1 };
                    break;
                case 'title-za':
                    sortOption = { title: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }

        // Get total count for pagination info
        const total = await Job.countDocuments(filter);

        // Execute query with pagination
        const jobs = await Job.find(filter)
            .populate('companyId', 'name image location')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        console.log(`Found ${jobs.length} jobs (page ${page}/${Math.ceil(total / limit)})`);

        return res.status(200).json({
            success: true,
            jobs: jobs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error in getJobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

export const updateJob_0 = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, job: updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const approveJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findByIdAndUpdate(
            jobId,
            { status: 'approved' },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Job approved successfully',
            data: job
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error approving job',
            error: error.message
        });
    }
};



export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.company._id;

        // Validate jobId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format'
            });
        }

        // Kiểm tra quyền truy cập - Chỉ cho phép chủ sở hữu công việc xóa
        const job = await Job.findOne({ _id: id, companyId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or you do not have permission to delete it'
            });
        }

        // Xóa tất cả đơn ứng tuyển liên quan đến job này
        const deleteApplicationsResult = await JobApplication.deleteMany({ id });

        // Xóa job
        await Job.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: 'Job and all related applications have been permanently deleted',
            deletedApplicationsCount: deleteApplicationsResult.deletedCount,
            job: {
                _id: job._id,
                title: job.title
            }
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};


export const getJobDetails = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.company._id;

        // Kiểm tra xem jobId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'ID công việc không hợp lệ'
            });
        }

        // Tìm job và không cần kiểm tra quyền truy cập khi chỉ xem chi tiết
        const job = await Job.findById(jobId)
            .populate('companyId', 'name image location')
            .lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc'
            });
        }

        // Kiểm tra quyền truy cập - chỉ khi công ty đang đăng nhập là chủ sở hữu công việc
        if (job.companyId._id.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập công việc này'
            });
        }

        return res.json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Error fetching job details:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin công việc',
            error: error.message
        });
    }
};

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            minSalary,
            maxSalary,
            currency,
            type,
            experience,
            category,
            requiredSkills,
            preferredSkills
        } = req.body;

        const companyId = req.company._id;

        // Validation
        if (!title || !description || !location || !minSalary || !maxSalary || !currency || !type || !experience || !category) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc"
            });
        }

        // Kiểm tra minSalary <= maxSalary
        if (Number(minSalary) > Number(maxSalary)) {
            return res.status(400).json({
                success: false,
                message: "Mức lương tối thiểu không thể lớn hơn mức lương tối đa"
            });
        }

        // Validate enum values
        const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
        const validExperience = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];
        const validCurrencies = ['USD', 'VND', 'EUR', 'JPY', 'SGD'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Loại công việc không hợp lệ"
            });
        }

        if (!validExperience.includes(experience)) {
            return res.status(400).json({
                success: false,
                message: "Mức kinh nghiệm không hợp lệ"
            });
        }

        if (!validCurrencies.includes(currency)) {
            return res.status(400).json({
                success: false,
                message: "Đơn vị tiền tệ không hợp lệ"
            });
        }

        // Định dạng số để hiển thị (thêm dấu phân cách hàng nghìn)
        const formatNumber = (num) => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        // Tạo chuỗi hiển thị lương
        let salaryDisplay;
        if (Number(minSalary) === Number(maxSalary)) {
            salaryDisplay = `${formatNumber(minSalary)} ${currency}`;
        } else {
            salaryDisplay = `${formatNumber(minSalary)} - ${formatNumber(maxSalary)} ${currency}`;
        }

        // Create new job
        const newJob = await Job.create({
            title,
            description,
            location,
            minSalary: Number(minSalary),
            maxSalary: Number(maxSalary),
            currency,
            salaryDisplay,
            type,
            experience,
            category,
            companyId,
            requiredSkills: requiredSkills || [],
            preferredSkills: preferredSkills || [],
            companyName: req.company.name, // Thêm tên công ty để hiển thị trong thông báo
            status: 'pending',  // Default status for new jobs
            visible: false      // Default visibility
        });

        console.log('New job created:', newJob._id);

        // THÊM ĐOẠN NÀY: Gửi thông báo cho admin
        // try {
        // await notifyNewJobCreated(newJob);
        // console.log('Admin notification sent for new job:', newJob._id);
        // } catch (notifyError) {
        // console.error('Error sending notification for new job:', notifyError);
        // Vẫn tiếp tục xử lý ngay cả khi gửi thông báo lỗi
        // }

        res.status(201).json({
            success: true,
            message: "Công việc đã được tạo và đang chờ admin duyệt",
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
export const toggleJobVisibility = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.company._id;

        console.log('Toggle visibility request params:', req.params);
        console.log('JobId extracted:', jobId);
        console.log('Company ID:', companyId);

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'ID công việc không hợp lệ'
            });
        }

        // Tìm job và verify ownership
        const job = await Job.findOne({
            _id: jobId,
            companyId
        });

        console.log('Job found:', job ? 'Yes' : 'No');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc hoặc bạn không có quyền truy cập'
            });
        }

        // Kiểm tra status approved     
        if (job.status !== 'active' && job.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Chỉ những công việc đã được duyệt hoặc đang hoạt động mới có thể thay đổi trạng thái hiển thị"
            });
        }

        // Toggle visibility sử dụng updateOne để tránh validation
        const result = await Job.updateOne(
            { _id: jobId },
            { $set: { visible: !job.visible } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Không thể cập nhật trạng thái hiển thị"
            });
        }

        // Lấy lại job sau khi cập nhật
        const updatedJob = await Job.findById(jobId);

        console.log('Job visibility toggled to:', updatedJob.visible);

        res.json({
            success: true,
            message: `Công việc đã được ${updatedJob.visible ? 'hiển thị' : 'ẩn'} thành công`,
            job: updatedJob
        });
    } catch (error) {
        console.error('Error toggling job visibility:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái hiển thị',
            error: error.message
        });
    }
};
export const toggleJobVisibility_1 = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.company._id;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'ID công việc không hợp lệ'
            });
        }

        // Tìm job và verify ownership
        const job = await Job.findOne({
            _id: jobId,
            companyId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc hoặc bạn không có quyền truy cập'
            });
        }

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

        res.json({
            success: true,
            message: `Công việc đã được ${job.visible ? 'hiển thị' : 'ẩn'} thành công`,
            job
        });
    } catch (error) {
        console.error('Error toggling job visibility:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái hiển thị',
            error: error.message
        });
    }
};
export const toggleJobVisibility_0 = async (req, res) => {
    try {
        const jobId = req.params.jobId;
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