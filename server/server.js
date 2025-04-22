import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectCloudinary } from './config/cloudinary.js';
// Route imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resourceRoutes from "./routes/resourceRoutes.js";
import interviewRoutes from './routes/interviewRoutes.js';
import blogPublicRoutes from './routes/blogPublicRoutes.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
// Connect to database
connectDB();
connectCloudinary();
console.log('MongoDB URI:', process.env.MONGODB_URI);

const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal API',
            version: '1.0.0',
            description: 'API Documentation for Job Portal Website',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Đường dẫn tới các file routes
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${ip}`);
    next();
});

// Debugging middleware for notifications
app.use((req, res, next) => {
    if (req.url.includes('/api/notifications')) {
        console.log(`[${new Date().toISOString()}] Notification request: ${req.method} ${req.url}`);

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            console.log(`Auth header present: ${token.substring(0, 10)}...`);
        } else {
            console.log('No auth header');
        }
    }
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/resources", resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/blogs', blogPublicRoutes);
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});