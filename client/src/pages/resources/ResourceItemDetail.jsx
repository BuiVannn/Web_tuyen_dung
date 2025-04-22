import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import { BsArrowLeft, BsBookmark, BsBarChart, BsPen, BsArrowRight, BsShare } from 'react-icons/bs';
import { MdOutlineSchool, MdMessage, MdDiversity3 } from 'react-icons/md';
import '../../styles/ResourceItemDetail.css'; // Import CSS styles for the component
const ResourceItemDetail = () => {
    const { resourceType, itemSlug } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);

    const [item, setItem] = useState(null);
    const [resourceInfo, setResourceInfo] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Map cho resource type và icons, màu sắc tương ứng
    const resourceInfoMap = {
        "cv-templates": {
            icon: <BsBookmark size={26} />,
            color: "blue",
            header: "from-blue-600 to-blue-800",
            text: "text-blue-600",
            lightBg: "bg-blue-50",
            border: "border-blue-100",
            buttonText: "text-blue-600"
        },
        "courses": {
            icon: <MdOutlineSchool size={28} />,
            color: "indigo",
            header: "from-indigo-600 to-indigo-800",
            text: "text-indigo-600",
            lightBg: "bg-indigo-50",
            border: "border-indigo-100",
            buttonText: "text-indigo-600"
        },
        "market-insights": {
            icon: <BsBarChart size={26} />,
            color: "green",
            header: "from-green-600 to-green-800",
            text: "text-green-600",
            lightBg: "bg-green-50",
            border: "border-green-100",
            buttonText: "text-green-600"
        },
        "community": {
            icon: <MdMessage size={28} />,
            color: "yellow",
            header: "from-yellow-500 to-yellow-700",
            text: "text-yellow-600",
            lightBg: "bg-yellow-50",
            border: "border-yellow-100",
            buttonText: "text-yellow-600"
        },
        "career-blog": {
            icon: <BsPen size={26} />,
            color: "purple",
            header: "from-purple-600 to-purple-800",
            text: "text-purple-600",
            lightBg: "bg-purple-50",
            border: "border-purple-100",
            buttonText: "text-purple-600"
        },
        "events": {
            icon: <MdDiversity3 size={28} />,
            color: "red",
            header: "from-red-600 to-red-800",
            text: "text-red-600",
            lightBg: "bg-red-50",
            border: "border-red-100",
            buttonText: "text-red-600"
        }
    };

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                setLoading(true);

                if (!resourceType || !itemSlug || !backendUrl) {
                    throw new Error("Missing required parameters");
                }

                const response = await axios.get(`${backendUrl}/api/resources/${resourceType}/${itemSlug}`);

                if (response.data.success) {
                    setItem(response.data.item);
                    setResourceInfo(response.data.resourceInfo);
                    setRelatedItems(response.data.relatedItems || []);
                } else {
                    setError(response.data.message || "Không thể tải thông tin tài nguyên");
                }
            } catch (error) {
                console.error("Error fetching resource item:", error);
                setError(error.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin");
            } finally {
                setLoading(false);
            }
        };

        fetchItemData();

        // Scroll to top when navigating to this page
        window.scrollTo(0, 0);
    }, [resourceType, itemSlug, backendUrl]);

    // Trích xuất thông tin màu sắc dựa trên resource type
    const getResourceStyleInfo = () => {
        const info = resourceInfoMap[resourceType] || {
            color: "blue",
            header: "from-blue-600 to-blue-800",
            text: "text-blue-600",
            lightBg: "bg-blue-50",
            border: "border-blue-100",
            buttonText: "text-blue-600"
        };
        return info;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-[500px]">
                    <Loading />
                </div>
                <Footer />
            </>
        );
    }

    if (error || !item) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài nguyên</h2>
                        <p className="text-gray-600 mb-8">{error || 'Tài nguyên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}</p>
                        <Link to={`/resources/${resourceType}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200">
                            Quay lại danh sách tài nguyên
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const styleInfo = getResourceStyleInfo();
    const currentResourceInfo = resourceInfoMap[resourceType];

    // Function để render nội dung từ HTML string
    const renderHTMLContent = (htmlString) => {
        return { __html: htmlString || `<p>${item.description}</p>` };
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb & Back Button */}
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(`/resources/${resourceType}`)}
                            className="flex items-center text-gray-600 hover:text-blue-600 group transition-colors"
                        >
                            <BsArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span>Quay lại danh sách tài nguyên</span>
                        </button>

                        <div className="text-sm breadcrumbs">
                            <ul className="flex items-center space-x-2 text-gray-500">
                                <li><Link to="/" className="hover:text-gray-800">Trang chủ</Link></li>
                                <span>/</span>
                                <li><Link to="/resources" className="hover:text-gray-800">Tài nguyên</Link></li>
                                <span>/</span>
                                <li><Link to={`/resources/${resourceType}`} className="hover:text-gray-800">{resourceInfo?.title}</Link></li>
                                <span>/</span>
                                <li className="text-gray-800 font-medium truncate max-w-[200px]">{item.title}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto mb-12">
                        {/* Hero Image */}
                        <div className="relative h-80 overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/1200x400?text=Resource+Image';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                <div className="p-8 text-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-white">{currentResourceInfo?.icon}</div>
                                        </div>
                                        <Link
                                            to={`/resources/${resourceType}`}
                                            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                                        >
                                            {resourceInfo?.title}
                                        </Link>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold">{item.title}</h1>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            {/* Share & Date Info */}
                            <div className="flex flex-wrap justify-between items-center pb-6 mb-8 border-b border-gray-100">
                                <button
                                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors gap-2"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: item.title,
                                                text: item.description,
                                                url: window.location.href,
                                            });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Đã sao chép link vào clipboard!');
                                        }
                                    }}
                                >
                                    <BsShare size={16} />
                                    <span className="text-sm">Chia sẻ tài nguyên</span>
                                </button>
                                <div className="text-sm text-gray-500">
                                    Cập nhật: {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>

                            {/* Main article content */}
                            <div className="prose prose-lg max-w-none">
                                <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Render HTML content if available */}
                                {item.content ? (
                                    <div
                                        dangerouslySetInnerHTML={renderHTMLContent(item.content)}
                                        className="resource-content"
                                    />
                                ) : (
                                    // Fallback content when no detailed content is available
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Tổng quan</h2>
                                        <p className="text-gray-700">
                                            {item.description}
                                        </p>

                                        <blockquote className={`${styleInfo.lightBg} border-l-4 ${styleInfo.border} pl-4 py-2 my-6`}>
                                            <p className="italic text-gray-700">
                                                "Tài nguyên này giúp bạn nâng cao kỹ năng và kiến thức trong lĩnh vực {resourceInfo?.title?.toLowerCase()}."
                                            </p>
                                        </blockquote>

                                        <h2 className="text-2xl font-bold text-gray-800 mt-8">Lợi ích chính</h2>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                            <li>Cập nhật kiến thức mới nhất trong lĩnh vực</li>
                                            <li>Nâng cao kỹ năng chuyên môn</li>
                                            <li>Tăng cơ hội việc làm</li>
                                            <li>Phát triển sự nghiệp bền vững</li>
                                        </ul>

                                        <div className="my-8">
                                            <h2 className="text-2xl font-bold text-gray-800">Cách sử dụng tài nguyên này</h2>
                                            <p className="text-gray-700 mb-4">
                                                Để tận dụng tối đa tài nguyên này, bạn nên:
                                            </p>
                                            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                                                <li>Nghiên cứu kỹ nội dung</li>
                                                <li>Áp dụng kiến thức vào thực tế</li>
                                                <li>Thực hành thường xuyên</li>
                                                <li>Theo dõi cập nhật mới nhất</li>
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Section */}
                            {item.link && (
                                <div className={`mt-12 bg-gradient-to-r ${styleInfo.header} rounded-xl overflow-hidden`}>
                                    <div className="px-8 py-6 text-white relative">
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">Bạn muốn tìm hiểu thêm?</h3>
                                                <p className="text-white/90 max-w-xl">
                                                    Khám phá thêm tài nguyên này và nâng cao kỹ năng của bạn ngay hôm nay!
                                                </p>
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center whitespace-nowrap"
                                            >
                                                <span className={styleInfo.buttonText}>Truy cập tài nguyên</span>
                                                <BsArrowRight className={`ml-2 ${styleInfo.buttonText}`} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related items section */}
                    {relatedItems.length > 0 && (
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tài nguyên liên quan</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedItems.map((relatedItem, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/resources/${resourceType}/${relatedItem.slug}`}
                                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                                    >
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={relatedItem.image}
                                                alt={relatedItem.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Resource';
                                                }}
                                            />
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h4 className={`font-semibold ${styleInfo.text} text-lg mb-2 group-hover:underline`}>
                                                {relatedItem.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm flex-grow">{relatedItem.description}</p>
                                            <div className="flex items-center text-gray-500 mt-4 group-hover:text-gray-700">
                                                <span className="text-sm">Khám phá</span>
                                                <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResourceItemDetail;