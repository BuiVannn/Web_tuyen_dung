import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide job title']
    },
    description: {
        type: String,
        required: [true, 'Please provide job description']
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    location: {
        type: String,
        required: [true, 'Please provide job location']
    },
    salary: {
        type: String,
        required: [true, 'Please provide salary range']
    },
    type: {
        type: String,
        required: [true, 'Please provide job type'],
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    },
    experience: {
        type: String,
        required: [true, 'Please provide experience level'],
        enum: ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert']

    },
    category: {
        type: String,
        required: [true, 'Please provide job category']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    preferredSkills: {
        type: [String],
        default: []
    },
    visible: {
        type: Boolean,
        default: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    applicationsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);

// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     requirements: {
//         type: String,
//         required: true,
//     },
//     location: { type: String, required: true },
//     category: { type: String, required: true },
//     level: { type: String, required: true },
//     salary: { type: Number, required: true },
//     company: {
//         type: String,
//         required: true,
//     },
//     type: {
//         type: String,
//         required: true,
//     },
//     experience: {
//         type: String,
//         required: true,
//     },
//     date: { type: Number, required: true },
//     visible: { type: Boolean, default: false },
//     companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
//     status: {
//         type: String,
//         enum: ['pending', 'active', 'inactive'],
//         default: 'pending'
//     },
//     applications: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Application'
//     }]
// }, {
//     timestamps: true
// });

// jobSchema.pre('save', function (next) {
//     if (this.status === 'inactive') {
//         this.visible = false;
//     }
//     next();
// });

// const Job = mongoose.model('Job', jobSchema)

// export default Job