import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide admin name'] // Thêm message lỗi rõ ràng hơn
    },
    email: {
        type: String,
        required: [true, 'Please provide admin email'],
        unique: true,
        lowercase: true // *** Thêm: Lưu email dạng chữ thường ***
    },
    password: {
        type: String,
        required: [true, 'Please provide admin password'],
        minlength: 6 // *** Thêm: Yêu cầu độ dài tối thiểu cho mật khẩu ***
    },
    // role: {
    // type: String,
    // enum: ['super', 'editor', 'viewer'],
    // default: 'editor'
    // },
    lastLogin: {
        type: Date,
        default: null
    }
    // Bạn có thể thêm các trường khác nếu cần, ví dụ: role, avatar,...
}, {
    timestamps: true // *** Thêm: Tự động thêm createdAt và updatedAt ***
});

// *** THÊM: Hash password trước khi lưu ***
adminSchema.pre('save', async function (next) {
    // Chỉ hash password nếu nó được thay đổi (hoặc là mới)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Tạo salt và hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Chuyển lỗi nếu có vấn đề khi hash
    }
});

// *** THÊM: Phương thức so sánh password ***
adminSchema.methods.matchPassword = async function (enteredPassword) {
    // So sánh password người dùng nhập với password đã hash trong DB
    return await bcrypt.compare(enteredPassword, this.password);
};


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;