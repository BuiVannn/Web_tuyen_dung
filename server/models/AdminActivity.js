import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    type: {
        type: String,
        enum: ['auth', 'job', 'user', 'company', 'blog', 'profile', 'resource', 'application', 'settings'],
        required: true
    },
    ipAddress: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // Đã có trường timestamp riêng
});

// Thêm index để tìm kiếm nhanh hơn
adminActivitySchema.index({ adminId: 1, timestamp: -1 });
adminActivitySchema.index({ type: 1, timestamp: -1 });

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);

export default AdminActivity;