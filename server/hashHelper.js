// hashHelper.js (Phiên bản ESM)
import bcrypt from 'bcryptjs'; // <<< Sử dụng import

const plainPassword = '12345678'; // Mật khẩu bạn muốn dùng

bcrypt.hash(plainPassword, 10)
    .then(hash => {
        console.log('Copy dòng này vào database:');
        console.log(hash);
    })
    .catch(err => console.error(err));