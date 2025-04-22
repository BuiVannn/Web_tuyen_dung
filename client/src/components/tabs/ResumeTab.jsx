import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, GraduationCap, Folder, ExternalLink, FileText, Upload, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResumeTab = ({ userData, navigate }) => {
    const defaultNavigate = useNavigate();
    const nav = navigate || defaultNavigate;
    const { backendUrl, userToken, fetchUserData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [resume, setResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const userExperience = userData?.experience || [];
    const userEducation = userData?.education || [];
    const userProjects = userData?.projects || [];

    // Kiểm tra có resume hay không
    const hasResume = Boolean(userData?.resume && typeof userData.resume === 'string' && userData.resume.trim() !== '');

    const goToEditProfile = (section) => {
        nav(`/profile/edit${section ? `?section=${section}` : ''}`);
    };

    // Hàm xử lý khi chọn file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Kiểm tra kích thước file (giới hạn 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error('File quá lớn. Giới hạn tải lên là 5MB.');
            return;
        }

        setResume(selectedFile);
    };

    // Hàm xử lý upload/update resume
    const updateResume = async () => {
        try {
            if (!resume) {
                toast.error('Vui lòng chọn file resume');
                return;
            }

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

            // Đặt các state trước khi hiển thị toast
            setIsEdit(false);
            setResume(null);

            // Fetch dữ liệu mới
            await fetchUserData();

            // Hiển thị toast sau khi đã hoàn tất mọi xử lý
            toast.success(data.message || 'Resume đã được cập nhật thành công!', {
                position: "top-right",
                autoClose: 3000
            });
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên resume', {
                toastId: 'resume-error',
                autoClose: 3000
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Resume Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>

                <div className="flex items-center space-x-4">
                    {isEdit || !hasResume ? (
                        <div className="flex flex-col space-y-4 w-full">
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                    <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                                        <Upload size={16} className="mr-2" />
                                        {resume ? 'Đã chọn file' : 'Chọn file Resume'}
                                    </div>
                                </label>

                                {resume && (
                                    <span className="text-sm text-gray-600 flex items-center">
                                        {resume.name}
                                        <button
                                            onClick={() => setResume(null)}
                                            className="ml-2 text-gray-500 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={updateResume}
                                    disabled={isUploading || !resume}
                                    className={`${isUploading || !resume
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                        } px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center`}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang tải lên...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={16} className="mr-2" />
                                            Lưu Resume
                                        </>
                                    )}
                                </button>

                                {hasResume && (
                                    <button
                                        onClick={() => setIsEdit(false)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Hủy
                                    </button>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Định dạng được hỗ trợ: PDF, DOC, DOCX (Tối đa 5MB)
                            </p>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => window.open(userData.resume, '_blank', 'noopener,noreferrer')}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                            >
                                <FileText size={16} className="mr-2" />
                                Xem Resume
                            </button>

                            <button
                                onClick={() => setIsEdit(true)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Cập nhật Resume
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Kinh nghiệm làm việc */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Briefcase size={20} className="mr-2 text-blue-600" />
                        Kinh nghiệm làm việc
                    </h2>
                    <button
                        onClick={() => goToEditProfile('experience')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm
                    </button>
                </div>

                {userExperience.length > 0 ? (
                    <div className="space-y-6">
                        {userExperience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-blue-500 pl-4 ml-2 relative hover:bg-gray-50 p-3 rounded transition">
                                {/* Timeline dot */}
                                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-2"></div>

                                <div className="flex justify-between">
                                    <h3 className="font-medium text-gray-900">{exp.position || 'Không xác định'}</h3>
                                    <span className="text-sm text-gray-500">
                                        {exp.from ? new Date(exp.from).toLocaleDateString() : '?'} -
                                        {exp.current ? ' Hiện tại' : (exp.to ? ` ${new Date(exp.to).toLocaleDateString()}` : ' ?')}
                                    </span>
                                </div>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <MapPin size={16} className="mr-1 text-gray-400" />
                                    {exp.company || 'Không xác định'}
                                    {exp.location && <span className="ml-1">• {exp.location}</span>}
                                </p>
                                <p className="mt-2 text-gray-700">{exp.description || 'Không có mô tả'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Briefcase size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Bạn chưa thêm kinh nghiệm làm việc</p>
                        <button
                            onClick={() => goToEditProfile('experience')}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Thêm kinh nghiệm
                        </button>
                    </div>
                )}
            </div>

            {/* Học vấn */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <GraduationCap size={20} className="mr-2 text-green-600" />
                        Học vấn
                    </h2>
                    <button
                        onClick={() => goToEditProfile('education')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm
                    </button>
                </div>

                {userEducation.length > 0 ? (
                    <div className="space-y-6">
                        {userEducation.map((edu, index) => (
                            <div key={index} className="border-l-2 border-green-500 pl-4 ml-2 relative hover:bg-gray-50 p-3 rounded transition">
                                {/* Timeline dot */}
                                <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2 top-2"></div>

                                <div className="flex justify-between">
                                    <h3 className="font-medium text-gray-900">{edu.degree || 'Không xác định'}</h3>
                                    <span className="text-sm text-gray-500">
                                        {edu.from ? new Date(edu.from).toLocaleDateString() : '?'} -
                                        {edu.to ? ` ${new Date(edu.to).toLocaleDateString()}` : ' Hiện tại'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-1">{edu.school || 'Không xác định'}</p>
                                {edu.fieldOfStudy && (
                                    <p className="text-gray-600 text-sm mt-1">
                                        <span className="font-medium">Chuyên ngành:</span> {edu.fieldOfStudy}
                                    </p>
                                )}
                                {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <GraduationCap size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Bạn chưa thêm thông tin học vấn</p>
                        <button
                            onClick={() => goToEditProfile('education')}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Thêm học vấn
                        </button>
                    </div>
                )}
            </div>

            {/* Dự án */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Folder size={20} className="mr-2 text-orange-600" />
                        Dự án
                    </h2>
                    <button
                        onClick={() => goToEditProfile('projects')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm
                    </button>
                </div>

                {userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userProjects.map((project, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                                    {project.url && (
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>

                                {project.technologies && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {project.technologies.split(',').map((tech, idx) => (
                                            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="mt-3 text-gray-700 text-sm">{project.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Folder size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Bạn chưa thêm dự án</p>
                        <button
                            onClick={() => goToEditProfile('projects')}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Thêm dự án
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeTab;
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Briefcase, GraduationCap, Folder, Link, ExternalLink, FileText } from 'lucide-react';

// const ResumeTab = ({ userData, navigate }) => {
//     const defaultNavigate = useNavigate();
//     const nav = navigate || defaultNavigate;

//     const userExperience = userData?.experience || [];
//     const userEducation = userData?.education || [];
//     const userProjects = userData?.projects || [];

//     const goToEditProfile = (section) => {
//         nav(`/profile/edit${section ? `?section=${section}` : ''}`);
//     };

//     return (
//         <div className="space-y-8">
//             {/* Resume Section */}
//             <div className="bg-white p-6 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>

//                 <div className="flex items-center space-x-4">
//                     {hasResume ? (
//                         <>
//                             <button
//                                 onClick={() => window.open(userData.resume, '_blank', 'noopener,noreferrer')}
//                                 className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
//                             >
//                                 <FileText size={16} className="mr-2" />
//                                 Xem Resume
//                             </button>

//                             <Link
//                                 to="/profile/edit?section=resume"
//                                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
//                             >
//                                 <ExternalLink size={16} className="mr-2" />
//                                 Cập nhật Resume
//                             </Link>
//                         </>
//                     ) : (
//                         <div className="flex flex-col space-y-3">
//                             <p className="text-gray-500">Bạn chưa tải lên Resume. Tải lên Resume để tăng cơ hội nhận được việc làm.</p>
//                             <Link
//                                 to="/profile/edit?section=resume"
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center self-start"
//                             >
//                                 <FileText size={16} className="mr-2" />
//                                 Tải lên Resume
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {/* Kinh nghiệm làm việc */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <Briefcase size={20} className="mr-2 text-blue-600" />
//                         Kinh nghiệm làm việc
//                     </h2>
//                     <button
//                         onClick={() => goToEditProfile('experience')}
//                         className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         Thêm
//                     </button>
//                 </div>

//                 {userExperience.length > 0 ? (
//                     <div className="space-y-6">
//                         {userExperience.map((exp, index) => (
//                             <div key={index} className="border-l-2 border-blue-500 pl-4 ml-2 relative hover:bg-gray-50 p-3 rounded transition">
//                                 {/* Timeline dot */}
//                                 <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-2"></div>

//                                 <div className="flex justify-between">
//                                     <h3 className="font-medium text-gray-900">{exp.position || 'Không xác định'}</h3>
//                                     <span className="text-sm text-gray-500">
//                                         {exp.from ? new Date(exp.from).toLocaleDateString() : '?'} -
//                                         {exp.current ? ' Hiện tại' : (exp.to ? ` ${new Date(exp.to).toLocaleDateString()}` : ' ?')}
//                                     </span>
//                                 </div>
//                                 <p className="text-gray-600 flex items-center mt-1">
//                                     <MapPin size={16} className="mr-1 text-gray-400" />
//                                     {exp.company || 'Không xác định'}
//                                     {exp.location && <span className="ml-1">• {exp.location}</span>}
//                                 </p>
//                                 <p className="mt-2 text-gray-700">{exp.description || 'Không có mô tả'}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                         <Briefcase size={32} className="mx-auto text-gray-400 mb-2" />
//                         <p className="text-gray-500">Bạn chưa thêm kinh nghiệm làm việc</p>
//                         <button
//                             onClick={() => goToEditProfile('experience')}
//                             className="mt-2 text-blue-600 hover:underline"
//                         >
//                             Thêm kinh nghiệm
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Học vấn */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <GraduationCap size={20} className="mr-2 text-green-600" />
//                         Học vấn
//                     </h2>
//                     <button
//                         onClick={() => goToEditProfile('education')}
//                         className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         Thêm
//                     </button>
//                 </div>

//                 {userEducation.length > 0 ? (
//                     <div className="space-y-6">
//                         {userEducation.map((edu, index) => (
//                             <div key={index} className="border-l-2 border-green-500 pl-4 ml-2 relative hover:bg-gray-50 p-3 rounded transition">
//                                 {/* Timeline dot */}
//                                 <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2 top-2"></div>

//                                 <div className="flex justify-between">
//                                     <h3 className="font-medium text-gray-900">{edu.degree || 'Không xác định'}</h3>
//                                     <span className="text-sm text-gray-500">
//                                         {edu.from ? new Date(edu.from).toLocaleDateString() : '?'} -
//                                         {edu.to ? ` ${new Date(edu.to).toLocaleDateString()}` : ' Hiện tại'}
//                                     </span>
//                                 </div>
//                                 <p className="text-gray-600 mt-1">{edu.school || 'Không xác định'}</p>
//                                 {edu.fieldOfStudy && (
//                                     <p className="text-gray-600 text-sm mt-1">
//                                         <span className="font-medium">Chuyên ngành:</span> {edu.fieldOfStudy}
//                                     </p>
//                                 )}
//                                 {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                         <GraduationCap size={32} className="mx-auto text-gray-400 mb-2" />
//                         <p className="text-gray-500">Bạn chưa thêm thông tin học vấn</p>
//                         <button
//                             onClick={() => goToEditProfile('education')}
//                             className="mt-2 text-blue-600 hover:underline"
//                         >
//                             Thêm học vấn
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Dự án */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <Folder size={20} className="mr-2 text-orange-600" />
//                         Dự án
//                     </h2>
//                     <button
//                         onClick={() => goToEditProfile('projects')}
//                         className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         Thêm
//                     </button>
//                 </div>

//                 {userProjects.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {userProjects.map((project, index) => (
//                             <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
//                                 <div className="flex justify-between items-start">
//                                     <h3 className="font-medium text-gray-900">{project.name}</h3>
//                                     {project.url && (
//                                         <a
//                                             href={project.url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-blue-600 hover:text-blue-800"
//                                         >
//                                             <ExternalLink size={16} />
//                                         </a>
//                                     )}
//                                 </div>

//                                 {project.technologies && (
//                                     <div className="flex flex-wrap gap-1 mt-2">
//                                         {project.technologies.split(',').map((tech, idx) => (
//                                             <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
//                                                 {tech.trim()}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 )}

//                                 <p className="mt-3 text-gray-700 text-sm">{project.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                         <Folder size={32} className="mx-auto text-gray-400 mb-2" />
//                         <p className="text-gray-500">Bạn chưa thêm dự án</p>
//                         <button
//                             onClick={() => goToEditProfile('projects')}
//                             className="mt-2 text-blue-600 hover:underline"
//                         >
//                             Thêm dự án
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ResumeTab;