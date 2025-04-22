// src/pages/ManageJobs.jsx

import React, { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom'; // <<< Thêm Link
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Eye, EyeOff } from 'lucide-react'; // <<< Thêm icons nếu muốn cho nút visibility

const ManageJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState(null); // Khởi tạo là null thay vì false để phân biệt chưa fetch và fetch về mảng rỗng
    const [loading, setLoading] = useState(true); // Thêm state loading

    const { backendUrl, companyToken } = useContext(AppContext);

    // Hàm fetch danh sách jobs của công ty
    const fetchCompanyJobs = async (retryCount = 0) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/companies/list-jobs`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                },
                timeout: 15000 // Set axios timeout to 15s
            });

            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message || "Không thể tải danh sách công việc");
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);

            // Retry logic for timeout errors
            if (error.code === 'ECONNABORTED' && retryCount < 3) {
                console.log(`Retrying... Attempt ${retryCount + 1}`);
                return fetchCompanyJobs(retryCount + 1);
            }

            toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
            setJobs([]);

            if (error.response?.status === 401) {
                localStorage.removeItem('companyToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    const fetchCompanyJobs_1 = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/companies/list-jobs`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message || "Không thể tải danh sách công việc");
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
            setJobs([]);
            if (error.response?.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('companyToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    const fetchCompanyJobs_0 = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
                headers: {
                    Authorization: `Bearer ${companyToken}` // Change from token to Bearer token
                }
            });

            if (data.success) {
                // Log the response to check the structure
                console.log('Jobs data:', data);

                // Make sure we handle the correct data structure
                const jobsList = data.jobs || data.jobsData || [];
                setJobs(jobsList.reverse());
            } else {
                toast.error(data.message || "Không thể tải danh sách công việc.");
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải công việc.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };
    // const fetchCompanyJobs = async () => {
    // setLoading(true); // Bắt đầu loading
    // try {
    // const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
    // headers: { token: companyToken } // Hoặc Authorization: Bearer
    // });
    // if (data.success) {
    //Đảm bảo data.jobsData là mảng trước khi reverse
    // setJobs(Array.isArray(data.jobsData) ? data.jobsData.reverse() : []);
    // console.log(data.jobsData);
    // } else {
    // toast.error(data.message || "Không thể tải danh sách công việc.");
    // setJobs([]); // Đặt thành mảng rỗng nếu lỗi
    // }
    // } catch (error) {
    // toast.error(error.message || "Lỗi khi tải công việc.");
    // setJobs([]); // Đặt thành mảng rỗng nếu lỗi
    // } finally {
    // setLoading(false); // Kết thúc loading
    // }
    // };

    // --- HÀM MỚI: Bật/Tắt hiển thị job (dùng API PATCH) ---

    const toggleJobVisibility = async (jobId, currentVisibility) => {
        try {
            // Optimistic update
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: !currentVisibility } : job
            ));

            const { data } = await axios.patch(
                `${backendUrl}/api/company/jobs/${jobId}/visibility`,
                {},  // Body trống vì server sẽ tự toggle
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
            } else {
                // Rollback if failed
                setJobs(prevJobs => prevJobs.map(job =>
                    job._id === jobId ? { ...job, visible: currentVisibility } : job
                ));
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
            // Rollback on error
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: currentVisibility } : job
            ));
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái hiển thị");
        }
    };
    const toggleJobVisibility_1 = async (jobId, currentVisibility) => {
        try {
            // Optimistic update
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: !currentVisibility } : job
            ));

            const { data } = await axios.patch(
                `${backendUrl}/api/company/jobs/${jobId}/visibility`,
                { visible: !currentVisibility },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success("Cập nhật trạng thái hiển thị thành công");
            } else {
                // Rollback if failed
                setJobs(prevJobs => prevJobs.map(job =>
                    job._id === jobId ? { ...job, visible: currentVisibility } : job
                ));
                toast.error(data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
            // Rollback on error
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: currentVisibility } : job
            ));
            toast.error("Lỗi khi cập nhật trạng thái hiển thị");
        }
    };
    const toggleJobVisibility_0 = async (jobId, currentVisibility) => {
        // Optimistic Update
        setJobs(prevJobs => prevJobs.map(job =>
            job._id === jobId ? { ...job, isVisible: !currentVisibility } : job
        ));

        try {
            const { data } = await axios.patch(`${backendUrl}/api/company/jobs/${jobId}/visibility`,
                {}, // Không cần gửi body nếu backend chỉ toggle
                { headers: { token: companyToken } } // Hoặc Authorization: Bearer
            );

            if (data.success) {
                toast.success(data.message);
                // Không cần fetch lại vì đã Optimistic Update
            } else {
                toast.error(data.message || "Cập nhật hiển thị thất bại.");
                // Rollback
                setJobs(prevJobs => prevJobs.map(job =>
                    job._id === jobId ? { ...job, isVisible: currentVisibility } : job
                ));
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi cập nhật hiển thị.");
            // Rollback
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, isVisible: currentVisibility } : job
            ));
        }
    };


    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs();
        } else {
            setJobs([]); // Nếu không có token, không có jobs
            setLoading(false);
        }
    }, [companyToken]); // Bỏ fetchCompanyJobs khỏi dependency array nếu nó không thay đổi

    // Hiển thị Loading
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loading /></div>;
    }

    // Hiển thị nếu không có jobs hoặc fetch lỗi
    if (!jobs || jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <p className="text-xl sm:text-2xl mb-4">Chưa có công việc nào được đăng.</p>
                <button
                    onClick={() => navigate('/dashboard/add-job')}
                    className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
                >
                    Đăng công việc mới
                </button>
            </div>
        );
    }

    // Hiển thị bảng jobs
    return (
        <div className="container p-4 max-w-5xl mx-auto"> {/* Thêm mx-auto */}
            <h2 className="text-2xl font-semibold mb-4">Quản lý Công việc đã đăng</h2>
            <div className="overflow-x-auto ">
                <table className="min-w-full bg-white border border-gray-200 border-collapse max-sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
                            <th className="py-2 px-4 border-b text-left ">Tiêu đề Công việc</th>
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">Ngày đăng</th>
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">Địa điểm</th>
                            <th className="py-2 px-4 border-b text-center ">Ứng viên</th>
                            <th className="py-2 px-4 border-b text-center">Trạng thái</th>
                            <th className="py-2 px-4 border-b text-center ">Hiển thị</th>
                            {/* <<< THÊM CỘT HÀNH ĐỘNG >>> */}
                            <th className="py-2 px-4 border-b text-center ">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, index) => (
                            <tr key={job._id} className="text-gray-700 hover:bg-gray-50">
                                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                                <td className="py-2 px-4 border-b font-medium">{job.title}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date || job.createdAt).format('DD/MM/YYYY')}</td> {/* Ưu tiên date nếu có, fallback về createdAt */}
                                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <span className="inline-flex items-center gap-1">
                                        <span className="font-medium">{job.applicationsCount || 0}</span>
                                        {job.applicationStats && (
                                            <span className="text-xs text-gray-500">
                                                ({job.applicationStats.pending || 0} mới)
                                            </span>
                                        )}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                                            job.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {job.status === 'active' ? 'Active' :
                                            job.status === 'inactive' ? 'Inactive' :
                                                'Pending'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {/* Sử dụng hàm toggleJobVisibility mới */}
                                    <button
                                        onClick={() => toggleJobVisibility(job._id, job.visible)}
                                        title={job.visible ? "Nhấn để ẩn" : "Nhấn để hiện"}
                                        className={`p-1 rounded ${job.visible && job.status === 'active' ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                                        disabled={job.status !== 'active'} // Disable nếu không phải active
                                    >
                                        {job.visible && job.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    {/* Hoặc dùng checkbox nếu muốn
                                    <input
                                        onChange={() => toggleJobVisibility(job._id, job.isVisible)}
                                        className="scale-125" type="checkbox"
                                        checked={job.isVisible === undefined ? true : job.isVisible} // Mặc định checked nếu isVisible không tồn tại
                                    />
                                     */}
                                </td>
                                {/* <<< THÊM Ô TD CHO HÀNH ĐỘNG >>> */}
                                <td className="py-2 px-4 border-b text-center">
                                    <Link
                                        to={`/dashboard/manage-jobs/${job._id}/applicants`} // <<< LINK ĐẾN TRANG XEM ỨNG VIÊN
                                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm px-2 py-1"
                                        title={`Xem ${job.applicants} ứng viên`}
                                    >
                                        Xem CV ({job.applicants || 0})
                                    </Link>
                                    {/* Thêm nút sửa job nếu cần */}
                                    {/* <Link to={`/dashboard/edit-job/${job._id}`}>Sửa</Link> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Nút Add new job */}
            <div className="mt-6 flex justify-end gap-2">
                <button
                    onClick={() => navigate('/dashboard/add-job')}
                    className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
                >
                    Đăng công việc mới
                </button>
            </div>

        </div>
    );
};

export default ManageJobs;