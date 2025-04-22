import React from "react";
import { Link } from "react-router-dom";
import {
    Facebook, Twitter, Instagram, Linkedin,
    Mail, Phone, MapPin, ChevronRight
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company info */}
                    <div>
                        <div className="mb-6">
                            <Link to="/" className="flex items-center">
                                <div className="flex items-center">
                                    <svg
                                        className="h-8 w-8 text-blue-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                    <span className="ml-2 text-xl font-semibold text-white">JobPortal - Van</span>
                                </div>
                            </Link>
                        </div>
                        <p className="text-gray-400 mb-6 pr-4">
                            Kết nối nhà tuyển dụng với nhân tài. Giúp bạn tìm kiếm cơ hội nghề nghiệp hoàn hảo và phát triển sự nghiệp.
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-blue-400 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-pink-600 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                            Truy cập nhanh
                            <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-blue-500"></span>
                        </h3>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/about-us" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Tìm việc làm
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For employers */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                            Dành cho nhà tuyển dụng
                            <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-blue-500"></span>
                        </h3>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link to="/post-job" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Đăng tin tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Bảng giá
                                </Link>
                            </li>
                            <li>
                                <Link to="/find-candidates" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Tìm ứng viên
                                </Link>
                            </li>
                            <li>
                                <Link to="/company-dashboard" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                                    <ChevronRight size={14} className="mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                    Quản lý tài khoản
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                            Liên hệ với chúng tôi
                            <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-blue-500"></span>
                        </h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Số 41, ngách 19, ngõ 217, trần phú, Hà Đông, T.P Hà Nội</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-3 text-blue-500 flex-shrink-0" />
                                <a href="tel:+84123456789" className="hover:text-blue-400 transition-colors duration-200">
                                    (84) 123 456 789
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-3 text-blue-500 flex-shrink-0" />
                                <a href="mailto:info@jobportal.com" className="hover:text-blue-400 transition-colors duration-200">
                                    van@jobportal.com
                                </a>
                            </li>
                        </ul>

                        {/* Newsletter subscription */}
                        <div className="mt-8">
                            <h4 className="text-sm font-semibold mb-3 text-gray-300">Đăng ký nhận tin mới</h4>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors duration-200"
                                >
                                    Gửi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer bottom - copyright, terms */}
                <div className="pt-8 border-t border-gray-800 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© {currentYear} JobPortal. Tất cả các quyền được bảo lưu.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-200">
                                Chính sách bảo mật
                            </Link>
                            <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors duration-200">
                                Điều khoản sử dụng
                            </Link>
                            <Link to="/sitemap" className="hover:text-blue-400 transition-colors duration-200">
                                Sơ đồ trang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
// import React from "react";
// import { assets } from "../assets/assets";

// const Footer = () => {
//     return (
//         <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20">
//             <img width={160} src={assets.logo} alt="" />
//             <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">Copyright @GreatStack.dev | All right reserved.</p>
//             <div className="flex gap-2.5 ">
//                 <img width={38} src={assets.facebook_icon} alt="" />
//                 <img width={38} src={assets.twitter_icon} alt="" />
//                 <img width={38} src={assets.instagram_icon} alt="" />
//             </div>
//         </div>
//     )
// }

// export default Footer