import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// Bỏ import assets nếu không dùng icon upload mặc định nữa
// import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Applications = () => {
    // Bỏ state không dùng
    // const [showPdfModal, setShowPdfModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // State quản lý chế độ edit/view
    const [resume, setResume] = useState(null); // State lưu file resume được chọn
    const [isUploading, setIsUploading] = useState(false); // State quản lý trạng thái đang upload

    const {
        backendUrl,
        userData,
        userToken,
        userApplications,
        fetchUserData, // Cần đảm bảo hàm này fetch và cập nhật userData trong context
        fetchUserApplications
    } = useContext(AppContext);

    // Hàm xử lý upload/update resume
    // Sửa lỗi cú pháp trong hàm updateResume
    const updateResume = async () => {
        try {
            if (!resume) {
                // Đảm bảo chỉ hiển thị một thông báo error
                toast.dismiss(); // Đóng tất cả toast hiện tại
                toast.error('Vui lòng chọn file resume (PDF)', {
                    toastId: 'resume-error',
                    autoClose: 3000
                });
                return;
            }

            console.log('File being uploaded:', resume);
            setIsUploading(true);

            const formData = new FormData();
            formData.append('resume', resume);

            // Đóng tất cả các toast trước khi bắt đầu upload
            toast.dismiss();

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload response:', data);

            // Đặt các state trước khi hiển thị toast
            setIsEdit(false);
            setResume(null);

            // Fetch dữ liệu mới
            await fetchUserData();

            // Hiển thị toast sau khi đã hoàn tất mọi xử lý
            setTimeout(() => {
                toast.success('Resume đã được cập nhật thành công', {
                    toastId: 'resume-success',
                    position: 'top-right',
                    autoClose: 3000,
                    transition: Slide,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }, 300);
        } catch (error) {
            console.error('Resume upload error:', error);

            // Đóng tất cả các toast trước khi hiển thị lỗi
            toast.dismiss();

            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume', {
                toastId: 'resume-error',
                autoClose: 3000
            });
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_loi = async () => {
        try {
            if (!resume) {
                return toast.error('Vui lòng chọn file resume (PDF)', {
                    toastId: 'resume-error' // Thêm ID trong object options
                });
            }

            // Phần code còn lại giữ nguyên
            console.log('File being uploaded:', resume);

            setIsUploading(true);
            const formData = new FormData();
            formData.append('resume', resume);

            // Debug log
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload response:', data);

            if (data.success) {
                // THAY ĐỔI: Không hiển thị toast ở đây
                // Chỉ fetch dữ liệu mới
                await fetchUserData();

                // Sau khi fetch xong mới hiển thị toast
                toast.success('Resume đã được cập nhật thành công', {
                    toastId: 'resume-success',
                    autoClose: 3000,
                    position: 'top-right'
                });

                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(data.message || 'Failed to update resume', {
                    toastId: 'resume-fail'
                });
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume', {
                toastId: 'resume-error'
            });
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_4 = async () => {
        try {
            if (!resume) {
                return toast.error('Vui lòng chọn file resume (PDF)');
            }

            // Debug log
            console.log('File being uploaded:', resume);

            setIsUploading(true);
            const formData = new FormData();
            formData.append('resume', resume);

            // Debug log
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload response:', data);

            if (data.success) {
                toast.success(data.message);
                if (data.data?.resumeUrl) {
                    console.log('New resume URL:', data.data.resumeUrl);
                }
                await fetchUserData();
                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(data.message || 'Failed to update resume');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume');
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_3 = async () => {
        try {
            if (!resume) {
                return toast.error('Vui lòng chọn file resume (PDF)');
            }
            setIsUploading(true);

            const formData = new FormData();
            formData.append('resume', resume);

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload response:', data); // Debug log

            if (data.success) {
                toast.success(data.message);
                // Kiểm tra và log URL mới
                if (data.data?.resumeUrl) {
                    console.log('New resume URL:', data.data.resumeUrl);
                }
                await fetchUserData(); // Cập nhật userData với URL mới
                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(data.message || 'Failed to update resume');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume');
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_2 = async () => {
        try {
            if (!resume) {
                return toast.error('Vui lòng chọn file resume (PDF)');
            }
            setIsUploading(true);

            const formData = new FormData();
            formData.append('resume', resume);

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload response:', data); // Debug log

            if (data.success) {
                toast.success(data.message);
                await fetchUserData(); // Cập nhật userData với URL mới
                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume');
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_1 = async () => {
        if (!resume) {
            return toast.error('Vui lòng chọn file resume (PDF)');
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append('resume', resume);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message || 'Resume updated successfully!');
                await fetchUserData(); // Fetch lại data user mới
                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(data.message || 'Failed to update resume.');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'An error occurred during upload.');
        } finally {
            setIsUploading(false);
        }
    };
    const updateResume_0 = async () => {
        if (!resume) {
            return toast.error('Vui lòng chọn file resume (PDF)');
        }
        setIsUploading(true); // Bắt đầu upload
        //setError(''); // Clear lỗi cũ

        const formData = new FormData();
        formData.append('resume', resume);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        // 'Content-Type': 'multipart/form-data' // Axios tự xử lý header này khi dùng FormData
                    }
                }
            );

            if (data.success) {
                toast.success(data.message || 'Resume updated successfully!');
                await fetchUserData(); // Rất quan trọng: fetch lại data user mới nhất
                setIsEdit(false);     // Thoát chế độ edit
                setResume(null);      // Xóa file đã chọn khỏi state
            } else {
                toast.error(data.message || 'Failed to update resume.');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'An error occurred during upload.');
        } finally {
            setIsUploading(false); // Kết thúc upload
        }
    };


    //useEffect(() => {
    // Fetch applications khi có userToken
    ///if (userToken) {
    //fetchUserApplications();

    // Có thể fetchUserData ở đây nếu cần load lần đầu
    // if (!userData) {
    //  fetchUserData();
    // }
    //}
    // Reset edit state nếu user thay đổi (ví dụ: logout/login user khác)
    //setIsEdit(false);
    // setResume(null);
    // }, [userToken]); // Thêm fetchUserApplications vào dependency nếu nó thay đổi
    useEffect(() => {
        const loadData = async () => {
            if (userToken) {
                await fetchUserApplications();
                await fetchUserData(); // Make sure we have latest user data
            }
        };

        loadData();
        // Reset states when component mounts
        setIsEdit(false);
        setResume(null);
    }, [userToken]); // Add fetchUserData and fetchUserApplications to dependencies if needed

    // Hàm render phần Resume (Upload/View/Edit)
    const renderResumeSection = () => {
        // Kiểm tra trạng thái loading
        if (!userData && userToken) {
            return <p className="text-gray-500">Đang tải thông tin...</p>;
        }
        if (!userData) {
            return <p className="text-gray-500">Vui lòng đăng nhập để quản lý resume.</p>;
        }

        // Kiểm tra có resume hay không - cải thiện kiểm tra để tránh false positive
        const hasResume = Boolean(userData?.resume && typeof userData.resume === 'string' && userData.resume.trim() !== '');
        console.log('Resume URL check:', userData?.resume);

        // Show upload form khi đang edit hoặc chưa có resume
        if (isEdit || !hasResume) {
            return (
                <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="resumeUpload" className="flex items-center cursor-pointer">
                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2 text-sm font-medium truncate max-w-xs">
                            {resume ? resume.name : (hasResume ? "Chọn file mới..." : "Chọn file Resume (PDF)")}
                        </span>
                        <input
                            id="resumeUpload"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    if (e.target.files[0].type === "application/pdf") {
                                        setResume(e.target.files[0]);
                                    } else {
                                        toast.error("Chỉ chấp nhận file PDF");
                                        e.target.value = null;
                                    }
                                }
                            }}
                            accept="application/pdf"
                            type="file"
                            hidden
                            disabled={isUploading}
                        />
                        <span className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium 
                            ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                            Browse
                        </span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={updateResume}
                            disabled={!resume || isUploading}
                            className={`border rounded-lg px-5 py-2 text-sm font-medium 
                                ${!resume || isUploading ?
                                    'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' :
                                    'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'}`}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        {isEdit && hasResume && (
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setResume(null);
                                }}
                                disabled={isUploading}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // Show view/edit buttons khi có resume và không trong chế độ edit
        return (
            <div className="flex items-center gap-3">
                <p className="text-gray-700 text-sm font-medium">Resume đã được tải lên</p>
                <button
                    onClick={() => {
                        if (!userData?.resume) {
                            toast.error('Chưa có resume nào được tải lên');
                            return;
                        }

                        // Sử dụng URL Cloudinary trực tiếp, không sửa đổi để tránh lỗi
                        const resumeUrl = userData.resume;
                        console.log('Opening resume URL:', resumeUrl);

                        // Mở URL trong tab mới, không thay đổi định dạng URL
                        window.open(resumeUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg text-sm"
                >
                    Xem Resume
                </button>
                <button
                    onClick={() => setIsEdit(true)}
                    className="text-gray-700 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                    Edit
                </button>
            </div>
        );
    };
    const renderResumeSection_3 = () => {
        // 1. Debug logs
        console.log('userData:', userData);
        console.log('resume URL:', userData?.resume);

        // 2. Loading states
        if (!userData && userToken) {
            return <p className="text-gray-500">Đang tải thông tin...</p>;
        }
        if (!userData) {
            return <p className="text-gray-500">Vui lòng đăng nhập để quản lý resume.</p>;
        }

        // 3. Check for resume existence - make sure empty strings are considered as no resume
        const hasResume = Boolean(userData?.resume && typeof userData.resume === 'string' && userData.resume.trim().length > 0);
        console.log('Has resume check:', {
            resumeValue: userData?.resume,
            hasResume,
            type: typeof userData?.resume

        });

        // 4. Show upload form when editing or no resume
        if (isEdit || !hasResume) {
            return (
                <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="resumeUpload" className="flex items-center cursor-pointer">
                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2 text-sm font-medium truncate max-w-xs">
                            {resume ? resume.name : (hasResume ? "Chọn file mới..." : "Chọn file Resume (PDF)")}
                        </span>
                        <input
                            id="resumeUpload"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    if (e.target.files[0].type === "application/pdf") {
                                        setResume(e.target.files[0]);
                                    } else {
                                        toast.error("Chỉ chấp nhận file PDF");
                                        e.target.value = null;
                                    }
                                }
                            }}
                            accept="application/pdf"
                            type="file"
                            hidden
                            disabled={isUploading}
                        />
                        <span className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium 
                            ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                            Browse
                        </span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={updateResume}
                            disabled={!resume || isUploading}
                            className={`border rounded-lg px-5 py-2 text-sm font-medium 
                                ${!resume || isUploading ?
                                    'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' :
                                    'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'}`}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        {isEdit && hasResume && (
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setResume(null);
                                }}
                                disabled={isUploading}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // 5. Show view/edit buttons when has resume
        return (
            <div className="flex items-center gap-3">
                <p className="text-gray-700 text-sm font-medium">Resume đã được tải lên</p>
                <button
                    onClick={() => {
                        if (!userData?.resume) {
                            toast.error('Chưa có resume nào được tải lên');
                            return;
                        }
                        // Use fl_attachment for better PDF viewing
                        const viewUrl = userData.resume;
                        // .replace('/upload/', '/upload/fl_attachment/')
                        // .replace('/raw/', '/');
                        console.log('Opening resume URL:', viewUrl);
                        // const finalUrl = `${viewUrl}#view=FitH`;
                        // window.open(finalUrl, '_blank', 'noopener,noreferrer');
                        window.open(viewUrl, '_blank', 'noopener,noreferrer');
                        //window.open(viewUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg text-sm"
                >
                    Xem Resume
                </button>
                <button
                    onClick={() => setIsEdit(true)}
                    className="text-gray-700 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                    Edit
                </button>
            </div>
        );
    };
    const renderResumeSection_2 = () => {
        // 1. Kiểm tra trạng thái loading
        if (!userData && userToken) {
            return <p className="text-gray-500">Đang tải thông tin...</p>;
        }
        if (!userData) {
            return <p className="text-gray-500">Vui lòng đăng nhập để quản lý resume.</p>;
        }

        // 2. Kiểm tra có resume hay không
        const hasResume = Boolean(userData?.resume);
        console.log('Has resume:', hasResume, 'Resume URL:', userData?.resume); // Debug log

        // 3. Show upload form khi đang edit hoặc chưa có resume
        if (isEdit || !hasResume) {
            return (
                <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="resumeUpload" className="flex items-center cursor-pointer">
                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2 text-sm font-medium truncate max-w-xs">
                            {resume ? resume.name : (hasResume ? "Chọn file mới..." : "Chọn file Resume (PDF)")}
                        </span>
                        <input
                            id="resumeUpload"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    if (e.target.files[0].type === "application/pdf") {
                                        setResume(e.target.files[0]);
                                    } else {
                                        toast.error("Chỉ chấp nhận file PDF");
                                        e.target.value = null;
                                    }
                                }
                            }}
                            accept="application/pdf"
                            type="file"
                            hidden
                            disabled={isUploading}
                        />
                        <span className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium 
                            ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                            Browse
                        </span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={updateResume}
                            disabled={!resume || isUploading}
                            className={`border rounded-lg px-5 py-2 text-sm font-medium 
                                ${!resume || isUploading ?
                                    'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' :
                                    'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'}`}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        {isEdit && hasResume && (
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setResume(null);
                                }}
                                disabled={isUploading}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // 4. Show view/edit buttons khi có resume và không trong chế độ edit
        return (
            <div className="flex items-center gap-3">
                <p className="text-gray-700 text-sm font-medium">Resume đã được tải lên</p>
                <button
                    onClick={() => {
                        try {
                            if (!userData?.resume) {
                                toast.error('Chưa có resume nào được tải lên');
                                return;
                            }
                            // Sử dụng fl_inline thay vì fl_attachment để xem PDF trực tiếp
                            const viewUrl = userData.resume.replace('/upload/', '/upload/fl_inline/');
                            console.log('Opening resume URL:', viewUrl);
                            window.open(viewUrl, '_blank', 'noopener,noreferrer');
                        } catch (error) {
                            console.error('Error opening resume:', error);
                            toast.error('Không thể mở resume');
                        }
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg text-sm"
                >
                    Xem Resume
                </button>
                <button
                    onClick={() => setIsEdit(true)}
                    className="text-gray-700 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                    Edit
                </button>
            </div>
        );
    };
    const renderResumeSection_1 = () => {
        // 1. Xử lý trạng thái đang tải dữ liệu User
        if (!userData && userToken) {
            return <p className="text-gray-500">Đang tải thông tin...</p>;
        }
        if (!userData) {
            return <p className="text-gray-500">Vui lòng đăng nhập để quản lý resume.</p>;
        }

        // 2. Xác định trạng thái: có resume hay không?
        const hasResume = Boolean(userData.resume); // Đảm bảo chuyển đổi chính xác

        // 3. Render dựa trên trạng thái isEdit và hasResume
        if (isEdit || !hasResume) {
            return (
                <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="resumeUpload" className="flex items-center cursor-pointer">
                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2 text-sm font-medium truncate max-w-xs">
                            {resume ? resume.name : (hasResume ? "Chọn file mới..." : "Chọn file Resume (PDF)")}
                        </span>
                        <input
                            id="resumeUpload"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    if (e.target.files[0].type === "application/pdf") {
                                        setResume(e.target.files[0]);
                                    } else {
                                        toast.error("Chỉ chấp nhận file PDF");
                                        e.target.value = null;
                                    }
                                }
                            }}
                            accept="application/pdf"
                            type="file"
                            hidden
                            disabled={isUploading}
                        />
                        <span className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                            Browse
                        </span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={updateResume}
                            disabled={!resume || isUploading}
                            className={`border rounded-lg px-5 py-2 text-sm font-medium ${!resume || isUploading ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'}`}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        {isEdit && hasResume && (
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setResume(null);
                                }}
                                disabled={isUploading}
                                className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium ${isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // TRẠNG THÁI 2: Có resume và không trong chế độ edit
        return (
            <div className="flex items-center gap-3">
                <p className="text-gray-700 text-sm font-medium">Resume đã được tải lên.</p>
                <button
                    onClick={() => {
                        if (!userData?.resume) {
                            toast.error('Chưa có resume nào được tải lên');
                            return;
                        }
                        // Thay đổi cách xem PDF qua Cloudinary
                        const viewUrl = userData.resume.replace('/upload/', '/upload/fl_attachment/');
                        window.open(viewUrl, '_blank');
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg text-sm"
                >
                    Xem Resume
                </button>
                <button
                    onClick={() => setIsEdit(true)}
                    className="text-gray-700 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                    Edit
                </button>
            </div>
        );
    };
    const renderResumeSection_0 = () => {
        // 1. Xử lý trạng thái đang tải dữ liệu User
        if (!userData && userToken) { // Check cả userToken để biết là đang đợi fetch hay chưa login
            return <p className="text-gray-500">Đang tải thông tin...</p>;
        }
        // Trường hợp chưa đăng nhập hoặc không có userData
        if (!userData) {
            return <p className="text-gray-500">Vui lòng đăng nhập để quản lý resume.</p>;
        }

        // 2. Xác định trạng thái: có resume hay không?
        const hasResume = !!userData.resume; // true nếu có link resume, false nếu null/undefined/""

        // 3. Render dựa trên trạng thái isEdit và hasResume

        // TRẠNG THÁI 1: Đang chỉnh sửa (isEdit=true) HOẶC Chưa có resume (hasResume=false)
        if (isEdit || !hasResume) {
            return (
                <div className="flex flex-wrap items-center gap-3"> {/* Dùng flex-wrap */}
                    {/* Input chọn file */}
                    <label htmlFor="resumeUpload" className="flex items-center cursor-pointer">
                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2 text-sm font-medium truncate max-w-xs">
                            {resume ? resume.name : (hasResume ? "Chọn file mới..." : "Chọn file Resume (PDF)")}
                        </span>
                        <input
                            id="resumeUpload"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    // Kiểm tra định dạng file (chỉ chấp nhận PDF)
                                    if (e.target.files[0].type === "application/pdf") {
                                        setResume(e.target.files[0]);
                                    } else {
                                        toast.error("Chỉ chấp nhận file định dạng PDF.");
                                        e.target.value = null; // Reset input nếu file không hợp lệ
                                    }
                                }
                            }}
                            accept="application/pdf"
                            type="file"
                            hidden
                            disabled={isUploading} // Disable khi đang upload
                        />
                        {/* Nút Browse thay cho icon */}
                        <span className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                            Browse
                        </span>
                    </label>

                    {/* Nút Save và Cancel */}
                    <div className="flex gap-2">
                        <button
                            onClick={updateResume}
                            disabled={!resume || isUploading} // Disable khi chưa chọn file hoặc đang upload
                            className={`border rounded-lg px-5 py-2 text-sm font-medium ${!resume || isUploading
                                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        {/* Chỉ hiện nút Cancel khi đang *chỉnh sửa* resume đã có */}
                        {isEdit && hasResume && (
                            <button
                                onClick={() => {
                                    setIsEdit(false); // Thoát chế độ edit
                                    setResume(null);  // Xóa file đang chọn (nếu có)
                                }}
                                disabled={isUploading} // Disable khi đang upload
                                className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium ${isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // TRẠNG THÁI 2: Đã có resume (hasResume=true) và KHÔNG chỉnh sửa (isEdit=false)
        return (
            <div className="flex items-center gap-3">
                {/* Có thể hiển thị tên file hoặc thông báo đã có resume */}
                <p className="text-gray-700 text-sm font-medium">Resume đã được tải lên.</p>
                <button
                    onClick={() => {
                        try {
                            // Kiểm tra URL hợp lệ và chứa '/upload/'
                            if (userData.resume && userData.resume.includes('/upload/')) {
                                // Thay thế /upload/ bằng /upload/fl_inline/ để xem trực tiếp
                                const viewUrl = userData.resume.replace('/upload/', '/upload/fl_inline/');
                                console.log('Opening resume URL for inline view:', viewUrl);
                                window.open(viewUrl, '_blank', 'noopener,noreferrer');
                            } else {
                                console.error('Invalid Cloudinary URL format:', userData.resume);
                                toast.error('Không thể xem resume. Định dạng URL không hợp lệ.');
                            }
                        } catch (error) {
                            console.error('Error constructing resume view URL:', error);
                            toast.error('Lỗi khi chuẩn bị link xem resume.');
                        }
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg text-sm"
                >
                    Xem Resume
                </button>
                <button
                    onClick={() => setIsEdit(true)} // Chuyển sang chế độ edit
                    className="text-gray-700 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                    Edit
                </button>
            </div>
        );
    };


    const renderStatusBadge = (status) => {
        // ... (Giữ nguyên hàm renderStatusBadge của bạn)
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
            viewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xem' },
            shortlisted: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Phù hợp' },
            interviewing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Phỏng vấn' },
            hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã tuyển' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối' },
            // Thêm các trạng thái khác nếu cần
            default: { bg: 'bg-gray-100', text: 'text-gray-800', label: status || 'Không rõ' } // Trạng thái mặc định hoặc không xác định
        };
        // Sử dụng toLowerCase() để đảm bảo khớp key ngay cả khi status từ API trả về chữ hoa/thường khác nhau
        const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

        return (
            <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    return (
        <>
            <Navbar />
            <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
                <h2 className="text-xl font-semibold mb-3">Resume Của Bạn</h2>
                <div className="mb-8"> {/* Tăng khoảng cách dưới */}
                    {renderResumeSection()}
                </div>

                <h2 className="text-xl font-semibold mb-4">Các Công Việc Đã Ứng Tuyển</h2>
                {/* Thêm trạng thái loading/empty cho bảng */}
                {userApplications.length === 0 ? (
                    <p className="text-gray-500">Bạn chưa ứng tuyển công việc nào.</p>
                ) : (
                    <div className="overflow-x-auto"> {/* Cho phép cuộn ngang trên màn hình nhỏ */}
                        <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                            {/* ... thead ... giữ nguyên */}
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Địa điểm</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Ngày ứng tuyển</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userApplications.map((application) => (
                                    // Kiểm tra dữ liệu trước khi render để tránh lỗi
                                    application && application.companyId && application.jobId ? (
                                        <tr key={application._id} className="hover:bg-gray-50"> {/* Sử dụng _id làm key */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-8 w-8 rounded-full object-cover" src={application.companyId.image || assets.default_company_logo} alt={application.companyId.name} /> {/* Thêm alt và ảnh default */}
                                                    <span className="ml-2 text-sm text-gray-900">{application.companyId.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {application.jobId.title}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                                                {application.jobId.location}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                                                {/* Kiểm tra application.date tồn tại và hợp lệ */}
                                                {application.date ? moment(application.date).format('DD/MM/YYYY') : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {renderStatusBadge(application.status)}
                                            </td>
                                        </tr>
                                    ) : null // Bỏ qua nếu dữ liệu application không đầy đủ
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Applications;

// import React, { useContext, useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import { assets } from "../assets/assets";
// import moment from "moment";
// import Footer from "../components/Footer";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AppContext } from "../context/AppContext";

// const Applications = () => {
//     const [showPdfModal, setShowPdfModal] = useState(false);
//     const [isEdit, setIsEdit] = useState(false);
//     const [resume, setResume] = useState(null);

//     // const [numPages, setNumPages] = useState(null);
//     // const [pageNumber, setPageNumber] = useState(1);

//     const {
//         backendUrl,
//         userData,
//         userToken,
//         userApplications,
//         fetchUserData,
//         fetchUserApplications
//     } = useContext(AppContext);

//     const updateResume = async () => {
//         try {
//             if (!resume) {
//                 return toast.error('Please select a resume file');
//             }
//             const formData = new FormData();
//             formData.append('resume', resume);

//             const { data } = await axios.post(
//                 `${backendUrl}/api/users/update-resume`,
//                 formData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success(data.message);
//                 await fetchUserData(); // Fetch updated user data
//                 setIsEdit(false); // Reset edit mode
//                 setResume(null); // Clear selected file
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Resume upload error:', error);
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };


//     useEffect(() => {
//         if (userToken) {
//             fetchUserApplications();
//         }
//     }, [userToken]);

//     const renderResumeSection = () => {
//         // Fix condition check - show edit form when isEdit is true OR when no resume exists
//         if (isEdit || !userData?.resume) {
//             return (
//                 <>
//                     <label className="flex items-center" htmlFor="resumeUpload">
//                         <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
//                             {resume ? resume.name : "Select Resume"}
//                         </p>
//                         <input
//                             id="resumeUpload"
//                             onChange={e => setResume(e.target.files[0])}
//                             accept="application/pdf"
//                             type="file"
//                             hidden
//                         />
//                         <img src={assets.profile_upload_icon} alt="" />
//                     </label>
//                     <button
//                         onClick={updateResume}
//                         className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
//                     >
//                         Save
//                     </button>
//                 </>
//             );
//         }

//         // Show view/edit buttons when resume exists
//         return (
//             <div className="flex gap-2">
//                 <button
//                     onClick={() => {
//                         if (!userData?.resume) {
//                             toast.error('No resume uploaded');
//                             return;
//                         }
//                         const cloudinaryUrl = userData.resume.replace('/upload/', '/upload/fl_attachment/');
//                         console.log('Opening resume URL:', cloudinaryUrl);
//                         window.open(cloudinaryUrl, '_blank');
//                     }}
//                     className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
//                 >
//                     View Resume
//                 </button>
//                 <button
//                     onClick={() => setIsEdit(true)}
//                     className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
//                 >
//                     Edit
//                 </button>
//             </div>
//         );
//     };




//     const renderStatusBadge = (status) => {
//         const statusConfig = {
//             pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
//             viewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xem' },
//             shortlisted: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Phù hợp' },
//             interviewing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Phỏng vấn' },
//             hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã tuyển' },
//             rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối' }
//         };

//         const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

//         return (
//             <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//                 {config.label}
//             </span>
//         );
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
//                 <h2 className="text-xl font-semibold">Your Resume</h2>
//                 <div className="flex gap-2 mb-6 mt-3">
//                     {renderResumeSection()}
//                 </div>

//                 <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
//                 <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
//                     <thead>
//                         <tr>
//                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
//                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
//                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Địa điểm</th>
//                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Ngày</th>
//                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {userApplications.map((job, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                     <div className="flex items-center">
//                                         <img className="h-8 w-8 rounded-full" src={job.companyId.image} alt="" />
//                                         <span className="ml-2 text-sm text-gray-900">{job.companyId.name}</span>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                                     {job.jobId.title}
//                                 </td>
//                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
//                                     {job.jobId.location}
//                                 </td>
//                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
//                                     {moment(job.date).format('ll')}
//                                 </td>
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                     {renderStatusBadge(job.status)}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default Applications;

// // import React, { useContext, useEffect, useState } from "react";
// // import Navbar from "../components/Navbar";
// // import { assets, jobsApplied } from "../assets/assets";
// // import moment from "moment";
// // import Footer from "../components/Footer";
// // import SalaryComparison from "../components/SalaryComparison";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { AppContext } from "../context/AppContext";

// // const Applications = () => {

// //     //const { user } = useUser()
// //     //const { getToken } = useAuth()
// //     const [showPdfModal, setShowPdfModal] = useState(false);
// //     const [isEdit, setIsEdit] = useState(false)
// //     const [resume, setResume] = useState(null)

// //     const { backendUrl, userData, userToken, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

// //     const updateResume = async () => {

// //         try {
// //             if (!resume) {
// //                 return toast.error('Please select a resume file');
// //             }
// //             const formData = new FormData()
// //             formData.append('resume', resume)

// //             //const token = await getToken()
// //             const { data } = await axios.post(backendUrl + '/api/users/update-resume',
// //                 formData,
// //                 {
// //                     headers: {
// //                         'Authorization': `Bearer ${userToken}`,
// //                         'Content-Type': 'multipart/form-data'
// //                     }
// //                 }
// //             )
// //             console.log('Upload response:', data);

// //             if (data.success) {
// //                 toast.success(data.message)
// //                 await fetchUserData()
// //                 setIsEdit(false);
// //                 setResume(null);
// //             }
// //             else {
// //                 toast.error(data.message)
// //             }
// //         } catch (error) {
// //             toast.error(error.response?.data?.message || error.message);
// //         }

// //         setIsEdit(false)
// //         setResume(null)
// //     }

// //     useEffect(() => {
// //         if (userToken) {
// //             fetchUserApplications()
// //         }
// //     }, [userToken])
// //     return (
// //         <>
// //             <Navbar />
// //             <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
// //                 <h2 className="text-xl font-semibold">Your Resume</h2>
// //                 <div className="flex gap-2 mb-6 mt-3 ">
// //                     {
// //                         // Kiểm tra userData tồn tại trước
// //                         isEdit || (userData && userData.resume === "") ? (
// //                             <>
// //                                 <label className="flex items-center " htmlFor="resumeUpload">
// //                                     <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
// //                                         {resume ? resume.name : "Select Resume"}
// //                                     </p>
// //                                     <input
// //                                         id='resumeUpload'
// //                                         onChange={e => setResume(e.target.files[0])}
// //                                         accept="application/pdf"
// //                                         type="file"
// //                                         hidden
// //                                     />
// //                                     <img src={assets.profile_upload_icon} alt="" />
// //                                 </label>
// //                                 <button
// //                                     onClick={updateResume}
// //                                     className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
// //                                 >
// //                                     Save
// //                                 </button>
// //                             </>
// //                         ) : (
// //                             // Kiểm tra userData tồn tại trước khi truy cập resume
// //                             userData && (
// //                                 <div className="flex gap-2">
// //                                     <a
// //                                         target="_blank"
// //                                         href={userData?.resume}
// //                                         //href={userData?.resume?.replace('/upload/', '/upload/fl_attachment/')}
// //                                         rel="noopener noreferrer"
// //                                         className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
// //                                         onClick={(e) => {
// //                                             if (!userData?.resume) {
// //                                                 e.preventDefault();
// //                                                 toast.error('No resume uploaded');
// //                                             }
// //                                             console.log('Resume URL:', userData?.resume); // Debug log
// //                                         }}
// //                                     >
// //                                         View Resume
// //                                     </a>
// //                                     <button
// //                                         onClick={() => setIsEdit(true)}
// //                                         className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
// //                                     >
// //                                         Edit
// //                                     </button>
// //                                 </div>
// //                             )
// //                         )
// //                     }
// //                     {/* { */}
// //                     {/* // isEdit || userData && userData.resume === "" */}
// //                     {/* // ? <> */}
// //                     {/* <label className="flex items-center " htmlFor="resumeUpload"> */}
// //                     {/* <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">{resume ? resume.name : "Select Resume"}</p> */}
// //                     {/* <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept="application/pdf" type="file" hidden /> */}
// //                     {/* <img src={assets.profile_upload_icon} alt="" /> */}
// //                     {/* </label> */}
// //                     {/* <button onClick={updateResume} className="bg-green-100 border border-green-400 rounded-lg px-4 py-2">Save</button> */}
// //                     {/* </> */}
// //                     {/* // : <div className="flex gap-2"> */}
// //                     {/* <a target="_blank" href={userData.resume} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"> */}
// //                     {/* Resume */}
// //                     {/* </a> */}
// //                     {/* <button onClick={() => setIsEdit(true)} className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 "> */}
// //                     {/* Edit */}
// //                     {/* </button> */}
// //                     {/* </div> */}
// //                     {/* // } */}
// //                 </div>
// //                 <h2 className="text-xl font-semibold mb-4 ">Jobs Applied</h2>
// //                 <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
// //                     <thead>
// //                         <tr>
// //                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
// //                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
// //                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Địa điểm</th>
// //                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Ngày</th>
// //                             <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                         {userApplications.map((job, index) => true ? (
// //                             <tr key={index} className="hover:bg-gray-50">
// //                                 <td className="px-4 py-3 whitespace-nowrap">
// //                                     <div className="flex items-center">
// //                                         <img className="h-8 w-8 rounded-full" src={job.companyId.image} alt="" />
// //                                         <span className="ml-2 text-sm text-gray-900">{job.companyId.name}</span>
// //                                     </div>

// //                                 </td>
// //                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
// //                                     {job.jobId.title}
// //                                 </td>
// //                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">{job.jobId.location}</td>
// //                                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">{moment(job.date).format('ll')}</td>
// //                                 {/* <td className="py-2 px-4 border-b"> */}
// //                                 {/* <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5  rounded`}> */}
// //                                 {/* {job.status} */}
// //                                 {/* </span> */}
// //                                 {/* </td> */}
// //                                 <td className="px-4 py-3 whitespace-nowrap">
// //                                     <span className={`px-4 py-1.5 rounded-full text-xs font-medium
// //                                         ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
// //                                             job.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
// //                                                 job.status === 'shortlisted' ? 'bg-indigo-100 text-indigo-800' :
// //                                                     job.status === 'interviewing' ? 'bg-purple-100 text-purple-800' :
// //                                                         job.status === 'hired' ? 'bg-green-100 text-green-800' :
// //                                                             job.status === 'rejected' ? 'bg-red-100 text-red-800' :
// //                                                                 'bg-gray-100 text-gray-800'
// //                                         }`}>
// //                                         {job.status === 'pending' ? 'Chờ duyệt' :
// //                                             job.status === 'viewed' ? 'Đã xem' :
// //                                                 job.status === 'shortlisted' ? 'Phù hợp' :
// //                                                     job.status === 'interviewing' ? 'Phỏng vấn' :
// //                                                         job.status === 'hired' ? 'Đã tuyển' :
// //                                                             job.status === 'rejected' ? 'Từ chối' :
// //                                                                 job.status}
// //                                     </span>
// //                                 </td>
// //                             </tr>
// //                         ) : (null))}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* test */}
// //             {/* <SalaryComparison /> */}
// //             <Footer />
// //         </>
// //     )
// // }

// // export default Applications