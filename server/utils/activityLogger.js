import AdminActivity from '../models/AdminActivity.js';

/**
 * Ghi nhận hoạt động của admin
 * @param {string} adminId - ID của admin
 * @param {string} action - Hành động thực hiện
 * @param {string} type - Loại hoạt động (auth, job, user, etc)
 * @param {Object} details - Chi tiết bổ sung (optional)
 * @param {Object} req - Express request object (để lấy IP, UserAgent)
 */
export const logAdminActivity = async (adminId, action, type, details = {}, req = null) => {
    try {
        // Thêm log debug
        console.log(`Logging admin activity: [${type}] ${action}`, { adminId, details });

        // Cải thiện cách lấy địa chỉ IP
        let ipAddress = '';
        if (req) {
            ipAddress = req.headers['x-forwarded-for'] ||
                req.headers['x-real-ip'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                (req.connection.socket ? req.connection.socket.remoteAddress : null);

            // Xử lý trường hợp có nhiều IP trong x-forwarded-for (lấy IP đầu tiên)
            if (ipAddress && ipAddress.includes(',')) {
                ipAddress = ipAddress.split(',')[0].trim();
            }

            // Xử lý trường hợp IPv6 localhost
            if (ipAddress === '::1') {
                ipAddress = '127.0.0.1';
            }

            // Xử lý trường hợp IPv4 được nhúng trong IPv6
            if (ipAddress && ipAddress.includes('::ffff:')) {
                ipAddress = ipAddress.replace('::ffff:', '');
            }
        }

        const userAgent = req ? req.headers['user-agent'] : '';

        const activity = new AdminActivity({
            adminId,
            action,
            type,
            details,
            ipAddress,
            userAgent,
            timestamp: new Date()
        });

        await activity.save();
        console.log(`Activity saved successfully: ${activity._id}, IP: ${ipAddress}`);
        return true;
    } catch (error) {
        console.error('Error logging admin activity:', error);
        return false;
    }
};
export const logAdminActivity_0 = async (adminId, action, type, details = {}, req = null) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] || req.connection.remoteAddress) : '';
        const userAgent = req ? req.headers['user-agent'] : '';

        const activity = new AdminActivity({
            adminId,
            action,
            type,
            details,
            ipAddress,
            userAgent
        });

        await activity.save();
        return true;
    } catch (error) {
        console.error('Error logging admin activity:', error);
        return false;
    }
};

/**
 * Ghi nhận đăng nhập thành công
 */
export const logAdminLogin = async (adminId, req) => {
    return logAdminActivity(
        adminId,
        'Đăng nhập thành công',
        'auth',
        {},
        req
    );
};

/**
 * Ghi nhận đăng xuất
 */
// export const logAdminLogout = async (adminId, req) => {
// return logAdminActivity(
// adminId,
// 'Đăng xuất',
// 'auth',
// {},
// req
// );
// };
export const logAdminLogout = async (adminId, req) => {
    console.log("Logging admin logout for:", adminId);
    try {
        const result = await logAdminActivity(
            adminId,
            'Đăng xuất',
            'auth',
            {},
            req
        );
        console.log("Logout activity log result:", result);
        return result;
    } catch (error) {
        console.error("Error logging logout:", error);
        return false;
    }
};

/**
 * Ghi nhận thay đổi thông tin cá nhân
 */
export const logProfileUpdate = async (adminId, req) => {
    return logAdminActivity(
        adminId,
        'Cập nhật thông tin cá nhân',
        'profile',
        {},
        req
    );
};

/**
 * Ghi nhận đổi mật khẩu
 */
export const logPasswordChange = async (adminId, req) => {
    return logAdminActivity(
        adminId,
        'Đổi mật khẩu',
        'profile',
        {},
        req
    );
};

/**
 * Ghi nhận hoạt động liên quan đến việc làm
 */
export const logJobActivity = async (adminId, action, jobId, jobTitle, req) => {
    return logAdminActivity(
        adminId,
        action,
        'job',
        { jobId, jobTitle },
        req
    );
};

/**
 * Ghi nhận hoạt động liên quan đến người dùng
 */
export const logUserActivity = async (adminId, action, userId, userName, req) => {
    return logAdminActivity(
        adminId,
        action,
        'user',
        { userId, userName },
        req
    );
};

/**
 * Ghi nhận hoạt động liên quan đến công ty
 */
export const logCompanyActivity = async (adminId, action, companyId, companyName, req) => {
    return logAdminActivity(
        adminId,
        action,
        'company',
        { companyId, companyName },
        req
    );
};

/**
 * Ghi nhận hoạt động liên quan đến blog
 */
export const logBlogActivity = async (adminId, action, blogId, blogTitle, req) => {
    return logAdminActivity(
        adminId,
        action,
        'blog',
        { blogId, blogTitle },
        req
    );
};


export const logResourceActivity = async (adminId, resourceId, action, req) => {
    return logAdminActivity(
        adminId,
        action,
        'resource',
        { resourceId },
        req
    );
};