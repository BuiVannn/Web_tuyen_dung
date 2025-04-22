import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Clock, MessageSquare } from 'lucide-react';

const BlogCard = ({ post }) => {
    if (!post) return null;

    // Generate excerpt from content if needed
    const generateExcerpt = (htmlContent, length = 120) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const text = tempDiv.textContent || tempDiv.innerText || "";
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    const excerpt = post.excerpt || generateExcerpt(post.content || '');

    // Calculate reading time
    const getReadingTime = (content) => {
        if (!content) return '2 phút';
        const wordsPerMinute = 200;
        const textOnly = content.replace(/<[^>]*>/g, '');
        const wordCount = textOnly.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} phút`;
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Link
            to={`/blog/${post.slug}`}
            className="block group bg-white rounded-lg shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1"
        >
            {/* Image container - cải thiện hiển thị ảnh */}
            {post.featuredImage ? (
                <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/640x360?text=Job+Portal+Blog';
                        }}
                    />

                    {/* Gradient overlay để làm nổi bật các phần tử trên ảnh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category tag - đưa lên trên ảnh */}
                    {post.category && (
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white shadow-md">
                                <MessageSquare size={12} className="mr-1" />
                                {post.category}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                /* Fallback nếu không có ảnh */
                <div className="h-32 flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
                    {post.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700 shadow-sm">
                            <MessageSquare size={12} className="mr-1" />
                            {post.category}
                        </span>
                    )}
                </div>
            )}

            {/* Content container */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Tags list */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                                <Tag size={10} className="inline mr-1" />
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                +{post.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-2 transition-colors duration-200">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {excerpt}
                </p>

                {/* Meta information */}
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center group/author">
                        {/* Author avatar or icon */}
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2 overflow-hidden group-hover/author:bg-blue-200 transition-colors duration-200">
                            {post.author?.avatar ? (
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.parentNode.innerHTML = '<User size={12} />';
                                    }}
                                />
                            ) : (
                                <User size={12} />
                            )}
                        </div>
                        <span className="group-hover/author:text-blue-600 transition-colors duration-200">
                            {post.author?.name || 'Admin'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Reading time */}
                        <div className="flex items-center group/time">
                            <Clock size={14} className="mr-1 text-gray-400 group-hover/time:text-blue-500 transition-colors duration-200" />
                            <span className="group-hover/time:text-blue-600 transition-colors duration-200">
                                {getReadingTime(post.content)}
                            </span>
                        </div>

                        {/* Publication date */}
                        {post.createdAt && (
                            <div className="flex items-center group/date">
                                <Calendar size={14} className="mr-1 text-gray-400 group-hover/date:text-blue-500 transition-colors duration-200" />
                                <span className="group-hover/date:text-blue-600 transition-colors duration-200">
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;