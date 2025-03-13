import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/ProfileHeader';
import ProfileContent from '../components/ProfileContent';

// Dữ liệu từ API hoặc store
//import { userData, recommendedJobs } from '../data/profileData';

const ProfilePage = () => {

    const userData = {
        name: "Bui Mau Van",
        title: "AI researcher",
        location: "TP. Ha Noi",
        avatar: "/api/placeholder/100/100",
        email: "buimauvan004@.com",
        phone: "0123456789",
        summary: "AI với 3 năm kinh nghiệm làm việc với ML, DL. Tôi đam mê tạo ra những mô hình AI tốt.",
        skills: ["Machine Learning", "DeepLearning", "Python", "JavaScript", "HTML/CSS", "Java", "Tailwind CSS", "Git"],
        experience: [
            {
                company: "Tech Solutions Inc.",
                position: "Fullstack Developer",
                duration: "01/2030 - Hiện tại",
                description: "Phát triển và bảo trì các ứng dụng web sử dụng ReactJS và Redux. Tối ưu hiệu suất ứng dụng và cải thiện trải nghiệm người dùng."
            },
            {
                company: "Vin AI",
                position: "Junior Developer",
                duration: "06/2026 - 12/2030",
                description: "Làm việc trong nhóm phát triển thuật toán AI"
            }
        ],
        education: [
            {
                school: "Học Viện Công nghệ Bưu chính Viễn thông",
                degree: "Kỹ sư Công nghệ thông tin",
                year: "2022-2027"
            }
        ],
        projects: [
            {
                name: "E-commerce Platform",
                description: "Website thương mại điện tử với tính năng giỏ hàng, thanh toán và quản lý đơn hàng.",
                technologies: "ReactJS, NodeJS, MongoDB"
            },
            {
                name: "Booking System",
                description: "Hệ thống đặt lịch trực tuyến cho dịch vụ spa và thẩm mỹ viện.",
                technologies: "NextJS, Express, PostgreSQL"
            }
        ],
        languages: ["Tiếng Việt (Bản địa)", "Tiếng Anh (Trung cấp)"],
        certificates: ["AWS Certified Developer", "React Developer Certificate"]
    };

    const recommendedJobs = [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "Tech Giant Co.",
            location: "TP. Hồ Chí Minh",
            salary: "25-35 triệu VNĐ",
            matchScore: 95
        },
        {
            id: 2,
            title: "React Developer",
            company: "Startup Innovative",
            location: "Hà Nội (Remote)",
            salary: "20-30 triệu VNĐ",
            matchScore: 90
        },
        {
            id: 3,
            title: "Frontend Team Lead",
            company: "Enterprise Solutions",
            location: "TP. Hồ Chí Minh",
            salary: "35-45 triệu VNĐ",
            matchScore: 80
        }
    ];
    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <ProfileHeader userData={userData} />
                <ProfileContent userData={userData} recommendedJobs={recommendedJobs} />
            </div>
        </>
    );
};

export default ProfilePage;