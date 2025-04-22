import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import {
    ArrowLeft, Edit, Calendar, User, Tag, Clock,
    FileText, CheckCircle, MessageSquare, Eye, ExternalLink
} from 'lucide-react';
import DOMPurify from 'dompurify';

const BlogPreview = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { id: blogId } = useParams();
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    // Fetch blog data
    useEffect(() => {
        const fetchBlogData = async () => {
            if (!blogId || !backendUrl) return;

            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    toast.error("Yêu cầu xác thực Admin.");
                    setLoading(false);
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get(`${backendUrl}/api/admin/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setBlog(response.data.post);
                } else {
                    toast.error(response.data.message || "Không tìm thấy bài viết.");
                    navigate('/admin/blogs');
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu bài viết:", error);
                toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải bài viết.");
                navigate('/admin/blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [blogId, backendUrl, navigate]);

    // Format date function 
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to publish blog
    const handlePublish = async () => {
        if (!blog || !blogId) return;

        try {
            setPublishing(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                return;
            }

            const response = await axios.put(
                `${backendUrl}/api/admin/blogs/${blogId}`,
                { status: 'published' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Bài viết đã được xuất bản thành công!');
                // Update local state
                setBlog({ ...blog, status: 'published' });
            } else {
                toast.error(response.data.message || "Xuất bản bài viết thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi xuất bản bài viết:", error);
            toast.error(error.response?.data?.message || "Lỗi máy chủ khi xuất bản bài viết.");
        } finally {
            setPublishing(false);
        }
    };

    // Function to view image in new tab
    const handleViewFullImage = () => {
        if (blog?.featuredImage) {
            window.open(blog.featuredImage, '_blank');
        }
    };

    // Render status badge
    const renderStatusBadge = (status) => {
        let colorClasses = 'bg-gray-100 text-gray-800';
        let text = 'Không xác định';
        let icon = null;

        switch (status?.toLowerCase()) {
            case 'published':
                colorClasses = 'bg-green-100 text-green-800';
                text = 'Đã xuất bản';
                icon = <CheckCircle size={14} className="mr-1" />;
                break;
            case 'draft':
                colorClasses = 'bg-amber-100 text-amber-800';
                text = 'Bản nháp';
                icon = <FileText size={14} className="mr-1" />;
                break;
            case 'archived':
                colorClasses = 'bg-blue-100 text-blue-800';
                text = 'Lưu trữ';
                icon = <Clock size={14} className="mr-1" />;
                break;
            default:
                text = status || 'N/A';
        }

        return (
            <span className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full ${colorClasses} transition duration-200 hover:shadow-sm`}>
                {icon}{text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center items-center h-64">
                        <Loading />
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">Không tìm thấy bài viết.</p>
                    <Link to="/admin/blogs" className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-200">
                        <ArrowLeft size={18} className="inline mr-1" /> Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <Link to="/admin/blogs" className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center mb-2 group">
                        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform duration-200" /> Quay lại danh sách
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-800">Xem trước bài viết</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 hover:shadow-md"
                    >
                        <Edit size={18} className="mr-2" />
                        Chỉnh sửa
                    </Link>

                    {blog.status !== 'published' && (
                        <button
                            onClick={handlePublish}
                            disabled={publishing}
                            className={`flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200 hover:shadow-md ${publishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Eye size={18} className="mr-2" />
                            {publishing ? 'Đang xuất bản...' : 'Xuất bản ngay'}
                        </button>
                    )}
                </div>
            </div>

            {/* Preview content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                {/* Blog title and meta */}
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>

                    <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>

                        <div className="flex items-center">
                            <User size={16} className="mr-2 text-blue-500" />
                            <span>{blog.author?.name || 'Admin'}</span>
                        </div>

                        <div>
                            {renderStatusBadge(blog.status)}
                        </div>

                        {blog.category && (
                            <div className="flex items-center">
                                <MessageSquare size={16} className="mr-2 text-blue-500" />
                                <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded-md text-xs font-medium hover:bg-blue-100 transition duration-200">
                                    {blog.category}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured image - improved display */}
                {blog.featuredImage && (
                    <div className="relative border-b border-gray-100">
                        <div className="flex justify-center items-center bg-gray-50 py-4 px-4">
                            <div className={`relative rounded-md overflow-hidden transition-all duration-300 ${!imageLoaded ? 'min-h-[200px] flex items-center justify-center' : ''}`}>
                                {!imageLoaded && (
                                    <div className="text-gray-400">Đang tải ảnh...</div>
                                )}
                                <img
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                    className={`max-w-full max-h-[350px] object-contain rounded shadow-sm hover:shadow-md transition-shadow duration-300 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => setImageLoaded(true)}
                                />

                                {/* Click to view full image */}
                                {imageLoaded && (
                                    <button
                                        onClick={handleViewFullImage}
                                        className="absolute bottom-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition duration-200 group"
                                        title="Xem ảnh đầy đủ"
                                    >
                                        <ExternalLink size={16} className="group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status indicator */}
                        {blog.status !== 'published' && (
                            <div className="absolute top-4 right-4">
                                <div className={`
                                    px-3 py-1 rounded-md font-medium text-sm shadow-sm
                                    ${blog.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
                                    hover:shadow transition duration-200
                                `}>
                                    {blog.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Blog content */}
                <div className="p-6">
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2 items-center">
                            <Tag size={16} className="text-blue-500" />
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-200 transition duration-200 cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Blog content */}
                    <div className="prose prose-lg max-w-none mt-6 prose-headings:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:transition-colors prose-a:duration-200">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(blog.content)
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Blog info card - improved */}
            <div className="bg-white rounded-lg shadow-md my-6 p-6 hover:shadow-lg transition duration-300">
                <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b">Thông tin bài viết</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-start group">
                        <div className="text-blue-500 mr-4 pt-0.5 group-hover:scale-110 transition-transform duration-200">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">ID</p>
                            <p className="text-sm font-mono text-gray-600 hover:text-gray-900 transition-colors duration-200">{blog._id}</p>
                        </div>
                    </div>

                    <div className="flex items-start group">
                        <div className="text-blue-500 mr-4 pt-0.5 group-hover:scale-110 transition-transform duration-200">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Tạo lúc</p>
                            <p className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">{formatDate(blog.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-start group">
                        <div className="text-blue-500 mr-4 pt-0.5 group-hover:scale-110 transition-transform duration-200">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Cập nhật</p>
                            <p className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">{formatDate(blog.updatedAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-start group">
                        <div className="text-blue-500 mr-4 pt-0.5 group-hover:scale-110 transition-transform duration-200">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Tác giả</p>
                            <p className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">{blog.author?.name || 'Admin'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-between items-center pb-8">
                <Link
                    to="/admin/blogs"
                    className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center group"
                >
                    <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                    Quay lại danh sách
                </Link>

                <div className="flex gap-3">
                    <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 hover:shadow-md"
                    >
                        <Edit size={18} className="mr-2" />
                        Chỉnh sửa
                    </Link>

                    {blog.status !== 'published' && (
                        <button
                            onClick={handlePublish}
                            disabled={publishing}
                            className={`flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200 hover:shadow-md ${publishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Eye size={18} className="mr-2" />
                            {publishing ? 'Đang xuất bản...' : 'Xuất bản ngay'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPreview;