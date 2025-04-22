import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import mongoose from "mongoose"
// Get all jobs
export const getJobs = async (req, res) => {
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
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm công việc cần xóa
        const job = await Job.findById(id);
        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }

        // Xóa công việc
        await Job.findByIdAndDelete(id);

        res.json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const updateJob = async (req, res) => {
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

