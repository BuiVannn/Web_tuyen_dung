import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import BlogLayout from '../components/BlogLayout';
import BlogCard from '../components/BlogCard';
import BlogSidebar from '../components/BlogSidebar';
import {
    ArrowLeft, ArrowRight, BookOpen, Search, X, Filter,
    CheckCircle, Tag, Calendar, RefreshCw, Lightbulb
} from 'lucide-react';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [fadeIn, setFadeIn] = useState(false);

    const { backendUrl } = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams();

    // Get all search parameters
    const getSearchParameters = () => {
        const page = parseInt(searchParams.get('page')) || 1;
        const category = searchParams.get('category') || '';
        const tag = searchParams.get('tag') || '';
        const search = searchParams.get('search') || '';
        return { page, category, tag, search };
    };

    // Update active filters display
    useEffect(() => {
        const { category, tag, search } = getSearchParameters();
        const newFilters = [];

        if (category) newFilters.push({ type: 'category', value: category });
        if (tag) newFilters.push({ type: 'tag', value: tag });
        if (search) newFilters.push({ type: 'search', value: search });

        setActiveFilters(newFilters);

        // Set search term from URL if present
        if (search && searchTerm !== search) {
            setSearchTerm(search);
        }
    }, [searchParams]);

    // Fade in animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeIn(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Fetch blog posts with filters and pagination
    const fetchPublishedPosts = async () => {
        if (!backendUrl) return;

        const { page, category, tag, search } = getSearchParameters();
        setCurrentPage(page);

        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/blogs`, {
                params: {
                    page,
                    limit: 9,
                    category,
                    tag,
                    search
                }
            });

            if (response.data.success) {
                setPosts(response.data.posts || []);
                setCurrentPage(response.data.currentPage || 1);
                setTotalPages(response.data.totalPages || 1);
                setTotalPosts(response.data.totalPosts || 0);

                // Extract categories and tags for filters
                if (response.data.posts && response.data.posts.length) {
                    const allCategories = [...new Set(
                        response.data.posts
                            .map(post => post.category)
                            .filter(cat => cat && cat.trim() !== '')
                    )];

                    const allTags = [...new Set(
                        response.data.posts.flatMap(post => post.tags || [])
                            .filter(tag => tag && tag.trim() !== '')
                    )];

                    setCategories(allCategories);
                    setTags(allTags);
                }
            } else {
                toast.error(response.data.message || "Không thể tải bài viết");
            }
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải bài viết");
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data when search parameters change
    useEffect(() => {
        fetchPublishedPosts();
    }, [searchParams, backendUrl]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const { category, tag, search } = getSearchParameters();
        const newParams = { page: newPage.toString() };

        if (category) newParams.category = category;
        if (tag) newParams.tag = tag;
        if (search) newParams.search = search;

        setSearchParams(newParams);

        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const { category, tag } = getSearchParameters();
        const newParams = { page: '1' };

        if (category) newParams.category = category;
        if (tag) newParams.tag = tag;
        if (searchTerm.trim()) newParams.search = searchTerm.trim();

        setSearchParams(newParams);
    };

    // Remove a specific filter
    const removeFilter = (type, value) => {
        const { category, tag, search } = getSearchParameters();
        const newParams = { page: '1' };

        if (type !== 'category' && category) newParams.category = category;
        if (type !== 'tag' && tag) newParams.tag = tag;
        if (type !== 'search' && search) newParams.search = search;

        if (type === 'search') {
            setSearchTerm('');
        }

        setSearchParams(newParams);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setSearchParams({ page: '1' });
    };

    // Check if any filter is active
    const isFilterActive = () => {
        return activeFilters.length > 0;
    };

    // Format the display text for filter types
    const formatFilterType = (type) => {
        switch (type) {
            case 'category': return 'Danh mục';
            case 'tag': return 'Tag';
            case 'search': return 'Tìm kiếm';
            default: return type;
        }
    };

    return (
        <BlogLayout>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                {/* Hero section with gradient background */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 mb-12 shadow-lg transform transition-transform hover:scale-[1.01] duration-300">
                    <div className="absolute inset-0 bg-white/10 background-pattern opacity-20"></div>
                    <div className="relative z-10 px-6 py-16 md:py-20 text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                            Blog Kiến Thức & Bài Viết Hướng Nghiệp
                        </h1>
                        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                            Cập nhật xu hướng mới nhất, lời khuyên nghề nghiệp và tin tức ngành để
                            hỗ trợ hành trình phát triển sự nghiệp của bạn.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/resources/career-advice"
                                className="inline-flex items-center px-5 py-3 rounded-full bg-white text-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 hover:-translate-y-1"
                            >
                                <Lightbulb size={18} className="mr-2" />
                                Tư vấn nghề nghiệp
                            </Link>
                            <Link
                                to="/resources/interview-tips"
                                className="inline-flex items-center px-5 py-3 rounded-full bg-blue-800 bg-opacity-30 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-opacity-40 hover:-translate-y-1 backdrop-blur"
                            >
                                <BookOpen size={18} className="mr-2" />
                                Mẹo phỏng vấn
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search and filters section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        {/* Search form */}
                        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 md:max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm bài viết..."
                                    className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Filter toggle button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors duration-200 group"
                        >
                            <Filter size={18} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                            <span>{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
                        </button>
                    </div>

                    {/* Active filters display */}
                    {isFilterActive() && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
                            {activeFilters.map((filter, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 group hover:bg-blue-100 transition-colors duration-200"
                                >
                                    <span className="text-blue-500 mr-1">{formatFilterType(filter.type)}:</span>
                                    {filter.value}
                                    <button
                                        onClick={() => removeFilter(filter.type, filter.value)}
                                        className="ml-1.5 p-0.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200 group-hover:rotate-90 transform"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="ml-2 text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors duration-200 group"
                            >
                                <RefreshCw size={14} className="mr-1 group-hover:rotate-180 transition-transform duration-500" />
                                Xóa tất cả
                            </button>
                        </div>
                    )}

                    {/* Filter options panel (expandable) */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown">
                            {/* Categories filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Tag size={16} className="mr-1.5 text-blue-500" />
                                    Danh mục
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.length > 0 ? (
                                        categories.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/blog?category=${encodeURIComponent(category)}`}
                                                className={`px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${searchParams.get('category') === category
                                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                                    }`}
                                            >
                                                {searchParams.get('category') === category && (
                                                    <CheckCircle size={10} className="inline mr-1" />
                                                )}
                                                {category}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">Không có danh mục nào.</span>
                                    )}
                                </div>
                            </div>

                            {/* Tags filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Tag size={16} className="mr-1.5 text-blue-500" />
                                    Tags phổ biến
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.length > 0 ? (
                                        tags.slice(0, 10).map((tag, index) => (
                                            <Link
                                                key={index}
                                                to={`/blog?tag=${encodeURIComponent(tag)}`}
                                                className={`px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${searchParams.get('tag') === tag
                                                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                                                    }`}
                                            >
                                                {searchParams.get('tag') === tag && (
                                                    <CheckCircle size={10} className="inline mr-1" />
                                                )}
                                                {tag}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">Không có tag nào.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main content */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
                                <Loading />
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                {/* Post stats summary */}
                                <div className="mb-6 text-sm text-gray-600 flex items-center bg-white rounded-lg shadow-sm px-4 py-3 border-l-4 border-blue-500">
                                    <span className="font-medium text-blue-800 mr-1">
                                        {totalPosts}
                                    </span>
                                    bài viết{isFilterActive() ? ' phù hợp với bộ lọc của bạn' : ''}
                                    {isFilterActive() && (
                                        <span className="ml-2 text-gray-500">
                                            (trang {currentPage}/{totalPages})
                                        </span>
                                    )}
                                </div>

                                {/* Blog post grid with animation */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                    {posts.map((post, index) => (
                                        <div
                                            key={post._id}
                                            className="animate-fadeIn"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <BlogCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-12">
                                        <nav className="flex items-center space-x-2" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 ${currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
                                                    }`}
                                            >
                                                <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform duration-200" />
                                                <span>Trước</span>
                                            </button>

                                            <div className="hidden sm:flex space-x-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                                                    .map((page, index, arr) => (
                                                        <React.Fragment key={page}>
                                                            {index > 0 && page - arr[index - 1] > 1 && (
                                                                <span className="px-3 py-2 text-gray-500 select-none">...</span>
                                                            )}
                                                            <button
                                                                onClick={() => handlePageChange(page)}
                                                                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ${currentPage === page
                                                                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
                                                                    }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        </React.Fragment>
                                                    ))}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 ${currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
                                                    }`}
                                            >
                                                <span>Tiếp</span>
                                                <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 text-blue-500">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    {isFilterActive()
                                        ? "Không có bài viết nào phù hợp với bộ lọc của bạn. Hãy thử lại với bộ lọc khác."
                                        : "Hiện tại chưa có bài viết nào. Vui lòng quay lại sau!"}
                                </p>

                                {isFilterActive() && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group"
                                    >
                                        <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                                        Xóa tất cả bộ lọc
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                            <BlogSidebar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS animation keyframes */}
            <style jsx="true">{`
                .background-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                
                .animate-fadeIn {
                    opacity: 0;
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </BlogLayout>
    );
};

export default Blog;