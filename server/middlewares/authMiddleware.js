import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import User from '../models/User.js'
import Admin from '../models/Admin.js'
import mongoose from 'mongoose';
// Middleware bảo vệ nhà tuyển dụng
// const verifyToken = (token, secret) => {
// if (!token) return null;
// try {
// return jwt.verify(token, secret);
// } catch (error) {
// return null;
// }
// };
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error(`Token verification failed with secret: ${error.message}`);
        return null;
    }
};

export const protectUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Received token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        console.log('Searching for user with ID:', decoded.id);

        // Thay đổi cách tạo ObjectId
        const userId = new mongoose.Types.ObjectId(decoded.id);
        console.log('Converted ObjectId:', userId);

        //const user = await User.findById(userId).select('-password');
        const user = await User.findById(decoded.id).select('-password');
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};
export const protectUser_2 = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // Debug log

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        console.log('Searching for user with ID:', decoded.id);
        console.log('ID type:', typeof decoded.id);
        //const user = await User.findById(decoded.id).select('-password');
        const userId = mongoose.Types.ObjectId(decoded.id);
        console.log('Converted ObjectId:', userId);

        //const user = await User.findOne({ _id: decoded.id }).select('-password');
        const user = await User.findById(userId).select('-password');
        console.log('Found user:', user); // Thêm log để kiểm tra user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};
export const protectUser_1 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Find user with string ID
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};
export const protectUser_0 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Auth failed'
        });
    }
};
export const protectCompany = async (req, res, next) => {
    try {
        console.log('Company middleware running...');
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token received:', token ? `${token.substring(0, 15)}...` : 'No token');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            // Kiểm tra cả companyId và id (để tương thích với cả hai format)
            const companyId = decoded.companyId || decoded.id;

            if (!companyId) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ'
                });
            }

            console.log('Looking for company with ID:', companyId);
            const company = await Company.findById(companyId).select('-password');
            console.log('Company found:', company ? 'Yes' : 'No');

            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            req.company = company;
            next();
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
    } catch (error) {
        console.error('Company auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xác thực công ty'
        });
    }
};
export const protectCompany_3 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.companyId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const company = await Company.findById(decoded.companyId).select('-password');
        if (!company) {
            return res.status(401).json({
                success: false,
                message: 'Company not found'
            });
        }

        req.company = company;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Auth failed'
        });
    }
};
export const protectCompany_2 = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        // Check if companyId exists in decoded token
        if (!decoded.companyId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        // Find company and attach to request
        const company = await Company.findById(decoded.companyId).select('-password');
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        req.company = company;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};
export const protectCompany_1 = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        if (!decoded.companyId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token structure'
            });
        }

        // Find company and attach to request
        const company = await Company.findById(decoded.companyId).select('-password');
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        req.company = company; // Attach company to request
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};
export const protectCompany_0 = async (req, res, next) => {
    try {
        // Kiểm tra token từ header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('No token found in headers');
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log('Token verification failed');
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Tìm company từ id được giải mã
        const company = await Company.findById(decoded.id).select('-password');
        if (!company) {
            console.log('Company not found with decoded id:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Gán company vào request
        req.company = company;
        next();
    } catch (error) {
        console.error('Error in protectCompany middleware:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};
// export const protectCompany = async (req, res, next) => {
// const token = req.headers.authorization?.split(' ')[1];
// 
// if (!token) {
// return res.status(401).json({ success: false, message: 'Not authorized, login again' });
// }
// 
// try {
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
// req.company = await Company.findById(decoded.id).select('-password');
// 
// if (!req.company) {
// return res.status(401).json({ success: false, message: 'Company not found' });
// }
// 
// next();
// } catch (error) {
// return res.status(401).json({ success: false, message: error.message });
// }
// }

// Middleware xác thực người dùng
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};
export const authMiddleware_1 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không có token xác thực'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
};
export const authMiddleware_0 = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

// Cải thiện protectAdmin bằng cách thêm logging và error handling tốt hơn
export const protectAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('Admin access attempted without token');
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        } catch (error) {
            console.log(`Invalid admin token: ${error.message}`);
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        // Check for adminId
        if (!decoded.adminId) {
            console.log('Token without adminId field');
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }

        // Find admin
        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin) {
            console.log(`Admin not found with ID: ${decoded.adminId}`);
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản admin'
            });
        }

        // Admin exists, attach to request
        console.log(`Admin authenticated: ${admin.name} (${admin._id})`);
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xác thực admin',
            error: error.message
        });
    }
};
export const protectAdmin_0 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verifyToken(token, process.env.ADMIN_JWT_SECRET);

        if (!decoded || !decoded.adminId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Auth failed'
        });
    }
};

// Middleware kiểm tra quyền Admin
export const adminMiddleware_0 = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục'
            });
        }

        // Xác thực token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        // Kiểm tra xem token có adminId không
        if (!decoded.adminId) {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }

        // Tìm admin từ database
        const admin = await Admin.findById(decoded.adminId).select('-password');

        // Nếu không tìm thấy admin
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Nếu tìm thấy admin, gắn vào request object
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xác thực admin'
        });
    }
};
export const adminMiddleware = async (req, res, next) => {
    try {
        console.log('Admin middleware running...');
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token received:', token ? `${token.substring(0, 15)}...` : 'No token');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            console.log('Decoded token:', decoded);

            if (!decoded.adminId) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ'
                });
            }

            console.log('Looking for admin with ID:', decoded.adminId);
            const admin = await Admin.findById(decoded.adminId).select('-password');
            console.log('Admin found:', admin ? 'Yes' : 'No');

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            req.admin = admin;
            next();
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xác thực admin'
        });
    }
};

// import jwt from 'jsonwebtoken'
// import Company from '../models/Company.js'
// import User from '../models/User.js'
// import Admin from '../models/Admin.js';

// export const protectCompany = async (req, res, next) => {
//     const token = req.headers.token
//     if (!token) {
//         return res.json({ success: false, message: 'Not authorized, Login Again' })

//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.company = await Company.findById(decoded.id).select('-password')
//         next()
//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

// // xac thuc admin
// // Middleware kiểm tra quyền Admin
// export const adminMiddleware = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Not authorized, no admin token' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
//         req.admin = await Admin.findById(decoded.id).select('-password');

//         if (!req.admin) {
//             return res.status(401).json({ success: false, message: 'Admin not found' });
//         }

//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized as admin',
//             error: error.message
//         });
//     }
// };
// // export const protectAdmin = async (req, res, next) => {
// // let token;
// //
// //Kiểm tra header Authorization theo chuẩn Bearer
// // if (
// // req.headers.authorization &&
// // req.headers.authorization.startsWith('Bearer')
// // ) {
// // try {
// //Lấy token từ header (Bỏ chữ 'Bearer ')
// // token = req.headers.authorization.split(' ')[1];
// //
// //Xác minh token bằng secret key DÀNH RIÊNG cho Admin
// //Đảm bảo bạn đã định nghĩa ADMIN_JWT_SECRET trong file .env
// // if (!process.env.ADMIN_JWT_SECRET) {
// // console.error('ADMIN_JWT_SECRET is not defined in .env file');
// // return res.status(500).json({ success: false, message: 'Server configuration error' });
// // }
// // const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
// //
// //Lấy thông tin admin từ DB dựa vào ID trong token, bỏ qua password
// // req.admin = await Admin.findById(decoded.id).select('-password');
// //
// // if (!req.admin) {
// // throw new Error('Admin not found');
// // }
// //
// // next(); // Cho phép đi tiếp nếu token hợp lệ và admin tồn tại
// // } catch (error) {
// // console.error('Admin Auth Error:', error.message);
// // res.status(401).json({ success: false, message: 'Not authorized, token failed' });
// // }
// // }
// //
// // if (!token) {
// // res.status(401).json({ success: false, message: 'Not authorized, no admin token' });
// // }
// // };

// // Middleware xác thực người dùng
// export const authMiddleware = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Not authorized, no token' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password');

//         if (!req.user) {
//             return res.status(401).json({ success: false, message: 'User not found' });
//         }

//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: 'Invalid token' });
//     }
// };


// // test

// // import jwt from 'jsonwebtoken';
// // import Company from '../models/Company.js';
// // import User from '../models/User.js';

// // // Middleware bảo vệ nhà tuyển dụng
// // export const protectCompany = async (req, res, next) => {
// //     const token = req.headers.authorization?.split(' ')[1];

// //     if (!token) {
// //         return res.status(401).json({ success: false, message: 'Not authorized, login again' });
// //     }

// //     try {
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         req.company = await Company.findById(decoded.id).select('-password');

// //         if (!req.company) {
// //             return res.status(401).json({ success: false, message: 'Company not found' });
// //         }

// //         next();
// //     } catch (error) {
// //         return res.status(401).json({ success: false, message: 'Invalid token' });
// //     }
// // };

// // // Middleware xác thực người dùng
// // export const authMiddleware = async (req, res, next) => {
// //     const token = req.headers.authorization?.split(' ')[1];

// //     if (!token) {
// //         return res.status(401).json({ success: false, message: 'Not authorized, no token' });
// //     }

// //     try {
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         req.user = await User.findById(decoded.id).select('-password');

// //         if (!req.user) {
// //             return res.status(401).json({ success: false, message: 'User not found' });
// //         }

// //         next();
// //     } catch (error) {
// //         return res.status(401).json({ success: false, message: 'Invalid token' });
// //     }
// // };

// // // Middleware kiểm tra quyền Admin
// // export const isAdmin = (req, res, next) => {
// //     if (req.user && req.user.role === 'admin') {
// //         next();
// //     } else {
// //         return res.status(403).json({ success: false, message: 'Not authorized as admin' });
// //     }
// // };


// Thêm middleware mới này vào cuối file

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: 'Không thể xác minh vai trò người dùng'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Vai trò ${req.user.role} không được phép truy cập tài nguyên này`
            });
        }

        next();
    };
};
// Tìm đoạn code trong hàm isAuthenticated khoảng dòng 746-820

export const isAuthenticated = async (req, res, next) => {
    try {
        // Kiểm tra header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Missing or invalid auth header');
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token, vui lòng đăng nhập lại'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('Token not found in auth header');
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ, vui lòng đăng nhập lại'
            });
        }

        console.log('Attempting to verify token:', token.substring(0, 15) + '...');

        // Thử lần lượt với các secret khác nhau
        try {
            // Thử xác minh như một user
            console.log('Trying user token');
            const decoded = verifyToken(token, process.env.JWT_SECRET);
            if (decoded) {
                console.log('User token decoded:', decoded);
                // Kiểm tra cả decoded.userId và decoded.id
                const userId = decoded.userId || decoded.id;
                if (userId) {
                    const user = await User.findById(userId).select('-password');
                    if (user) {
                        console.log('User authenticated:', user._id);
                        req.user = user;
                        return next();
                    }
                }
            }
        } catch (err) {
            console.log('Not a user token, trying next');
        }

        try {
            // Thử xác minh như một company
            console.log('Trying company token');
            const decoded = verifyToken(token, process.env.COMPANY_JWT_SECRET || process.env.JWT_SECRET);
            if (decoded) {
                console.log('Company token decoded:', decoded);
                // Kiểm tra cả decoded.companyId và decoded.id
                const companyId = decoded.companyId || decoded.id;
                if (companyId) {
                    const company = await Company.findById(companyId).select('-password');
                    if (company) {
                        console.log('Company authenticated:', company._id);
                        req.company = company;
                        return next();
                    }
                }
            }
        } catch (err) {
            console.log('Not a company token, trying next');
        }

        try {
            // Thử xác minh như một admin
            console.log('Trying admin token');
            const decoded = verifyToken(token, process.env.ADMIN_JWT_SECRET);
            if (decoded) {
                console.log('Admin token decoded:', decoded);
                // Kiểm tra cả decoded.adminId và decoded.id
                const adminId = decoded.adminId || decoded.id;
                if (adminId) {
                    const admin = await Admin.findById(adminId).select('-password');
                    if (admin) {
                        console.log('Admin authenticated:', admin._id);
                        req.admin = admin;
                        return next();
                    }
                }
            }
        } catch (err) {
            console.log('Not an admin token either');
        }

        // Nếu không tìm thấy người dùng hợp lệ với bất kỳ loại token nào
        console.log('No valid token found');
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại'
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server trong quá trình xác thực',
            error: error.message
        });
    }
};