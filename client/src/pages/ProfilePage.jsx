import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileContent from '../components/ProfileContent';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userToken) {
                toast.error("Vui lòng đăng nhập để xem hồ sơ");
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log("Fetching profile with token:", userToken);

                const response = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                console.log("Profile response:", response.data);

                if (response.data.success) {
                    setProfileData(response.data.profile);
                } else {
                    setError(response.data.message || "Failed to fetch profile data.");
                    toast.error(response.data.message || "Không thể tải dữ liệu hồ sơ.");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                const message = err.response?.data?.message || err.message || "An error occurred while fetching profile.";
                setError(message);
                toast.error("Lỗi khi tải dữ liệu hồ sơ: " + message);

                // Xử lý lỗi 401/403 (token hết hạn)
                if (err.response?.status === 401 || err.response?.status === 403) {
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [backendUrl, userToken, navigate]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <Loading />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto p-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Lỗi khi tải dữ liệu hồ sơ</h2>
                        <p className="mb-4">{error}</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                            >
                                Quay về trang chủ
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!profileData) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                        <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ</h2>
                        <p className="text-gray-600 mb-6">Bạn chưa tạo hồ sơ cá nhân. Tạo hồ sơ để nhận được các gợi ý việc làm phù hợp và dễ dàng ứng tuyển!</p>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Tạo hồ sơ ngay
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen pt-6 pb-12">
                <div className="container mx-auto px-4">
                    <ProfileHeader userData={profileData} />
                    <div className="mt-6">
                        <ProfileContent userData={profileData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import ProfileHeader from '../components/ProfileHeader';
// import ProfileContent from '../components/ProfileContent';
// import Loading from '../components/Loading';
// import { toast } from 'react-toastify';

// const ProfilePage = () => {
//     const navigate = useNavigate();
//     const { backendUrl, userToken } = useContext(AppContext);
//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             if (!userToken) {
//                 toast.error("Vui lòng đăng nhập để xem hồ sơ");
//                 navigate('/login');
//                 return;
//             }

//             setLoading(true);
//             setError(null);

//             try {
//                 console.log("Fetching profile with token:", userToken);

//                 const response = await axios.get(`${backendUrl}/api/users/profile`, {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`
//                     }
//                 });

//                 console.log("Profile response:", response.data);

//                 if (response.data.success) {
//                     setProfileData(response.data.profile);
//                 } else {
//                     setError(response.data.message || "Failed to fetch profile data.");
//                     toast.error(response.data.message || "Không thể tải dữ liệu hồ sơ.");
//                 }
//             } catch (err) {
//                 console.error("Error fetching profile:", err);
//                 const message = err.response?.data?.message || err.message || "An error occurred while fetching profile.";
//                 setError(message);
//                 toast.error("Lỗi khi tải dữ liệu hồ sơ: " + message);

//                 // Xử lý lỗi 401/403 (token hết hạn)
//                 if (err.response?.status === 401 || err.response?.status === 403) {
//                     toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
//                     navigate('/login');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProfile();
//     }, [backendUrl, userToken, navigate]);

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen"><Loading /></div>;
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-8">
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                     <p className="font-medium">Lỗi khi tải dữ liệu hồ sơ</p>
//                     <p className="text-sm">{error}</p>
//                     <button
//                         onClick={() => navigate('/')}
//                         className="mt-2 text-blue-600 hover:underline"
//                     >
//                         Quay về trang chủ
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (!profileData) {
//         return (
//             <div className="container mx-auto p-8 text-center">
//                 <p className="text-gray-500">Không tìm thấy dữ liệu hồ sơ.</p>
//                 <button
//                     onClick={() => navigate('/profile/edit')}
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
//                 >
//                     Tạo hồ sơ mới
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <div className="container mx-auto px-4 py-8">
//                 <ProfileHeader userData={profileData} />
//                 <ProfileContent userData={profileData} />
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;

// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import ProfileHeader from '../components/ProfileHeader';
// import ProfileContent from '../components/ProfileContent';

// // Dữ liệu từ API hoặc store
// //import { userData, recommendedJobs } from '../data/profileData';

// const ProfilePage = () => {

//     const userData = {
//         name: "Bui Mau Van",
//         title: "AI researcher",
//         location: "TP. Ha Noi",
//         avatar: "/api/placeholder/100/100",
//         email: "buimauvan004@.com",
//         phone: "0123456789",
//         summary: "AI với 3 năm kinh nghiệm làm việc với ML, DL. Tôi đam mê tạo ra những mô hình AI tốt.",
//         skills: ["Machine Learning", "DeepLearning", "Python", "JavaScript", "HTML/CSS", "Java", "Tailwind CSS", "Git"],
//         experience: [
//             {
//                 company: "Tech Solutions Inc.",
//                 position: "Fullstack Developer",
//                 duration: "01/2030 - Hiện tại",
//                 description: "Phát triển và bảo trì các ứng dụng web sử dụng ReactJS và Redux. Tối ưu hiệu suất ứng dụng và cải thiện trải nghiệm người dùng."
//             },
//             {
//                 company: "Vin AI",
//                 position: "Junior Developer",
//                 duration: "06/2026 - 12/2030",
//                 description: "Làm việc trong nhóm phát triển thuật toán AI"
//             }
//         ],
//         education: [
//             {
//                 school: "Học Viện Công nghệ Bưu chính Viễn thông",
//                 degree: "Kỹ sư Công nghệ thông tin",
//                 year: "2022-2027"
//             }
//         ],
//         projects: [
//             {
//                 name: "E-commerce Platform",
//                 description: "Website thương mại điện tử với tính năng giỏ hàng, thanh toán và quản lý đơn hàng.",
//                 technologies: "ReactJS, NodeJS, MongoDB"
//             },
//             {
//                 name: "Booking System",
//                 description: "Hệ thống đặt lịch trực tuyến cho dịch vụ spa và thẩm mỹ viện.",
//                 technologies: "NextJS, Express, PostgreSQL"
//             }
//         ],
//         languages: ["Tiếng Việt (Bản địa)", "Tiếng Anh (Trung cấp)"],
//         certificates: ["AWS Certified Developer", "React Developer Certificate"]
//     };

//     const recommendedJobs = [
//         {
//             id: 1,
//             title: "Senior Frontend Developer",
//             company: "Tech Giant Co.",
//             location: "TP. Hồ Chí Minh",
//             salary: "25-35 triệu VNĐ",
//             matchScore: 95
//         },
//         {
//             id: 2,
//             title: "React Developer",
//             company: "Startup Innovative",
//             location: "Hà Nội (Remote)",
//             salary: "20-30 triệu VNĐ",
//             matchScore: 90
//         },
//         {
//             id: 3,
//             title: "Frontend Team Lead",
//             company: "Enterprise Solutions",
//             location: "TP. Hồ Chí Minh",
//             salary: "35-45 triệu VNĐ",
//             matchScore: 80
//         }
//     ];
//     return (
//         <>
//             <Navbar />
//             <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//                 <ProfileHeader userData={userData} />
//                 <ProfileContent userData={userData} recommendedJobs={recommendedJobs} />
//             </div>
//         </>
//     );
// };

// export default ProfilePage;