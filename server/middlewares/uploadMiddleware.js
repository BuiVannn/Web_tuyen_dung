
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Middleware xử lý upload ảnh đơn lẻ và lưu lên Cloudinary
export const uploadSingleImage = (fieldName) => {
    return async (req, res, next) => {
        // Dùng multer để xử lý upload trước
        const singleUpload = upload.single(fieldName);

        singleUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Error uploading file'
                });
            }

            // Không có file được upload - không sao, tiếp tục
            if (!req.file) {
                return next();
            }

            try {
                // Upload lên Cloudinary
                const folder = getCloudinaryFolder(fieldName);
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: folder,
                    resource_type: 'auto'
                });

                // Thêm thông tin file vào request để controller sử dụng
                req.cloudinaryResult = result;

                // Xóa file tạm sau khi upload lên Cloudinary
                fs.unlinkSync(req.file.path);

                next();
            } catch (error) {
                // Xóa file tạm nếu có lỗi
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path);
                }

                console.error('Cloudinary upload error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading to cloud storage'
                });
            }
        });
    };
};

// Hàm trợ giúp để chọn folder phù hợp trên Cloudinary
function getCloudinaryFolder(fieldName) {
    switch (fieldName) {
        case 'featuredImage':
            return 'blog_images';
        case 'logo':
            return 'company_logos';
        case 'avatar':
            return 'user_avatars';
        case 'resume':
        case 'cv':
            return 'resumes';
        default:
            return 'miscellaneous';
    }
}

// Middleware xử lý upload nhiều file
export const uploadMultipleImages = (fieldName, maxCount = 5) => {
    return async (req, res, next) => {
        const multiUpload = upload.array(fieldName, maxCount);

        multiUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Error uploading files'
                });
            }

            if (!req.files || req.files.length === 0) {
                return next();
            }

            try {
                // Upload lên Cloudinary
                const folder = getCloudinaryFolder(fieldName);
                const uploadPromises = req.files.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        folder: folder,
                        resource_type: 'auto'
                    })
                );

                const results = await Promise.all(uploadPromises);

                // Thêm thông tin file vào request
                req.cloudinaryResults = results;

                // Xóa tất cả file tạm
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });

                next();
            } catch (error) {
                // Xóa tất cả file tạm nếu có lỗi
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }

                console.error('Cloudinary upload error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading to cloud storage'
                });
            }
        });
    };
};
// import upload from '../config/multer.js';
// import cloudinary from '../config/cloudinary.js';
// import fs from 'fs';
// import path from 'path';

// // Middleware xử lý upload ảnh đơn lẻ và lưu lên Cloudinary
// export const uploadSingleImage = (fieldName) => {
//     return async (req, res, next) => {
//         // Dùng multer để xử lý upload trước
//         const singleUpload = upload.single(fieldName);

//         singleUpload(req, res, async (err) => {
//             if (err) {
//                 return res.status(400).json({
//                     success: false,
//                     message: err.message || 'Error uploading file'
//                 });
//             }

//             // Không có file được upload
//             if (!req.file) {
//                 return next();
//             }

//             try {
//                 // Upload lên Cloudinary
//                 const folder = getCloudinaryFolder(fieldName);
//                 const result = await cloudinary.uploader.upload(req.file.path, {
//                     folder: folder,
//                     resource_type: 'auto'
//                 });

//                 // Thêm thông tin file vào request để controller sử dụng
//                 req.cloudinaryResult = result;

//                 // Xóa file tạm sau khi upload lên Cloudinary
//                 fs.unlinkSync(req.file.path);

//                 next();
//             } catch (error) {
//                 // Xóa file tạm nếu có lỗi
//                 if (req.file && req.file.path) {
//                     fs.unlinkSync(req.file.path);
//                 }

//                 console.error('Cloudinary upload error:', error);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Error uploading to cloud storage'
//                 });
//             }
//         });
//     };
// };

// // Hàm trợ giúp để chọn folder phù hợp trên Cloudinary
// function getCloudinaryFolder(fieldName) {
//     switch (fieldName) {
//         case 'featuredImage':
//             return 'blog_images';
//         case 'logo':
//             return 'company_logos';
//         case 'avatar':
//             return 'user_avatars';
//         case 'resume':
//         case 'cv':
//             return 'resumes';
//         default:
//             return 'miscellaneous';
//     }
// }

// // Middleware xử lý upload nhiều file
// export const uploadMultipleImages = (fieldName, maxCount = 5) => {
//     return async (req, res, next) => {
//         const multiUpload = upload.array(fieldName, maxCount);

//         multiUpload(req, res, async (err) => {
//             if (err) {
//                 return res.status(400).json({
//                     success: false,
//                     message: err.message || 'Error uploading files'
//                 });
//             }

//             if (!req.files || req.files.length === 0) {
//                 return next();
//             }

//             try {
//                 // Upload lên Cloudinary
//                 const folder = getCloudinaryFolder(fieldName);
//                 const uploadPromises = req.files.map(file =>
//                     cloudinary.uploader.upload(file.path, {
//                         folder: folder,
//                         resource_type: 'auto'
//                     })
//                 );

//                 const results = await Promise.all(uploadPromises);

//                 // Thêm thông tin file vào request
//                 req.cloudinaryResults = results;

//                 // Xóa tất cả file tạm
//                 req.files.forEach(file => {
//                     fs.unlinkSync(file.path);
//                 });

//                 next();
//             } catch (error) {
//                 // Xóa tất cả file tạm nếu có lỗi
//                 if (req.files && req.files.length > 0) {
//                     req.files.forEach(file => {
//                         if (fs.existsSync(file.path)) {
//                             fs.unlinkSync(file.path);
//                         }
//                     });
//                 }

//                 console.error('Cloudinary upload error:', error);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Error uploading to cloud storage'
//                 });
//             }
//         });
//     };
// };