import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        //minlength: 6
    },
    image: {
        type: String,
        default: 'default_company_image_url'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    phone: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    foundedYear: {
        type: Number
    },
    industry: {
        type: String,
        trim: true
    },
    employees: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    benefits: {
        type: [String],
        default: []
    },
    subscription: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    },
    subscriptionExpiryDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Add method to generate JWT token
// companySchema.methods.generateAuthToken = function () {
// return jwt.sign(
// { companyId: this._id },
// process.env.JWT_SECRET,
// { expiresIn: '30d' }
// );
// };

// Đảm bảo password chỉ được hash một lần
companySchema.pre('save', async function (next) {
    // Chỉ hash password nếu nó được sửa đổi
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Hash password before saving
// companySchema.pre('save', async function (next) {
// if (!this.isModified('password')) return next();
// 
// const salt = await bcryptjs.genSalt(10);
// this.password = await bcryptjs.hash(this.password, salt);
//this.password = await bcryptjs.hash(this.password, 12);
//next();
// });

// Add method to compare password
companySchema.methods.comparePassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

const Company = mongoose.model('Company', companySchema);
export default Company;

// import mongoose from "mongoose";

// const companySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     image: { type: String, required: true },
//     password: { type: String, required: true },
// })

// const Company = mongoose.model('Company', companySchema)

// export default Company