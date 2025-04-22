import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import BlogLayout from '../components/BlogLayout';
import BlogSidebar from '../components/BlogSidebar';
import {
    Calendar, User, Tag, ArrowLeft, Clock, Share2,
    MessageCircle, Heart, Bookmark, ExternalLink,
    ChevronUp, Eye
} from 'lucide-react';

const BlogDetail = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const contentRef = useRef(null);

    const navigate = useNavigate();
    const { slug } = useParams();
    const { backendUrl, userToken, companyToken } = useContext(AppContext);

    // Fetch blog post data
    const fetchPostDetails = async (postSlug) => {
        if (!backendUrl || !postSlug) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${backendUrl}/api/blogs/${postSlug}`);
            if (response.data.success) {
                setPost(response.data.post);
                // Update document title with post title
                document.title = `${response.data.post.title} | Job Portal Blog`;
            } else {
                setError(response.data.message || "Không thể tải bài viết");
                toast.error(response.data.message || "Không thể tải bài viết");
            }
        } catch (err) {
            console.error("Lỗi khi tải chi tiết bài viết:", err);
            if (err.response && err.response.status === 404) {
                setError("Bài viết không tồn tại hoặc đã bị xóa");
            } else {
                setError("Lỗi máy chủ khi tải bài viết");
                toast.error(err.response?.data?.message || "Lỗi máy chủ");
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset document title when component unmounts
    useEffect(() => {
        return () => {
            document.title = 'Job Portal';
        };
    }, []);

    // Track scroll position to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch post data when slug changes
    useEffect(() => {
        fetchPostDetails(slug);
    }, [slug, backendUrl]);

    // Handle share functionality
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: `Xem bài viết này: ${post.title}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Đã sao chép liên kết vào clipboard!");
        }
    };

    // Open image in full screen/new tab
    const handleViewFullImage = () => {
        if (post?.featuredImage) {
            window.open(post.featuredImage, '_blank');
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Calculate reading time
    const getReadingTime = (content) => {
        if (!content) return '2 phút đọc';
        const wordsPerMinute = 200;
        const textOnly = content.replace(/<[^>]*>/g, '');
        const wordCount = textOnly.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} phút đọc`;
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <BlogLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-center items-center h-64">
                        <Loading />
                    </div>
                </div>
            </BlogLayout>
        );
    }

    if (error) {
        return (
            <BlogLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="bg-red-50 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
                        <h2 className="text-2xl font-bold text-red-700 mb-3">Không tìm thấy bài viết</h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/blog')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Quay lại Blog
                        </button>
                    </div>
                </div>
            </BlogLayout>
        );
    }

    if (!post) {
        return (
            <BlogLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500">
                    Không tìm thấy dữ liệu bài viết.
                </div>
            </BlogLayout>
        );
    }

    return (
        <BlogLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Main content */}
                    <article className="lg:w-3/4" ref={contentRef}>
                        {/* Hero section with featured image */}
                        {post.featuredImage && (
                            <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="relative">
                                    <div className="flex justify-center items-center bg-gray-50 py-4">
                                        <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${!imageLoaded ? 'min-h-[200px] flex items-center justify-center' : ''}`}>
                                            {!imageLoaded && (
                                                <div className="text-gray-400 flex items-center">
                                                    <Loading />
                                                </div>
                                            )}
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className={`w-full max-h-[400px] object-contain ${!imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
                                                onLoad={() => setImageLoaded(true)}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            {imageLoaded && (
                                                <button
                                                    onClick={handleViewFullImage}
                                                    className="absolute bottom-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-all duration-200 group"
                                                    title="Xem ảnh đầy đủ"
                                                >
                                                    <ExternalLink size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Back link */}
                        <div className="mb-8">
                            <Link
                                to="/blog"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                            >
                                <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform duration-200" />
                                Quay lại tất cả bài viết
                            </Link>
                        </div>

                        {/* Post header */}
                        <header className="mb-8">
                            {post.category && (
                                <div className="mb-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200 transition-colors duration-200">
                                        <MessageCircle size={14} className="mr-1.5" />
                                        {post.category}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-5">
                                <div className="flex items-center group">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 group-hover:bg-blue-200 transition-colors duration-200">
                                        {post.author?.avatar ? (
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentNode.innerHTML = '<User size={16} />';
                                                }}
                                            />
                                        ) : (
                                            <User size={16} />
                                        )}
                                    </div>
                                    <span className="group-hover:text-blue-600 transition-colors duration-200">
                                        {post.author?.name || 'Admin'}
                                    </span>
                                </div>

                                <div className="flex items-center group">
                                    <Calendar size={16} className="mr-1.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                    <span className="group-hover:text-blue-600 transition-colors duration-200">
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center group">
                                    <Clock size={16} className="mr-1.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                    <span className="group-hover:text-blue-600 transition-colors duration-200">
                                        {getReadingTime(post.content)}
                                    </span>
                                </div>

                                <div className="flex items-center group">
                                    <Eye size={16} className="mr-1.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                    <span className="group-hover:text-blue-600 transition-colors duration-200">
                                        {post.views || 0} lượt xem
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2 mb-8">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                            >
                                <Share2 size={16} className="mr-1.5" />
                                Chia sẻ
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all duration-200"
                            >
                                <Heart size={16} className="mr-1.5" />
                                Yêu thích
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
                            >
                                <Bookmark size={16} className="mr-1.5" />
                                Lưu
                            </button>
                        </div>

                        {/* Post content */}
                        <div
                            className="prose prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-md prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:transition-colors prose-a:duration-200 mb-10"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <Link
                                            key={index}
                                            to={`/blog?tag=${encodeURIComponent(tag)}`}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            <Tag size={14} className="mr-1.5 opacity-70" />
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Call to action for logged-in users */}
                        {(userToken || companyToken) && (
                            <div className="mt-10 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {userToken ? "Tìm Công Việc Mơ Ước Của Bạn" : "Tìm Ứng Viên Tài Năng"}
                                </h3>
                                <p className="text-gray-600 mb-5 leading-relaxed">
                                    {userToken
                                        ? "Sẵn sàng cho bước tiếp theo trong sự nghiệp? Khám phá các cơ hội việc làm phù hợp ngay bây giờ."
                                        : "Đang tìm kiếm ứng viên đủ năng lực? Đăng tin tuyển dụng và tiếp cận hàng nghìn người tìm việc."}
                                </p>
                                <Link
                                    to={userToken ? "/" : "/dashboard/add-job"}
                                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                                >
                                    {userToken ? "Tìm Việc Làm" : "Đăng Tin Tuyển Dụng"}
                                </Link>
                            </div>
                        )}

                        {/* Author information */}
                        {post.author && (
                            <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                                        {post.author.avatar ? (
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.author.name}</h3>
                                        <p className="text-gray-600 mb-3">{post.author.title || 'Tác giả'}</p>
                                        {post.author.bio && (
                                            <p className="text-gray-700">{post.author.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Back link */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <Link
                                to="/blog"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                            >
                                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                Quay lại tất cả bài viết
                            </Link>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:w-1/4 mt-10 lg:mt-0">
                        <div className="sticky top-24">
                            <BlogSidebar currentPostId={post._id} />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl z-50 group"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform duration-200" />
                </button>
            )}
        </BlogLayout>
    );
};

export default BlogDetail;