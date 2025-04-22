import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Home, Mail, Phone, MapPin, Edit, Download, Briefcase, Calendar, Clock } from 'lucide-react';

const ProfileHeader = ({ userData }) => {
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    // Kiểm tra userData có cấu trúc đúng không
    const userName = userData?.userId?.name || 'User Name';
    const userTitle = userData?.title || 'Job Title';
    const userLocation = userData?.location || 'Location';
    const userAvatar = userData?.avatar || '/default-avatar.png';
    const userResume = userData?.resume || '';
    // Thêm trường mới
    const userPhone = userData?.phone || '';
    const userEmail = userData?.userId?.email || '';
    const userAvailability = userData?.availability || 'Đang tìm việc';  // Trạng thái tìm việc
    const userExperience = userData?.experience || [];
    const totalYearsExperience = userExperience.reduce((total, exp) => {
        // Tính tổng năm kinh nghiệm
        if (exp.from && (exp.to || exp.current)) {
            const from = new Date(exp.from);
            const to = exp.current ? new Date() : new Date(exp.to);
            return total + (to.getFullYear() - from.getFullYear());
        }
        return total;
    }, 0);

    // Handle file upload
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File quá lớn. Giới hạn tải lên là 5MB.');
            return;
        }

        setIsUploading(true);
        setFileName(file.name);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axios.put(
                `${backendUrl}/api/users/profile/resume`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${userToken}`
                    }
                }
            );

            if (response.data.success) {
                setUploadSuccess(true);
                toast.success('CV đã được tải lên thành công!');
                setTimeout(() => {
                    setUploadSuccess(false);
                }, 3000);
            } else {
                toast.error(response.data.message || 'Không thể tải lên CV');
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tải lên CV');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
                {/* Cover image area */}
                <button
                    onClick={() => navigate('/profile/edit')}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                    title="Edit Profile"
                >
                    <Edit size={18} className="text-gray-700" />
                </button>
            </div>

            <div className="relative px-6 pb-6">
                <div className="flex flex-col md:flex-row">
                    {/* Avatar */}
                    <div className="relative -mt-16 md:-mt-20 mb-4 md:mb-0 flex-shrink-0">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="md:ml-6 md:pt-4 flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{userName}</h1>
                                <p className="text-lg text-blue-600 font-medium">{userTitle}</p>

                                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                                    {userLocation && (
                                        <span className="flex items-center text-sm">
                                            <MapPin size={16} className="mr-1 text-gray-400" />
                                            {userLocation}
                                        </span>
                                    )}
                                    {userPhone && (
                                        <span className="flex items-center text-sm">
                                            <Phone size={16} className="mr-1 text-gray-400" />
                                            {userPhone}
                                        </span>
                                    )}
                                    {userEmail && (
                                        <span className="flex items-center text-sm">
                                            <Mail size={16} className="mr-1 text-gray-400" />
                                            {userEmail}
                                        </span>
                                    )}
                                </div>

                                {/* Status Badges */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Clock size={14} className="mr-1" />
                                        {userAvailability}
                                    </span>
                                    {totalYearsExperience > 0 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <Briefcase size={14} className="mr-1" />
                                            {totalYearsExperience} năm kinh nghiệm
                                        </span>
                                    )}
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <Calendar size={14} className="mr-1" />
                                        Tham gia từ {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Resume Upload/Download */}
                            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                                {userResume ? (
                                    <a
                                        href={userResume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Xem CV
                                    </a>
                                ) : (
                                    <div>
                                        <button
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${isUploading
                                                ? 'text-gray-400 bg-gray-100'
                                                : 'text-gray-700 bg-white hover:bg-gray-50'
                                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                        >
                                            {isUploading ? 'Đang tải lên...' : 'Tải lên CV'}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Định dạng: PDF, DOC, DOCX (tối đa 5MB)</p>
                                    </div>
                                )}

                                {uploadSuccess && (
                                    <p className="mt-2 text-sm text-green-600">
                                        {fileName} đã được tải lên thành công!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar - Completeness of profile */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Hoàn thiện hồ sơ</span>
                        <span className="text-sm font-medium text-blue-600">
                            {calculateProfileCompleteness(userData)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${calculateProfileCompleteness(userData)}%` }}
                        ></div>
                    </div>
                    {calculateProfileCompleteness(userData) < 100 && (
                        <p className="mt-1 text-xs text-gray-500">
                            Hoàn thiện hồ sơ của bạn để tăng cơ hội được tuyển dụng
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Hàm tính mức độ hoàn thiện hồ sơ
const calculateProfileCompleteness = (userData) => {
    const fields = [
        !!userData?.userId?.name,
        !!userData?.title,
        !!userData?.location,
        !!userData?.bio,
        !!userData?.phone,
        !!userData?.resume,
        !!(userData?.skills && userData.skills.length > 0),
        !!(userData?.experience && userData.experience.length > 0),
        !!(userData?.education && userData.education.length > 0),
        !!(userData?.projects && userData.projects.length > 0),
        !!(userData?.socialLinks?.linkedin || userData?.socialLinks?.github || userData?.socialLinks?.portfolio)
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
};

export default ProfileHeader;
// import React, { useState, useRef, useContext } from 'react';
// import { useNavigate } from "react-router-dom";
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { Home } from 'lucide-react';
// const ProfileHeader = ({ userData }) => {
//     const navigate = useNavigate();
//     const { backendUrl, userToken } = useContext(AppContext);

//     // State cho file và avatar
//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [fileName, setFileName] = useState('');
//     const fileInputRef = useRef(null);

//     // Kiểm tra userData có cấu trúc đúng không
//     const userName = userData?.userId?.name || 'User Name';
//     const userTitle = userData?.title || 'Job Title';
//     const userLocation = userData?.location || 'Location';
//     const userAvatar = userData?.avatar || '/default-avatar.png';
//     const userResume = userData?.resume || '';

//     // Handle file upload
//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         setIsUploading(true);
//         setFileName(file.name);

//         try {
//             const formData = new FormData();
//             formData.append('resume', file);

//             const response = await axios.post(
//                 `${backendUrl}/api/users/update-resume`,
//                 formData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 setUploadSuccess(true);
//                 toast.success('Resume uploaded successfully');
//                 // Nếu backend trả về URL mới, cập nhật UI
//                 if (response.data.resume) {
//                     // Cập nhật URL resume nếu cần
//                 }
//             } else {
//                 toast.error(response.data.message || 'Failed to upload resume');
//             }
//         } catch (error) {
//             console.error('Error uploading resume:', error);
//             toast.error(error.response?.data?.message || 'Error uploading file');
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     // Handle view resume
//     const handleViewResume = () => {
//         if (userResume) {
//             window.open(userResume, '_blank');
//         } else {
//             toast.info('No resume available. Please upload one first.');
//         }
//     };

//     // Handle avatar upload
//     const handleAvatarChange = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         try {
//             const formData = new FormData();
//             formData.append('avatar', file);

//             const response = await axios.post(
//                 `${backendUrl}/api/users/update-avatar`,
//                 formData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 toast.success('Avatar updated successfully');
//                 // Đáng lẽ phải refresh trang để lấy avatar mới, nhưng sẽ tạo UX không tốt
//                 // Có thể sử dụng URL.createObjectURL để hiển thị tạm thời
//                 // hoặc sử dụng context để cập nhật userData trong app
//             } else {
//                 toast.error(response.data.message || 'Failed to update avatar');
//             }
//         } catch (error) {
//             console.error('Error updating avatar:', error);
//             toast.error(error.response?.data?.message || 'Error updating avatar');
//         }
//     };

//     return (
//         <div>
//             {/* Thêm nút quay về trang chủ */}
//             <div className="absolute top-4 left-4 z-10">
//                 <button
//                     onClick={() => navigate('/')}
//                     className="flex items-center gap-1 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-md text-blue-600 hover:bg-white transition shadow-sm"
//                 >
//                     <Home size={18} />
//                     <span className="text-sm font-medium">Trang chủ</span>
//                 </button>
//             </div>
//             {/* Header với ảnh nền và avatar */}
//             <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
//                 <div className="absolute -bottom-16 left-8">
//                     <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
//                         <img
//                             src={userAvatar}
//                             alt={userName}
//                             className="h-full w-full object-cover"
//                         />
//                         {/* Input file cho avatar */}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleAvatarChange}
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Thông tin cơ bản */}
//             <div className="pt-20 px-8 pb-4">
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
//                         <p className="text-gray-600">{userTitle}</p>
//                         <p className="text-gray-500 flex items-center mt-1">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                             {userLocation}
//                         </p>
//                     </div>

//                     <div className="flex gap-2">
//                         {/* Input ẩn để tải file */}
//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             accept=".pdf,.doc,.docx"
//                             className="hidden"
//                         />

//                         {/* Button tải CV với các trạng thái khác nhau */}
//                         <button
//                             onClick={handleUploadClick}
//                             disabled={isUploading}
//                             className={`flex items-center px-4 py-2 rounded-md transition ${uploadSuccess || userResume
//                                 ? 'bg-green-500 text-white hover:bg-green-600'
//                                 : 'bg-blue-600 text-white hover:bg-blue-700'
//                                 }`}
//                         >
//                             {isUploading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Đang tải...
//                                 </>
//                             ) : uploadSuccess || userResume ? (
//                                 <>
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
//                                     </svg>
//                                     Cập nhật CV
//                                 </>
//                             ) : (
//                                 <>
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
//                                     </svg>
//                                     Tải CV
//                                 </>
//                             )}
//                         </button>

//                         {/* Button xem CV */}
//                         {(userResume || uploadSuccess) && (
//                             <button
//                                 onClick={handleViewResume}
//                                 className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition flex items-center"
//                             >
//                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//                                 </svg>
//                                 Xem CV
//                             </button>
//                         )}

//                         <button
//                             onClick={() => navigate("/profile/edit")}
//                             className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition"
//                         >
//                             Chỉnh sửa
//                         </button>
//                     </div>
//                 </div>

//                 {/* Hiển thị tên file khi đã tải lên */}
//                 {fileName && uploadSuccess && (
//                     <div className="mt-3 flex items-center">
//                         <div className="flex items-center text-sm text-green-600 mr-3">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                             </svg>
//                             <span className="truncate max-w-xs">{fileName}</span>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProfileHeader;

// import React, { useState, useRef } from 'react';
// import { useNavigate } from "react-router-dom";

// const ProfileHeader = ({ userData }) => {
//     const navigate = useNavigate();

//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [fileName, setFileName] = useState('');
//     const [fileURL, setFileURL] = useState('');
//     const fileInputRef = useRef(null);

//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setIsUploading(true);
//             setFileName(file.name);

//             // Tạo URL cho file để có thể xem trực tiếp
//             const objectURL = URL.createObjectURL(file);
//             setFileURL(objectURL);

//             // Mô phỏng quá trình tải lên
//             setTimeout(() => {
//                 setIsUploading(false);
//                 setUploadSuccess(true);
//             }, 1500);
//         }
//     };

//     const handleViewCV = () => {
//         // Mở CV trong tab mới
//         if (fileURL) {
//             window.open(fileURL, '_blank');
//         }
//     };

//     // avatar

//     const [selectedImage, setSelectedImage] = useState(null);

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedImage(URL.createObjectURL(file));
//         }
//     };

//     return (
//         <div>
//             {/* Header với ảnh nền và avatar */}
//             {/* <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600"> */}
//             {/* <div className="absolute -bottom-16 left-8"> */}
//             {/* <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg"> */}
//             {/* <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover" /> */}
//             {/* </div> */}
//             {/* </div> */}
//             {/* </div> */}
//             <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
//                 <div className="absolute -bottom-16 left-8">
//                     <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
//                         <img
//                             src={selectedImage || userData.userId.avatar}
//                             alt={userData.userId.name}
//                             className="h-full w-full object-cover"
//                         />
//                         {/* {hovering && <div className="overlay">Thay đổi ảnh</div>} */}
//                         {/* Input file ẩn */}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                         />
//                     </div>
//                 </div>
//             </div>
//             {/* Thông tin cơ bản */}
//             <div className="pt-20 px-8 pb-4">
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">{userData.userId.name}</h1>
//                         <p className="text-gray-600">{userData.usesrId.title}</p>
//                         <p className="text-gray-500 flex items-center mt-1">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                             {userData.userId.location}
//                         </p>
//                     </div>

//                     <div className="flex gap-2">
//                         {/* Input ẩn để tải file */}
//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             accept=".pdf,.doc,.docx"
//                             className="hidden"
//                         />

//                         {/* Button tải CV với các trạng thái khác nhau */}
//                         <button
//                             onClick={handleUploadClick}
//                             disabled={isUploading}
//                             className={`flex items-center px-4 py-2 rounded-md transition ${uploadSuccess
//                                 ? 'bg-green-500 text-white hover:bg-green-600'
//                                 : 'bg-blue-600 text-white hover:bg-blue-700'
//                                 }`}
//                         >
//                             {isUploading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Đang tải...
//                                 </>
//                             ) : uploadSuccess ? (
//                                 <>
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
//                                     </svg>
//                                     CV đã tải lên
//                                 </>
//                             ) : (
//                                 <>
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
//                                     </svg>
//                                     Tải CV
//                                 </>
//                             )}
//                         </button>

//                         <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition">
//                             Liên hệ
//                         </button>

//                         <button
//                             onClick={() => navigate("/profile/edit")}
//                             className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition">
//                             Chỉnh sửa
//                         </button>
//                     </div>
//                 </div>

//                 {/* Hiển thị tên file và nút xem CV khi đã tải lên */}
//                 {fileName && uploadSuccess && (
//                     <div className="mt-3 flex items-center">
//                         <div className="flex items-center text-sm text-green-600 mr-3">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                             </svg>
//                             <span className="truncate max-w-xs">{fileName}</span>
//                         </div>
//                         <button
//                             onClick={handleViewCV}
//                             className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition"
//                         >
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//                             </svg>
//                             Xem CV
//                         </button>
//                     </div>
//                 )}

//                 {/* Preview cho các file khác PDF (tùy chọn) */}
//                 {fileURL && uploadSuccess && !fileName.endsWith('.pdf') && (
//                     <div className="mt-2 p-2 border rounded-md">
//                         <p className="text-xs text-gray-500 mb-1">Preview CV:</p>
//                         <div className="h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
//                             <p className="text-sm text-gray-600">
//                                 Nhấn "Xem CV" để xem file đầy đủ
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProfileHeader;