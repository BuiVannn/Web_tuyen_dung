// import { v2 as cloudinary } from 'cloudinary'

// const connectCloudinary = async () => {

//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_SECRET_KEY
//     })
// }

// export default connectCloudinary

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
        console.log('Cloudinary Connected successfully');
    } catch (error) {
        console.error('Cloudinary Connection Error:', error);
        throw error;
    }
};

export default cloudinary;
// const connectCloudinary = () => {
// try {
// cloudinary.config({
// cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// api_key: process.env.CLOUDINARY_API_KEY,
// api_secret: process.env.CLOUDINARY_API_SECRET
// });
// console.log('Cloudinary Connected successfully');
// } catch (error) {
// console.error('Cloudinary Connection Error:', error);
// throw error;
// }
// };

//export default connectCloudinary;
// export { cloudinary, connectCloudinary };

// new
// server/config/cloudinary.js (Đã sửa lỗi)
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv'; // Import dotenv nếu bạn chưa import ở file chính và cần load ở đây
//
// dotenv.config(); // Load biến môi trường từ .env
//
//--- Cấu hình Cloudinary ngay khi module này được import ---
//Sử dụng tên biến môi trường chuẩn
// cloudinary.config({
// cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // <<< Sửa lại tên biến
// api_key: process.env.CLOUDINARY_API_KEY,
// api_secret: process.env.CLOUDINARY_API_SECRET, // <<< Sửa lại tên biến
// secure: true // Nên đặt là true để dùng HTTPS
// });
//
//--- Export trực tiếp đối tượng cloudinary đã được cấu hình ---
// export default cloudinary;

// Bỏ hàm connectCloudinary không cần thiết đi hoặc chỉ giữ lại để log nếu muốn
/*
const connectCloudinary = async () => {
    // Chỉ để log kiểm tra cấu hình nếu cần
    try {
        console.log("Cloudinary Config Check:", cloudinary.config());
        if(!cloudinary.config().cloud_name) {
             console.error("!!! Cloudinary config is missing cloud_name. Check .env variables and names.");
        } else {
             console.log("Cloudinary configured successfully.");
        }
    } catch(err) {
        console.error("Error checking Cloudinary config:", err)
    }
}
// Không export hàm này làm default nữa
// export default connectCloudinary
// Bạn vẫn có thể export hàm này nếu muốn gọi nó ở server.js để kiểm tra
// export { connectCloudinary };
*/