import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaBookmark } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        const jobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        setSavedJobs(jobs);
    }, []);

    const removeJob = (jobId) => {
        const updatedJobs = savedJobs.filter(job => job._id !== jobId);
        setSavedJobs(updatedJobs);
        localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-2 flex items-center text-gray-800">
                            <FaBookmark className="mr-3 text-blue-600" />
                            Công việc đã lưu
                        </h2>
                        <p className="text-gray-500">Quản lý danh sách công việc bạn đã lưu để xem sau</p>
                    </div>

                    {savedJobs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <MdWork size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Bạn chưa lưu công việc nào</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Khi bạn thấy công việc phù hợp, hãy nhấn vào biểu tượng bookmark để lưu và xem lại sau.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Tìm việc làm ngay
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedJobs.map((job) => (
                                    <div key={job._id} className="relative group">
                                        <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeJob(job._id);
                                                }}
                                                className="bg-red-100 text-red-600 p-2 rounded-full shadow-md hover:bg-red-200 transition-all"
                                                title="Xóa khỏi danh sách đã lưu"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                        <JobCard
                                            job={job}
                                            customClass="h-full transform transition-transform hover:-translate-y-1 hover:shadow-md"
                                            hideBookmarkButton={true}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 flex justify-between bg-white shadow-sm rounded-lg p-6">
                                <button
                                    onClick={() => navigate("/")}
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg transition-colors font-medium"
                                >
                                    Quay lại trang chủ
                                </button>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem("favoriteJobs");
                                        setSavedJobs([]);
                                    }}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-lg transition-colors font-medium"
                                >
                                    Xóa tất cả
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SavedJobs;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaTrash, FaBookmark } from "react-icons/fa";
// import JobCard from "../components/JobCard";
// import Navbar from "../components/Navbar";
// import { Briefcase } from "lucide-react";

// const SavedJobs = () => {
//     const navigate = useNavigate();
//     const [savedJobs, setSavedJobs] = useState([]);

//     useEffect(() => {
//         const jobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         setSavedJobs(jobs);
//     }, []);

//     const removeJob = (jobId) => {
//         const updatedJobs = savedJobs.filter(job => job._id !== jobId);
//         setSavedJobs(updatedJobs);
//         localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="container mx-auto p-6">
//                 <h2 className="text-2xl font-bold mb-6 flex items-center">
//                     <FaBookmark className="mr-2 text-blue-600" />
//                     Công việc đã lưu
//                 </h2>

//                 {savedJobs.length === 0 ? (
//                     <div className="text-center py-12 bg-gray-50 rounded-lg">
//                         <Briefcase size={48} className="mx-auto text-gray-400 mb-3" />
//                         <p className="text-lg text-gray-600 mb-2">Bạn chưa lưu công việc nào</p>
//                         <p className="text-gray-500 mb-4">Lưu các công việc yêu thích để xem lại sau</p>
//                         <button
//                             onClick={() => navigate("/jobs")}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                             Tìm việc làm
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {savedJobs.map((job) => (
//                                 <div key={job._id} className="relative h-full flex">
//                                     {/* Container để đảm bảo chiều cao đồng đều */}
//                                     <div className="flex-1 flex flex-col border border-gray-200 shadow rounded overflow-hidden h-full">
//                                         {/* Bọc JobCard trong một div có chiều cao cố định */}
//                                         <div className="relative flex-1">
//                                             {/* Nút xóa đặt ở góc trên bên phải */}
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     removeJob(job._id);
//                                                 }}
//                                                 className="absolute top-4 right-4 bg-red-100 text-red-600 p-1.5 z-10 rounded-full shadow-sm hover:bg-red-200 transition-all"
//                                                 title="Xóa khỏi danh sách đã lưu"
//                                             >
//                                                 <FaTrash className="text-sm" />
//                                             </button>

//                                             {/* Override styles của JobCard để đảm bảo đồng nhất */}
//                                             <div className="h-full">
//                                                 <JobCard
//                                                     job={job}
//                                                     customClass="h-full border-none shadow-none rounded-none"
//                                                     hideBookmarkButton={true} // Thêm prop này
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="mt-8 flex justify-between">
//                             <button
//                                 onClick={() => navigate("/")}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//                             >
//                                 Quay lại trang chủ
//                             </button>

//                             <button
//                                 onClick={() => navigate("/jobs")}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//                             >
//                                 Tìm thêm việc làm
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </>
//     );
// };

// export default SavedJobs;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaTrash } from "react-icons/fa"; // Icon xoá
// import JobCard from "../components/JobCard"; // Dùng lại component JobCard
// import Navbar from "../components/Navbar";

// const SavedJobs = () => {
//     const navigate = useNavigate();
//     const [savedJobs, setSavedJobs] = useState([]);

//     useEffect(() => {
//         const jobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
//         setSavedJobs(jobs);
//         console.log(jobs);
//     }, []);

//     // const removeJob = (jobId) => {
//     // const updatedJobs = savedJobs.filter((id) => id !== jobId);
//     // localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
//     // setSavedJobs(updatedJobs);
//     // };
//     const removeJob = (jobId) => {
//         const updatedJobs = savedJobs.filter(job => job._id !== jobId);
//         setSavedJobs(updatedJobs);
//         localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
//         console.log("🗑 Removed Job:", jobId);
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="container mx-auto p-6">
//                 <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
//                 {savedJobs.length === 0 ? (
//                     <p>No saved jobs yet</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {savedJobs.map((job) => (
//                             <div key={job._id} className="relative">
//                                 <JobCard job={job} />
//                                 {/* Nút xóa đặt ở góc trên bên phải */}
//                                 <button
//                                     onClick={() => removeJob(job._id)}
//                                     className="absolute top-5 right-5 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-all"
//                                 >
//                                     <FaTrash className="text-lg" />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>


//                 )}
//                 <button onClick={() => navigate("/")} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//                     Back Home
//                 </button>
//             </div>
//         </>
//     );
// };

// export default SavedJobs;
