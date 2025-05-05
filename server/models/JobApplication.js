import mongoose from 'mongoose';

const jobApplicationSchema = mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'viewed', 'reviewing', 'shortlisted', 'rejected', 'interviewing', 'interview_scheduled', 'offered', 'hired', 'withdrawn'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    // Thông tin cơ bản của ứng viên
    basicInfo: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        birthYear: {
            type: Number
        },
        education: {
            type: String
        },
        coverLetter: {
            type: String
        },
        resumeUrl: {
            type: String
        },
        submittedFrom: {
            type: String // Device/browser info
        },
        ipAddress: {
            type: String
        }
    },
    // Lưu lịch sử tương tác với ứng viên
    interactionHistory: [{
        action: {
            type: String,
            enum: ['status_change', 'viewed', 'contacted', 'interview_scheduled', 'feedback_added']
        },
        date: {
            type: Date,
            default: Date.now
        },
        notes: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('JobApplication', jobApplicationSchema);

// import mongoose from 'mongoose';

// const jobApplicationSchema = new mongoose.Schema({
//     companyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Company',
//         required: true
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     jobId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Job',
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'viewed', 'shortlisted', 'interviewing', 'hired', 'rejected'],
//         default: 'pending'
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

//export default mongoose.model('JobApplication', jobApplicationSchema);










// import mongoose from 'mongoose';

// const jobApplicationSchema = new mongoose.Schema({
//     job: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Job',
//         required: true
//     },
//     user: {
//         type: String, // Changed from ObjectId to String
//         ref: 'User',
//         required: true
//     },
//     company: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Company',
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'rejected'],
//         default: 'pending'
//     },
//     resume: String,
//     coverLetter: String
// }, {
//     timestamps: true
// });

// export default mongoose.model('JobApplication', jobApplicationSchema);
// // import mongoose from "mongoose";

// // const JobApplicationSchema = new mongoose.Schema({
// //     userId: { type: String, ref: 'User', required: true },
// //     companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
// //     jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
// //     status: {
// //         type: String,
// //         enum: ['pending', 'viewed', 'shortlisted', 'interviewing', 'rejected', 'hired'],
// //         default: 'pending'
// //     },
// //     coverLetter: { type: String },
// //     portfolio: { type: String },
// //     date: { type: Number, default: Date.now }
// // }, {
// //     timestamps: true
// // });

// // const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);
// // export default JobApplication;
// // // import mongoose from "mongoose";

// // // const JobApplicationSchema = new mongoose.Schema({
// // //     userId: { type: String, ref: 'User', required: true },
// // //     companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
// // //     jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
// // //     status: { type: String, default: 'Pending' },
// // //     date: { type: Number, required: true }
// // // })

// // // const JobApplication = mongoose.model('JobApplication', JobApplicationSchema)

// // // export default JobApplication