import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ file tạm thời
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Thiết lập filter để kiểm tra loại file
const fileFilter = (req, file, cb) => {
    // Kiểm tra field name để áp dụng các quy tắc khác nhau
    if (file.fieldname === 'resume' || file.fieldname === 'cv') {
        // Chỉ cho phép PDF đối với CV/resume
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for resumes!'), false);
        }
    } else if (file.fieldname === 'featuredImage' || file.fieldname === 'image' ||
        file.fieldname === 'logo' || file.fieldname === 'avatar') {
        // Cho phép các loại file ảnh thông dụng
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png' || file.mimetype === 'image/gif' ||
            file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, PNG, GIF or WebP images are allowed!'), false);
        }
    } else {
        // Mặc định cho phép tất cả các loại file ảnh và PDF
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDF files are allowed!'), false);
        }
    }
};

// Tạo middleware multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default upload;
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Choose destination based on file type
//         const destination = file.fieldname === 'image' ? 'uploads/images/' : 'uploads/';
//         cb(null, destination);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     // Handle both PDF and image uploads
//     if (file.fieldname === 'image') {
//         // For image uploads (company registration)
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//             cb(null, true);
//         } else {
//             cb(new Error('Only JPG, JPEG or PNG images are allowed!'), false);
//         }
//     } else {
//         // For PDF uploads (resumes)
//         if (file.mimetype === 'application/pdf') {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF files are allowed!'), false);
//         }
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // Keep 5MB limit
//     }
// });

// export default upload;



//ok
// import multer from 'multer';
//
// const storage = multer.diskStorage({
// destination: function (req, file, cb) {
// cb(null, 'uploads/') // Đảm bảo folder uploads/ tồn tại
// },
// filename: function (req, file, cb) {
// cb(null, Date.now() + '-' + file.originalname)
// }
// });
//
// const fileFilter = (req, file, cb) => {
// if (file.mimetype === 'application/pdf') {
// cb(null, true);
// } else {
// cb(new Error('Only PDF files are allowed!'), false);
// }
// };
//
// const upload = multer({
// storage: storage,
// fileFilter: fileFilter,
// limits: {
// fileSize: 1024 * 1024 * 5 // Giới hạn 5MB
// }
// });
//
// export default upload;
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from './cloudinary.js';

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'resumes',
//         resource_type: 'raw',
//         allowed_formats: ['pdf', 'doc', 'docx'],
//         public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now(),
//         transformation: [{
//             fetch_format: "auto",
//             quality: "auto"
//         }]
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter: (req, file, cb) => {
//         const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//         if (allowedMimeTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF and Word documents are allowed'), false);
//         }
//     }
// });

// export default upload;

// // // import multer from "multer";

// // // const storage = multer.diskStorage({})

// // // const upload = multer({ storage })

// // // export default upload


// // // new
// // // server/config/multer.js

// // import multer from 'multer';
// // import { CloudinaryStorage } from 'multer-storage-cloudinary'; // <<< Import CloudinaryStorage
// // import cloudinary from './cloudinary.js'; // <<< Import cấu hình cloudinary từ file cloudinary.js

// // // --- Cấu hình Cloudinary Storage ---
// // const storage = new CloudinaryStorage({
// //     cloudinary: cloudinary, // Sử dụng instance cloudinary đã cấu hình (quan trọng!)
// //     params: async (req, file) => {
// //         // params là một object hoặc một function trả về object chứa các tùy chọn upload
// //         // console.log('Multer file:', file); // Log để xem thông tin file nếu cần debug
// //         let folderName = 'others'; // Thư mục mặc định trên Cloudinary

// //         // Phân loại thư mục dựa trên loại file hoặc route (ví dụ)
// //         if (file.fieldname === 'featuredImage') { // Nếu là ảnh đại diện blog
// //             folderName = 'blog_featured_images';
// //         } else if (file.fieldname === 'image') { // Nếu là ảnh trong nội dung blog (từ API upload riêng)
// //             folderName = 'blog_content_images';
// //         } else if (file.fieldname === 'resume') { // Nếu là CV
// //             folderName = 'resumes';
// //         }
// //         // Thêm các điều kiện khác nếu bạn có nhiều loại upload

// //         return {
// //             folder: folderName, // Thư mục lưu trên Cloudinary
// //             // resource_type: "auto", // Tự động nhận diện loại file (image, video, raw)
// //             allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf'], // Chỉ cho phép các định dạng này
// //             // transformation: [{ width: 1200, height: 1200, crop: 'limit' }], // Resize ảnh nếu cần
// //             public_id: file.originalname.split('.')[0] + '-' + Date.now() // Tạo public_id duy nhất (tùy chọn)
// //         };
// //     },
// // });

// // // --- Tạo middleware Multer ---
// // const upload = multer({
// //     storage: storage, // <<< QUAN TRỌNG: Sử dụng CloudinaryStorage đã cấu hình
// //     limits: {
// //         fileSize: 10 * 1024 * 1024 // Giới hạn kích thước file 10MB (ví dụ)
// //     },
// //     fileFilter: (req, file, cb) => { // Kiểm tra loại file cơ bản (tùy chọn)
// //         const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
// //         if (allowedMimeTypes.includes(file.mimetype)) {
// //             cb(null, true); // Chấp nhận file
// //         } else {
// //             cb(new Error('Định dạng file không được hỗ trợ.'), false); // Từ chối file
// //         }
// //     }
// // });

// // export default upload; // Export middleware upload đã cấu hình Cloudinary