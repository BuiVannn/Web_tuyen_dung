import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BsBookmark, BsBarChart, BsPen, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
import { AppContext } from "../../context/AppContext";

const ResourceDetail = () => {
    const { resourceType } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedResources, setRelatedResources] = useState([]);

    // Map cho resource type và icons, màu sắc tương ứng
    const resourceInfoMap = {
        "cv-templates": {
            icon: <BsBookmark size={26} />,
            color: "blue",
            title: "Hướng dẫn viết CV",
            heading: "Tạo CV chuyên nghiệp thu hút nhà tuyển dụng",
            description: "CV là cơ hội đầu tiên để bạn gây ấn tượng với nhà tuyển dụng. Một CV được thiết kế tốt sẽ giúp bạn nổi bật giữa hàng trăm ứng viên khác."
        },
        "courses": {
            icon: <MdOutlineSchool size={28} />,
            color: "indigo",
            title: "Khóa học kỹ năng",
            heading: "Nâng cao kỹ năng với các khóa học chất lượng",
            description: "Trong thị trường việc làm cạnh tranh, việc liên tục cập nhật và nâng cao kỹ năng là điều cần thiết để duy trì lợi thế cạnh tranh."
        },
        "market-insights": {
            icon: <BsBarChart size={26} />,
            color: "green",
            title: "Thống kê thị trường",
            heading: "Những số liệu và xu hướng mới nhất về thị trường lao động",
            description: "Hiểu rõ về mức lương, kỹ năng được săn đón và cơ hội nghề nghiệp trong các ngành để có định hướng nghề nghiệp phù hợp."
        },
        "community": {
            icon: <MdMessage size={28} />,
            color: "yellow",
            title: "Cộng đồng hỗ trợ",
            heading: "Kết nối với cộng đồng chuyên gia và người tìm việc",
            description: "Tham gia vào cộng đồng để đặt câu hỏi, chia sẻ kinh nghiệm và học hỏi từ những người đi trước trong ngành của bạn."
        },
        "career-blog": {
            icon: <BsPen size={26} />,
            color: "purple",
            title: "Blog tư vấn nghề nghiệp",
            heading: "Lời khuyên về nghề nghiệp từ chuyên gia",
            description: "Cập nhật các bài viết với các chiến lược phát triển sự nghiệp, kỹ năng phỏng vấn và thông tin ngành từ các chuyên gia."
        },
        "events": {
            icon: <MdDiversity3 size={28} />,
            color: "red",
            title: "Sự kiện tuyển dụng",
            heading: "Các sự kiện tuyển dụng và hội thảo nghề nghiệp",
            description: "Kết nối trực tiếp với nhà tuyển dụng và chuyên gia thông qua các sự kiện trực tuyến và ngoại tuyến."
        }
    };

    // Dữ liệu fallback nếu API không có dữ liệu chi tiết
    const fallbackData = {
        'courses': {
            title: 'Khóa học kỹ năng',
            description: 'Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến',
            actions: [
                { text: 'Khám phá khóa học', link: '#', primary: true },
                { text: 'Tìm hiểu thêm', link: '#', primary: false }
            ],
            items: []
        },
        'cv-templates': {
            title: 'Mẫu CV và Hướng dẫn',
            description: 'Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao',
            actions: [
                { text: 'Xem mẫu CV', link: '#', primary: true },
                { text: 'Tải xuống', link: '#', primary: false }
            ],
            items: []
        },
        // Thêm các loại tài nguyên khác
    };
    // Tìm đoạn useEffect và cập nhật như sau:

    useEffect(() => {
        const fetchResource = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("Đang gọi API:", `${backendUrl}/api/resources/${resourceType}`);

                const response = await axios.get(`${backendUrl}/api/resources/${resourceType}`);

                if (response.data.success) {
                    setResource(response.data.resource);
                    setRelatedResources(response.data.relatedResources || []);
                } else {
                    console.error("API trả về lỗi:", response.data);
                    setError(response.data.message || "Không thể tải tài nguyên");

                    // Sử dụng dữ liệu dự phòng 
                    if (fallbackData && fallbackData[resourceType]) {
                        console.log("Sử dụng dữ liệu dự phòng:", fallbackData[resourceType]);
                        setResource(fallbackData[resourceType]);
                    }
                }
            } catch (error) {
                console.error("Error fetching resource:", error);
                setError("Đã xảy ra lỗi khi tải tài nguyên");

                // Sử dụng dữ liệu dự phòng trong trường hợp lỗi
                if (fallbackData && fallbackData[resourceType]) {
                    console.log("Sử dụng dữ liệu dự phòng:", fallbackData[resourceType]);
                    setResource(fallbackData[resourceType]);
                }
            } finally {
                setLoading(false);
            }
        };

        if (resourceType && backendUrl) {
            fetchResource();
        }
    }, [resourceType, backendUrl]);

    // Trích xuất thông tin màu sắc dựa trên resource type
    const getResourceStyleInfo = () => {
        const info = resourceInfoMap[resourceType] || { color: "blue" };
        const colorClasses = {
            blue: {
                header: "from-blue-600 to-blue-700",
                text: "text-blue-600",
                lightBg: "bg-blue-50",
                border: "border-blue-100",
                buttonHover: "hover:bg-blue-50",
                buttonText: "text-blue-700"
            },
            indigo: {
                header: "from-indigo-600 to-indigo-700",
                text: "text-indigo-600",
                lightBg: "bg-indigo-50",
                border: "border-indigo-100",
                buttonHover: "hover:bg-indigo-50",
                buttonText: "text-indigo-700"
            },
            green: {
                header: "from-green-600 to-green-700",
                text: "text-green-600",
                lightBg: "bg-green-50",
                border: "border-green-100",
                buttonHover: "hover:bg-green-50",
                buttonText: "text-green-700"
            },
            yellow: {
                header: "from-amber-500 to-amber-600",
                text: "text-amber-600",
                lightBg: "bg-amber-50",
                border: "border-amber-100",
                buttonHover: "hover:bg-amber-50",
                buttonText: "text-amber-700"
            },
            purple: {
                header: "from-purple-600 to-purple-700",
                text: "text-purple-600",
                lightBg: "bg-purple-50",
                border: "border-purple-100",
                buttonHover: "hover:bg-purple-50",
                buttonText: "text-purple-700"
            },
            red: {
                header: "from-red-600 to-red-700",
                text: "text-red-600",
                lightBg: "bg-red-50",
                border: "border-red-100",
                buttonHover: "hover:bg-red-50",
                buttonText: "text-red-700"
            }
        };

        return colorClasses[info.color];
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (error && !resource) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài nguyên</h2>
                    <p className="text-gray-600 mb-6">Tài nguyên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const styleInfo = getResourceStyleInfo();
    const currentResourceInfo = resourceInfoMap[resourceType];

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 group transition-colors"
                    >
                        <BsArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại tài nguyên</span>
                    </button>

                    {/* Header */}
                    <div className={`bg-gradient-to-r ${styleInfo.header} rounded-t-xl shadow-lg overflow-hidden`}>
                        <div className="relative py-16 px-8 text-white z-10">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
                            <div className="max-w-4xl mx-auto relative z-10">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-6">
                                        <div className={styleInfo.text}>{currentResourceInfo?.icon}</div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold">{resource.title}</h1>
                                </div>
                                <p className="text-xl text-white/90 mt-4 max-w-3xl">{resource.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-b-xl shadow-lg p-8 max-w-6xl mx-auto mb-12">
                        {/* Intro Section with icon boxes */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            <div className={`p-6 rounded-xl ${styleInfo.lightBg} ${styleInfo.border}`}>
                                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 ${styleInfo.text}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                        <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                        <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">Đa dạng tài nguyên</h3>
                                <p className="text-gray-600">Tiếp cận nhiều loại tài nguyên khác nhau được thiết kế để phát triển kỹ năng toàn diện.</p>
                            </div>
                            <div className={`p-6 rounded-xl ${styleInfo.lightBg} ${styleInfo.border}`}>
                                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 ${styleInfo.text}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">Chất lượng cao</h3>
                                <p className="text-gray-600">Tất cả nội dung đều được biên soạn và đánh giá bởi các chuyên gia trong ngành.</p>
                            </div>
                            <div className={`p-6 rounded-xl ${styleInfo.lightBg} ${styleInfo.border}`}>
                                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 ${styleInfo.text}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">Luôn cập nhật</h3>
                                <p className="text-gray-600">Nội dung được cập nhật thường xuyên để đảm bảo thông tin luôn mới và phù hợp với xu hướng.</p>
                            </div>
                        </div>

                        {/* Main Content */}

                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Khám phá các tài nguyên</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {resource.items && resource.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group h-full"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <Link
                                                    to={`/resources/${resourceType}/${item.slug || `item-${idx}`}`}
                                                    className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center"
                                                >
                                                    <span className={styleInfo.buttonText}>Xem chi tiết</span>
                                                    <BsArrowRight className={`ml-2 ${styleInfo.buttonText} group-hover:translate-x-1 transition-transform`} />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-xl text-gray-800 mb-3">{item.title}</h4>
                                            <p className="text-gray-600">{item.description}</p>
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`mt-4 inline-flex items-center ${styleInfo.text} hover:underline`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Truy cập tài nguyên
                                                    <BsArrowRight className="ml-2" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className={`bg-gradient-to-r ${styleInfo.header} rounded-xl shadow-md overflow-hidden mb-16`}>
                            <div className="relative p-8 text-white">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="md:max-w-xl">
                                        <h3 className="text-2xl font-bold mb-2">Bắt đầu ngay hôm nay</h3>
                                        <p className="text-white/90">Khám phá các {resource.title.toLowerCase()} của chúng tôi và nâng cao cơ hội phát triển nghề nghiệp của bạn.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {fallbackData[resourceType]?.actions.map((action, idx) => (
                                            <a
                                                key={idx}
                                                href={action.link}
                                                className={action.primary
                                                    ? "bg-white hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm " + styleInfo.buttonText
                                                    : "bg-transparent border border-white hover:bg-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                                                }
                                            >
                                                {action.text}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className={`p-4 ${styleInfo.lightBg}`}>
                                        <h3 className="font-semibold text-gray-800">Làm thế nào để tận dụng tối đa các tài nguyên?</h3>
                                    </div>
                                    <div className="p-4 border-t border-gray-200">
                                        <p className="text-gray-600">Chúng tôi khuyên bạn nên bắt đầu với các tài nguyên cơ bản, sau đó dần dần khám phá các tài nguyên chuyên sâu. Đừng quên thực hành những gì bạn đã học để củng cố kiến thức.</p>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className={`p-4 ${styleInfo.lightBg}`}>
                                        <h3 className="font-semibold text-gray-800">Các tài nguyên có được cập nhật thường xuyên không?</h3>
                                    </div>
                                    <div className="p-4 border-t border-gray-200">
                                        <p className="text-gray-600">Có, tất cả các tài nguyên của chúng tôi đều được cập nhật thường xuyên để đảm bảo phản ánh những xu hướng và thực tiễn mới nhất trong thị trường lao động.</p>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className={`p-4 ${styleInfo.lightBg}`}>
                                        <h3 className="font-semibold text-gray-800">Tôi có thể đóng góp tài nguyên không?</h3>
                                    </div>
                                    <div className="p-4 border-t border-gray-200">
                                        <p className="text-gray-600">Chúng tôi luôn chào đón các đóng góp từ chuyên gia và người dùng. Vui lòng liên hệ với chúng tôi qua trang Liên hệ để biết thêm thông tin về cách bạn có thể chia sẻ kiến thức của mình.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Resources */}
                    {relatedResources && relatedResources.length > 0 && (
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tài nguyên liên quan</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedResources.map((related, idx) => (
                                    <a
                                        key={idx}
                                        href={related.link}
                                        className="bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                                    >
                                        <h4 className={`font-semibold ${styleInfo.text} text-lg mb-2 group-hover:underline`}>{related.title}</h4>
                                        <p className="text-gray-600 mb-4">{related.description}</p>
                                        <div className="flex items-center text-gray-500 group-hover:text-gray-700">
                                            <span className="text-sm">Khám phá</span>
                                            <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </a>
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

export default ResourceDetail;
// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { BsBookmark, BsBarChart, BsPen, BsArrowLeft } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
// import { AppContext } from "../../context/AppContext";

// const ResourceDetail = () => {
//     const { resourceType } = useParams();
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext);

//     const [resource, setResource] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [relatedResources, setRelatedResources] = useState([]);

//     // Map của resource type và icons
//     const resourceIcons = {
//         "cv-templates": <BsBookmark className="text-blue-600" size={26} />,
//         "courses": <MdOutlineSchool className="text-indigo-600" size={28} />,
//         "market-insights": <BsBarChart className="text-green-600" size={26} />,
//         "community": <MdMessage className="text-yellow-600" size={28} />,
//         "career-blog": <BsPen className="text-purple-600" size={26} />,
//         "events": <MdDiversity3 className="text-red-600" size={28} />
//     };

//     useEffect(() => {
//         const fetchResourceData = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`${backendUrl}/api/resources/${resourceType}`);

//                 if (data.success) {
//                     setResource(data.resource);

//                     // Fetch related resources if available
//                     if (data.resource.relatedResources && data.resource.relatedResources.length > 0) {
//                         setRelatedResources(data.resource.relatedResources);
//                     }
//                 } else {
//                     setError("Không thể tải thông tin tài nguyên");
//                 }
//             } catch (err) {
//                 console.error("Error fetching resource:", err);
//                 setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResourceData();

//         // Scroll to top when navigating to this page
//         window.scrollTo(0, 0);
//     }, [resourceType, backendUrl]);

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (error || !resource) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex flex-col items-center justify-center px-4">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài nguyên</h2>
//                     <p className="text-gray-600 mb-6">Tài nguyên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
//                     >
//                         Quay lại
//                     </button>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <div className="bg-gray-50 py-12">
//                 <div className="container mx-auto px-4">
//                     {/* Back button */}
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="flex items-center text-gray-600 hover:text-blue-600 mb-6 group transition-colors"
//                     >
//                         <BsArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//                         <span>Quay lại tài nguyên</span>
//                     </button>

//                     {/* Main content */}
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl mx-auto mb-12">
//                         {/* Header */}
//                         <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-white relative">
//                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
//                             <div className="relative z-10">
//                                 <div className="flex items-center">
//                                     <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-6">
//                                         {resourceIcons[resourceType]}
//                                     </div>
//                                     <h1 className="text-4xl font-bold">{resource.title}</h1>
//                                 </div>
//                                 <p className="text-xl text-blue-100 mt-4 max-w-3xl">{resource.description}</p>
//                             </div>
//                         </div>

//                         {/* Content */}
//                         <div className="p-8">
//                             {/* Items grid */}
//                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//                                 {resource.items && resource.items.map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
//                                     >
//                                         <div className="relative overflow-hidden">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.title}
//                                                 className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
//                                             />
//                                             {item.link && (
//                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
//                                                     <a
//                                                         href={item.link}
//                                                         className="bg-white/90 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
//                                                     >
//                                                         Xem chi tiết
//                                                     </a>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="p-6">
//                                             <h4 className="font-bold text-xl text-gray-800 mb-3">{item.title}</h4>
//                                             <p className="text-gray-600">{item.description}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Related resources section */}
//                     {relatedResources && relatedResources.length > 0 && (
//                         <div className="max-w-6xl mx-auto">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Tài nguyên liên quan</h2>
//                             <div className="grid md:grid-cols-3 gap-6">
//                                 {relatedResources.map((related, idx) => (
//                                     <a
//                                         key={idx}
//                                         href={related.link}
//                                         className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-100"
//                                     >
//                                         <h4 className="font-semibold text-blue-600 text-lg mb-2">{related.title}</h4>
//                                         <p className="text-gray-600">{related.description}</p>
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ResourceDetail;

// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { BsBookmark, BsBarChart, BsPen } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
// import { AppContext } from "../../context/AppContext";

// const ResourceDetail = () => {
//     const { resourceType } = useParams();
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext);

//     const [resource, setResource] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Map của resource type và icons
//     const resourceIcons = {
//         "cv-templates": <BsBookmark className="text-blue-600" size={26} />,
//         "courses": <MdOutlineSchool className="text-indigo-600" size={28} />,
//         "market-insights": <BsBarChart className="text-green-600" size={26} />,
//         "community": <MdMessage className="text-yellow-600" size={28} />,
//         "career-blog": <BsPen className="text-purple-600" size={26} />,
//         "events": <MdDiversity3 className="text-red-600" size={28} />
//     };

//     useEffect(() => {
//         const fetchResourceData = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`${backendUrl}/api/resources/${resourceType}`);

//                 if (data.success) {
//                     setResource(data.resource);
//                 } else {
//                     setError("Không thể tải thông tin tài nguyên");
//                 }
//             } catch (err) {
//                 console.error("Error fetching resource:", err);
//                 setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResourceData();
//     }, [resourceType, backendUrl]);

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (error || !resource) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex flex-col items-center justify-center px-4">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài nguyên</h2>
//                     <p className="text-gray-600 mb-6">Tài nguyên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
//                     >
//                         Quay lại
//                     </button>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <div className="bg-gray-50 py-12">
//                 <div className="container mx-auto px-4">
//                     <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
//                         <div className="flex items-center mb-6">
//                             <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mr-4">
//                                 {resourceIcons[resourceType]}
//                             </div>
//                             <h1 className="text-3xl font-bold text-gray-800">{resource.title}</h1>
//                         </div>

//                         <p className="text-lg text-gray-600 mb-8">{resource.description}</p>

//                         {/* Content items */}
//                         <div className="grid md:grid-cols-2 gap-6 mb-8">
//                             {resource.items && resource.items.map((item, idx) => (
//                                 <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
//                                     <img
//                                         src={item.image}
//                                         alt={item.title}
//                                         className="w-full h-48 object-cover"
//                                     />
//                                     <div className="p-4">
//                                         <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
//                                         <p className="text-gray-600">{item.description}</p>
//                                         {item.link && (
//                                             <a
//                                                 href={item.link}
//                                                 className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
//                                             >
//                                                 Xem chi tiết
//                                                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                                                 </svg>
//                                             </a>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Related resources */}
//                         {resource.relatedResources && resource.relatedResources.length > 0 && (
//                             <div className="mt-12">
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Tài nguyên liên quan</h3>
//                                 <div className="grid md:grid-cols-3 gap-4">
//                                     {resource.relatedResources.map((related, idx) => (
//                                         <a
//                                             key={idx}
//                                             href={related.link}
//                                             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                                         >
//                                             <h4 className="font-medium text-blue-600">{related.title}</h4>
//                                             <p className="text-sm text-gray-600 mt-1">{related.description}</p>
//                                         </a>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ResourceDetail;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { BsBookmark, BsBarChart, BsPen } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
// import { AppContext } from "../../context/AppContext";

// const ResourceDetail = () => {
//     const { resourceType } = useParams();
//     const navigate = useNavigate();
//     const { backendUrl } = React.useContext(AppContext);

//     const [resource, setResource] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Map của resource type và icons
//     const resourceIcons = {
//         "cv-templates": <BsBookmark className="text-blue-600" size={26} />,
//         "courses": <MdOutlineSchool className="text-indigo-600" size={28} />,
//         "market-insights": <BsBarChart className="text-green-600" size={26} />,
//         "community": <MdMessage className="text-yellow-600" size={28} />,
//         "career-blog": <BsPen className="text-purple-600" size={26} />,
//         "events": <MdDiversity3 className="text-red-600" size={28} />
//     };

//     useEffect(() => {
//         const fetchResourceData = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`${backendUrl}/api/resources/${resourceType}`);

//                 if (data.success) {
//                     setResource(data.resource);
//                 } else {
//                     setError("Không thể tải thông tin tài nguyên");
//                 }
//             } catch (err) {
//                 console.error("Error fetching resource:", err);
//                 setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResourceData();
//     }, [resourceType, backendUrl]);

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (error || !resource) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex flex-col items-center justify-center px-4">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài nguyên</h2>
//                     <p className="text-gray-600 mb-6">Tài nguyên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
//                     >
//                         Quay lại
//                     </button>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <div className="bg-gray-50 py-12">
//                 <div className="container mx-auto px-4">
//                     <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
//                         <div className="flex items-center mb-6">
//                             <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mr-4">
//                                 {resourceIcons[resourceType]}
//                             </div>
//                             <h1 className="text-3xl font-bold text-gray-800">{resource.title}</h1>
//                         </div>

//                         <p className="text-lg text-gray-600 mb-8">{resource.description}</p>

//                         {/* Content items */}
//                         <div className="grid md:grid-cols-2 gap-6 mb-8">
//                             {resource.items.map((item, idx) => (
//                                 <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
//                                     <img
//                                         src={item.image}
//                                         alt={item.title}
//                                         className="w-full h-48 object-cover"
//                                     />
//                                     <div className="p-4">
//                                         <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
//                                         <p className="text-gray-600">{item.description}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Related resources */}
//                         {resource.relatedResources && resource.relatedResources.length > 0 && (
//                             <div className="mt-12">
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Tài nguyên liên quan</h3>
//                                 <div className="grid md:grid-cols-3 gap-4">
//                                     {resource.relatedResources.map((related, idx) => (
//                                         <a
//                                             key={idx}
//                                             href={related.link}
//                                             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                                         >
//                                             <h4 className="font-medium text-blue-600">{related.title}</h4>
//                                             <p className="text-sm text-gray-600 mt-1">{related.description}</p>
//                                         </a>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ResourceDetail;