// seedAdmin.js (Phiên bản ESM)
import mongoose from 'mongoose';
import dotenv from 'dotenv';         // <<< Sử dụng import
import connectDB from './config/db.js'; // <<< Sử dụng import, giữ nguyên .js
import Admin from './models/Admin.js';   // <<< Sử dụng import, giữ nguyên .js

dotenv.config();

const createAdmin = async () => {
    await connectDB();

    try {
        const adminEmail = 'admin@demo.com';
        const adminPassword = '12345678';
        const adminName = 'Admin';

        const adminExists = await Admin.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin account already exists.');
            process.exit();
        }

        const admin = new Admin({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
        });

        await admin.save();

        console.log('Admin account created successfully!');
        process.exit();
    } catch (error) {
        console.error('Error creating admin account:', error);
        process.exit(1);
    }
};

createAdmin();