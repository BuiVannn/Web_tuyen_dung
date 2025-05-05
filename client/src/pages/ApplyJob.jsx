import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import kconvert from 'k-convert';
import moment from 'moment';
import axios from "axios";
import { toast } from "react-toastify";
import { MdLocationOn, MdWork, MdAttachMoney, MdBusinessCenter, MdCategory, MdDateRange } from "react-icons/md";
import JobApplicationForm from "../components/JobApplicationForm";

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [JobData, setJobData] = useState(null);
    const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const { backendUrl, userToken, userData, userApplications, fetchUserApplications, jobs } = useContext(AppContext);

    // Function to determine header background gradient based on job category
    const getHeaderGradient = () => {
        if (!JobData?.category) return "from-blue-100 to-indigo-50";

        const category = JobData.category.toLowerCase();
        if (category.includes("technology") || category.includes("it"))
            return "from-blue-100 to-indigo-50";
        if (category.includes("marketing") || category.includes("sales"))
            return "from-orange-100 to-amber-50";
        if (category.includes("design") || category.includes("creative"))
            return "from-purple-100 to-fuchsia-50";
        if (category.includes("finance") || category.includes("accounting"))
            return "from-green-100 to-emerald-50";
        if (category.includes("health") || category.includes("medical"))
            return "from-red-100 to-rose-50";
        return "from-gray-100 to-slate-50";
    };

    const fetchJob = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                setJobData(data.job);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error(error.response?.data?.message || 'Error fetching job details');
        }
    };

    const applyHandler = async () => {
        try {
            if (!userData) {
                return toast.error('Vui lòng đăng nhập để ứng tuyển');
            }

            // Mở form ứng tuyển thay vì gọi API trực tiếp
            setShowApplicationForm(true);

        } catch (error) {
            console.error('Apply error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi ứng tuyển');
        }
    };

    const handleApplicationSuccess = async () => {
        // Đóng form và hiển thị thông báo thành công
        setShowApplicationForm(false);
        toast.success('Ứng tuyển thành công');
        await fetchUserApplications();
        checkAlreadyApplied();
    };

    const checkAlreadyApplied = () => {
        if (!JobData || !userApplications?.length) return;

        const hasApplied = userApplications.some(application =>
            application.jobId && application.jobId._id === JobData._id
        );

        setIsAlreadyApplied(hasApplied);
    };

    useEffect(() => {
        fetchJob();
    }, [id, backendUrl]);

    useEffect(() => {
        if (JobData && userApplications?.length) {
            checkAlreadyApplied();
        }
    }, [JobData, userApplications]);

    return JobData ? (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Nâng cấp phần Header */}
                    <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
                        <div className={`bg-gradient-to-r ${getHeaderGradient()} px-8 py-8 border-b relative`}>
                            {/* Job type badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-md ${JobData.type?.toLowerCase().includes("full-time")
                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                    : JobData.type?.toLowerCase().includes("part-time")
                                        ? "bg-purple-50 text-purple-600 border border-purple-200"
                                        : JobData.type?.toLowerCase().includes("contract")
                                            ? "bg-orange-50 text-orange-600 border border-orange-200"
                                            : JobData.type?.toLowerCase().includes("internship")
                                                ? "bg-green-50 text-green-600 border border-green-200"
                                                : "bg-gray-50 text-gray-600 border border-gray-200"
                                    }`}>
                                    {JobData.type || "Full-time"}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                                    <div className="bg-white p-4 rounded-lg shadow-md border flex items-center justify-center">
                                        <img
                                            src={JobData.companyId.image}
                                            alt={JobData.companyId.name}
                                            className="h-16 w-16 object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/80x80/e9ecef/495057?text=Logo';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">{JobData.title}</h1>
                                        <div className="flex items-center">
                                            <span className="text-blue-700 font-semibold text-lg">{JobData.companyId.name}</span>
                                            <span className="mx-2 text-gray-400">•</span>
                                            <span className="text-gray-600 text-sm">
                                                Đăng {moment(JobData.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <button
                                        onClick={applyHandler}
                                        disabled={isAlreadyApplied}
                                        className={`px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Job details */}
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdLocationOn className="text-blue-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Địa điểm</h3>
                                    </div>
                                    <p className="text-gray-600">{JobData.location}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdBusinessCenter className="text-green-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Loại công việc</h3>
                                    </div>
                                    <p className="text-gray-600">{JobData.type || "Toàn thời gian"}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdWork className="text-red-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Kinh nghiệm</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {JobData.experience ||
                                            (JobData.level && JobData.level.toLowerCase().includes("beginner") ? "Entry Level" : "Không yêu cầu")}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdAttachMoney className="text-amber-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Mức lương</h3>
                                    </div>
                                    <p className="text-gray-600">{JobData.salary ? JobData.salary : kconvert.convertTo(JobData.salary)}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdCategory className="text-purple-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Danh mục</h3>
                                    </div>
                                    <p className="text-gray-600">{JobData.category}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-1">
                                        <MdDateRange className="text-indigo-500 mr-2" size={20} />
                                        <h3 className="font-medium text-gray-700">Ngày đăng</h3>
                                    </div>
                                    <p className="text-gray-600">{moment(JobData.createdAt).format('DD/MM/YYYY')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Job description */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white shadow-sm rounded-xl p-8">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mô tả công việc</h2>
                                <div className="prose max-w-none">
                                    <div className="rich-text text-gray-700" dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
                                </div>

                                <button
                                    onClick={applyHandler}
                                    disabled={isAlreadyApplied}
                                    className={`mt-8 px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'
                                        }`}
                                >
                                    {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                </button>
                            </div>
                        </div>

                        {/* Related jobs */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white shadow-sm rounded-xl p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                    Công việc khác từ {JobData.companyId.name}
                                </h2>
                                <div className="space-y-4">
                                    {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                                        .filter(job => {
                                            const appliedJobsIds = new Set(userApplications?.map(app => app.jobId && app.jobId._id))
                                            return !appliedJobsIds.has(job._id)
                                        }).slice(0, 3)
                                        .map((job, index) => (
                                            <div key={job._id || index} className="border rounded-lg hover:shadow-sm transition-shadow">
                                                <JobCard
                                                    job={job}
                                                    customClass="h-full border-none shadow-none"
                                                />
                                            </div>
                                        ))}

                                    {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id).length === 0 && (
                                        <p className="text-gray-500 italic text-center py-4">
                                            Không có công việc khác từ công ty này
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Đơn Ứng Tuyển</h2>
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={JobData.companyId.image}
                                        alt={JobData.companyId.name}
                                        className="h-10 w-10 object-contain bg-white p-1 border rounded"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{JobData.title}</p>
                                        <p className="text-sm text-gray-600">{JobData.companyId.name}</p>
                                    </div>
                                </div>
                                <hr className="my-3" />
                            </div>
                            {/* Nhúng form ứng tuyển */}
                            <JobApplicationForm
                                jobId={JobData._id}
                                onSuccess={handleApplicationSuccess}
                                onCancel={() => setShowApplicationForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    ) : (
        <Loading />
    );
};

export default ApplyJob;
// // Chỉ cập nhật phần header để nổi bật hơn
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import Navbar from "../components/Navbar";
// import Loading from "../components/Loading";
// import JobCard from "../components/JobCard";
// import Footer from "../components/Footer";
// import kconvert from 'k-convert';
// import moment from 'moment';
// import axios from "axios";
// import { toast } from "react-toastify";
// import { MdLocationOn, MdWork, MdAttachMoney, MdBusinessCenter, MdCategory, MdDateRange } from "react-icons/md";

// const ApplyJob = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [JobData, setJobData] = useState(null);
//     const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
//     const { backendUrl, userToken, userData, userApplications, fetchUserApplications, jobs } = useContext(AppContext);

//     // Function to determine header background gradient based on job category
//     const getHeaderGradient = () => {
//         if (!JobData?.category) return "from-blue-100 to-indigo-50";

//         const category = JobData.category.toLowerCase();
//         if (category.includes("technology") || category.includes("it"))
//             return "from-blue-100 to-indigo-50";
//         if (category.includes("marketing") || category.includes("sales"))
//             return "from-orange-100 to-amber-50";
//         if (category.includes("design") || category.includes("creative"))
//             return "from-purple-100 to-fuchsia-50";
//         if (category.includes("finance") || category.includes("accounting"))
//             return "from-green-100 to-emerald-50";
//         if (category.includes("health") || category.includes("medical"))
//             return "from-red-100 to-rose-50";
//         return "from-gray-100 to-slate-50";
//     };

//     const fetchJob = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (data.success) {
//                 setJobData(data.job);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching job:", error);
//             toast.error(error.response?.data?.message || 'Error fetching job details');
//         }
//     };

//     const applyHandler = async () => {
//         try {
//             if (!userData) {
//                 return toast.error('Vui lòng đăng nhập để ứng tuyển');
//             }
//             if (!userData.resume) {
//                 navigate('/applications');
//                 return toast.error('Vui lòng tải lên resume trước khi ứng tuyển');
//             }

//             const { data } = await axios.post(
//                 `${backendUrl}/api/users/apply`,
//                 { jobId: JobData._id },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success('Ứng tuyển thành công');
//                 await fetchUserApplications();
//                 checkAlreadyApplied();
//             } else {
//                 toast.error(data.message || 'Ứng tuyển thất bại');
//             }
//         } catch (error) {
//             console.error('Apply error:', error);
//             toast.error(error.response?.data?.message || 'Lỗi khi ứng tuyển');
//         }
//     };

//     const checkAlreadyApplied = () => {
//         if (!JobData || !userApplications?.length) return;

//         const hasApplied = userApplications.some(application =>
//             application.jobId && application.jobId._id === JobData._id
//         );

//         setIsAlreadyApplied(hasApplied);
//     };

//     useEffect(() => {
//         fetchJob();
//     }, [id, backendUrl]);

//     useEffect(() => {
//         if (JobData && userApplications?.length) {
//             checkAlreadyApplied();
//         }
//     }, [JobData, userApplications]);

//     return JobData ? (
//         <>
//             <Navbar />
//             <div className="min-h-screen bg-gray-50 py-10">
//                 <div className="container px-4 mx-auto max-w-6xl">
//                     {/* Nâng cấp phần Header */}
//                     <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
//                         <div className={`bg-gradient-to-r ${getHeaderGradient()} px-8 py-8 border-b relative`}>
//                             {/* Job type badge */}
//                             <div className="absolute top-4 right-4">
//                                 <span className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-md ${JobData.type?.toLowerCase().includes("full-time")
//                                         ? "bg-blue-50 text-blue-600 border border-blue-200"
//                                         : JobData.type?.toLowerCase().includes("part-time")
//                                             ? "bg-purple-50 text-purple-600 border border-purple-200"
//                                             : JobData.type?.toLowerCase().includes("contract")
//                                                 ? "bg-orange-50 text-orange-600 border border-orange-200"
//                                                 : JobData.type?.toLowerCase().includes("internship")
//                                                     ? "bg-green-50 text-green-600 border border-green-200"
//                                                     : "bg-gray-50 text-gray-600 border border-gray-200"
//                                     }`}>
//                                     {JobData.type || "Full-time"}
//                                 </span>
//                             </div>

//                             <div className="flex flex-wrap items-center justify-between">
//                                 <div className="flex items-center space-x-5 mb-4 md:mb-0">
//                                     <div className="bg-white p-4 rounded-lg shadow-md border flex items-center justify-center">
//                                         <img
//                                             src={JobData.companyId.image}
//                                             alt={JobData.companyId.name}
//                                             className="h-16 w-16 object-contain"
//                                             onError={(e) => {
//                                                 e.target.onerror = null;
//                                                 e.target.src = 'https://placehold.co/80x80/e9ecef/495057?text=Logo';
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">{JobData.title}</h1>
//                                         <div className="flex items-center">
//                                             <span className="text-blue-700 font-semibold text-lg">{JobData.companyId.name}</span>
//                                             <span className="mx-2 text-gray-400">•</span>
//                                             <span className="text-gray-600 text-sm">
//                                                 Đăng {moment(JobData.createdAt).fromNow()}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <button
//                                         onClick={applyHandler}
//                                         disabled={isAlreadyApplied}
//                                         className={`px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
//                                                 ? 'bg-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'
//                                             }`}
//                                     >
//                                         {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Job details */}
//                         <div className="px-8 py-6">
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdLocationOn className="text-blue-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Địa điểm</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.location}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdBusinessCenter className="text-green-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Loại công việc</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.type || "Toàn thời gian"}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdWork className="text-red-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Kinh nghiệm</h3>
//                                     </div>
//                                     <p className="text-gray-600">
//                                         {JobData.experience ||
//                                             (JobData.level && JobData.level.toLowerCase().includes("beginner") ? "Entry Level" : "Không yêu cầu")}
//                                     </p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdAttachMoney className="text-amber-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Mức lương</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.salary ? JobData.salary : kconvert.convertTo(JobData.salary)}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdCategory className="text-purple-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Danh mục</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.category}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-1">
//                                         <MdDateRange className="text-indigo-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Ngày đăng</h3>
//                                     </div>
//                                     <p className="text-gray-600">{moment(JobData.createdAt).format('DD/MM/YYYY')}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex flex-col lg:flex-row gap-8">
//                         {/* Job description */}
//                         <div className="w-full lg:w-2/3">
//                             <div className="bg-white shadow-sm rounded-xl p-8">
//                                 <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mô tả công việc</h2>
//                                 <div className="prose max-w-none">
//                                     <div className="rich-text text-gray-700" dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
//                                 </div>

//                                 <button
//                                     onClick={applyHandler}
//                                     disabled={isAlreadyApplied}
//                                     className={`mt-8 px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
//                                             ? 'bg-gray-400 cursor-not-allowed'
//                                             : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'
//                                         }`}
//                                 >
//                                     {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Related jobs */}
//                         <div className="w-full lg:w-1/3">
//                             <div className="bg-white shadow-sm rounded-xl p-6 sticky top-24">
//                                 <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                     Công việc khác từ {JobData.companyId.name}
//                                 </h2>
//                                 <div className="space-y-4">
//                                     {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
//                                         .filter(job => {
//                                             const appliedJobsIds = new Set(userApplications?.map(app => app.jobId && app.jobId._id))
//                                             return !appliedJobsIds.has(job._id)
//                                         }).slice(0, 3)
//                                         .map((job, index) => (
//                                             <div key={job._id || index} className="border rounded-lg hover:shadow-sm transition-shadow">
//                                                 <JobCard
//                                                     job={job}
//                                                     customClass="h-full border-none shadow-none"
//                                                 />
//                                             </div>
//                                         ))}

//                                     {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id).length === 0 && (
//                                         <p className="text-gray-500 italic text-center py-4">
//                                             Không có công việc khác từ công ty này
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     ) : (
//         <Loading />
//     );
// };

// export default ApplyJob;





// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import Navbar from "../components/Navbar";
// import Loading from "../components/Loading";
// import JobCard from "../components/JobCard";
// import Footer from "../components/Footer";
// import kconvert from 'k-convert';
// import moment from 'moment';
// import axios from "axios";
// import { toast } from "react-toastify";
// import { MdLocationOn, MdWork, MdAttachMoney, MdBusinessCenter, MdCategory, MdDateRange } from "react-icons/md";

// const ApplyJob = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [JobData, setJobData] = useState(null);
//     const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
//     const { backendUrl, userToken, userData, userApplications, fetchUserApplications, jobs } = useContext(AppContext);

//     const fetchJob = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (data.success) {
//                 setJobData(data.job);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching job:", error);
//             toast.error(error.response?.data?.message || 'Error fetching job details');
//         }
//     };

//     const applyHandler = async () => {
//         try {
//             if (!userData) {
//                 return toast.error('Vui lòng đăng nhập để ứng tuyển');
//             }
//             if (!userData.resume) {
//                 navigate('/applications');
//                 return toast.error('Vui lòng tải lên resume trước khi ứng tuyển');
//             }

//             const { data } = await axios.post(
//                 `${backendUrl}/api/users/apply`,
//                 { jobId: JobData._id },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success('Ứng tuyển thành công');
//                 await fetchUserApplications();
//                 checkAlreadyApplied();
//             } else {
//                 toast.error(data.message || 'Ứng tuyển thất bại');
//             }
//         } catch (error) {
//             console.error('Apply error:', error);
//             toast.error(error.response?.data?.message || 'Lỗi khi ứng tuyển');
//         }
//     };

//     const checkAlreadyApplied = () => {
//         if (!JobData || !userApplications?.length) return;

//         const hasApplied = userApplications.some(application =>
//             application.jobId && application.jobId._id === JobData._id
//         );

//         setIsAlreadyApplied(hasApplied);
//     };

//     useEffect(() => {
//         fetchJob();
//     }, [id, backendUrl]);

//     useEffect(() => {
//         if (JobData && userApplications?.length) {
//             checkAlreadyApplied();
//         }
//     }, [JobData, userApplications]);

//     return JobData ? (
//         <>
//             <Navbar />
//             <div className="min-h-screen bg-gray-50 py-10">
//                 <div className="container px-4 mx-auto max-w-6xl">
//                     {/* Job header */}
//                     <div className="bg-white shadow-sm rounded-xl mb-8 overflow-hidden">
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-8 py-6">
//                             <div className="flex flex-wrap items-center justify-between">
//                                 <div className="flex items-center space-x-4 mb-4 md:mb-0">
//                                     <div className="bg-white p-3 rounded-lg shadow-sm border">
//                                         <img
//                                             src={JobData.companyId.image}
//                                             alt={JobData.companyId.name}
//                                             className="h-16 w-16 object-contain"
//                                         />
//                                     </div>
//                                     <div>
//                                         <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-1">{JobData.title}</h1>
//                                         <p className="text-blue-600 font-medium">{JobData.companyId.name}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <button
//                                         onClick={applyHandler}
//                                         disabled={isAlreadyApplied}
//                                         className={`px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
//                                                 ? 'bg-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-600 hover:bg-blue-700 transition-colors'
//                                             }`}
//                                     >
//                                         {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
//                                     </button>
//                                     <p className="text-gray-500 text-sm mt-2 text-center">
//                                         Đăng {moment(JobData.createdAt).fromNow()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Job details */}
//                         <div className="px-8 py-6">
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdLocationOn className="text-blue-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Địa điểm</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.location}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdBusinessCenter className="text-green-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Loại công việc</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.type || "Toàn thời gian"}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdWork className="text-red-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Kinh nghiệm</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.experience || JobData.level || "Mới đi làm"}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdAttachMoney className="text-amber-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Mức lương</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.salary ? JobData.salary : kconvert.convertTo(JobData.salary)}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdCategory className="text-purple-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Danh mục</h3>
//                                     </div>
//                                     <p className="text-gray-600">{JobData.category}</p>
//                                 </div>

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex items-center mb-1">
//                                         <MdDateRange className="text-indigo-500 mr-2" size={20} />
//                                         <h3 className="font-medium text-gray-700">Ngày đăng</h3>
//                                     </div>
//                                     <p className="text-gray-600">{moment(JobData.createdAt).format('DD/MM/YYYY')}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex flex-col lg:flex-row gap-8">
//                         {/* Job description */}
//                         <div className="w-full lg:w-2/3">
//                             <div className="bg-white shadow-sm rounded-xl p-8">
//                                 <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mô tả công việc</h2>
//                                 <div className="prose max-w-none">
//                                     <div className="rich-text text-gray-700" dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
//                                 </div>

//                                 <button
//                                     onClick={applyHandler}
//                                     disabled={isAlreadyApplied}
//                                     className={`mt-8 px-6 py-3 rounded-lg font-medium text-white ${isAlreadyApplied
//                                             ? 'bg-gray-400 cursor-not-allowed'
//                                             : 'bg-blue-600 hover:bg-blue-700 transition-colors'
//                                         }`}
//                                 >
//                                     {isAlreadyApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Related jobs */}
//                         <div className="w-full lg:w-1/3">
//                             <div className="bg-white shadow-sm rounded-xl p-6 sticky top-24">
//                                 <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                     Công việc khác từ {JobData.companyId.name}
//                                 </h2>
//                                 <div className="space-y-4">
//                                     {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
//                                         .filter(job => {
//                                             const appliedJobsIds = new Set(userApplications?.map(app => app.jobId && app.jobId._id))
//                                             return !appliedJobsIds.has(job._id)
//                                         }).slice(0, 3)
//                                         .map((job, index) => (
//                                             <div key={job._id || index} className="border rounded-lg hover:shadow-sm transition-shadow">
//                                                 <JobCard
//                                                     job={job}
//                                                     customClass="h-full border-none shadow-none"
//                                                 />
//                                             </div>
//                                         ))}

//                                     {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id).length === 0 && (
//                                         <p className="text-gray-500 italic text-center py-4">
//                                             Không có công việc khác từ công ty này
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     ) : (
//         <Loading />
//     );
// };

// export default ApplyJob;


// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import Navbar from "../components/Navbar";
// import Loading from "../components/Loading";
// import JobCard from "../components/JobCard";
// import Footer from "../components/Footer";
// import kconvert from 'k-convert';
// import moment from 'moment';
// import axios from "axios";
// import { toast } from "react-toastify";
// const ApplyJob = () => {

//     const { id } = useParams()
//     const navigate = useNavigate()
//     const [JobData, setJobData] = useState(null)
//     const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
//     const { backendUrl, userToken, userData, userApplications, fetchUserApplications, jobs } = useContext(AppContext)

//     const fetchJob = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log("Job data response:", data); // Debug log

//             if (data.success) {
//                 setJobData(data.job);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching job:", error);
//             toast.error(error.response?.data?.message || 'Error fetching job details');
//         }
//     };
//     const fetchJob_0 = async () => {

//         try {
//             const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
//             //console.log("test data: ", data);

//             if (data.success) {
//                 setJobData(data.job)
//             }
//             else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const applyHandler = async () => {
//         try {
//             if (!userData) {
//                 return toast.error('Vui lòng đăng nhập để ứng tuyển');
//             }
//             if (!userData.resume) {
//                 navigate('/applications');
//                 return toast.error('Vui lòng tải lên resume trước khi ứng tuyển');
//             }

//             const { data } = await axios.post(
//                 `${backendUrl}/api/users/apply`,
//                 { jobId: JobData._id },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success('Ứng tuyển thành công');
//                 await fetchUserApplications(); // Refresh applications list
//                 checkAlreadyApplied(); // Re-check application status
//             } else {
//                 toast.error(data.message || 'Ứng tuyển thất bại');
//             }
//         } catch (error) {
//             console.error('Apply error:', error);
//             toast.error(error.response?.data?.message || 'Lỗi khi ứng tuyển');
//         }
//     };
//     const applyHandler_0 = async () => {

//         try {
//             if (!userData) {
//                 return toast.error('Login to apply for jobs')
//             }
//             if (!userData.resume) {
//                 navigate('/applications')
//                 return toast.error('Upload resume to apply')
//             }
//             const { data } = await axios.post(
//                 `${backendUrl}/api/users/apply`,
//                 { jobId: JobData._id },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`
//                     }
//                 }
//             );
//             // const token = await getToken()
//             // console.log(JobData);
//             // const { data } = await axios.post(backendUrl + '/api/user/apply',
//             // { jobId: JobData._id },
//             // { headers: { Authorization: `Bearer ${token}` } }
//             // )

//             if (data.success) {
//                 toast.success(data.message)
//                 fetchUserApplications()
//             }
//             else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const checkAlreadyApplied = () => {
//         if (!JobData || !userApplications?.length) return;

//         const hasApplied = userApplications.some(application =>
//             application.jobId && application.jobId._id === JobData._id
//         );

//         setIsAlreadyApplied(hasApplied);
//     };

//     useEffect(() => {
//         fetchJob();
//     }, [id, backendUrl]);

//     useEffect(() => {
//         if (JobData && userApplications?.length) {
//             checkAlreadyApplied();
//         }
//     }, [JobData, userApplications]);
//     const checkAlreadyApplied_1 = () => {
//         if (!JobData || !userApplications) return;

//         // Debug logs
//         console.log('Checking applications:', {
//             userApplications,
//             currentJobId: JobData._id
//         });

//         // Sửa lại logic kiểm tra
//         const hasApplied = userApplications.some(application => {
//             // Debug log cho từng application
//             console.log('Checking application:', {
//                 applicationJobId: application.jobId?._id,
//                 currentJobId: JobData._id,
//                 matches: application.jobId?._id === JobData._id
//             });

//             return application.jobId?._id === JobData._id;
//         });

//         console.log('Has applied:', hasApplied);
//         setIsAlreadyApplied(hasApplied);
//     };
//     const checkAlreadyApplied_0 = () => {
//         const hasApplied = userApplications.some(item => item.jobId._id === JobData._id)
//         setIsAlreadyApplied(hasApplied)

//     }
//     useEffect(() => {
//         fetchJob()

//     }, [id])

//     useEffect(() => {
//         if (userApplications.length > 0 && JobData) {
//             checkAlreadyApplied()
//         }
//     }, [JobData, userApplications, id])



//     return JobData ? (
//         <>
//             <Navbar />
//             <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto ">
//                 <div className="bg-white text-black rounded-lg w-full">
//                     <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
//                         <div className="flex flex-col md:flex-row items-center">
//                             <img className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border" src={JobData.companyId.image} alt="" />
//                             <div className="text-center md:text-left text-neutral-700 ">
//                                 <h1 className="text-2xl sm:text-4xl font-medium ">{JobData.title}</h1>
//                                 <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
//                                     <span className="flex items-center gap-1">
//                                         <img src={assets.suitcase_icon} alt="" />
//                                         {JobData.companyId.name}
//                                     </span>
//                                     <span className="flex items-center gap-1">
//                                         <img src={assets.location_icon} alt="" />
//                                         {JobData.location}
//                                     </span>
//                                     <span className="flex items-center gap-1">
//                                         <img src={assets.person_icon} alt="" />
//                                         {JobData.level}
//                                     </span>
//                                     <span className="flex items-center gap-1">
//                                         <img src={assets.money_icon} alt="" />
//                                         CTC: {kconvert.convertTo(JobData.salary)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center ">
//                             {/* <button onClick={applyHandler} className="bg-blue-600 p-2.5 px-10 text-white rounded "> */}
//                             {/* {isAlreadyApplied ? 'Already Applied' : 'Apply Now'} */}
//                             {/* </button> */}
//                             <button
//                                 onClick={applyHandler}
//                                 disabled={isAlreadyApplied}
//                                 className={`p-2.5 px-10 text-white rounded ${isAlreadyApplied
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700'
//                                     }`}
//                             >
//                                 {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
//                             </button>
//                             <p className="mt-1 text-gray-600">Posted {moment(JobData.date).fromNow()}</p>
//                         </div>
//                     </div>

//                     <div className="flex flex-col lg:flex-row justify-between items-start ">
//                         <div className="w-full lg:w-2/3">
//                             <h2 className="font-bold text-2xl mb-4">Job Description</h2>
//                             <div className="rich-text" dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
//                             {/* <button onClick={applyHandler} className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10">{isAlreadyApplied ? 'Already Applied' : 'Apply Now'}</button> */}
//                             <button
//                                 onClick={applyHandler}
//                                 disabled={isAlreadyApplied}
//                                 className={`p-2.5 px-10 text-white rounded mt-10 ${isAlreadyApplied
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700'
//                                     }`}
//                             >
//                                 {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
//                             </button>

//                         </div>
//                         {/* right section more job */}
//                         <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 spcae-y-5 ">
//                             <h2>More jobs from {JobData.companyId.name}</h2>
//                             {jobs?.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
//                                 .filter(job => {
//                                     // set of applied jobids
//                                     const appliedJobsIds = new Set(userApplications?.map(app => app.jobId && app.jobId._id))
//                                     // return true if the user has not applied for this job
//                                     return !appliedJobsIds.has(job._id)
//                                 }).slice(0, 4)
//                                 .map((job, index) => <JobCard key={job._id || index} job={job} />)}
//                         </div>
//                     </div>

//                 </div>
//             </div>
//             <Footer />
//         </>
//     ) : (
//         <Loading />
//     )
// }

// export default ApplyJob