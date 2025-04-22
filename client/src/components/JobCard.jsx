import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaBuilding } from "react-icons/fa";
import { MdLocationOn, MdWork, MdAttachMoney, MdBusinessCenter, MdTimer, MdCategory } from "react-icons/md";
import moment from 'moment';

const JobCard = ({ job, customClass = "", hideBookmarkButton = false }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        setIsFavorite(savedJobs.some(item => item._id === job._id));
    }, [job._id]);

    const toggleFavorite = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền
        let savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        if (isFavorite) {
            savedJobs = savedJobs.filter(item => item._id !== job._id);
        } else {
            savedJobs.push(job);
        }
        localStorage.setItem("favoriteJobs", JSON.stringify(savedJobs));
        setIsFavorite(!isFavorite);
    };

    const handleCardClick = () => {
        navigate(`/apply-job/${job._id}`);
        scrollTo(0, 0);
    };

    // Xác định màu nền dựa vào danh mục công việc
    const getCategoryColor = () => {
        const category = job.category?.toLowerCase() || "";
        if (category.includes("technology") || category.includes("it") || category.includes("information"))
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

    // Xác định màu border dựa vào loại công việc
    const getTypeBorderColor = () => {
        const type = job.type?.toLowerCase() || "";
        if (type.includes("full-time")) return "border-blue-400 text-blue-600 bg-blue-50";
        if (type.includes("part-time")) return "border-purple-400 text-purple-600 bg-purple-50";
        if (type.includes("contract")) return "border-orange-400 text-orange-600 bg-orange-50";
        if (type.includes("internship")) return "border-green-400 text-green-600 bg-green-50";
        if (type.includes("remote")) return "border-teal-400 text-teal-600 bg-teal-50";
        return "border-gray-400 text-gray-600 bg-gray-50";
    };

    // Format thời gian đăng tin
    const formatPostTime = () => {
        if (!job.createdAt) return "";
        return moment(job.createdAt).fromNow();
    };

    // Định dạng hiển thị kinh nghiệm - đã cải tiến để đồng bộ
    const formatExperience = () => {
        if (!job.experience) {
            if (job.level && job.level.toLowerCase().includes("beginner")) {
                return "Entry Level";
            }
            return "Không yêu cầu";
        }
        return job.experience;
    };

    return (
        <div
            className={`group border overflow-hidden bg-white hover:shadow-lg transition-all duration-300 ease-in-out rounded-lg h-full flex flex-col transform hover:-translate-y-1 ${customClass}`}
            onClick={handleCardClick}
        >
            {/* Header section with enhanced gradient and shadow */}
            <div className={`bg-gradient-to-r ${getCategoryColor()} px-6 pt-6 pb-4 relative shadow-md`}>
                {/* Company logo and name with improved styling */}
                <div className="flex items-center">
                    <div className="h-12 w-12 bg-white rounded-lg shadow-md p-2 flex items-center justify-center overflow-hidden">
                        {job.companyId?.image ? (
                            <img
                                className="h-auto w-auto max-h-10 max-w-10 object-contain"
                                src={job.companyId.image}
                                alt={`${job.companyId.name} logo`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '<div class="text-gray-400 text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>';
                                }}
                            />
                        ) : (
                            <FaBuilding className="text-gray-400 text-2xl" />
                        )}
                    </div>
                    <div className="ml-3 flex-1">
                        <span className="text-sm font-medium text-gray-800 line-clamp-1">
                            {job.companyId?.name || "Company"}
                        </span>
                        <div className="flex items-center text-xs text-gray-600 mt-0.5">
                            <MdTimer className="mr-1" />
                            <span>{formatPostTime()}</span>
                        </div>
                    </div>

                    {!hideBookmarkButton && (
                        <button
                            onClick={toggleFavorite}
                            className={`relative z-10 p-2 rounded-full group-hover:bg-white/80 transition-colors ${isFavorite ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'
                                }`}
                            title={isFavorite ? "Đã lưu" : "Lưu công việc"}
                            aria-label={isFavorite ? "Đã lưu" : "Lưu công việc"}
                        >
                            {isFavorite ? <FaBookmark className="text-xl" /> : <FaRegBookmark className="text-xl" />}
                        </button>
                    )}
                </div>

                {/* Job title styled prominently with enhanced shadow effect */}
                <h3 className="font-semibold text-xl mt-4 mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors drop-shadow-sm">
                    {job.title}
                </h3>

                {/* Job type badge with enhanced shadow */}
                <div className="absolute -bottom-3 left-6">
                    <span className={`px-3 py-1 text-xs font-medium border rounded-full shadow-md ${getTypeBorderColor()}`}>
                        {job.type || "Full-time"}
                    </span>
                </div>
            </div>

            {/* Body with job details */}
            <div className="px-6 pt-6 pb-5 flex-1 flex flex-col">
                {/* Job attributes grid */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center text-sm">
                        <div className="w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-blue-500">
                            <MdLocationOn className="text-lg" />
                        </div>
                        <span className="text-gray-700">
                            <span className="font-medium text-gray-900">Địa điểm:</span> {job.location}
                        </span>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-red-500">
                            <MdWork className="text-lg" />
                        </div>
                        <span className="text-gray-700">
                            <span className="font-medium text-gray-900">Kinh nghiệm:</span> {formatExperience()}
                        </span>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-green-500">
                            <MdCategory className="text-lg" />
                        </div>
                        <span className="text-gray-700">
                            <span className="font-medium text-gray-900">Danh mục:</span> {job.category}
                        </span>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-amber-500">
                            <MdAttachMoney className="text-lg" />
                        </div>
                        <span className="text-gray-700">
                            <span className="font-medium text-gray-900">Lương:</span> {job.salary}
                        </span>
                    </div>
                </div>

                {/* Job description */}
                <div className="flex-grow mt-1 mb-5">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: job.description?.slice(0, 180) + (job.description?.length > 180 ? "..." : "")
                        }}></p>
                </div>

                {/* Action buttons with improved spacing and shadow */}
                <div className="mt-auto pt-4 flex gap-2 text-sm border-t border-gray-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/apply-job/${job._id}`); scrollTo(0, 0); }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        Ứng tuyển ngay
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/apply-job/${job._id}`); scrollTo(0, 0); }}
                        className="flex-1 text-gray-700 border border-gray-300 rounded-md px-4 py-2.5 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;

// // Dùng để quản lý trạng thái của icon bookmark.
// import React, { useState, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { FaBookmark, FaRegBookmark } from "react-icons/fa";
// import { MdLocationOn, MdWork, MdAttachMoney, MdBusinessCenter } from "react-icons/md";

// const JobCard = ({ job, customClass = "", hideBookmarkButton = false }) => {
//     const navigate = useNavigate();
//     const [isFavorite, setIsFavorite] = useState(false);

//     useEffect(() => {
//         const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         setIsFavorite(savedJobs.some(item => item._id === job._id));
//     }, [job._id]);

//     const toggleFavorite = (e) => {
//         e.stopPropagation(); // Ngăn sự kiện click lan truyền
//         let savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         if (isFavorite) {
//             savedJobs = savedJobs.filter(item => item._id !== job._id);
//         } else {
//             savedJobs.push(job);
//         }
//         localStorage.setItem("favoriteJobs", JSON.stringify(savedJobs));
//         setIsFavorite(!isFavorite);
//     };

//     const handleCardClick = () => {
//         navigate(`/apply-job/${job._id}`);
//         scrollTo(0, 0);
//     };

//     return (
//         <div
//             className={`border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg h-full flex flex-col ${customClass}`}
//             onClick={handleCardClick}
//         >
//             <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                     <img
//                         className="h-10 w-auto object-contain bg-white p-1 rounded"
//                         src={job.companyId.image}
//                         alt={`${job.companyId.name} logo`}
//                     />
//                     <span className="ml-2 text-sm text-gray-600">{job.companyId.name}</span>
//                 </div>

//                 {!hideBookmarkButton && (
//                     <button
//                         onClick={toggleFavorite}
//                         className={`text-xl transition-colors ${isFavorite ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}
//                         title={isFavorite ? "Đã lưu" : "Lưu công việc"}
//                     >
//                         {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
//                     </button>
//                 )}
//             </div>

//             <h3 className="font-medium text-xl mt-3 mb-2 text-gray-800 line-clamp-2">{job.title}</h3>

//             <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
//                 <div className="flex items-center text-xs text-gray-600">
//                     <MdLocationOn className="mr-1 text-blue-500" />
//                     <span>{job.location}</span>
//                 </div>
//                 <div className="flex items-center text-xs text-gray-600">
//                     <MdWork className="mr-1 text-red-500" />
//                     <span>{job.experience}</span>
//                 </div>
//                 <div className="flex items-center text-xs text-gray-600">
//                     <MdBusinessCenter className="mr-1 text-green-500" />
//                     <span>{job.type}</span>
//                 </div>
//                 <div className="flex items-center text-xs text-gray-600">
//                     <MdAttachMoney className="mr-1 text-amber-500" />
//                     <span>{job.salary}</span>
//                 </div>
//             </div>

//             <div className="flex-grow mt-2 mb-4">
//                 <p className="text-gray-500 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) + (job.description.length > 150 ? "..." : "") }}></p>
//             </div>

//             <div className="mt-auto pt-4 flex gap-2 text-sm">
//                 <button
//                     onClick={(e) => { e.stopPropagation(); navigate(`/apply-job/${job._id}`); scrollTo(0, 0); }}
//                     className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//                 >
//                     Ứng tuyển ngay
//                 </button>
//                 <button
//                     onClick={(e) => { e.stopPropagation(); navigate(`/apply-job/${job._id}`); scrollTo(0, 0); }}
//                     className="flex-1 text-gray-700 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
//                 >
//                     Chi tiết
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default JobCard;
// // Dùng để quản lý trạng thái của icon bookmark.
// import React, { useState, useEffect } from "react";


// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";

// // test
// //import { FaHeart, FaRegHeart } from "react-icons/fa"; // Icon trái tim
// //import { useAuth } from "@clerk/clerk-react"; // Sử dụng Clerk để lấy user

// //Biểu tượng bookmark để lưu công việc yêu thích.
// import { FaBookmark, FaRegBookmark } from "react-icons/fa";


// // Cập nhật component để nhận thêm customClass prop
// // Cập nhật component để nhận thêm prop hideBookmarkButton
// const JobCard = ({ job, customClass = "", hideBookmarkButton = false }) => {
//     const navigate = useNavigate()

//     const [isFavorite, setIsFavorite] = useState(false);

//     useEffect(() => {
//         const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         setIsFavorite(savedJobs.some(item => item._id === job._id));
//     }, [job._id]);

//     const toggleFavorite = (e) => {
//         e.stopPropagation(); // Ngăn sự kiện click lan truyền

//         let savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         if (isFavorite) {
//             savedJobs = savedJobs.filter(item => item._id !== job._id);
//         } else {
//             savedJobs.push(job);
//         }
//         localStorage.setItem("favoriteJobs", JSON.stringify(savedJobs));
//         setIsFavorite(!isFavorite);
//     };

//     return (
//         <div className={`border p-6 shadow rounded h-full flex flex-col ${customClass}`}>
//             <div className="flex justify-between items-center">
//                 <img className="h-8" src={job.companyId.image} alt="" />

//                 {/* Chỉ hiển thị nút bookmark nếu không bị ẩn */}
//                 {!hideBookmarkButton && (
//                     <div>
//                         <button
//                             onClick={toggleFavorite}
//                             className="text-blue-500 hover:text-blue-700 text-xl transition-colors"
//                             title={isFavorite ? "Đã lưu" : "Lưu công việc"}
//                         >
//                             {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <h4 className="font-medium text-xl mt-2">{job.title}</h4>

//             <div className="flex items-center gap-3 mt-2 text-xs">
//                 <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded ">{job.location}</span>
//                 <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded ">{job.level}</span>
//             </div>

//             {/* Phần mô tả với chiều cao cố định */}
//             <div className="flex-grow mt-4">
//                 <p className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>
//             </div>

//             <div className="mt-4 flex gap-4 text-sm">
//                 <button
//                     onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//                 >
//                     Ứng tuyển ngay
//                 </button>
//                 <button
//                     onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
//                     className="text-gray-500 border border-gray-500 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
//                 >
//                     Xem chi tiết
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default JobCard

// // Component này nhận một đối tượng job, chứa thông tin về công việc (title, location, level, description,...).
// const JobCard = ({ job }) => {

//     const navigate = useNavigate()

//     // test
//     //isFavorite: true nếu công việc đã được lưu vào danh sách yêu thích, ngược lại là false.
//     const [isFavorite, setIsFavorite] = useState(false);

//     useEffect(() => {
//         const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         //setIsFavorite(savedJobs.includes(job._id));
//         // const found = savedJobs.some((savedJob) => savedJob._id === job._id);
//         // setIsFavorite(found);
//         setIsFavorite(savedJobs.some(item => item._id === job._id));
//     }, [job._id]);
//     const toggleFavorite = () => {
//         console.log("Clicked!");
//         let savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         if (isFavorite) {
//             //savedJobs = savedJobs.filter((id) => id !== job._id);
//             savedJobs = savedJobs.filter(item => item._id !== job._id);
//         } else {
//             //savedJobs.push(job._id);
//             savedJobs.push(job);
//         }
//         localStorage.setItem("favoriteJobs", JSON.stringify(savedJobs));
//         setIsFavorite(!isFavorite);
//         console.log("Saved Jobs After Update:", savedJobs);
//     };
//     //
//     return (
//         <div className="border p-6 shadow rounded">
//             <div className="flex jutify-between items-center">
//                 <img className="h-8" src={job.companyId.image} alt="" />
//                 {/* test */}
//                 <div className="ml-auto">
//                     <button onClick={toggleFavorite} className="text-red-500 text-xl">
//                         {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
//                     </button>
//                 </div>


//                 {/*  */}
//             </div>
//             <h4 className="font-medium text-xl mt-2">{job.title}</h4>
//             <div className="flex items-center gap-3 mt-2 text-xs">
//                 <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded ">{job.location}</span>
//                 <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded ">{job.level}</span>
//             </div>
//             <p className="text-gray-500 text-sm mt-4" dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>
//             <div className="mt-4 flex gap-4 text-sm">
//                 <button onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} className="bg-blue-600 text-white px-4 py-2 rounded">Apply now</button>
//                 <button onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} className="text-gray-500 border border-gray-500 rounded px-4 py-2">Learn more</button>

//             </div>
//         </div>
//     )
// }

// export default JobCard