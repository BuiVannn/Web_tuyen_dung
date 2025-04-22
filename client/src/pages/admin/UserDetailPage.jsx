import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const UserDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const { setHeaderTitle } = useOutletContext() || {};
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);

    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Chi tiết ứng viên");
        }
    }, [setHeaderTitle]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin");
                navigate('/admin/login');
                return;
            }

            const response = await axios.get(`${backendUrl}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("User details response:", response.data);

            if (response.data.success) {
                setUser(response.data.user);
                // Đặt userProfile đúng cách dựa trên cấu trúc response
                // setUserProfile(response.data.userProfile || null);
                setUserProfile(response.data.profile || null); // FIX HERE: Change from userProfile to profile
                setApplications(response.data.applications || []);
            } else {
                toast.error(response.data.message || "Không thể tải thông tin ứng viên");
                navigate('/admin/candidates');
            }

        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
            navigate('/admin/candidates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl && userId) {
            fetchUserDetails();
        }
    }, [backendUrl, userId, navigate]);

    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Xóa ứng viên thành công");
                navigate('/admin/candidates');
            } else {
                toast.error(response.data.message || "Xóa ứng viên thất bại");
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    const formatSimpleDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), 'MM/yyyy', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <Loading />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-red-500 text-xl mb-4">
                    <span className="material-icons text-5xl mb-2">error_outline</span>
                    <p>Không tìm thấy thông tin ứng viên</p>
                </div>
                <Link to="/admin/candidates" className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
                    <span className="material-icons mr-2">arrow_back</span>
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const UserProfileTab = () => (
        <div className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                        <span className="material-icons mr-2">person</span>
                        Thông tin cá nhân
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Họ tên:</p>
                                {/* <p className="font-medium">{user.name || 'Chưa cập nhật'}</p> */}
                                <p className="font-medium">{user ? user.name : 'Chưa cập nhật'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Email:</p>
                                {/* <p className="font-medium">{user.email || 'Chưa cập nhật'}</p> */}
                                <p className="font-medium">{user ? user.email : 'Chưa cập nhật'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Điện thoại:</p>
                                {/* <p className="font-medium">{userProfile?.phone || 'Chưa cập nhật'}</p> */}
                                <p className="font-medium">{userProfile?.phone || 'Chưa cập nhật'}</p>
                                {/* <p className="font-medium">{profile?.phone || 'Chưa cập nhật'}</p> */}
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Địa chỉ:</p>
                                <p className="font-medium">{userProfile?.location || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Trạng thái tìm việc:</p>
                                <p className="font-medium">{userProfile?.availability || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Ngày tham gia:</p>
                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">ID người dùng:</p>
                                <p className="font-medium text-xs bg-gray-100 p-2 rounded break-all">{user._id}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Cập nhật gần nhất:</p>
                                <p className="font-medium">{formatDate(user.updatedAt)}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Giới thiệu bản thân:</p>
                                <p className="font-medium">{userProfile?.bio || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CV và kỹ năng */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                        <span className="material-icons mr-2">description</span>
                        CV và kỹ năng
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">CV / Resume:</p>
                                {user.resume || userProfile?.resume ? (
                                    <a
                                        href={user.resume || userProfile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                                    >
                                        <span className="material-icons mr-1 text-sm">visibility</span>
                                        Xem CV
                                    </a>
                                ) : (
                                    <p className="text-yellow-600">Chưa tải lên CV</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Kỹ năng:</p>
                                {userProfile?.skills && userProfile.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {userProfile.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Chưa cập nhật</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Chức danh:</p>
                                <p className="font-medium">{userProfile?.title || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Vị trí ứng tuyển:</p>
                                <p className="font-medium">{userProfile?.title || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Ngôn ngữ:</p>
                                {userProfile?.languages && userProfile.languages.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {userProfile.languages.map((lang, index) => (
                                            <div key={index} className="text-sm">
                                                <span className="font-medium">{lang.name}</span>
                                                {lang.level && <span className="text-gray-500"> - {lang.level}</span>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Chưa cập nhật</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liên kết mạng xã hội */}
            {userProfile?.socialLinks && (
                Object.values(userProfile.socialLinks).some(link => link && link.trim() !== '') && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white flex items-center">
                                <span className="material-icons mr-2">link</span>
                                Liên kết mạng xã hội
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {userProfile.socialLinks.linkedin && (
                                    <a
                                        href={userProfile.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <span className="material-icons mr-2">business</span>
                                        LinkedIn
                                    </a>
                                )}
                                {userProfile.socialLinks.github && (
                                    <a
                                        href={userProfile.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-gray-800 hover:text-black"
                                    >
                                        <span className="material-icons mr-2">code</span>
                                        GitHub
                                    </a>
                                )}
                                {userProfile.socialLinks.portfolio && (
                                    <a
                                        href={userProfile.socialLinks.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-green-600 hover:text-green-800"
                                    >
                                        <span className="material-icons mr-2">web</span>
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* Giáo dục và kinh nghiệm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Giáo dục */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                        <h3 className="text-lg font-medium text-white flex items-center">
                            <span className="material-icons mr-2">school</span>
                            Học vấn
                        </h3>
                    </div>
                    <div className="p-6">
                        {userProfile?.education && userProfile.education.length > 0 ? (
                            <div className="space-y-4">
                                {userProfile.education.map((edu, index) => (
                                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                        <p className="font-medium">{edu.school}</p>
                                        <p className="text-sm">{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}</p>
                                        <p className="text-xs text-gray-500">
                                            {edu.from && formatSimpleDate(edu.from)} -
                                            {edu.to ? formatSimpleDate(edu.to) : 'Hiện tại'}
                                        </p>
                                        {edu.description && <p className="text-sm mt-1 text-gray-600">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Chưa cập nhật thông tin học vấn</p>
                        )}
                    </div>
                </div>

                {/* Kinh nghiệm */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                        <h3 className="text-lg font-medium text-white flex items-center">
                            <span className="material-icons mr-2">work</span>
                            Kinh nghiệm làm việc
                        </h3>
                    </div>
                    <div className="p-6">
                        {userProfile?.experience && userProfile.experience.length > 0 ? (
                            <div className="space-y-4">
                                {userProfile.experience.map((exp, index) => (
                                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                        <p className="font-medium">{exp.position}</p>
                                        <p className="text-sm">{exp.company}</p>
                                        <p className="text-xs text-gray-500">
                                            {exp.from && formatSimpleDate(exp.from)} -
                                            {exp.to ? formatSimpleDate(exp.to) : exp.current ? 'Hiện tại' : ''}
                                        </p>
                                        {exp.description && <p className="text-sm mt-1 text-gray-600">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Chưa cập nhật kinh nghiệm làm việc</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Dự án và chứng chỉ */}
            {((userProfile?.projects && userProfile.projects.length > 0) ||
                (userProfile?.certificates && userProfile.certificates.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dự án */}
                        {userProfile?.projects && userProfile.projects.length > 0 && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                    <h3 className="text-lg font-medium text-white flex items-center">
                                        <span className="material-icons mr-2">rocket_launch</span>
                                        Dự án
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {userProfile.projects.map((project, index) => (
                                            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                                <p className="font-medium">{project.name}</p>
                                                {project.technologies && <p className="text-sm text-blue-600">{project.technologies}</p>}
                                                {project.description && <p className="text-sm mt-1 text-gray-600">{project.description}</p>}
                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                                                    >
                                                        Xem dự án
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chứng chỉ */}
                        {userProfile?.certificates && userProfile.certificates.length > 0 && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                    <h3 className="text-lg font-medium text-white flex items-center">
                                        <span className="material-icons mr-2">military_tech</span>
                                        Chứng chỉ
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {userProfile.certificates.map((cert, index) => (
                                            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                                <p className="font-medium">{cert.name}</p>
                                                {cert.issuer && <p className="text-sm text-gray-600">Cấp bởi: {cert.issuer}</p>}
                                                {cert.date && <p className="text-xs text-gray-500">Ngày cấp: {formatSimpleDate(cert.date)}</p>}
                                                {cert.url && (
                                                    <a
                                                        href={cert.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                                                    >
                                                        Xem chứng chỉ
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            {/* Sở thích */}
            {userProfile?.interests && userProfile.interests.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
                        <h3 className="text-lg font-medium text-white flex items-center">
                            <span className="material-icons mr-2">favorite</span>
                            Sở thích cá nhân
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {userProfile.interests.map((interest, index) => (
                                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const ApplicationsTab = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                    <span className="material-icons mr-2">work</span>
                    Đơn ứng tuyển
                </h3>
            </div>
            <div className="p-6">
                {applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Công việc
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Công ty
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày ứng tuyển
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((application) => (
                                    <tr key={application._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {application.jobId?.title || "Công việc không xác định"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {application.companyId?.name || "Công ty không xác định"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(application.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {application.status === 'accepted' ? 'Đã chấp nhận' :
                                                    application.status === 'rejected' ? 'Đã từ chối' :
                                                        application.status === 'pending' ? 'Đang chờ xử lý' : application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {application.jobId && (
                                                <Link
                                                    to={`/admin/jobs/${application.jobId._id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Xem việc làm
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="material-icons text-4xl mb-2">description</span>
                        <p>Ứng viên chưa có đơn ứng tuyển nào</p>
                    </div>
                )}
            </div>
        </div>
    );
    // Phần còn lại của component giữ nguyên
    // ...

    return (
        <div className="space-y-6">
            {/* Header với avatar và thông tin cơ bản */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 text-indigo-700">
                                {userProfile?.avatar ? (
                                    <img
                                        src={userProfile.avatar}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="material-icons text-4xl">person</span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                <p className="text-blue-100 flex items-center">
                                    <span className="material-icons text-sm mr-1">email</span>
                                    {user.email}
                                </p>
                                {userProfile?.title && (
                                    <p className="text-blue-100 flex items-center mt-1">
                                        <span className="material-icons text-sm mr-1">work</span>
                                        {userProfile.title}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="relative">
                                {!showDeleteOptions ? (
                                    <button
                                        onClick={() => setShowDeleteOptions(true)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                                    >
                                        <span className="material-icons mr-1">more_vert</span>
                                        Thao tác
                                    </button>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md absolute right-0 -top-1 border z-50 min-w-[200px]">
                                        <button
                                            onClick={() => setShowDeleteOptions(false)}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                                        >
                                            <span className="material-icons text-sm mr-1">close</span>
                                            Đóng
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteOptions(false);
                                                setShowDeleteModal(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                                        >
                                            <span className="material-icons mr-1 text-sm">delete</span>
                                            Xóa ứng viên
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/admin/candidates"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <span className="material-icons mr-1">arrow_back</span>
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="flex border-b">
                    <button
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Hồ sơ cá nhân
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'applications'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Đơn ứng tuyển ({applications.length})
                    </button>
                </div>
            </div>

            {/* Tab content */}
            <div className="mt-6">
                {activeTab === 'profile' ? <UserProfileTab /> : <ApplicationsTab />}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center text-red-500 mb-4">
                            <span className="material-icons text-5xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa ứng viên</h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Bạn có chắc chắn muốn xóa ứng viên <span className="font-semibold">{user.name}</span>?<br />
                            Tất cả thông tin và đơn ứng tuyển của ứng viên sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex-1"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailPage;
// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// import { useOutletContext } from 'react-router-dom';
// import { format } from 'date-fns';
// import vi from 'date-fns/locale/vi';

// const UserDetailPage = () => {
//     const { userId } = useParams();
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext);
//     const [user, setUser] = useState(null);
//     const [userProfile, setUserProfile] = useState(null);
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('profile');
//     const { setHeaderTitle } = useOutletContext() || {};
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [showDeleteOptions, setShowDeleteOptions] = useState(false);

//     useEffect(() => {
//         if (setHeaderTitle) {
//             setHeaderTitle("Chi tiết ứng viên");
//         }
//     }, [setHeaderTitle]);

//     const fetchUserDetails = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin");
//                 navigate('/admin/login');
//                 return;
//             }

//             const response = await axios.get(`${backendUrl}/api/admin/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             // Thêm log để xem cấu trúc dữ liệu
//             console.log("User details response:", response.data);

//             if (response.data.success) {
//                 setUser(response.data.user);
//                 // Đảm bảo trường userProfile được set đúng cách
//                 setUserProfile(response.data.userProfile || null);
//                 setApplications(response.data.applications || []);
//             } else {
//                 toast.error(response.data.message || "Không thể tải thông tin ứng viên");
//                 navigate('/admin/candidates');
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//             navigate('/admin/candidates');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const fetchUserDetails_0 = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin");
//                 navigate('/admin/login');
//                 return;
//             }

//             const response = await axios.get(`${backendUrl}/api/admin/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 setUser(response.data.user);
//                 setUserProfile(response.data.userProfile || null);
//                 setApplications(response.data.applications || []);
//             } else {
//                 toast.error(response.data.message || "Không thể tải thông tin ứng viên");
//                 navigate('/admin/candidates');
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//             navigate('/admin/candidates');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (backendUrl && userId) {
//             fetchUserDetails();
//         }
//     }, [backendUrl, userId, navigate]);

//     const handleDeleteUser = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 toast.success("Xóa ứng viên thành công");
//                 navigate('/admin/candidates');
//             } else {
//                 toast.error(response.data.message || "Xóa ứng viên thất bại");
//                 setShowDeleteModal(false);
//             }
//         } catch (error) {
//             console.error("Error deleting user:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//             setShowDeleteModal(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         try {
//             return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
//         } catch (error) {
//             return dateString;
//         }
//     };

//     const formatSimpleDate = (dateString) => {
//         if (!dateString) return "N/A";
//         try {
//             return format(new Date(dateString), 'MM/yyyy', { locale: vi });
//         } catch (error) {
//             return dateString;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-full py-20">
//                 <Loading />
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <div className="text-red-500 text-xl mb-4">
//                     <span className="material-icons text-5xl mb-2">error_outline</span>
//                     <p>Không tìm thấy thông tin ứng viên</p>
//                 </div>
//                 <Link to="/admin/candidates" className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
//                     <span className="material-icons mr-2">arrow_back</span>
//                     Quay lại danh sách
//                 </Link>
//             </div>
//         );
//     }

//     const UserProfileTab = () => (
//         <div className="space-y-6">
//             {/* Thông tin cá nhân */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                     <h3 className="text-lg font-medium text-white flex items-center">
//                         <span className="material-icons mr-2">person</span>
//                         Thông tin cá nhân
//                     </h3>
//                 </div>
//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Họ tên:</p>
//                                 <p className="font-medium">{userProfile && userProfile?.name ? userProfile.name : 'Chưa cập nhật'}</p>

//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Email:</p>

//                                 <p className="font-medium">{userProfile && userProfile?.email ? userProfile.email : 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Điện thoại:</p>
//                                 <p className="font-medium">{userProfile && userProfile?.phone ? userProfile.phone : 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Địa chỉ:</p>

//                                 <p className="font-medium">{userProfile && userProfile?.location ? userProfile.location : 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Trạng thái tìm việc:</p>

//                                 <p className="font-medium">{userProfile && userProfile?.availability ? userProfile.availability : 'Chưa cập nhật'}</p>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Ngày tham gia:</p>
//                                 <p className="font-medium">{formatDate(user.createdAt)}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">ID người dùng:</p>
//                                 <p className="font-medium text-xs bg-gray-100 p-2 rounded break-all">{user._id}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Cập nhật gần nhất:</p>
//                                 <p className="font-medium">{formatDate(user.updatedAt)}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Giới thiệu bản thân:</p>
//                                 <p className="font-medium">{userProfile?.bio || 'Chưa cập nhật'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* CV và kỹ năng */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
//                     <h3 className="text-lg font-medium text-white flex items-center">
//                         <span className="material-icons mr-2">description</span>
//                         CV và kỹ năng
//                     </h3>
//                 </div>
//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">CV / Resume:</p>
//                                 {user.resume || userProfile?.resume ? (
//                                     <a
//                                         href={user.resume || userProfile?.resume}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-500 hover:text-blue-700 inline-flex items-center"
//                                     >
//                                         <span className="material-icons mr-1 text-sm">visibility</span>
//                                         Xem CV
//                                     </a>
//                                 ) : (
//                                     <p className="text-yellow-600">Chưa tải lên CV</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Kỹ năng:</p>
//                                 {userProfile?.skills && userProfile.skills.length > 0 ? (
//                                     <div className="flex flex-wrap gap-2 mt-1">
//                                         {userProfile.skills.map((skill, index) => (
//                                             <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p>Chưa cập nhật</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Chức danh:</p>
//                                 <p className="font-medium">{userProfile?.title || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Vị trí ứng tuyển:</p>
//                                 <p className="font-medium">{userProfile?.title || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Ngôn ngữ:</p>
//                                 {userProfile?.languages && userProfile.languages.length > 0 ? (
//                                     <div className="flex flex-col gap-1">
//                                         {userProfile.languages.map((lang, index) => (
//                                             <div key={index} className="text-sm">
//                                                 <span className="font-medium">{lang.name}</span>
//                                                 {lang.level && <span className="text-gray-500"> - {lang.level}</span>}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p>Chưa cập nhật</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Liên kết mạng xã hội */}
//             {userProfile?.socialLinks && (
//                 Object.values(userProfile.socialLinks).some(link => link && link.trim() !== '') && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
//                             <h3 className="text-lg font-medium text-white flex items-center">
//                                 <span className="material-icons mr-2">link</span>
//                                 Liên kết mạng xã hội
//                             </h3>
//                         </div>
//                         <div className="p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 {userProfile.socialLinks.linkedin && (
//                                     <a
//                                         href={userProfile.socialLinks.linkedin}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-blue-600 hover:text-blue-800"
//                                     >
//                                         <span className="material-icons mr-2">business</span>
//                                         LinkedIn
//                                     </a>
//                                 )}
//                                 {userProfile.socialLinks.github && (
//                                     <a
//                                         href={userProfile.socialLinks.github}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-gray-800 hover:text-black"
//                                     >
//                                         <span className="material-icons mr-2">code</span>
//                                         GitHub
//                                     </a>
//                                 )}
//                                 {userProfile.socialLinks.portfolio && (
//                                     <a
//                                         href={userProfile.socialLinks.portfolio}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-green-600 hover:text-green-800"
//                                     >
//                                         <span className="material-icons mr-2">web</span>
//                                         Portfolio
//                                     </a>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )
//             )}

//             {/* Giáo dục và kinh nghiệm */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Giáo dục */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">school</span>
//                             Học vấn
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         {userProfile?.education && userProfile.education.length > 0 ? (
//                             <div className="space-y-4">
//                                 {userProfile.education.map((edu, index) => (
//                                     <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                         <p className="font-medium">{edu.school}</p>
//                                         <p className="text-sm">{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {edu.from && formatSimpleDate(edu.from)} -
//                                             {edu.to ? formatSimpleDate(edu.to) : 'Hiện tại'}
//                                         </p>
//                                         {edu.description && <p className="text-sm mt-1 text-gray-600">{edu.description}</p>}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 italic">Chưa cập nhật thông tin học vấn</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Kinh nghiệm */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">work</span>
//                             Kinh nghiệm làm việc
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         {userProfile?.experience && userProfile.experience.length > 0 ? (
//                             <div className="space-y-4">
//                                 {userProfile.experience.map((exp, index) => (
//                                     <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                         <p className="font-medium">{exp.position}</p>
//                                         <p className="text-sm">{exp.company}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {exp.from && formatSimpleDate(exp.from)} -
//                                             {exp.to ? formatSimpleDate(exp.to) : exp.current ? 'Hiện tại' : ''}
//                                         </p>
//                                         {exp.description && <p className="text-sm mt-1 text-gray-600">{exp.description}</p>}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 italic">Chưa cập nhật kinh nghiệm làm việc</p>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Dự án và chứng chỉ */}
//             {((userProfile?.projects && userProfile.projects.length > 0) ||
//                 (userProfile?.certificates && userProfile.certificates.length > 0)) && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Dự án */}
//                         {userProfile?.projects && userProfile.projects.length > 0 && (
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                                     <h3 className="text-lg font-medium text-white flex items-center">
//                                         <span className="material-icons mr-2">rocket_launch</span>
//                                         Dự án
//                                     </h3>
//                                 </div>
//                                 <div className="p-6">
//                                     <div className="space-y-4">
//                                         {userProfile.projects.map((project, index) => (
//                                             <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                                 <p className="font-medium">{project.name}</p>
//                                                 {project.technologies && <p className="text-sm text-blue-600">{project.technologies}</p>}
//                                                 {project.description && <p className="text-sm mt-1 text-gray-600">{project.description}</p>}
//                                                 {project.url && (
//                                                     <a
//                                                         href={project.url}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-xs text-blue-500 hover:underline mt-1 inline-block"
//                                                     >
//                                                         Xem dự án
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Chứng chỉ */}
//                         {userProfile?.certificates && userProfile.certificates.length > 0 && (
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
//                                     <h3 className="text-lg font-medium text-white flex items-center">
//                                         <span className="material-icons mr-2">military_tech</span>
//                                         Chứng chỉ
//                                     </h3>
//                                 </div>
//                                 <div className="p-6">
//                                     <div className="space-y-4">
//                                         {userProfile.certificates.map((cert, index) => (
//                                             <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                                 <p className="font-medium">{cert.name}</p>
//                                                 {cert.issuer && <p className="text-sm text-gray-600">Cấp bởi: {cert.issuer}</p>}
//                                                 {cert.date && <p className="text-xs text-gray-500">Ngày cấp: {formatSimpleDate(cert.date)}</p>}
//                                                 {cert.url && (
//                                                     <a
//                                                         href={cert.url}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-xs text-blue-500 hover:underline mt-1 inline-block"
//                                                     >
//                                                         Xem chứng chỉ
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//             {/* Sở thích */}
//             {userProfile?.interests && userProfile.interests.length > 0 && (
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">favorite</span>
//                             Sở thích cá nhân
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         <div className="flex flex-wrap gap-2">
//                             {userProfile.interests.map((interest, index) => (
//                                 <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                                     {interest}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const ApplicationsTab = () => (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <h3 className="text-lg font-medium text-white flex items-center">
//                     <span className="material-icons mr-2">work</span>
//                     Đơn ứng tuyển
//                 </h3>
//             </div>
//             <div className="p-6">
//                 {applications.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Công việc
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Công ty
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Ngày ứng tuyển
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Trạng thái
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Hành động
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {applications.map((application) => (
//                                     <tr key={application._id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm font-medium text-gray-900">
//                                                 {application.jobId?.title || "Công việc không xác định"}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-500">
//                                                 {application.companyId?.name || "Công ty không xác định"}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-500">
//                                                 {formatDate(application.createdAt)}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//                                             ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                                                     application.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                                                         'bg-yellow-100 text-yellow-800'}`}>
//                                                 {application.status === 'accepted' ? 'Đã chấp nhận' :
//                                                     application.status === 'rejected' ? 'Đã từ chối' :
//                                                         application.status === 'pending' ? 'Đang chờ xử lý' : application.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             {application.jobId && (
//                                                 <Link
//                                                     to={`/admin/jobs/${application.jobId._id}`}
//                                                     className="text-blue-600 hover:text-blue-900 mr-3"
//                                                 >
//                                                     Xem việc làm
//                                                 </Link>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         <span className="material-icons text-4xl mb-2">description</span>
//                         <p>Ứng viên chưa có đơn ứng tuyển nào</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

//     return (
//         <div className="space-y-6">
//             {/* Thông tin tổng quan và thao tác */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                         <div className="flex items-center mb-4 md:mb-0">
//                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 text-indigo-700">
//                                 {userProfile?.avatar ? (
//                                     <img
//                                         src={userProfile.avatar}
//                                         alt={user.name}
//                                         className="w-16 h-16 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <span className="material-icons text-4xl">person</span>
//                                 )}
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-white">{user.name}</h2>
//                                 <p className="text-blue-100 flex items-center">
//                                     <span className="material-icons text-sm mr-1">email</span>
//                                     {user.email}
//                                 </p>
//                                 {userProfile?.title && (
//                                     <p className="text-blue-100 flex items-center mt-1">
//                                         <span className="material-icons text-sm mr-1">work</span>
//                                         {userProfile.title}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             <div className="relative">
//                                 {!showDeleteOptions ? (
//                                     <button
//                                         onClick={() => setShowDeleteOptions(true)}
//                                         className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
//                                     >
//                                         <span className="material-icons mr-1">more_vert</span>
//                                         Thao tác
//                                     </button>
//                                 ) : (
//                                     <div className="bg-white rounded-lg shadow-md absolute right-0 -top-1 border z-50 min-w-[200px]">
//                                         <button
//                                             onClick={() => setShowDeleteOptions(false)}
//                                             className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
//                                         >
//                                             <span className="material-icons text-sm mr-1">close</span>
//                                             Đóng
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setShowDeleteOptions(false);
//                                                 setShowDeleteModal(true);
//                                             }}
//                                             className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
//                                         >
//                                             <span className="material-icons mr-1 text-sm">delete</span>
//                                             Xóa ứng viên
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             <Link
//                                 to="/admin/candidates"
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//                             >
//                                 <span className="material-icons mr-1">arrow_back</span>
//                                 Quay lại
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab navigation */}
//                 <div className="flex border-b">
//                     <button
//                         className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                         onClick={() => setActiveTab('profile')}
//                     >
//                         Hồ sơ cá nhân
//                     </button>
//                     <button
//                         className={`px-6 py-3 text-sm font-medium ${activeTab === 'applications'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                         onClick={() => setActiveTab('applications')}
//                     >
//                         Đơn ứng tuyển ({applications.length})
//                     </button>
//                 </div>
//             </div>

//             {/* Tab content */}
//             <div className="mt-6">
//                 {activeTab === 'profile' ? <UserProfileTab /> : <ApplicationsTab />}
//             </div>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
//                         <div className="flex items-center justify-center text-red-500 mb-4">
//                             <span className="material-icons text-5xl">warning</span>
//                         </div>
//                         <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa ứng viên</h3>
//                         <p className="text-gray-600 mb-6 text-center">
//                             Bạn có chắc chắn muốn xóa ứng viên <span className="font-semibold">{user.name}</span>?<br />
//                             Tất cả thông tin và đơn ứng tuyển của ứng viên sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
//                         </p>
//                         <div className="flex justify-center space-x-4">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex-1"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteUser}
//                                 className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
//                             >
//                                 Xác nhận xóa
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserDetailPage;

// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// import { useOutletContext } from 'react-router-dom';
// import { format } from 'date-fns';
// import vi from 'date-fns/locale/vi';

// const UserDetailPage = () => {
//     const { userId } = useParams();
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext);
//     const [user, setUser] = useState(null);
//     const [userProfile, setUserProfile] = useState(null);
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('profile');
//     const { setHeaderTitle } = useOutletContext() || {};
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [showDeleteOptions, setShowDeleteOptions] = useState(false);

//     useEffect(() => {
//         if (setHeaderTitle) {
//             setHeaderTitle("Chi tiết ứng viên");
//         }
//     }, [setHeaderTitle]);

//     const fetchUserDetails = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin");
//                 navigate('/admin/login');
//                 return;
//             }

//             const response = await axios.get(`${backendUrl}/api/admin/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 setUser(response.data.user);
//                 setUserProfile(response.data.userProfile || null);
//                 setApplications(response.data.applications || []);
//             } else {
//                 toast.error(response.data.message || "Không thể tải thông tin ứng viên");
//                 navigate('/admin/candidates');
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//             navigate('/admin/candidates');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (backendUrl && userId) {
//             fetchUserDetails();
//         }
//     }, [backendUrl, userId]);

//     const handleDeleteUser = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 toast.success("Xóa ứng viên thành công");
//                 navigate('/admin/candidates');
//             } else {
//                 toast.error(response.data.message || "Xóa ứng viên thất bại");
//                 setShowDeleteModal(false);
//             }
//         } catch (error) {
//             console.error("Error deleting user:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//             setShowDeleteModal(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         try {
//             return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
//         } catch (error) {
//             return dateString;
//         }
//     };

//     const formatSimpleDate = (dateString) => {
//         if (!dateString) return "N/A";
//         try {
//             return format(new Date(dateString), 'MM/yyyy', { locale: vi });
//         } catch (error) {
//             return dateString;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-full py-20">
//                 <Loading />
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <div className="text-red-500 text-xl mb-4">
//                     <span className="material-icons text-5xl mb-2">error_outline</span>
//                     <p>Không tìm thấy thông tin ứng viên</p>
//                 </div>
//                 <Link to="/admin/candidates" className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
//                     <span className="material-icons mr-2">arrow_back</span>
//                     Quay lại danh sách
//                 </Link>
//             </div>
//         );
//     }

//     const UserProfileTab = () => (
//         <div className="space-y-6">
//             {/* Thông tin cá nhân */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                     <h3 className="text-lg font-medium text-white flex items-center">
//                         <span className="material-icons mr-2">person</span>
//                         Thông tin cá nhân
//                     </h3>
//                 </div>
//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Họ tên:</p>
//                                 <p className="font-medium">{user.name || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Email:</p>
//                                 <p className="font-medium">{user.email || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Điện thoại:</p>
//                                 <p className="font-medium">{userProfile?.phone || user.phone || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Địa chỉ:</p>
//                                 <p className="font-medium">{userProfile?.location || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Trạng thái tìm việc:</p>
//                                 <p className="font-medium">{userProfile?.availability || 'Chưa cập nhật'}</p>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Ngày tham gia:</p>
//                                 <p className="font-medium">{formatDate(user.createdAt)}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">ID người dùng:</p>
//                                 <p className="font-medium text-xs bg-gray-100 p-2 rounded break-all">{user._id}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Cập nhật gần nhất:</p>
//                                 <p className="font-medium">{formatDate(user.updatedAt)}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Giới thiệu bản thân:</p>
//                                 <p className="font-medium">{userProfile?.bio || 'Chưa cập nhật'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* CV và kỹ năng */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
//                     <h3 className="text-lg font-medium text-white flex items-center">
//                         <span className="material-icons mr-2">description</span>
//                         CV và kỹ năng
//                     </h3>
//                 </div>
//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">CV / Resume:</p>
//                                 {user.resume || userProfile?.resume ? (
//                                     <a
//                                         href={user.resume || userProfile?.resume}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-500 hover:text-blue-700 inline-flex items-center"
//                                     >
//                                         <span className="material-icons mr-1 text-sm">visibility</span>
//                                         Xem CV
//                                     </a>
//                                 ) : (
//                                     <p className="text-yellow-600">Chưa tải lên CV</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Kỹ năng:</p>
//                                 {userProfile?.skills && userProfile.skills.length > 0 ? (
//                                     <div className="flex flex-wrap gap-2 mt-1">
//                                         {userProfile.skills.map((skill, index) => (
//                                             <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p>Chưa cập nhật</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Chức danh:</p>
//                                 <p className="font-medium">{userProfile?.title || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Vị trí ứng tuyển:</p>
//                                 <p className="font-medium">{user.jobTitle || 'Chưa cập nhật'}</p>
//                             </div>
//                             <div className="mb-4">
//                                 <p className="text-sm text-gray-500">Ngôn ngữ:</p>
//                                 {userProfile?.languages && userProfile.languages.length > 0 ? (
//                                     <div className="flex flex-col gap-1">
//                                         {userProfile.languages.map((lang, index) => (
//                                             <div key={index} className="text-sm">
//                                                 <span className="font-medium">{lang.name}</span>
//                                                 {lang.level && <span className="text-gray-500"> - {lang.level}</span>}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p>Chưa cập nhật</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Liên kết mạng xã hội */}
//             {userProfile?.socialLinks && (
//                 Object.values(userProfile.socialLinks).some(link => link && link.trim() !== '') && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
//                             <h3 className="text-lg font-medium text-white flex items-center">
//                                 <span className="material-icons mr-2">link</span>
//                                 Liên kết mạng xã hội
//                             </h3>
//                         </div>
//                         <div className="p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 {userProfile.socialLinks.linkedin && (
//                                     <a
//                                         href={userProfile.socialLinks.linkedin}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-blue-600 hover:text-blue-800"
//                                     >
//                                         <span className="material-icons mr-2">business</span>
//                                         LinkedIn
//                                     </a>
//                                 )}
//                                 {userProfile.socialLinks.github && (
//                                     <a
//                                         href={userProfile.socialLinks.github}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-gray-800 hover:text-black"
//                                     >
//                                         <span className="material-icons mr-2">code</span>
//                                         GitHub
//                                     </a>
//                                 )}
//                                 {userProfile.socialLinks.portfolio && (
//                                     <a
//                                         href={userProfile.socialLinks.portfolio}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-green-600 hover:text-green-800"
//                                     >
//                                         <span className="material-icons mr-2">web</span>
//                                         Portfolio
//                                     </a>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )
//             )}

//             {/* Giáo dục và kinh nghiệm */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Giáo dục */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">school</span>
//                             Học vấn
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         {userProfile?.education && userProfile.education.length > 0 ? (
//                             <div className="space-y-4">
//                                 {userProfile.education.map((edu, index) => (
//                                     <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                         <p className="font-medium">{edu.school}</p>
//                                         <p className="text-sm">{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {edu.from && formatSimpleDate(edu.from)} -
//                                             {edu.to ? formatSimpleDate(edu.to) : 'Hiện tại'}
//                                         </p>
//                                         {edu.description && <p className="text-sm mt-1 text-gray-600">{edu.description}</p>}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 italic">Chưa cập nhật thông tin học vấn</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Kinh nghiệm */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">work</span>
//                             Kinh nghiệm làm việc
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         {userProfile?.experience && userProfile.experience.length > 0 ? (
//                             <div className="space-y-4">
//                                 {userProfile.experience.map((exp, index) => (
//                                     <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                         <p className="font-medium">{exp.position}</p>
//                                         <p className="text-sm">{exp.company}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {exp.from && formatSimpleDate(exp.from)} -
//                                             {exp.to ? formatSimpleDate(exp.to) : exp.current ? 'Hiện tại' : ''}
//                                         </p>
//                                         {exp.description && <p className="text-sm mt-1 text-gray-600">{exp.description}</p>}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 italic">Chưa cập nhật kinh nghiệm làm việc</p>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Dự án và chứng chỉ */}
//             {((userProfile?.projects && userProfile.projects.length > 0) ||
//                 (userProfile?.certificates && userProfile.certificates.length > 0)) && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Dự án */}
//                         {userProfile?.projects && userProfile.projects.length > 0 && (
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                                     <h3 className="text-lg font-medium text-white flex items-center">
//                                         <span className="material-icons mr-2">rocket_launch</span>
//                                         Dự án
//                                     </h3>
//                                 </div>
//                                 <div className="p-6">
//                                     <div className="space-y-4">
//                                         {userProfile.projects.map((project, index) => (
//                                             <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                                 <p className="font-medium">{project.name}</p>
//                                                 {project.technologies && <p className="text-sm text-blue-600">{project.technologies}</p>}
//                                                 {project.description && <p className="text-sm mt-1 text-gray-600">{project.description}</p>}
//                                                 {project.url && (
//                                                     <a
//                                                         href={project.url}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-xs text-blue-500 hover:underline mt-1 inline-block"
//                                                     >
//                                                         Xem dự án
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Chứng chỉ */}
//                         {userProfile?.certificates && userProfile.certificates.length > 0 && (
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
//                                     <h3 className="text-lg font-medium text-white flex items-center">
//                                         <span className="material-icons mr-2">military_tech</span>
//                                         Chứng chỉ
//                                     </h3>
//                                 </div>
//                                 <div className="p-6">
//                                     <div className="space-y-4">
//                                         {userProfile.certificates.map((cert, index) => (
//                                             <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
//                                                 <p className="font-medium">{cert.name}</p>
//                                                 {cert.issuer && <p className="text-sm text-gray-600">Cấp bởi: {cert.issuer}</p>}
//                                                 {cert.date && <p className="text-xs text-gray-500">Ngày cấp: {formatSimpleDate(cert.date)}</p>}
//                                                 {cert.url && (
//                                                     <a
//                                                         href={cert.url}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-xs text-blue-500 hover:underline mt-1 inline-block"
//                                                     >
//                                                         Xem chứng chỉ
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//             {/* Sở thích */}
//             {userProfile?.interests && userProfile.interests.length > 0 && (
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
//                         <h3 className="text-lg font-medium text-white flex items-center">
//                             <span className="material-icons mr-2">favorite</span>
//                             Sở thích cá nhân
//                         </h3>
//                     </div>
//                     <div className="p-6">
//                         <div className="flex flex-wrap gap-2">
//                             {userProfile.interests.map((interest, index) => (
//                                 <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                                     {interest}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const ApplicationsTab = () => (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <h3 className="text-lg font-medium text-white flex items-center">
//                     <span className="material-icons mr-2">work</span>
//                     Đơn ứng tuyển
//                 </h3>
//             </div>
//             <div className="p-6">
//                 {applications.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Công việc
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Công ty
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Ngày ứng tuyển
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Trạng thái
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Hành động
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {applications.map((application) => (
//                                     <tr key={application._id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm font-medium text-gray-900">
//                                                 {application.jobId?.title || "Công việc không xác định"}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-500">
//                                                 {application.companyId?.name || "Công ty không xác định"}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-500">
//                                                 {formatDate(application.createdAt)}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//                         ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                                                     application.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                                                         'bg-yellow-100 text-yellow-800'}`}>
//                                                 {application.status === 'accepted' ? 'Đã chấp nhận' :
//                                                     application.status === 'rejected' ? 'Đã từ chối' :
//                                                         application.status === 'pending' ? 'Đang chờ xử lý' : application.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             {application.jobId && (
//                                                 <Link
//                                                     to={`/admin/jobs/${application.jobId._id}`}
//                                                     className="text-blue-600 hover:text-blue-900 mr-3"
//                                                 >
//                                                     Xem việc làm
//                                                 </Link>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         <span className="material-icons text-4xl mb-2">description</span>
//                         <p>Ứng viên chưa có đơn ứng tuyển nào</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

//     return (
//         <div className="space-y-6">
//             {/* Thông tin tổng quan và thao tác */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                         <div className="flex items-center mb-4 md:mb-0">
//                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 text-indigo-700">
//                                 {user.avatar || userProfile?.avatar ? (
//                                     <img
//                                         src={user.avatar || userProfile?.avatar}
//                                         alt={user.name}
//                                         className="w-16 h-16 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <span className="material-icons text-4xl">person</span>
//                                 )}
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-white">{user.name}</h2>
//                                 <p className="text-blue-100 flex items-center">
//                                     <span className="material-icons text-sm mr-1">email</span>
//                                     {user.email}
//                                 </p>
//                                 {userProfile?.title && (
//                                     <p className="text-blue-100 flex items-center mt-1">
//                                         <span className="material-icons text-sm mr-1">work</span>
//                                         {userProfile.title}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             <div className="relative">
//                                 {!showDeleteOptions ? (
//                                     <button
//                                         onClick={() => setShowDeleteOptions(true)}
//                                         className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
//                                     >
//                                         <span className="material-icons mr-1">more_vert</span>
//                                         Thao tác
//                                     </button>
//                                 ) : (
//                                     <div className="bg-white rounded-lg shadow-md absolute right-0 -top-1 border z-50 min-w-[200px]">
//                                         <button
//                                             onClick={() => setShowDeleteOptions(false)}
//                                             className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
//                                         >
//                                             <span className="material-icons text-sm mr-1">close</span>
//                                             Đóng
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setShowDeleteOptions(false);
//                                                 setShowDeleteModal(true);
//                                             }}
//                                             className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
//                                         >
//                                             <span className="material-icons mr-1 text-sm">delete</span>
//                                             Xóa ứng viên
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             <Link
//                                 to="/admin/candidates"
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//                             >
//                                 <span className="material-icons mr-1">arrow_back</span>
//                                 Quay lại
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab navigation */}
//                 <div className="flex border-b">
//                     <button
//                         className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                         onClick={() => setActiveTab('profile')}
//                     >
//                         Hồ sơ cá nhân
//                     </button>
//                     <button
//                         className={`px-6 py-3 text-sm font-medium ${activeTab === 'applications'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                         onClick={() => setActiveTab('applications')}
//                     >
//                         Đơn ứng tuyển ({applications.length})
//                     </button>
//                 </div>
//             </div>

//             {/* Tab content */}
//             <div className="mt-6">
//                 {activeTab === 'profile' ? <UserProfileTab /> : <ApplicationsTab />}
//             </div>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
//                         <div className="flex items-center justify-center text-red-500 mb-4">
//                             <span className="material-icons text-5xl">warning</span>
//                         </div>
//                         <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa ứng viên</h3>
//                         <p className="text-gray-600 mb-6 text-center">
//                             Bạn có chắc chắn muốn xóa ứng viên <span className="font-semibold">{user.name}</span>?<br />
//                             Tất cả thông tin và đơn ứng tuyển của ứng viên sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
//                         </p>
//                         <div className="flex justify-center space-x-4">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex-1"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteUser}
//                                 className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
//                             >
//                                 Xác nhận xóa
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserDetailPage;

