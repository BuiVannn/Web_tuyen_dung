import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ChevronUp, Bookmark, Rss, Share2 } from 'lucide-react';

// Layout component to wrap blog pages with common navigation and footer
const BlogLayout = ({ children }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const location = useLocation();

    // Track scroll position to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Reset scroll position when navigating between pages
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Toggle floating sidebar
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Custom navigation overlay for blog section */}
            <div className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300 hover:shadow">
                <Navbar />

                {/* Secondary navigation specific to blog */}
                <div className="border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-12">
                            <div className="flex space-x-4 text-sm">
                                <Link
                                    to="/blog"
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/blog' && !location.search
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Tất cả bài viết
                                </Link>
                                <Link
                                    to="/blog?category=Hướng%20nghiệp"
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${location.search.includes('category=H%C6%B0%E1%BB%9Bng%20nghi%E1%BB%87p')
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Hướng nghiệp
                                </Link>
                                <Link
                                    to="/blog?category=Phỏng%20vấn"
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${location.search.includes('category=Ph%E1%BB%8Fng%20v%E1%BA%A5n')
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Phỏng vấn
                                </Link>
                            </div>

                            <div className="hidden md:flex items-center space-x-2">
                                <button
                                    className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 flex items-center"
                                    onClick={toggleSidebar}
                                >
                                    <Bookmark size={16} className="mr-1.5" />
                                    Đã lưu
                                </button>
                                <a
                                    href="/rss.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 flex items-center"
                                >
                                    <Rss size={16} className="mr-1.5" />
                                    RSS
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content with subtle background pattern */}
            <main className="flex-grow bg-gray-50 relative">
                <div className="absolute inset-0 background-pattern opacity-20 pointer-events-none"></div>
                <div className="relative">
                    {children}
                </div>
            </main>

            {/* Blog-specific pre-footer section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Đăng ký nhận tin mới nhất</h2>
                    <p className="max-w-2xl mx-auto text-blue-100 mb-8">
                        Nhận thông báo khi có bài viết mới về hướng dẫn tìm việc, phỏng vấn và phát triển nghề nghiệp.
                    </p>

                    <form className="max-w-md mx-auto flex">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 py-3 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-0"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-blue-600 font-medium py-3 px-6 rounded-r-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>

            <Footer />

            {/* Floating bookmark/saved articles sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Bài viết đã lưu</h3>
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Sample content for saved articles */}
                    <div className="text-sm text-gray-600 text-center py-8">
                        <Bookmark size={24} className="mx-auto mb-2 text-gray-400" />
                        <p>Chưa có bài viết nào được lưu</p>
                        <p className="mt-2">Nhấn vào biểu tượng bookmark trên các bài viết để lưu trữ</p>
                    </div>
                </div>
            </div>

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 z-40 group"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform duration-200" />
                </button>
            )}

            {/* Social share floating button */}
            <div className="fixed bottom-8 left-8 z-40 hidden md:block">
                <div className="relative group">
                    <button className="p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl group-hover:-translate-y-1">
                        <Share2 size={20} />
                    </button>

                    <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="flex flex-col bg-white p-2 rounded-lg shadow-lg space-y-2">
                            <button className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button className="p-2 hover:bg-blue-50 rounded-full text-blue-400 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </button>
                            <button className="p-2 hover:bg-blue-50 rounded-full text-green-600 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 5H4a1 1 0 00-1 1v2h18V6a1 1 0 00-1-1zm-1 4H5v10a1 1 0 001 1h12a1 1 0 001-1V9zm-3 8h-8v-1h8v1zm-3-3h-5v-1h5v1z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for background pattern */}
            <style jsx="true">{`
                .background-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%233b82f6' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
};

export default BlogLayout;