import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import {
    MdFilterList, MdWorkOutline, MdLocationOn, MdBusinessCenter,
    MdAttachMoney, MdCategory, MdSchool, MdQueryBuilder, MdCheck
} from "react-icons/md";

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

    const [showFilter, setShowFilter] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState(jobs);

    // Job type options - Đồng bộ với model Job
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

    // Experience level options - Đồng bộ với model Job
    const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
        );
    };

    const handleTypeChange = (type) => {
        setSelectedTypes(
            prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleExperienceChange = (level) => {
        setSelectedExperience(
            prev => prev.includes(level) ? prev.filter(e => e !== level) : [...prev, level]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedLocations([]);
        setSelectedTypes([]);
        setSelectedExperience([]);
        setSearchFilter({ title: "", location: "" });
    };

    useEffect(() => {
        // Filter logic
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesType = job => selectedTypes.length === 0 || (job.type && selectedTypes.includes(job.type));
        const matchesExperience = job => selectedExperience.length === 0 || (job.experience && selectedExperience.includes(job.experience));
        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

        const newFilteredJobs = jobs.filter(
            job => matchesCategory(job) &&
                matchesLocation(job) &&
                matchesType(job) &&
                matchesExperience(job) &&
                matchesTitle(job) &&
                matchesSearchLocation(job)
        );

        setFilteredJobs(newFilteredJobs);
        setCurrentPage(1);
    }, [jobs, selectedCategories, selectedLocations, selectedTypes, selectedExperience, searchFilter]);

    const jobsPerPage = 9; // Số lượng job hiển thị trên mỗi trang
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1; // Đảm bảo luôn có ít nhất 1 trang

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filter sidebar with improved design */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <MdFilterList className="mr-2 text-blue-600" size={22} />
                                Lọc kết quả
                            </h3>

                            {/* Clear all filters button */}
                            {(selectedCategories.length > 0 || selectedLocations.length > 0 ||
                                selectedTypes.length > 0 || selectedExperience.length > 0 ||
                                searchFilter.title || searchFilter.location) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                    >
                                        Xóa lọc
                                    </button>
                                )}
                        </div>

                        {/* Current search tags with improved design */}
                        {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                            <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                                    <MdWorkOutline className="mr-1.5" />
                                    Tìm kiếm hiện tại:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {searchFilter.title && (
                                        <div className="inline-flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1.5 rounded-full text-blue-700 text-sm shadow-sm">
                                            <MdWorkOutline size={16} />
                                            <span>{searchFilter.title}</span>
                                            <button
                                                onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
                                                className="ml-1 hover:text-blue-800 hover:bg-blue-50 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                                aria-label="Remove search term"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}

                                    {searchFilter.location && (
                                        <div className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-sm shadow-sm">
                                            <MdLocationOn size={16} />
                                            <span>{searchFilter.location}</span>
                                            <button
                                                onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
                                                className="ml-1 hover:text-indigo-800 hover:bg-indigo-50 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                                aria-label="Remove location filter"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilter(prev => !prev)}
                            className="mb-6 w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 lg:hidden text-gray-700 transition-colors"
                        >
                            <span className="font-medium">{showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
                            <span className="text-lg">{showFilter ? "−" : "+"}</span>
                        </button>

                        <div className={showFilter ? "space-y-6" : "max-lg:hidden space-y-6"}>
                            {/* Job type filter - Improved */}
                            <div className="filter-section">
                                <h4 className="filter-heading">
                                    <MdBusinessCenter className="mr-2 text-green-600" />
                                    Loại hình công việc
                                </h4>
                                <ul className="space-y-2.5 mt-3">
                                    {jobTypes.map((type, index) => (
                                        <li key={index} className="filter-item">
                                            <label className="flex items-center cursor-pointer group">
                                                <div className={`filter-checkbox ${selectedTypes.includes(type) ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        onChange={() => handleTypeChange(type)}
                                                        checked={selectedTypes.includes(type)}
                                                    />
                                                    {selectedTypes.includes(type) && <MdCheck className="text-white text-sm" />}
                                                </div>
                                                <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 transition-colors">{type}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Experience level filter - Improved */}
                            <div className="filter-section">
                                <h4 className="filter-heading">
                                    <MdSchool className="mr-2 text-red-600" />
                                    Cấp độ kinh nghiệm
                                </h4>
                                <ul className="space-y-2.5 mt-3">
                                    {experienceLevels.map((level, index) => (
                                        <li key={index} className="filter-item">
                                            <label className="flex items-center cursor-pointer group">
                                                <div className={`filter-checkbox ${selectedExperience.includes(level) ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        onChange={() => handleExperienceChange(level)}
                                                        checked={selectedExperience.includes(level)}
                                                    />
                                                    {selectedExperience.includes(level) && <MdCheck className="text-white text-sm" />}
                                                </div>
                                                <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 transition-colors">{level}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Category filter - Improved */}
                            <div className="filter-section">
                                <h4 className="filter-heading">
                                    <MdCategory className="mr-2 text-purple-600" />
                                    Danh mục công việc
                                </h4>
                                <ul className="space-y-2.5 mt-3">
                                    {JobCategories.map((category, index) => (
                                        <li key={index} className="filter-item">
                                            <label className="flex items-center cursor-pointer group">
                                                <div className={`filter-checkbox ${selectedCategories.includes(category) ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        onChange={() => handleCategoryChange(category)}
                                                        checked={selectedCategories.includes(category)}
                                                    />
                                                    {selectedCategories.includes(category) && <MdCheck className="text-white text-sm" />}
                                                </div>
                                                <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 transition-colors">{category}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Location filter - Improved */}
                            <div className="filter-section">
                                <h4 className="filter-heading">
                                    <MdLocationOn className="mr-2 text-blue-600" />
                                    Địa điểm
                                </h4>
                                <ul className="space-y-2.5 mt-3">
                                    {JobLocations.map((location, index) => (
                                        <li key={index} className="filter-item">
                                            <label className="flex items-center cursor-pointer group">
                                                <div className={`filter-checkbox ${selectedLocations.includes(location) ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        onChange={() => handleLocationChange(location)}
                                                        checked={selectedLocations.includes(location)}
                                                    />
                                                    {selectedLocations.includes(location) && <MdCheck className="text-white text-sm" />}
                                                </div>
                                                <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 transition-colors">{location}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job listings */}
                <div className="w-full lg:w-3/4">
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800" id="job-list">
                                Công việc mới nhất
                            </h2>
                            <span className="text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                {filteredJobs.length} kết quả
                            </span>
                        </div>
                        <p className="text-gray-500 mt-1">Khám phá cơ hội việc làm từ các công ty hàng đầu</p>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <MdWorkOutline size={48} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy công việc</h3>
                            <p className="text-gray-500 mb-6">
                                Không có công việc nào phù hợp với bộ lọc hiện tại. Vui lòng thử với tiêu chí khác.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Job cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredJobs
                                    .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
                                    .map((job, index) => (
                                        <JobCard key={job._id || index} job={job} />
                                    ))}
                            </div>
                        </>
                    )}

                    {/* Pagination - Always display */}
                    {filteredJobs.length > 0 && (
                        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <a href="#job-list">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                                        disabled={currentPage === 1}
                                    >
                                        &larr;
                                    </button>
                                </a>

                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <a key={index} href="#job-list">
                                        <button
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`w-10 h-10 flex items-center justify-center border rounded-lg font-medium transition-all
                                                ${currentPage === index + 1
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </a>
                                ))}

                                <a href="#job-list">
                                    <button
                                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                                        disabled={currentPage === totalPages}
                                    >
                                        &rarr;
                                    </button>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobListing;
// kha ok
// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { assets, JobCategories, JobLocations } from "../assets/assets";
// import JobCard from "./JobCard";
// import { MdFilterList, MdWorkOutline, MdLocationOn, MdBusinessCenter, MdAttachMoney } from "react-icons/md";

// const JobListing = () => {
//     const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

//     const [showFilter, setShowFilter] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedLocations, setSelectedLocations] = useState([]);
//     const [selectedTypes, setSelectedTypes] = useState([]);
//     const [selectedExperience, setSelectedExperience] = useState([]);
//     const [filteredJobs, setFilteredJobs] = useState(jobs);

//     // Job type options
//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

//     // Experience level options
//     const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

//     const handleCategoryChange = (category) => {
//         setSelectedCategories(
//             prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//         );
//     };

//     const handleLocationChange = (location) => {
//         setSelectedLocations(
//             prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
//         );
//     };

//     const handleTypeChange = (type) => {
//         setSelectedTypes(
//             prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//         );
//     };

//     const handleExperienceChange = (level) => {
//         setSelectedExperience(
//             prev => prev.includes(level) ? prev.filter(e => e !== level) : [...prev, level]
//         );
//     };

//     useEffect(() => {
//         // Filter logic
//         const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);
//         const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location);
//         const matchesType = job => selectedTypes.length === 0 || (job.type && selectedTypes.includes(job.type));
//         const matchesExperience = job => selectedExperience.length === 0 || (job.experience && selectedExperience.includes(job.experience));
//         const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
//         const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

//         const newFilteredJobs = jobs.filter(
//             job => matchesCategory(job) &&
//                 matchesLocation(job) &&
//                 matchesType(job) &&
//                 matchesExperience(job) &&
//                 matchesTitle(job) &&
//                 matchesSearchLocation(job)
//         );

//         setFilteredJobs(newFilteredJobs);
//         setCurrentPage(1);
//     }, [jobs, selectedCategories, selectedLocations, selectedTypes, selectedExperience, searchFilter]);

//     const jobsPerPage = 9; // Số lượng job hiển thị trên mỗi trang
//     const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1; // Đảm bảo luôn có ít nhất 1 trang

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Filter sidebar */}
//                 <div className="w-full lg:w-1/4">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
//                         <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                             <MdFilterList className="mr-2" size={20} />
//                             Lọc kết quả
//                         </h3>

//                         {/* Current search tags */}
//                         {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
//                             <div className="mb-6">
//                                 <h4 className="text-sm font-medium text-gray-600 mb-2">Tìm kiếm hiện tại:</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {searchFilter.title && (
//                                         <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-blue-700 text-sm">
//                                             <MdWorkOutline size={16} />
//                                             <span>{searchFilter.title}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
//                                                 className="ml-1 hover:text-blue-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}

//                                     {searchFilter.location && (
//                                         <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-sm">
//                                             <MdLocationOn size={16} />
//                                             <span>{searchFilter.location}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
//                                                 className="ml-1 hover:text-indigo-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile filter toggle */}
//                         <button
//                             onClick={() => setShowFilter(prev => !prev)}
//                             className="mb-4 w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded border border-gray-200 lg:hidden text-gray-700"
//                         >
//                             <span>{showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
//                             <span>{showFilter ? "−" : "+"}</span>
//                         </button>

//                         <div className={showFilter ? "space-y-6" : "max-lg:hidden space-y-6"}>
//                             {/* Job type filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Loại hình công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {jobTypes.map((type, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`type-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleTypeChange(type)}
//                                                 checked={selectedTypes.includes(type)}
//                                             />
//                                             <label
//                                                 htmlFor={`type-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {type}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Experience level filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Cấp độ kinh nghiệm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {experienceLevels.map((level, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`exp-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleExperienceChange(level)}
//                                                 checked={selectedExperience.includes(level)}
//                                             />
//                                             <label
//                                                 htmlFor={`exp-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {level}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Category filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Danh mục công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobCategories.map((category, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`category-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleCategoryChange(category)}
//                                                 checked={selectedCategories.includes(category)}
//                                             />
//                                             <label
//                                                 htmlFor={`category-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {category}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Location filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Địa điểm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobLocations.map((location, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`location-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleLocationChange(location)}
//                                                 checked={selectedLocations.includes(location)}
//                                             />
//                                             <label
//                                                 htmlFor={`location-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {location}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Job listings */}
//                 <div className="w-full lg:w-3/4">
//                     <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-semibold text-gray-800" id="job-list">
//                                 Công việc mới nhất
//                             </h2>
//                             <span className="text-gray-500 text-sm">
//                                 {filteredJobs.length} kết quả
//                             </span>
//                         </div>
//                         <p className="text-gray-500 mt-1">Khám phá cơ hội việc làm từ các công ty hàng đầu</p>
//                     </div>

//                     {filteredJobs.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
//                             <MdWorkOutline size={48} className="mx-auto text-gray-400 mb-3" />
//                             <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy công việc</h3>
//                             <p className="text-gray-500">
//                                 Không có công việc nào phù hợp với bộ lọc hiện tại. Vui lòng thử với tiêu chí khác.
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Job cards */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                 {filteredJobs
//                                     .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
//                                     .map((job, index) => (
//                                         <JobCard key={job._id || index} job={job} />
//                                     ))}
//                             </div>
//                         </>
//                     )}

//                     {/* Pagination - Luôn hiển thị */}
//                     <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-center">
//                         <div className="flex items-center space-x-2">
//                             <a href="#job-list">
//                                 <button
//                                     onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                                     className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                     disabled={currentPage === 1}
//                                 >
//                                     &larr;
//                                 </button>
//                             </a>

//                             {Array.from({ length: totalPages }).map((_, index) => (
//                                 <a key={index} href="#job-list">
//                                     <button
//                                         onClick={() => setCurrentPage(index + 1)}
//                                         className={`w-10 h-10 flex items-center justify-center border rounded
//                                             ${currentPage === index + 1
//                                                 ? 'bg-blue-600 text-white border-blue-600'
//                                                 : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                                     >
//                                         {index + 1}
//                                     </button>
//                                 </a>
//                             ))}

//                             <a href="#job-list">
//                                 <button
//                                     onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
//                                     className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                     disabled={currentPage === totalPages}
//                                 >
//                                     &rarr;
//                                 </button>
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobListing;
// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { assets, JobCategories, JobLocations } from "../assets/assets";
// import JobCard from "./JobCard";
// import { MdFilterList, MdWorkOutline, MdLocationOn, MdBusinessCenter, MdAttachMoney } from "react-icons/md";

// const JobListing = () => {
//     const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

//     const [showFilter, setShowFilter] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedLocations, setSelectedLocations] = useState([]);
//     const [selectedTypes, setSelectedTypes] = useState([]);
//     const [selectedExperience, setSelectedExperience] = useState([]);
//     const [filteredJobs, setFilteredJobs] = useState(jobs);

//     // Job type options
//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

//     // Experience level options
//     const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

//     const handleCategoryChange = (category) => {
//         setSelectedCategories(
//             prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//         );
//     };

//     const handleLocationChange = (location) => {
//         setSelectedLocations(
//             prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
//         );
//     };

//     const handleTypeChange = (type) => {
//         setSelectedTypes(
//             prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//         );
//     };

//     const handleExperienceChange = (level) => {
//         setSelectedExperience(
//             prev => prev.includes(level) ? prev.filter(e => e !== level) : [...prev, level]
//         );
//     };

//     useEffect(() => {
//         // Filter logic
//         const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);
//         const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location);
//         const matchesType = job => selectedTypes.length === 0 || (job.type && selectedTypes.includes(job.type));
//         const matchesExperience = job => selectedExperience.length === 0 || (job.experience && selectedExperience.includes(job.experience));
//         const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
//         const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

//         const newFilteredJobs = jobs.filter(
//             job => matchesCategory(job) &&
//                 matchesLocation(job) &&
//                 matchesType(job) &&
//                 matchesExperience(job) &&
//                 matchesTitle(job) &&
//                 matchesSearchLocation(job)
//         );

//         setFilteredJobs(newFilteredJobs);
//         setCurrentPage(1);
//     }, [jobs, selectedCategories, selectedLocations, selectedTypes, selectedExperience, searchFilter]);

//     const jobsPerPage = 9; // Số lượng job hiển thị trên mỗi trang
//     const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Filter sidebar */}
//                 <div className="w-full lg:w-1/4">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
//                         <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                             <MdFilterList className="mr-2" size={20} />
//                             Lọc kết quả
//                         </h3>

//                         {/* Current search tags */}
//                         {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
//                             <div className="mb-6">
//                                 <h4 className="text-sm font-medium text-gray-600 mb-2">Tìm kiếm hiện tại:</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {searchFilter.title && (
//                                         <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-blue-700 text-sm">
//                                             <MdWorkOutline size={16} />
//                                             <span>{searchFilter.title}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
//                                                 className="ml-1 hover:text-blue-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}

//                                     {searchFilter.location && (
//                                         <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-sm">
//                                             <MdLocationOn size={16} />
//                                             <span>{searchFilter.location}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
//                                                 className="ml-1 hover:text-indigo-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile filter toggle */}
//                         <button
//                             onClick={() => setShowFilter(prev => !prev)}
//                             className="mb-4 w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded border border-gray-200 lg:hidden text-gray-700"
//                         >
//                             <span>{showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
//                             <span>{showFilter ? "−" : "+"}</span>
//                         </button>

//                         <div className={showFilter ? "space-y-6" : "max-lg:hidden space-y-6"}>
//                             {/* Job type filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Loại hình công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {jobTypes.map((type, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`type-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleTypeChange(type)}
//                                                 checked={selectedTypes.includes(type)}
//                                             />
//                                             <label
//                                                 htmlFor={`type-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {type}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Experience level filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Cấp độ kinh nghiệm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {experienceLevels.map((level, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`exp-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleExperienceChange(level)}
//                                                 checked={selectedExperience.includes(level)}
//                                             />
//                                             <label
//                                                 htmlFor={`exp-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {level}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Category filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Danh mục công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobCategories.map((category, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`category-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleCategoryChange(category)}
//                                                 checked={selectedCategories.includes(category)}
//                                             />
//                                             <label
//                                                 htmlFor={`category-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {category}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Location filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Địa điểm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobLocations.map((location, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`location-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleLocationChange(location)}
//                                                 checked={selectedLocations.includes(location)}
//                                             />
//                                             <label
//                                                 htmlFor={`location-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {location}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Job listings */}
//                 <div className="w-full lg:w-3/4">
//                     <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-semibold text-gray-800" id="job-list">
//                                 Công việc mới nhất
//                             </h2>
//                             <span className="text-gray-500 text-sm">
//                                 {filteredJobs.length} kết quả
//                             </span>
//                         </div>
//                         <p className="text-gray-500 mt-1">Khám phá cơ hội việc làm từ các công ty hàng đầu</p>
//                     </div>

//                     {filteredJobs.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
//                             <MdWorkOutline size={48} className="mx-auto text-gray-400 mb-3" />
//                             <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy công việc</h3>
//                             <p className="text-gray-500">
//                                 Không có công việc nào phù hợp với bộ lọc hiện tại. Vui lòng thử với tiêu chí khác.
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Job cards */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                 {filteredJobs
//                                     .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
//                                     .map((job, index) => (
//                                         <JobCard key={job._id || index} job={job} />
//                                     ))}
//                             </div>

//                             {/* Pagination - Hiển thị luôn nút phân trang cho dù chỉ có 1 trang */}
//                             <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-center">
//                                 <div className="flex items-center space-x-2">
//                                     <a href="#job-list">
//                                         <button
//                                             onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                                             className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                             disabled={currentPage === 1}
//                                         >
//                                             &larr;
//                                         </button>
//                                     </a>

//                                     {Array.from({ length: totalPages || 1 }).map((_, index) => (
//                                         <a key={index} href="#job-list">
//                                             <button
//                                                 onClick={() => setCurrentPage(index + 1)}
//                                                 className={`w-10 h-10 flex items-center justify-center border rounded
//                                                     ${currentPage === index + 1
//                                                         ? 'bg-blue-600 text-white border-blue-600'
//                                                         : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                                             >
//                                                 {index + 1}
//                                             </button>
//                                         </a>
//                                     ))}

//                                     <a href="#job-list">
//                                         <button
//                                             onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages || 1))}
//                                             className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                             disabled={currentPage === (totalPages || 1)}
//                                         >
//                                             &rarr;
//                                         </button>
//                                     </a>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobListing;



// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { assets, JobCategories, JobLocations } from "../assets/assets";
// import JobCard from "./JobCard";
// import { MdFilterList, MdWorkOutline, MdLocationOn, MdBusinessCenter, MdAttachMoney } from "react-icons/md";

// const JobListing = () => {
//     const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

//     const [showFilter, setShowFilter] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedLocations, setSelectedLocations] = useState([]);
//     const [selectedTypes, setSelectedTypes] = useState([]);
//     const [selectedExperience, setSelectedExperience] = useState([]);
//     const [filteredJobs, setFilteredJobs] = useState(jobs);

//     // Job type options
//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

//     // Experience level options
//     const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

//     const handleCategoryChange = (category) => {
//         setSelectedCategories(
//             prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//         );
//     };

//     const handleLocationChange = (location) => {
//         setSelectedLocations(
//             prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
//         );
//     };

//     const handleTypeChange = (type) => {
//         setSelectedTypes(
//             prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//         );
//     };

//     const handleExperienceChange = (level) => {
//         setSelectedExperience(
//             prev => prev.includes(level) ? prev.filter(e => e !== level) : [...prev, level]
//         );
//     };

//     useEffect(() => {
//         // Filter logic
//         const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);
//         const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location);
//         const matchesType = job => selectedTypes.length === 0 || (job.type && selectedTypes.includes(job.type));
//         const matchesExperience = job => selectedExperience.length === 0 || (job.experience && selectedExperience.includes(job.experience));
//         const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
//         const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

//         const newFilteredJobs = jobs.filter(
//             job => matchesCategory(job) &&
//                 matchesLocation(job) &&
//                 matchesType(job) &&
//                 matchesExperience(job) &&
//                 matchesTitle(job) &&
//                 matchesSearchLocation(job)
//         );

//         setFilteredJobs(newFilteredJobs);
//         setCurrentPage(1);
//     }, [jobs, selectedCategories, selectedLocations, selectedTypes, selectedExperience, searchFilter]);

//     const jobsPerPage = 9; // Increase from 6 to 9 for more content
//     const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Filter sidebar */}
//                 <div className="w-full lg:w-1/4">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
//                         <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                             <MdFilterList className="mr-2" size={20} />
//                             Lọc kết quả
//                         </h3>

//                         {/* Current search tags */}
//                         {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
//                             <div className="mb-6">
//                                 <h4 className="text-sm font-medium text-gray-600 mb-2">Tìm kiếm hiện tại:</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {searchFilter.title && (
//                                         <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-blue-700 text-sm">
//                                             <MdWorkOutline size={16} />
//                                             <span>{searchFilter.title}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
//                                                 className="ml-1 hover:text-blue-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}

//                                     {searchFilter.location && (
//                                         <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-sm">
//                                             <MdLocationOn size={16} />
//                                             <span>{searchFilter.location}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
//                                                 className="ml-1 hover:text-indigo-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile filter toggle */}
//                         <button
//                             onClick={() => setShowFilter(prev => !prev)}
//                             className="mb-4 w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded border border-gray-200 lg:hidden text-gray-700"
//                         >
//                             <span>{showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
//                             <span>{showFilter ? "−" : "+"}</span>
//                         </button>

//                         <div className={showFilter ? "space-y-6" : "max-lg:hidden space-y-6"}>
//                             {/* Job type filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Loại hình công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {jobTypes.map((type, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`type-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleTypeChange(type)}
//                                                 checked={selectedTypes.includes(type)}
//                                             />
//                                             <label
//                                                 htmlFor={`type-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {type}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Experience level filter - New */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Cấp độ kinh nghiệm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {experienceLevels.map((level, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`exp-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleExperienceChange(level)}
//                                                 checked={selectedExperience.includes(level)}
//                                             />
//                                             <label
//                                                 htmlFor={`exp-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {level}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Category filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Danh mục công việc</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobCategories.map((category, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`category-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleCategoryChange(category)}
//                                                 checked={selectedCategories.includes(category)}
//                                             />
//                                             <label
//                                                 htmlFor={`category-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {category}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Location filter */}
//                             <div>
//                                 <h4 className="font-medium text-gray-700 mb-3">Địa điểm</h4>
//                                 <ul className="space-y-2 text-gray-600">
//                                     {JobLocations.map((location, index) => (
//                                         <li className='flex gap-2 items-center' key={index}>
//                                             <input
//                                                 id={`location-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleLocationChange(location)}
//                                                 checked={selectedLocations.includes(location)}
//                                             />
//                                             <label
//                                                 htmlFor={`location-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {location}
//                                             </label>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Job listings */}
//                 <div className="w-full lg:w-3/4">
//                     <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-semibold text-gray-800" id="job-list">
//                                 Công việc mới nhất
//                             </h2>
//                             <span className="text-gray-500 text-sm">
//                                 {filteredJobs.length} kết quả
//                             </span>
//                         </div>
//                         <p className="text-gray-500 mt-1">Khám phá cơ hội việc làm từ các công ty hàng đầu</p>
//                     </div>

//                     {filteredJobs.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
//                             <MdWorkOutline size={48} className="mx-auto text-gray-400 mb-3" />
//                             <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy công việc</h3>
//                             <p className="text-gray-500">
//                                 Không có công việc nào phù hợp với bộ lọc hiện tại. Vui lòng thử với tiêu chí khác.
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Job cards */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                 {filteredJobs
//                                     .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
//                                     .map((job, index) => (
//                                         <JobCard key={job._id || index} job={job} />
//                                     ))}
//                             </div>

//                             {/* Pagination */}
//                             {totalPages > 1 && (
//                                 <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-center">
//                                     <div className="flex items-center space-x-2">
//                                         <a href="#job-list">
//                                             <button
//                                                 onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                                                 className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                                 disabled={currentPage === 1}
//                                             >
//                                                 &larr;
//                                             </button>
//                                         </a>

//                                         {Array.from({ length: totalPages }).map((_, index) => (
//                                             <a key={index} href="#job-list">
//                                                 <button
//                                                     onClick={() => setCurrentPage(index + 1)}
//                                                     className={`w-10 h-10 flex items-center justify-center border rounded
//                                                         ${currentPage === index + 1
//                                                             ? 'bg-blue-600 text-white border-blue-600'
//                                                             : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                                                 >
//                                                     {index + 1}
//                                                 </button>
//                                             </a>
//                                         ))}

//                                         <a href="#job-list">
//                                             <button
//                                                 onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
//                                                 className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                                 disabled={currentPage === totalPages}
//                                             >
//                                                 &rarr;
//                                             </button>
//                                         </a>
//                                     </div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobListing;



// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { assets, JobCategories, JobLocations } from "../assets/assets";
// import JobCard from "./JobCard";
// // Thêm import icon thiếu
// import { MdFilterList, MdWorkOutline, MdLocationOn } from "react-icons/md";

// const JobListing = () => {
//     const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)

//     const [showFilter, setShowFilter] = useState(true)

//     const [currentPage, setCurrentPage] = useState(1)

//     const [selectedCategories, setSelectedCategories] = useState([])
//     const [selectedLocations, setSelectedLocations] = useState([])

//     const [filteredJobs, setFilteredJobs] = useState(jobs)

//     // Giữ nguyên các hàm xử lý logic hiện tại
//     const handleCategoyChange = (category) => {
//         setSelectedCategories(
//             prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//         )
//     }

//     const handleLocationChange = (location) => {
//         setSelectedLocations(
//             prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
//         )
//     }

//     useEffect(() => {
//         // Giữ nguyên logic filter hiện tại
//         const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
//         const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
//         const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
//         const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

//         const newFilteredJobs = jobs.slice().reverse().filter(
//             job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
//         )

//         setFilteredJobs(newFilteredJobs)
//         setCurrentPage(1)
//     }, [jobs, selectedCategories, selectedLocations, searchFilter])


//     return (
//         <div className="container mx-auto px-4 py-6">
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Filter sidebar với thiết kế cải tiến */}
//                 <div className="w-full lg:w-1/4">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
//                         <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                             <MdFilterList className="mr-2" size={20} />
//                             Lọc kết quả
//                         </h3>

//                         {/* Current search tags với thiết kế cải tiến */}
//                         {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
//                             <div className="mb-6">
//                                 <h4 className="text-sm font-medium text-gray-600 mb-2">Tìm kiếm hiện tại:</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {searchFilter.title && (
//                                         <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-blue-700 text-sm">
//                                             <MdWorkOutline size={16} />
//                                             <span>{searchFilter.title}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
//                                                 className="ml-1 hover:text-blue-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}

//                                     {searchFilter.location && (
//                                         <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-sm">
//                                             <MdLocationOn size={16} />
//                                             <span>{searchFilter.location}</span>
//                                             <button
//                                                 onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
//                                                 className="ml-1 hover:text-indigo-800"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Nút toggle filter trên mobile */}
//                         <button
//                             onClick={() => setShowFilter(prev => !prev)}
//                             className="mb-4 w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded border border-gray-200 lg:hidden text-gray-700"
//                         >
//                             <span>{showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
//                             <span>{showFilter ? "−" : "+"}</span>
//                         </button>

//                         {/* Category filter với thiết kế cải tiến */}
//                         <div className={showFilter ? "" : "max-lg:hidden"}>
//                             <h4 className="font-medium text-gray-700 py-4">Danh mục công việc</h4>
//                             <ul className="space-y-3 text-gray-600">
//                                 {
//                                     JobCategories.map((category, index) => (
//                                         <li className='flex gap-3 items-center' key={index}>
//                                             <input
//                                                 id={`category-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleCategoyChange(category)}
//                                                 checked={selectedCategories.includes(category)}
//                                             />
//                                             <label
//                                                 htmlFor={`category-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {category}
//                                             </label>
//                                         </li>
//                                     ))
//                                 }
//                             </ul>
//                         </div>

//                         {/* Location filter với thiết kế cải tiến */}
//                         <div className={showFilter ? "" : "max-lg:hidden"}>
//                             <h4 className="font-medium text-gray-700 py-4 pt-6">Địa điểm</h4>
//                             <ul className="space-y-3 text-gray-600">
//                                 {
//                                     JobLocations.map((location, index) => (
//                                         <li className='flex gap-3 items-center' key={index}>
//                                             <input
//                                                 id={`location-${index}`}
//                                                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                 type="checkbox"
//                                                 onChange={() => handleLocationChange(location)}
//                                                 checked={selectedLocations.includes(location)}
//                                             />
//                                             <label
//                                                 htmlFor={`location-${index}`}
//                                                 className="text-sm font-medium text-gray-700 cursor-pointer"
//                                             >
//                                                 {location}
//                                             </label>
//                                         </li>
//                                     ))
//                                 }
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Job listings với thiết kế cải tiến */}
//                 <div className="w-full lg:w-3/4">
//                     <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-semibold text-gray-800" id="job-list">
//                                 Công việc mới nhất
//                             </h2>
//                             <span className="text-gray-500 text-sm">
//                                 {filteredJobs.length} kết quả
//                             </span>
//                         </div>
//                         <p className="text-gray-500 mt-1">Khám phá cơ hội việc làm từ các công ty hàng đầu</p>
//                     </div>

//                     {/* Job cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                         {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
//                             <JobCard key={index} job={job} />
//                         ))}
//                     </div>

//                     {/* Pagination với thiết kế cải tiến */}
//                     {filteredJobs.length > 0 && (
//                         <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-center">
//                             <div className="flex items-center space-x-2">
//                                 <a href="#job-list">
//                                     <button
//                                         onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                                         className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                         disabled={currentPage === 1}
//                                     >
//                                         &larr;
//                                     </button>
//                                 </a>

//                                 {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
//                                     <a key={index} href="#job-list">
//                                         <button
//                                             onClick={() => setCurrentPage(index + 1)}
//                                             className={`w-10 h-10 flex items-center justify-center border rounded
//                                                 ${currentPage === index + 1
//                                                     ? 'bg-blue-600 text-white border-blue-600'
//                                                     : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                                         >
//                                             {index + 1}
//                                         </button>
//                                     </a>
//                                 ))}

//                                 <a href="#job-list">
//                                     <button
//                                         onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))}
//                                         className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
//                                         disabled={currentPage === Math.ceil(filteredJobs.length / 6)}
//                                     >
//                                         &rarr;
//                                     </button>
//                                 </a>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobListing;







// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { assets, JobCategories, JobLocations } from "../assets/assets";
// import JobCard from "./JobCard";

// const JobListing = () => {
//     const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)

//     const [showFilter, setShowFilter] = useState(true)

//     const [currentPage, setCurrentPage] = useState(1)

//     const [selectedCategories, setSelectedCategories] = useState([])
//     const [selectedLocations, setSelectedLocations] = useState([])

//     const [filteredJobs, setFilteredJobs] = useState(jobs)
//     const handleCategoyChange = (category) => {
//         setSelectedCategories(
//             prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//         )
//     }

//     const handleLocationChange = (location) => {
//         setSelectedLocations(
//             prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
//         )
//     }

//     useEffect(() => {

//         const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)

//         const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)

//         const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

//         const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

//         const newFilteredJobs = jobs.slice().reverse().filter(
//             job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
//         )

//         setFilteredJobs(newFilteredJobs)
//         setCurrentPage(1)
//     }, [jobs, selectedCategories, selectedLocations, searchFilter])


//     return (
//         <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
//             <div className="w-full lg:w-1/4 bg-white px-4">
//                 {
//                     isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
//                         <>
//                             <h3 className="font-medium text-lg mb-4">Current Search</h3>
//                             <div className="mb-4 text-gray-600">
//                                 {searchFilter.title && (
//                                     <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
//                                         {searchFilter.title}
//                                         <img onClick={e => setSearchFilter(prev => ({ ...prev, title: "" }))} className="cursor-pointer" src={assets.cross_icon} alt="" />
//                                     </span>
//                                 )}
//                                 {searchFilter.location && (
//                                     <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
//                                         {searchFilter.location}
//                                         <img onClick={e => setSearchFilter(prev => ({ ...prev, location: "" }))} className="cursor-pointer" src={assets.cross_icon} alt="" />
//                                     </span>
//                                 )}
//                             </div>

//                         </>
//                     )
//                 }

//                 <button onClick={e => setShowFilter(prev => !prev)} className="px-6 py-1.5 rounded border border-gray-400 lg:hidden">
//                     {showFilter ? "Close" : "Filters"}
//                 </button>
//                 {/* category filter */}
//                 <div className={showFilter ? "" : "max-lg:hidden"}>
//                     <h4 className="font-medium text-lg py-4">Search by Categories</h4>
//                     <ul className="space-y-4 text-gray-600">
//                         {
//                             JobCategories.map((category, index) => (
//                                 <li className='flex gap-3 items-center' key={index}>
//                                     <input
//                                         className="scale-125"
//                                         type="checkbox"
//                                         onChange={() => handleCategoyChange(category)}
//                                         checked={selectedCategories.includes(category)}
//                                     />
//                                     {category}
//                                 </li>
//                             ))
//                         }
//                     </ul>
//                 </div>

//                 {/* location filter */}
//                 <div className={showFilter ? "" : "max-lg:hidden"}>
//                     <h4 className="font-medium text-lg py-4 pt-14">Search by Locations</h4>
//                     <ul className="space-y-4 text-gray-600">
//                         {
//                             JobLocations.map((location, index) => (
//                                 <li className='flex gap-3 items-center' key={index}>
//                                     <input
//                                         className="scale-125"
//                                         type="checkbox"
//                                         onChange={() => handleLocationChange(location)}
//                                         checked={selectedLocations.includes(location)}

//                                     />
//                                     {location}
//                                 </li>
//                             ))
//                         }
//                     </ul>
//                 </div>
//             </div>

//             {/* Job listings */}
//             <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
//                 <h3 className="font-medium text-3xl py-2" id="job-list">Lates Jobs</h3>
//                 <p className="mb-8 ">Get your desired job from top companies</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ">
//                     {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
//                         <JobCard key={index} job={job} />
//                     ))}
//                 </div>

//                 {/* Pagination */}
//                 {filteredJobs.length > 0 && (
//                     <div className="flex items-center justify-center space-x-2 mt-10">
//                         <a href="#job-list">
//                             <img onClick={() => setCurrentPage(Math.max(currentPage - 1), 1)} src={assets.left_arrow_icon} alt="" />
//                         </a>
//                         {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
//                             <a key={index} href="#job-list">
//                                 <button onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
//                             </a>
//                         ))}
//                         <a href="#job-list">
//                             <img onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
//                         </a>
//                     </div>
//                 )}
//             </section>
//         </div>
//     )
// }

// export default JobListing