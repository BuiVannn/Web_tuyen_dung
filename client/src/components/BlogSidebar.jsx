import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import {
    Calendar, Tag, TrendingUp, Search, BookOpen,
    MessageCircle, User, Eye, ChevronRight
} from 'lucide-react';

const BlogSidebar = ({ currentPostId }) => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        const fetchSidebarData = async () => {
            if (!backendUrl) return;

            try {
                // Fetch popular posts (top 5 by views)
                const postsResponse = await axios.get(`${backendUrl}/api/blogs`, {
                    params: {
                        page: 1,
                        limit: 8,
                        sortBy: 'views'
                    }
                });

                if (postsResponse.data.success) {
                    // Filter out current post if it's in the list
                    const filteredPosts = currentPostId
                        ? postsResponse.data.posts.filter(post => post._id !== currentPostId).slice(0, 4)
                        : postsResponse.data.posts.slice(0, 4);

                    setPopularPosts(filteredPosts);

                    // Extract unique categories from posts
                    const uniqueCategories = [...new Set(
                        postsResponse.data.posts
                            .map(post => post.category)
                            .filter(category => category && category.trim() !== '')
                    )];
                    setCategories(uniqueCategories);

                    // Extract unique tags from posts
                    const allTags = postsResponse.data.posts.flatMap(post => post.tags || [])
                        .filter(tag => tag && tag.trim() !== '');

                    // Count tag frequency
                    const tagCount = allTags.reduce((acc, tag) => {
                        acc[tag] = (acc[tag] || 0) + 1;
                        return acc;
                    }, {});

                    // Sort tags by frequency and get top 8
                    const sortedTags = Object.keys(tagCount)
                        .sort((a, b) => tagCount[b] - tagCount[a])
                        .slice(0, 8);

                    setTags(sortedTags);
                }
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSidebarData();
    }, [backendUrl, currentPostId]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/blog?search=${encodeURIComponent(searchTerm.trim())}`;
        }
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex space-x-3">
                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-7 w-16 bg-gray-200 rounded-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search Box */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                        <ChevronRight size={20} className="transform transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                </form>
            </div>

            {/* Popular Posts Section */}
            {popularPosts.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp size={18} className="mr-2 text-blue-500" />
                        Bài viết nổi bật
                    </h3>
                    <div className="space-y-4 divide-y divide-gray-100">
                        {popularPosts.map((post, index) => (
                            <Link
                                key={post._id}
                                to={`/blog/${post.slug}`}
                                className={`flex items-start space-x-3 group ${index > 0 ? 'pt-4' : ''}`}
                            >
                                {post.featuredImage ? (
                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Blog'; }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-blue-500">
                                        <BookOpen size={20} />
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors duration-200">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center flex-wrap mt-1 gap-2">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar size={12} className="mr-1" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                        {post.views > 0 && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Eye size={12} className="mr-1" />
                                                <span>{post.views}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100">
                        <Link
                            to="/blog"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                        >
                            Xem tất cả bài viết
                            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MessageCircle size={18} className="mr-2 text-blue-500" />
                        Danh mục
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/blog?category=${encodeURIComponent(category)}`}
                                className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border border-gray-100 hover:border-blue-100"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Tags Cloud */}
            {tags.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Tag size={18} className="mr-2 text-blue-500" />
                        Tags phổ biến
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <Link
                                key={index}
                                to={`/blog?tag=${encodeURIComponent(tag)}`}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-full hover:bg-indigo-100 transition-colors duration-200"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Join Community CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                    <User size={80} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tham gia cộng đồng</h3>
                <p className="text-sm text-gray-600 mb-4">Kết nối với những người cùng chí hướng và mở rộng mạng lưới nghề nghiệp của bạn.</p>
                <a
                    href="/community"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
                >
                    Tham gia ngay
                    <ChevronRight size={16} className="ml-1" />
                </a>
            </div>
        </div>
    );
};

export default BlogSidebar;