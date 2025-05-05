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
    // salary: {
    // type: String,
    // required: [true, 'Please provide salary range']
    // },
    minSalary: {
        type: Number,
        required: [function () {
            // Chỉ bắt buộc khi tạo mới document
            return this.isNew;
        }, 'Please provide minimum salary'],
        min: [0, 'Minimum salary cannot be negative']
    },
    // Thay đổi trường maxSalary
    maxSalary: {
        type: Number,
        required: [function () {
            // Chỉ bắt buộc khi tạo mới document
            return this.isNew;
        }, 'Please provide maximum salary'],
        min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
        type: String,
        required: [function () {
            // Chỉ bắt buộc khi tạo mới document
            return this.isNew;
        }, 'Please provide salary currency'],
        enum: ['USD', 'VND', 'EUR', 'JPY', 'SGD'],
        default: 'USD'
    },
    salaryDisplay: {
        type: String,
        // Trường này sẽ được tạo tự động để hiển thị - không yêu cầu nhập
    },
    salaryDisplay: {
        type: String,
        // Trường này sẽ được tạo tự động để hiển thị - không yêu cầu nhập
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

// Middleware để tự động tạo chuỗi hiển thị lương
jobSchema.pre('save', function (next) {
    // Kiểm tra nếu minSalary và maxSalary tồn tại
    if (this.minSalary !== undefined && this.maxSalary !== undefined) {
        // Định dạng số để hiển thị (thêm dấu phân cách hàng nghìn)
        const formatNumber = (num) => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        // Tạo chuỗi hiển thị lương
        if (this.minSalary === this.maxSalary) {
            this.salaryDisplay = `${formatNumber(this.minSalary)} ${this.currency}`;
        } else {
            this.salaryDisplay = `${formatNumber(this.minSalary)} - ${formatNumber(this.maxSalary)} ${this.currency}`;
        }
    }

    // Validate: maxSalary phải lớn hơn hoặc bằng minSalary
    if (this.minSalary > this.maxSalary) {
        this.maxSalary = this.minSalary;
    }

    next();
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