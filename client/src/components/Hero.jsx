import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MdSearch, MdFilterAlt, MdLocationOn, MdWorkOutline, MdTune } from "react-icons/md";

const Hero = ({ onToggleAdvanced }) => {
    const { setSearchFilter, setIsSearched } = useContext(AppContext);
    const { companyToken } = useContext(AppContext);
    const titleRef = useRef(null);
    const locationRef = useRef(null);

    const onSearch = () => {
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        });
        setIsSearched(true);

        // Cuộn xuống phần danh sách công việc
        document.getElementById('job-list')?.scrollIntoView({ behavior: 'smooth' });
    };
    if (companyToken) return null;
    return (
        <div className="relative overflow-hidden">
            {/* Background & Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 opacity-95"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff33_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>

            <div className="container 2xl:px-20 mx-auto relative z-10">
                <div className="text-white py-20 px-4 md:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in">
                        Khám phá cơ hội nghề nghiệp lý tưởng
                    </h1>

                    <p className="mb-10 max-w-2xl mx-auto text-lg opacity-95 leading-relaxed animate-fade-in-delayed">
                        Kết nối với hơn 10,000+ vị trí công việc từ những công ty hàng đầu.
                        Bắt đầu hành trình sự nghiệp mới ngay hôm nay!
                    </p>

                    {/* Enhanced Search Box with Improved Design */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden transition-all animate-fade-up border border-gray-200">
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-gray-200 relative group">
                                <MdWorkOutline className="text-indigo-500 text-xl mr-3 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    ref={titleRef}
                                    placeholder="Chức danh, kỹ năng hoặc công ty"
                                    className="w-full py-2 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>

                            <div className="flex-1 flex items-center px-5 py-4 relative group">
                                <MdLocationOn className="text-indigo-500 text-xl mr-3 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    ref={locationRef}
                                    placeholder="Địa điểm"
                                    className="w-full py-2 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>

                            <button
                                onClick={onSearch}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-8 py-4 transition-all m-0 flex items-center justify-center shadow-md"
                            >
                                <MdSearch className="mr-2" size={22} />
                                <span>Tìm kiếm</span>
                            </button>
                        </div>

                        {/* Enhanced Filter Option */}
                        <div className="px-5 pb-4 pt-2 text-right border-t border-gray-100">
                            <button
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm ml-auto transition-all group"
                                onClick={() => onToggleAdvanced(prev => !prev)}
                            >
                                <MdTune className="group-hover:rotate-180 transition-transform duration-300" size={18} />
                                <span className="group-hover:underline">Tùy chọn tìm kiếm nâng cao</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
// import React, { useContext, useState, useRef } from "react";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/AppContext";
// import { MdSearch, MdFilterList, MdLocationOn, MdWorkOutline } from "react-icons/md";
// // Xóa import framer-motion không cần thiết

// const Hero = () => {
//     const { setSearchFilter, setIsSearched } = useContext(AppContext);
//     const [showAdvanced, setShowAdvanced] = useState(false);

//     const titleRef = useRef(null);
//     const locationRef = useRef(null);

//     const onSearch = () => {
//         setSearchFilter({
//             title: titleRef.current.value,
//             location: locationRef.current.value
//         });
//         setIsSearched(true);

//         // Cuộn xuống phần danh sách công việc
//         document.getElementById('job-list')?.scrollIntoView({ behavior: 'smooth' });
//     };

//     return (
//         <div className="relative overflow-hidden">
//             {/* Background & Gradient Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-90"></div>

//             {/* Sử dụng background pattern tĩnh thay vì animation */}
//             <div className="absolute inset-0 bg-[url('path/to/pattern.png')] opacity-5"></div>

//             <div className="container 2xl:px-20 mx-auto relative z-10">
//                 <div className="text-white py-20 px-4 md:px-8 text-center">
//                     {/* Thay thế motion.h1 bằng h1 thông thường */}
//                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in">
//                         Tìm công việc mơ ước của bạn
//                     </h1>

//                     {/* Thay thế motion.p bằng p thông thường */}
//                     <p className="mb-8 max-w-2xl mx-auto text-lg opacity-90 leading-relaxed animate-fade-in-delayed">
//                         Khám phá hơn 10,000+ cơ hội việc làm từ những công ty hàng đầu. Bước tiếp theo trong sự nghiệp của bạn bắt đầu tại đây!
//                     </p>

//                     {/* Thay thế motion.div bằng div thông thường */}
//                     <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto overflow-hidden transition-all animate-fade-up">
//                         <div className="flex flex-col md:flex-row">
//                             <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
//                                 <MdWorkOutline className="text-gray-400 text-xl mr-3" />
//                                 <input
//                                     type="text"
//                                     ref={titleRef}
//                                     placeholder="Chức danh, kỹ năng hoặc công ty"
//                                     className="w-full py-2 focus:outline-none text-gray-700 placeholder-gray-400"
//                                 />
//                             </div>

//                             <div className="flex-1 flex items-center px-4 py-3">
//                                 <MdLocationOn className="text-gray-400 text-xl mr-3" />
//                                 <input
//                                     type="text"
//                                     ref={locationRef}
//                                     placeholder="Địa điểm"
//                                     className="w-full py-2 focus:outline-none text-gray-700 placeholder-gray-400"
//                                 />
//                             </div>

//                             <button
//                                 onClick={onSearch}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 transition-colors m-0 flex items-center justify-center"
//                             >
//                                 <MdSearch className="mr-2" size={22} />
//                                 <span>Tìm kiếm</span>
//                             </button>
//                         </div>

//                         <div className="px-4 pb-3 pt-1 text-right">
//                             <button
//                                 className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center ml-auto"
//                                 onClick={() => setShowAdvanced(!showAdvanced)}
//                             >
//                                 <MdFilterList className="mr-1" />
//                                 {showAdvanced ? "Ẩn bộ lọc nâng cao" : "Hiện bộ lọc nâng cao"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Trusted By Section */}
//             <div className="bg-white py-6 shadow-md">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-col md:flex-row items-center justify-between">
//                         <p className="font-medium text-gray-700 mb-4 md:mb-0">Được tin dùng bởi:</p>
//                         <div className="flex flex-wrap gap-8 justify-center items-center">
//                             <img className="h-6 opacity-70 hover:opacity-100 transition-opacity" src={assets.microsoft_logo} alt="Microsoft" />
//                             <img className="h-6 opacity-70 hover:opacity-100 transition-opacity" src={assets.amazon_logo} alt="Amazon" />
//                             <img className="h-6 opacity-70 hover:opacity-100 transition-opacity" src={assets.samsung_logo} alt="Samsung" />
//                             <img className="h-6 opacity-70 hover:opacity-100 transition-opacity" src={assets.accenture_logo} alt="Accenture" />
//                             <img className="h-6 opacity-70 hover:opacity-100 transition-opacity" src={assets.adobe_logo} alt="Adobe" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Hero;



// import React, { useContext, useRef } from "react";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/AppContext";


// const Hero = () => {

//     const { setSearchFilter, setIsSearched } = useContext(AppContext)

//     const titleRef = useRef(null)
//     const locationRef = useRef(null)

//     const onSearch = () => {
//         setSearchFilter({
//             title: titleRef.current.value,
//             location: locationRef.current.value
//         })
//         setIsSearched(true)
//         // console.log({
//         // title: titleRef.current.value,
//         // location: locationRef.current.value
//         // })
//     }

//     return (
//         <div className="container 2xl:px-20 mx-auto my-10">
//             <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl">
//                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
//                     Over 10,000+ jobs to apply
//                 </h2>

//                 <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5 ">Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
//                 <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto ">
//                     <div className="flex items-center">
//                         <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
//                         <input type="text"
//                             placeholder="Search for jobs"
//                             className="max-sm:text-xs p-2 rounded outline-none w-full bg-white text-gray-400"
//                             ref={titleRef}
//                         />
//                     </div>
//                     <div className="flex items-center">
//                         <img className="h-4 sm:h-5" src={assets.location_icon} alt="" />
//                         <input type="text"
//                             placeholder="Location"
//                             className="max-sm:text-xs p-2 rounded outline-none w-full bg-white text-gray-400"
//                             ref={locationRef}
//                         />
//                     </div>
//                     <button onClick={onSearch} className="bg-blue-600 px-6 py-2 rounded text-white m-1">Search</button>
//                 </div>
//             </div>

//             <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
//                 <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
//                     <p className="font-medium ">Trusted by</p>
//                     <img className="h-6" src={assets.microsoft_logo} alt="" />
//                     <img className="h-6" src={assets.walmart_logo} alt="" />
//                     <img className="h-6" src={assets.accenture_logo} alt="" />
//                     <img className="h-6" src={assets.samsung_logo} alt="" />
//                     <img className="h-6" src={assets.amazon_logo} alt="" />
//                     <img className="h-6" src={assets.adobe_logo} alt="" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Hero
// //48