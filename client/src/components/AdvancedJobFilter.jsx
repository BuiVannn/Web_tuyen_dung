import React, { useState, useContext } from 'react';
import { MdFilterAlt, MdTune, MdOutlineMonetizationOn, MdOutlineWorkOutline } from 'react-icons/md';
import { CiLocationOn } from "react-icons/ci";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaLaptopHouse } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const AdvancedJobFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        jobType: [],
        salary: {
            min: '',
            max: ''
        },
        experience: [],
        remote: false
    });

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
    const experienceLevels = ['Entry level', 'Mid level', 'Senior level', 'Manager', 'Executive'];

    // Xử lý input text (từ khóa, địa điểm)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý checkbox (Loại công việc, kinh nghiệm)
    const handleCheckboxChange = (e, category) => {
        const { value, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [category]: checked
                ? [...prev[category], value]
                : prev[category].filter(item => item !== value)
        }));
    };

    // Xử lý checkbox toggle (Làm việc từ xa)
    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Xử lý input số (Lương tối thiểu, tối đa)
    const handleSalaryChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => {
            const newSalary = {
                ...prev.salary,
                [name]: value
            };

            // Kiểm tra điều kiện max >= min
            if (newSalary.min !== "" && newSalary.max !== "" && Number(newSalary.max) < Number(newSalary.min)) {
                alert("Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu!");
                return prev; // Không cập nhật state nếu điều kiện sai
            }

            return {
                ...prev,
                salary: newSalary
            };
        });
    };

    // Xử lý form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onFilter) onFilter(filters);
    };

    // Đặt lại bộ lọc về mặc định
    const handleReset = () => {
        setFilters({
            keyword: '',
            location: '',
            jobType: [],
            salary: {
                min: '',
                max: ''
            },
            experience: [],
            remote: false
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <MdTune className="mr-2 text-indigo-600" size={20} />
                Tinh chỉnh tìm kiếm
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tìm kiếm và địa điểm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                            Từ khóa
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleInputChange}
                                placeholder="Chức danh, kỹ năng, công ty..."
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <MdOutlineWorkOutline className="absolute left-3 top-3 text-gray-400" size={18} />
                            {filters.keyword && (
                                <button
                                    type="button"
                                    onClick={() => setFilters(prev => ({ ...prev, keyword: "" }))}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa điểm
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={filters.location}
                                onChange={handleInputChange}
                                placeholder="Thành phố, quốc gia..."
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <CiLocationOn className="absolute left-3 top-3 text-gray-400" size={18} />
                            {filters.location && (
                                <button
                                    type="button"
                                    onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid layout for filters with improved styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Job Types */}
                    <div className="bg-indigo-50/50 p-5 rounded-lg border border-indigo-100">
                        <h3 className="font-medium mb-4 text-gray-800 flex items-center">
                            <MdOutlineWorkOutline className="mr-2 text-indigo-500" size={18} />
                            Loại công việc
                        </h3>
                        <div className="space-y-3">
                            {jobTypes.map(type => (
                                <div key={type} className="flex items-center gap-2 group">
                                    <input
                                        type="checkbox"
                                        id={`job-type-${type}`}
                                        value={type}
                                        checked={filters.jobType.includes(type)}
                                        onChange={(e) => handleCheckboxChange(e, 'jobType')}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor={`job-type-${type}`}
                                        className="text-sm text-gray-700 cursor-pointer group-hover:text-indigo-600 transition-colors"
                                    >
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experience Levels */}
                    <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
                        <h3 className="font-medium mb-4 text-gray-800 flex items-center">
                            <RiUserSettingsLine className="mr-2 text-blue-500" size={18} />
                            Kinh nghiệm
                        </h3>
                        <div className="space-y-3">
                            {experienceLevels.map(level => (
                                <div key={level} className="flex items-center gap-2 group">
                                    <input
                                        type="checkbox"
                                        id={`exp-level-${level}`}
                                        value={level}
                                        checked={filters.experience.includes(level)}
                                        onChange={(e) => handleCheckboxChange(e, 'experience')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={`exp-level-${level}`}
                                        className="text-sm text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors"
                                    >
                                        {level}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Salary Range */}
                    <div className="bg-purple-50/50 p-5 rounded-lg border border-purple-100">
                        <h3 className="font-medium mb-4 text-gray-800 flex items-center">
                            <MdOutlineMonetizationOn className="mr-2 text-purple-500" size={18} />
                            Mức lương (triệu VNĐ)
                        </h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                name="min"
                                value={filters.salary.min}
                                onChange={handleSalaryChange}
                                placeholder="Từ"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                min="0"
                            />
                            <span className="text-gray-500">—</span>
                            <input
                                type="number"
                                name="max"
                                value={filters.salary.max}
                                onChange={handleSalaryChange}
                                placeholder="Đến"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Remote Option with improved styling */}
                <div className="flex items-center gap-2 bg-green-50/50 p-4 rounded-lg border border-green-100 inline-block">
                    <div className="flex items-center gap-2 group">
                        <input
                            type="checkbox"
                            id="remote"
                            name="remote"
                            checked={filters.remote}
                            onChange={handleToggleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                            htmlFor="remote"
                            className="text-sm text-gray-700 cursor-pointer group-hover:text-green-600 transition-colors flex items-center gap-2"
                        >
                            <FaLaptopHouse className="text-green-500" />
                            Làm việc từ xa
                        </label>
                    </div>
                </div>

                {/* Action Buttons with improved styling */}
                <div className="flex justify-end space-x-3 mt-8">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg 
                            bg-white shadow-sm hover:bg-gray-100 hover:text-gray-800 transition-all"
                    >
                        Đặt lại
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                            text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-sm"
                    >
                        Áp dụng bộ lọc
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdvancedJobFilter;
// import React, { useState } from 'react';
// import { MdSearch, MdFilterList, MdOutlineFilterAlt } from 'react-icons/md';
// import { CiLocationOn } from "react-icons/ci";
// const AdvancedJobFilter = ({ onFilter }) => {
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [filters, setFilters] = useState({
//         keyword: '',
//         location: '',
//         jobType: [],
//         salary: {
//             min: '',
//             max: ''
//         },
//         experience: [],
//         remote: false
//     });

//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
//     const experienceLevels = ['Entry level', 'Mid level', 'Senior level', 'Manager', 'Executive'];

//     //Xử lý input text (từ khóa, địa điểm):
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     //Xử lý checkbox (Loại công việc, kinh nghiệm)
//     const handleCheckboxChange = (e, category) => {
//         const { value, checked } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [category]: checked
//                 ? [...prev[category], value]
//                 : prev[category].filter(item => item !== value)
//         }));
//     };

//     //Xử lý checkbox toggle (Làm việc từ xa)
//     const handleToggleChange = (e) => {
//         const { name, checked } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: checked
//         }));
//     };

//     // const handleSalaryChange = (e) => {
//     // const { name, value } = e.target;
//     // setFilters(prev => ({
//     // ...prev,
//     // salary: {
//     // ...prev.salary,
//     // [name]: value
//     // }
//     // }));
//     // };

//     //Xử lý input số (Lương tối thiểu, tối đa)
//     const handleSalaryChange = (e) => {
//         const { name, value } = e.target;

//         setFilters(prev => {
//             const newSalary = {
//                 ...prev.salary,
//                 [name]: value
//             };

//             // Kiểm tra điều kiện max >= min
//             if (newSalary.min !== "" && newSalary.max !== "" && Number(newSalary.max) < Number(newSalary.min)) {
//                 alert("Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu!");
//                 return prev; // Không cập nhật state nếu điều kiện sai
//             }

//             return {
//                 ...prev,
//                 salary: newSalary
//             };
//         });
//     };


//     const handleSubmit = (e) => {
//         //Ngăn chặn hành vi mặc định của form
//         //Trong HTML, khi một form được submit, trình duyệt sẽ tải lại trang.
//         //e.preventDefault(); giúp ngăn chặn hành vi này để xử lý dữ liệu ngay trong React.
//         e.preventDefault();
//         // onFilter là một prop được truyền từ component cha.
//         // Khi gọi onFilter(filters), nó gửi state filters chứa thông tin bộ lọc lên component cha để xử lý dữ liệu (ví dụ: lọc danh sách công việc).
//         onFilter(filters);
//     };

//     //Đặt lại bộ lọc về mặc định:

//     const handleReset = () => {
//         setFilters({
//             keyword: '',
//             location: '',
//             jobType: [],
//             salary: {
//                 min: '',
//                 max: ''
//             },
//             experience: [],
//             remote: false
//         });
//     };

//     return (
//         <div className="container mx-auto px-4 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <MdFilterList className="mr-2" />
//                     Bộ lọc nâng cao
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Grid layout for filters */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {/* Job Types */}
//                         <div className="bg-gray-50 p-4 rounded-md">
//                             <h3 className="font-medium mb-3 text-gray-700">Loại công việc</h3>
//                             <div className="space-y-2">
//                                 {/* Existing checkboxes with improved styling */}
//                             </div>
//                         </div>

//                         {/* Experience Levels */}
//                         <div className="bg-gray-50 p-4 rounded-md">
//                             <h3 className="font-medium mb-3 text-gray-700">Kinh nghiệm</h3>
//                             <div className="space-y-2">
//                                 {/* Existing checkboxes with improved styling */}
//                             </div>
//                         </div>

//                         {/* Salary Range */}
//                         <div className="bg-gray-50 p-4 rounded-md">
//                             <h3 className="font-medium mb-3 text-gray-700">Mức lương (triệu VNĐ)</h3>
//                             {/* Existing salary inputs with improved styling */}
//                         </div>
//                     </div>

//                     {/* Remote Option */}
//                     <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md inline-block">
//                         {/* Existing remote checkbox with improved styling */}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button
//                             type="button"
//                             onClick={handleReset}
//                             className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg
//                                 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-800 transition-all"
//                         >
//                             Đặt lại
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-blue-600 hover:bg-blue-700 text-white font-medium
//                                 px-6 py-2 rounded-lg transition-colors shadow-sm"
//                         >
//                             Áp dụng bộ lọc
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AdvancedJobFilter;

// //     return (
// //         <div className="w-full bg-white rounded-lg shadow-md p-4 mb-6">
// //             <form onSubmit={handleSubmit}>
// //                 {/* Basic Search */}
// //                 <div className="flex flex-col md:flex-row gap-4 mb-4">
// //                     <div className="flex-1 relative">
// //                         <MdSearch className="absolute left-3 top-3 text-gray-500" size={20} />
// //                         <input
// //                             type="text"
// //                             name="keyword"
// //                             value={filters.keyword}
// //                             onChange={handleInputChange}
// //                             placeholder="Nhập từ khóa tìm kiếm (vị trí, kỹ năng...)"
// //                             className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />

// //                         {filters.keyword && (
// //                             <button
// //                                 onClick={() => setFilters({ ...filters, keyword: "" })}
// //                                 className="absolute right-3 top-2 text-gray-500 hover:text-red-500 transition-transform duration-200 hover:scale-125"
// //                             >
// //                                 ✖
// //                             </button>
// //                         )}
// //                     </div>
// //                     <div className="flex-1 relative">
// //                         <CiLocationOn className="absolute left-3 top-3 text-gray-500" size={20} />
// //                         <input
// //                             type="text"
// //                             name="location"
// //                             value={filters.location}
// //                             onChange={handleInputChange}
// //                             placeholder="Địa điểm"
// //                             className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         // className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />

// //                         {filters.location && (
// //                             <button
// //                                 onClick={() => setFilters({ ...filters, location: "" })}
// //                                 className="absolute right-3 top-2 text-gray-500 hover:text-red-500 transition-transform duration-200 hover:scale-125"
// //                             >
// //                                 ✖
// //                             </button>
// //                         )}
// //                     </div>
// //                     <button
// //                         type="button"
// //                         onClick={() => setIsFilterOpen(!isFilterOpen)}
// //                         className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md transition-colors"
// //                     >
// //                         <MdOutlineFilterAlt size={20} />
// //                         Bộ lọc
// //                     </button>
// //                     <button
// //                         type="submit"
// //                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md transition-colors"
// //                     >
// //                         Tìm kiếm
// //                     </button>
// //                 </div>

// //                 {/* Advanced Filters */}
// //                 {isFilterOpen && (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 p-4 bg-gray-50 rounded-md">
// //                         {/* Job Types */}
// //                         <div>
// //                             <h3 className="font-medium mb-2 text-gray-700">Loại công việc</h3>
// //                             <div className="space-y-2">
// //                                 {jobTypes.map(type => (
// //                                     <div key={type} className="flex items-center gap-2">
// //                                         <input
// //                                             type="checkbox"
// //                                             id={`job-type-${type}`}
// //                                             value={type}
// //                                             checked={filters.jobType.includes(type)}
// //                                             onChange={(e) => handleCheckboxChange(e, 'jobType')}
// //                                             // className="w-4 h-4 text-blue-600"
// //                                             className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-400"
// //                                         />
// //                                         <label htmlFor={`job-type-${type}`}
// //                                             // className="ml-2 text-sm text-gray-700"
// //                                             className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ml-2"
// //                                         >
// //                                             {type}
// //                                         </label>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>

// //                         {/* Experience Level */}
// //                         <div>
// //                             <h3 className="font-medium mb-2 text-gray-700">Kinh nghiệm</h3>
// //                             <div className="space-y-2">
// //                                 {experienceLevels.map(level => (
// //                                     <div key={level} className="flex items-center gap-2">
// //                                         <input
// //                                             type="checkbox"
// //                                             id={`exp-level-${level}`}
// //                                             value={level}
// //                                             checked={filters.experience.includes(level)}
// //                                             onChange={(e) => handleCheckboxChange(e, 'experience')}
// //                                             //className="w-4 h-4 text-blue-600"
// //                                             className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-400"
// //                                         />
// //                                         <label htmlFor={`exp-level-${level}`}
// //                                             //className="ml-2 text-sm text-gray-700"
// //                                             className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ml-2"
// //                                         >
// //                                             {level}
// //                                         </label>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>

// //                         {/* Salary Range */}
// //                         <div>
// //                             <h3 className="font-medium mb-2 text-gray-700">Mức lương (triệu VNĐ)</h3>
// //                             <div className="flex items-center gap-2">
// //                                 <input
// //                                     type="number"
// //                                     name="min"
// //                                     value={filters.salary.min}
// //                                     onChange={handleSalaryChange}
// //                                     placeholder="Từ"
// //                                     className="w-full px-3 py-1 border rounded-md text-sm"
// //                                     min="0"
// //                                 />
// //                                 <span>-</span>
// //                                 <input
// //                                     type="number"
// //                                     name="max"
// //                                     value={filters.salary.max}
// //                                     onChange={handleSalaryChange}
// //                                     placeholder="Đến"
// //                                     className="w-full px-3 py-1 border rounded-md text-sm"
// //                                     min="0"
// //                                 />
// //                             </div>
// //                         </div>

// //                         {/* Remote Option */}
// //                         <div>
// //                             <div className="flex items-center gap-2">
// //                                 <input
// //                                     type="checkbox"
// //                                     id="remote"
// //                                     name="remote"
// //                                     checked={filters.remote}
// //                                     onChange={handleToggleChange}
// //                                     //className="w-4 h-4 text-blue-600"
// //                                     className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-400"
// //                                 />
// //                                 <label htmlFor="remote"
// //                                     //className="ml-2 text-sm text-gray-700"
// //                                     className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ml-2"
// //                                 >
// //                                     Làm việc từ xa
// //                                 </label>
// //                             </div>
// //                         </div>

// //                         {/* reset button */}
// //                         <div className="md:col-span-2 lg:col-span-3 flex justify-end">
// //                             <button
// //                                 type="button"
// //                                 onClick={handleReset}
// //                                 className="mr-2 px-5 py-2 text-gray-600 border border-gray-300
// //                                 rounded-lg bg-white shadow-sm hover:bg-gray-100
// //                                 hover:text-gray-800 hover:shadow-md transition-all
// //                                 duration-200 ease-in-out"
// //                             >
// //                                 Đặt lại
// //                             </button>
// //                         </div>

// //                     </div>
// //                 )}
// //             </form>
// //         </div>
// //     );
// // };

// // export default AdvancedJobFilter;