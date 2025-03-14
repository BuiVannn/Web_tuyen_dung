import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ userData }) => {
    const navigate = useNavigate();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileURL, setFileURL] = useState('');
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            setFileName(file.name);

            // Tạo URL cho file để có thể xem trực tiếp
            const objectURL = URL.createObjectURL(file);
            setFileURL(objectURL);

            // Mô phỏng quá trình tải lên
            setTimeout(() => {
                setIsUploading(false);
                setUploadSuccess(true);
            }, 1500);
        }
    };

    const handleViewCV = () => {
        // Mở CV trong tab mới
        if (fileURL) {
            window.open(fileURL, '_blank');
        }
    };

    // avatar

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            {/* Header với ảnh nền và avatar */}
            {/* <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600"> */}
            {/* <div className="absolute -bottom-16 left-8"> */}
            {/* <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg"> */}
            {/* <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover" /> */}
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute -bottom-16 left-8">
                    <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                        <img
                            src={selectedImage || userData.avatar}
                            alt={userData.name}
                            className="h-full w-full object-cover"
                        />
                        {/* {hovering && <div className="overlay">Thay đổi ảnh</div>} */}
                        {/* Input file ẩn */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            {/* Thông tin cơ bản */}
            <div className="pt-20 px-8 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                        <p className="text-gray-600">{userData.title}</p>
                        <p className="text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {userData.location}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {/* Input ẩn để tải file */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                        />

                        {/* Button tải CV với các trạng thái khác nhau */}
                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className={`flex items-center px-4 py-2 rounded-md transition ${uploadSuccess
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang tải...
                                </>
                            ) : uploadSuccess ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    CV đã tải lên
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                    </svg>
                                    Tải CV
                                </>
                            )}
                        </button>

                        <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition">
                            Liên hệ
                        </button>

                        <button
                            onClick={() => navigate("/profile/edit")}
                            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition">
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

                {/* Hiển thị tên file và nút xem CV khi đã tải lên */}
                {fileName && uploadSuccess && (
                    <div className="mt-3 flex items-center">
                        <div className="flex items-center text-sm text-green-600 mr-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="truncate max-w-xs">{fileName}</span>
                        </div>
                        <button
                            onClick={handleViewCV}
                            className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Xem CV
                        </button>
                    </div>
                )}

                {/* Preview cho các file khác PDF (tùy chọn) */}
                {fileURL && uploadSuccess && !fileName.endsWith('.pdf') && (
                    <div className="mt-2 p-2 border rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Preview CV:</p>
                        <div className="h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
                            <p className="text-sm text-gray-600">
                                Nhấn "Xem CV" để xem file đầy đủ
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;