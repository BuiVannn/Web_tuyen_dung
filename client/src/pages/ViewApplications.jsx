// src/pages/ViewApplications.jsx (Đã sửa để xử lý 2 trường hợp)

import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, Link } from 'react-router-dom'; // <<< Thêm useParams, Link
// import { assets } from "../assets/assets"; // Bỏ import data giả lập nếu có
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Eye, Check, X, Mail } from 'lucide-react'; // Thêm icons

// Helper render status (có thể dùng lại)
const renderStatusBadge = (status) => {
    let colorClasses = 'bg-gray-100 text-gray-800'; // Màu mặc định cho trạng thái không xác định
    let displayText = 'N/A'; // Text mặc định

    // Dùng toLowerCase() để xử lý các trường hợp viết hoa/thường khác nhau nếu có
    // Dùng optional chaining (?.) để tránh lỗi nếu status là null hoặc undefined
    switch (status?.toLowerCase()) {
        case 'pending':
            colorClasses = 'bg-yellow-100 text-yellow-800';
            displayText = 'Chờ duyệt';
            break;
        case 'viewed':
            colorClasses = 'bg-blue-100 text-blue-800';
            displayText = 'Đã xem';
            break;
        case 'shortlisted':
            colorClasses = 'bg-purple-100 text-purple-800'; // Ví dụ màu tím cho shortlisted
            displayText = 'Phù hợp';
            break;
        case 'interviewing':
            colorClasses = 'bg-cyan-100 text-cyan-800'; // Ví dụ màu cyan cho interviewing
            displayText = 'Phỏng vấn';
            break;
        case 'hired':
        case 'accepted': // Có thể gộp chung Hired/Accepted
            colorClasses = 'bg-green-100 text-green-800';
            displayText = 'Đã tuyển';
            break;
        case 'rejected':
            colorClasses = 'bg-red-100 text-red-800';
            displayText = 'Từ chối';
            break;
        default:
            // Giữ nguyên màu xám nếu status không khớp hoặc là null/undefined
            // displayText có thể lấy giá trị status gốc nếu nó không null/undefined và không khớp case nào
            displayText = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'N/A';
            break;
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {displayText}
        </span>
    );
};

const ViewApplications = () => {
    const { jobId } = useParams(); // <<< Lấy jobId từ URL (sẽ là undefined nếu ở route xem tất cả)
    const { backendUrl, companyToken } = useContext(AppContext);
    const [applicants, setApplicants] = useState([]); // Đổi tên state rõ hơn
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState(''); // State lưu tên job khi xem chi tiết
    const [imageErrors, setImageErrors] = useState({});
    // --- HÀM FETCH DỮ LIỆU (Xử lý cả 2 trường hợp) ---
    const fetchData = useCallback(async () => {
        if (!companyToken) {
            console.log('No company token found');
            return;
        }
        setLoading(true);

        try {
            const apiUrl = jobId
                ? `${backendUrl}/api/companies/jobs/${jobId}/applicants`
                : `${backendUrl}/api/companies/applicants`;

            console.log('Fetching from URL:', apiUrl);

            const { data } = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', data);

            if (data.success) {
                // Đảm bảo dữ liệu người dùng được populate đầy đủ
                // const applications = data.applications.filter(app => app.userId && app._id);
                // setApplicants(applications);
                // if (jobId && data.jobTitle) {
                // setJobTitle(data.jobTitle);
                // }
                setApplicants(data.applications);
                // Hoặc nếu cần filter, làm rõ hơn điều kiện
                const applications = data.applications.filter(app => {
                    console.log('Checking application:', app);
                    return app && app._id;  // Chỉ check exists
                });
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error details:', error);
            setApplicants([]);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu ứng viên");
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]);
    const fetchData_7 = useCallback(async () => {
        if (!companyToken) {
            console.log('No company token found');
            return;
        }
        setLoading(true);

        try {
            // Debug log
            console.log('Fetching applications with:', {
                jobId,
                companyToken: companyToken ? 'exists' : 'missing',
                backendUrl
            });

            const apiUrl = jobId
                ? `${backendUrl}/api/companies/jobs/${jobId}/applicants`
                : `${backendUrl}/api/companies/applicants`;

            console.log('Fetching from URL:', apiUrl);

            const { data } = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', data);

            if (data.success) {
                setApplicants(data.applications);
                if (jobId && data.jobTitle) {
                    setJobTitle(data.jobTitle);
                }
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setApplicants([]);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu ứng viên");
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]);
    const fetchData_6 = useCallback(async () => {
        if (!companyToken) return;
        setLoading(true);

        try {
            // Change from /company/ to /companies/
            const apiUrl = jobId
                ? `${backendUrl}/api/companies/jobs/${jobId}/applicants`
                : `${backendUrl}/api/companies/applicants`;

            const { data } = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                setApplicants(data.applications);
                if (jobId) {
                    setJobTitle(data.jobTitle);
                }
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu");
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]);
    const fetchData_5 = useCallback(async () => {
        if (!companyToken) return;
        setLoading(true);

        try {
            // Chọn API endpoint dựa vào việc có jobId hay không
            const apiUrl = jobId
                ? `${backendUrl}/api/company/jobs/${jobId}/applicants`  // Lấy ứng viên của 1 job
                : `${backendUrl}/api/company/applicants`;               // Lấy tất cả ứng viên

            const { data } = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Applications data:', data);

            if (data.success) {
                setApplicants(data.applications);
                // Chỉ set jobTitle nếu đang xem một job cụ thể
                if (jobId) {
                    setJobTitle(data.jobTitle);
                }
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên.");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]);
    const fetchData_4 = useCallback(async () => {
        if (!companyToken || !jobId) return;
        setLoading(true);

        try {
            // Always use the jobId specific endpoint
            const { data } = await axios.get(
                `${backendUrl}/api/company/jobs/${jobId}/applicants`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Applications data:', data);

            if (data.success) {
                setApplicants(data.applications);
                setJobTitle(data.jobTitle); // Set job title from response
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên.");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]);
    const fetchData_3 = useCallback(async () => {
        if (!companyToken) {
            console.log('No company token found');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/company/applicants`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response data:', data); // Để debug

            if (data.success) {
                setApplicants(data.applications);
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên.");
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                // Có thể thêm logic để logout và redirect về trang login
            } else {
                toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
            }
        } finally {
            setLoading(false);
        }
    }, [companyToken, backendUrl]);
    const fetchData_2 = useCallback(async () => {
        if (!companyToken || !backendUrl) return;
        setLoading(true);

        try {
            const { data } = await axios.get(
                `${backendUrl}/api/company/applicants`,
                {
                    headers: {
                        Authorization: `Bearer ${companyToken}`
                    }
                }
            );

            if (data.success) {
                console.log('Applications data:', data.applications); // Debug log
                setApplicants(data.applications);
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên.");
                setApplicants([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }, [companyToken, backendUrl]);

    const fetchData_0 = useCallback(async () => {
        if (!companyToken || !backendUrl) return;
        setLoading(true);
        setApplicants([]); // Xóa dữ liệu cũ khi fetch mới
        setJobTitle(''); // Reset job title

        // Xác định URL API dựa trên việc có jobId hay không
        const apiUrl = jobId
            ? `${backendUrl}/api/company/jobs/${jobId}/applicants` // API mới lấy theo Job ID
            : `${backendUrl}/api/company/applicants`;             // API cũ lấy tất cả

        console.log(`Workspaceing data from: ${apiUrl}`); // Log để debug

        try {
            const { data } = await axios.get(apiUrl, {
                headers: { token: companyToken } // Sử dụng token header nếu API backend của bạn dùng nó
                // headers: { Authorization: `Bearer ${companyToken}` } // Hoặc dùng Bearer Token nếu bạn đổi backend
            });

            if (data.success) {
                setApplicants(data.applications?.reverse() || []); // Lưu danh sách ứng viên
                // Nếu xem theo job cụ thể, có thể cần lấy thêm title của job đó (nếu API không trả về)
                if (jobId && data.applications?.length > 0 && data.applications[0].jobId) {
                    // Giả sử API trả về jobId object trong application hoặc bạn cần gọi API khác lấy job title
                    setJobTitle(data.applications[0].jobId.title || `Job ID: ${jobId}`); // Lấy tạm title từ application đầu tiên
                }
            } else {
                toast.error(data.message || "Không thể tải dữ liệu ứng viên.");
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu ứng viên:", error);
            toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải dữ liệu.");
            setApplicants([]); // Đặt lại thành mảng rỗng khi lỗi
        } finally {
            setLoading(false);
        }
    }, [jobId, companyToken, backendUrl]); // Dependency array

    // --- HÀM CẬP NHẬT STATUS (Dùng API PATCH mới) ---
    const updateApplicationStatus = async (applicationId, newStatus) => {
        const currentApp = applicants.find(app => app._id === applicationId);
        if (!currentApp) return;
        const oldStatus = currentApp.status;

        // Optimistic Update
        setApplicants(prev => prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
        ));

        try {
            if (!companyToken) {
                toast.error("Vui lòng đăng nhập lại");
                throw new Error("Missing token");
            }

            // Updated endpoint from /api/company/ to /api/companies/
            const { data } = await axios.patch(
                `${backendUrl}/api/companies/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success("Cập nhật trạng thái thành công");
            } else {
                // Rollback if API returns error
                setApplicants(prev => prev.map(app =>
                    app._id === applicationId ? { ...app, status: oldStatus } : app
                ));
                toast.error(data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Rollback on error
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: oldStatus } : app
            ));
            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            } else {
                toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái");
            }
        }
    };
    const updateApplicationStatus_1 = async (applicationId, newStatus) => {
        const currentApp = applicants.find(app => app._id === applicationId);
        if (!currentApp) return;
        const oldStatus = currentApp.status;

        // Optimistic Update
        setApplicants(prev => prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
        ));

        try {
            if (!companyToken) {
                toast.error("Vui lòng đăng nhập lại");
                throw new Error("Missing token");
            }

            // Update API call with correct Bearer token
            const { data } = await axios.patch(
                `${backendUrl}/api/company/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success("Cập nhật trạng thái thành công");
            } else {
                // Rollback if API returns error
                setApplicants(prev => prev.map(app =>
                    app._id === applicationId ? { ...app, status: oldStatus } : app
                ));
                toast.error(data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Rollback on error
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: oldStatus } : app
            ));
            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            } else {
                toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái");
            }
        }
    };
    const updateApplicationStatus_0 = async (applicationId, newStatus) => {
        // Tìm application hiện tại trong state để lấy status cũ (cho rollback)
        const currentApp = applicants.find(app => app._id === applicationId);
        if (!currentApp) return;
        const oldStatus = currentApp.status;

        // Optimistic Update: Cập nhật UI trước
        setApplicants(prev => prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
        ));

        try {
            if (!companyToken || !backendUrl) { toast.error("Lỗi cấu hình hoặc xác thực."); throw new Error("Missing token/URL"); }

            // Gọi API PATCH mới
            const { data } = await axios.patch(`${backendUrl}/api/company/applications/${applicationId}/status`,
                { status: newStatus }, // Gửi status mới trong body
                { headers: { token: companyToken } } // Hoặc Authorization: Bearer
            );

            if (data.success) {
                toast.success(data.message || "Cập nhật trạng thái thành công.");
                // Không cần fetch lại vì đã Optimistic Update
            } else {
                // Rollback nếu API báo lỗi
                toast.error(data.message || "Cập nhật trạng thái thất bại.");
                setApplicants(prev => prev.map(app =>
                    app._id === applicationId ? { ...app, status: oldStatus } : app
                ));
            }
        } catch (error) {
            // Rollback nếu gọi API lỗi
            console.error("Lỗi cập nhật trạng thái:", error);
            toast.error(error.response?.data?.message || "Lỗi máy chủ khi cập nhật.");
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: oldStatus } : app
            ));
        }
    };

    // useEffect để gọi fetch khi component mount hoặc jobId/companyToken thay đổi
    // useEffect(() => {
    // fetchData();
    // }, [fetchData]); // fetchData đã có dependencies của nó
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                await fetchData();
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [fetchData]);

    // Xác định tiêu đề trang
    const pageTitle = jobId ? `Ứng viên cho công việc: ${jobTitle || '...'}` : "Tất cả Đơn ứng tuyển";

    // --- JSX RENDERING ---
    return (
        // Bạn có thể cần bao gồm Navbar/Footer ở đây nếu component này không nằm trong layout nào khác
        // <Navbar />
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">{pageTitle}</h2>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loading /></div>
            ) : applicants.length === 0 ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <p className="text-xl text-gray-500">
                        {jobId ? "Chưa có ứng viên nào cho công việc này." : "Không có đơn ứng tuyển nào."}
                    </p>
                </div>
            ) : (
                <div>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full bg-white border border-gray-200 max-sm:text-sm font-['Inter']">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ứng viên</th>
                                    {/* Chỉ hiển thị cột Job Title nếu đang xem tất cả */}
                                    {/* {!jobId && <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">Công việc</th>} */}
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Công việc</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Ngày nộp</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Resume</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {applicants.map((applicant, index) => (
                                    <tr key={applicant._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-10 w-10 rounded-full mr-3 object-cover"
                                                    src={
                                                        imageErrors[applicant._id]
                                                            ? '/default-avatar.jpg'
                                                            : applicant.userId?.image || applicant.userId?.avatar || '/default-avatar.jpg'
                                                    }
                                                    alt={applicant.userId?.name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        setImageErrors(prev => ({
                                                            ...prev,
                                                            [applicant._id]: true
                                                        }));
                                                        e.target.src = '/default-avatar.jpg';
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-medium">{applicant.userId?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{applicant.userId?.email || 'N/A'}</div>
                                                    {applicant.userId?.phone && (
                                                        <div className="text-sm text-gray-500">{applicant.userId.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {applicant.jobId?.title || 'N/A'}
                                            <div className="text-sm text-gray-500">{applicant.jobId?.location || 'N/A'}</div>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {/* {new Date(applicant.date).toLocaleDateString()} */}
                                            {applicant.date ? new Date(applicant.date).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        {/* {applicants.filter(item => item.userId).map((applicant, index) => ( // Bỏ filter jobId vì API đã lọc rồi nếu có jobId */}

                                        {/* // <tr key={applicant._id} className="text-gray-700 hover:bg-gray-50"> */}
                                        {/* <td className="py-2 px-4 border-b text-center">{index + 1}</td> */}
                                        {/* <td className="py-2 px-4 border-b"> */}
                                        {/* <div className="flex items-center"> */}
                                        {/* <img className="w-10 h-10 rounded-full mr-3 max-sm:hidden object-cover" src={applicant.userId?.image || '/avatar-placeholder.jpg'} alt={applicant.userId?.name || 'N/A'} /> */}
                                        {/* <span>{applicant.userId?.name || 'N/A'}</span> */}
                                        {/* Có thể thêm email nếu cần */}
                                        {/* </div> */}
                                        {/* </td> */}
                                        {/* Chỉ hiển thị cột Job Title nếu đang xem tất cả */}
                                        {/* {!jobId && <td className="py-2 px-4 border-b max-sm:hidden">{applicant.jobId?.title || 'N/A'}</td>} */}
                                        {/* <td className="py-2 px-4 border-b max-sm:hidden"> */}
                                        {/* {applicant.date ? new Date(applicant.date).toLocaleDateString('vi-VN') : 'N/A'} */}
                                        {/* </td> */}
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {applicant.userId?.resume ? (
                                                <a
                                                    href={applicant.userId.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded inline-flex gap-1 items-center text-xs font-medium">
                                                    Xem CV <Eye size={14} />
                                                </a>
                                            ) : (
                                                <span className='text-xs text-gray-400'>Chưa có</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {renderStatusBadge(applicant.status)}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 relative">
                                            <div className="flex items-center justify-start gap-3"> {/* Dùng gap-3 để có khoảng cách */}
                                                {/* Nút Xem chi tiết Profile */}
                                                <Link
                                                    to={`/dashboard/applicant-profile/${applicant.userId?._id}`} // <<< LINK ĐẾN TRANG PROFILE
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title={`Xem chi tiết ${applicant.userId?.name}`}
                                                >
                                                    <Eye size={18} />
                                                </Link>

                                                {/* Nút Gửi Email */}
                                                <a
                                                    href={`mailto:${applicant.userId?.email}`}
                                                    className="text-gray-500 hover:text-blue-600"
                                                    title={`Gửi email tới ${applicant.userId?.name}`}
                                                    onClick={(e) => { if (!applicant.userId?.email) e.preventDefault() }} // Ngăn click nếu không có email
                                                >
                                                    <Mail size={18} />
                                                </a>

                                                {/* Dropdown cập nhật status */}
                                                <select
                                                    value={applicant.status || 'pending'}
                                                    onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    title="Thay đổi trạng thái"
                                                >
                                                    {/* options */}
                                                    <option value="pending">Chờ duyệt</option>
                                                    <option value="viewed">Đã xem</option>
                                                    <option value="shortlisted">Phù hợp</option>
                                                    <option value="interviewing">Phỏng vấn</option>
                                                    <option value="hired">Đã tuyển</option>
                                                    <option value="rejected">Từ chối</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* TODO: Thêm Pagination nếu cần */}
                </div>
            )}
        </div>
        // <Footer />
    );
};

export default ViewApplications; // Sửa tên export nếu cần