import React from "react";
import { assets } from "../assets/assets";
import { BsBookmark, BsBarChart, BsPen, BsArrowRight } from "react-icons/bs";
import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CareerResources = () => {
    const navigate = useNavigate();

    const resources = [
        {
            id: 1,
            icon: <BsBookmark className="text-blue-600" size={26} />,
            title: "Hướng dẫn viết CV",
            description: "Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao",
            link: "/resources/cv-templates",
            type: "cv-templates"
        },
        {
            id: 2,
            icon: <MdOutlineSchool className="text-indigo-600" size={28} />,
            title: "Khóa học kỹ năng",
            description: "Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến",
            link: "/resources/courses",
            type: "courses"
        },
        {
            id: 3,
            icon: <BsBarChart className="text-green-600" size={26} />,
            title: "Thống kê thị trường",
            description: "Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại",
            link: "/resources/market-insights",
            type: "market-insights"
        },
        {
            id: 4,
            icon: <MdMessage className="text-yellow-600" size={28} />,
            title: "Cộng đồng hỗ trợ",
            description: "Tham gia cộng đồng chia sẻ kinh nghiệm và kết nối chuyên gia",
            link: "/resources/community",
            type: "community"
        },
        {
            id: 5,
            icon: <BsPen className="text-purple-600" size={26} />,
            title: "Blog tư vấn nghề nghiệp",
            description: "Bài viết và lời khuyên từ các chuyên gia hàng đầu về nghề nghiệp",
            link: "/resources/career-blog",
            type: "career-blog"
        },
        {
            id: 6,
            icon: <MdDiversity3 className="text-red-600" size={28} />,
            title: "Sự kiện tuyển dụng",
            description: "Tham gia các sự kiện tuyển dụng trực tuyến và ngoại tuyến",
            link: "/resources/events",
            type: "events"
        }
    ];

    // Hàm để chuyển đến trang chi tiết resource
    const navigateToDetail = (type) => {
        navigate(`/resources/${type}`);
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4 2xl:px-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Tài nguyên phát triển sự nghiệp</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Khám phá các công cụ và tài nguyên giúp bạn xây dựng sự nghiệp thành công.
                        Từ hướng dẫn viết CV chuyên nghiệp đến các khóa học nâng cao kỹ năng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            onClick={() => navigateToDetail(resource.type)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                {resource.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{resource.title}</h3>
                            <p className="text-gray-600 mb-4">{resource.description}</p>
                            <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                                Xem chi tiết
                                <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 md:p-12 flex items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">Trở thành ứng viên nổi bật</h2>
                                <p className="text-blue-100 mb-6">
                                    Tạo hồ sơ miễn phí ngay hôm nay và để nhà tuyển dụng chủ động liên hệ với bạn.
                                    Tiếp cận các cơ hội việc làm độc quyền và các công cụ phát triển sự nghiệp.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
                                        Tạo hồ sơ miễn phí
                                    </a>
                                    <a href="/employers" className="bg-transparent text-white border border-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors">
                                        Dành cho nhà tuyển dụng
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-64 lg:h-auto">
                            <div className="absolute inset-0 bg-indigo-800/30 backdrop-blur-sm lg:backdrop-blur-none z-10 lg:hidden"></div>
                            <img
                                src={assets.banner_img || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3432&q=80"}
                                alt="Career growth"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CareerResources;
// import React, { useState } from "react";
// import { assets } from "../assets/assets";
// import { BsBookmark, BsBarChart, BsPen, BsChevronDown, BsChevronUp } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const CareerResources = () => {
//     const navigate = useNavigate();
//     const [expandedResource, setExpandedResource] = useState(null);

//     const resources = [
//         {
//             id: 1,
//             icon: <BsBookmark className="text-blue-600" size={26} />,
//             title: "Hướng dẫn viết CV",
//             description: "Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao",
//             link: "/resources/cv-templates",
//             type: "cv-templates",
//             detailedContent: {
//                 heading: "Tạo CV chuyên nghiệp thu hút nhà tuyển dụng",
//                 text: "CV là cơ hội đầu tiên để bạn gây ấn tượng với nhà tuyển dụng. Một CV được thiết kế tốt sẽ giúp bạn nổi bật giữa hàng trăm ứng viên khác.",
//                 items: [
//                     {
//                         title: "Mẫu CV theo ngành nghề",
//                         description: "Các mẫu CV được thiết kế riêng cho từng ngành nghề cụ thể, giúp bạn nổi bật với nhà tuyển dụng.",
//                         image: assets.cv_template_img || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdW1lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Công cụ soát lỗi CV",
//                         description: "Kiểm tra và nhận phản hồi tức thì về CV của bạn, từ định dạng đến nội dung và từ ngữ.",
//                         image: assets.cv_check_img || "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlY2tsaXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Từ khóa theo ngành",
//                         description: "Danh sách từ khóa ATS-friendly giúp CV của bạn vượt qua các hệ thống sàng lọc tự động.",
//                         image: assets.keywords_img || "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5d29yZHN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Xem tất cả mẫu CV",
//                         link: "/resources/cv-templates"
//                     },
//                     secondary: {
//                         text: "Bắt đầu tạo CV",
//                         link: "/resume-builder"
//                     }
//                 }
//             }
//         },
//         {
//             id: 2,
//             icon: <MdOutlineSchool className="text-indigo-600" size={28} />,
//             title: "Khóa học kỹ năng",
//             description: "Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến",
//             link: "/resources/courses",
//             type: "courses",
//             detailedContent: {
//                 heading: "Nâng cao kỹ năng với các khóa học chất lượng",
//                 text: "Trong thị trường việc làm cạnh tranh, việc liên tục cập nhật và nâng cao kỹ năng là điều cần thiết để duy trì lợi thế cạnh tranh.",
//                 items: [
//                     {
//                         title: "Kỹ năng chuyên môn",
//                         description: "Các khóa học về lập trình, thiết kế, marketing và nhiều lĩnh vực khác từ các chuyên gia hàng đầu.",
//                         image: assets.technical_course_img || "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Kỹ năng mềm",
//                         description: "Khóa học về giao tiếp, lãnh đạo, quản lý thời gian và giải quyết vấn đề - những kỹ năng quan trọng trong mọi ngành nghề.",
//                         image: assets.soft_skills_img || "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXdvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Chứng chỉ chuyên ngành",
//                         description: "Chuẩn bị cho các kỳ thi chứng chỉ với các khóa học được thiết kế riêng và tài liệu ôn tập.",
//                         image: assets.certification_img || "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2VydGlmaWNhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Khám phá khóa học",
//                         link: "/resources/courses"
//                     },
//                     secondary: {
//                         text: "Khóa học miễn phí",
//                         link: "/free-courses"
//                     }
//                 }
//             }
//         },
//         // Thêm các resource khác tương tự...
//         {
//             id: 3,
//             icon: <BsBarChart className="text-green-600" size={26} />,
//             title: "Thống kê thị trường",
//             description: "Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại",
//             link: "/resources/market-insights",
//             type: "market-insights",
//             detailedContent: {
//                 heading: "Những số liệu và xu hướng mới nhất về thị trường lao động",
//                 text: "Hiểu rõ về mức lương, kỹ năng được săn đón và cơ hội nghề nghiệp trong các ngành để có định hướng nghề nghiệp phù hợp.",
//                 items: [
//                     {
//                         title: "Báo cáo mức lương",
//                         description: "So sánh mức lương theo vị trí, kinh nghiệm và địa điểm để định giá đúng giá trị thị trường của bạn.",
//                         image: assets.salary_report_img || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcnRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Xu hướng nghề nghiệp",
//                         description: "Phân tích về các ngành nghề đang phát triển, kỹ năng được săn đón và dự báo về tương lai việc làm.",
//                         image: assets.career_trends_img || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dHJlbmR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Công cụ tính lương",
//                         description: "Tính toán mức lương mong đợi dựa trên kinh nghiệm, vị trí và địa điểm làm việc của bạn.",
//                         image: assets.salary_calculator_img || "https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbGN1bGF0b3J8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Xem thống kê lương",
//                         link: "/resources/market-insights"
//                     },
//                     secondary: {
//                         text: "Tính lương của bạn",
//                         link: "/salary-calculator"
//                     }
//                 }
//             }
//         },
//         {
//             id: 4,
//             icon: <MdMessage className="text-yellow-600" size={28} />,
//             title: "Cộng đồng hỗ trợ",
//             description: "Tham gia cộng đồng chia sẻ kinh nghiệm và kết nối chuyên gia",
//             link: "/resources/community",
//             type: "community",
//             detailedContent: {
//                 heading: "Kết nối với cộng đồng chuyên gia và người tìm việc",
//                 text: "Tham gia vào cộng đồng để đặt câu hỏi, chia sẻ kinh nghiệm và học hỏi từ những người đi trước trong ngành của bạn.",
//                 items: [
//                     {
//                         title: "Diễn đàn hỏi đáp",
//                         description: "Đặt câu hỏi và nhận câu trả lời từ các chuyên gia và thành viên khác trong cộng đồng.",
//                         image: assets.forum_img || "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9ydW18ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Mentorship",
//                         description: "Kết nối với mentor trong ngành để được hướng dẫn và tư vấn cho con đường sự nghiệp của bạn.",
//                         image: assets.mentorship_img || "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWVudG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Networking",
//                         description: "Tham gia các sự kiện networking online và offline để mở rộng mạng lưới quan hệ nghề nghiệp.",
//                         image: assets.networking_img || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bmV0d29ya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Tham gia cộng đồng",
//                         link: "/resources/community"
//                     },
//                     secondary: {
//                         text: "Tìm mentor",
//                         link: "/find-mentors"
//                     }
//                 }
//             }
//         },
//         {
//             id: 5,
//             icon: <BsPen className="text-purple-600" size={26} />,
//             title: "Blog tư vấn nghề nghiệp",
//             description: "Bài viết và lời khuyên từ các chuyên gia hàng đầu về nghề nghiệp",
//             link: "/resources/career-blog",
//             type: "career-blog",
//             detailedContent: {
//                 heading: "Lời khuyên về nghề nghiệp từ chuyên gia",
//                 text: "Cập nhật các bài viết với các chiến lược phát triển sự nghiệp, kỹ năng phỏng vấn và thông tin ngành từ các chuyên gia.",
//                 items: [
//                     {
//                         title: "Hướng dẫn phỏng vấn",
//                         description: "Các mẹo, câu hỏi thường gặp và cách chuẩn bị cho phỏng vấn trong mọi ngành nghề.",
//                         image: assets.interview_tips_img || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZXJ2aWV3fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Xây dựng thương hiệu cá nhân",
//                         description: "Chiến lược xây dựng và quản lý thương hiệu cá nhân trên mạng xã hội và trong ngành nghề.",
//                         image: assets.personal_branding_img || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnJhbmRpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Chuyển đổi nghề nghiệp",
//                         description: "Hướng dẫn và kinh nghiệm từ những người đã thành công trong việc chuyển đổi nghề nghiệp.",
//                         image: assets.career_change_img || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyZWVyJTIwY2hhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Đọc các bài viết mới nhất",
//                         link: "/resources/career-blog"
//                     },
//                     secondary: {
//                         text: "Đăng ký nhận bản tin",
//                         link: "/newsletter-signup"
//                     }
//                 }
//             }
//         },
//         {
//             id: 6,
//             icon: <MdDiversity3 className="text-red-600" size={28} />,
//             title: "Sự kiện tuyển dụng",
//             description: "Tham gia các sự kiện tuyển dụng trực tuyến và ngoại tuyến",
//             link: "/resources/events",
//             type: "events",
//             detailedContent: {
//                 heading: "Các sự kiện tuyển dụng và hội thảo nghề nghiệp",
//                 text: "Kết nối trực tiếp với nhà tuyển dụng và chuyên gia thông qua các sự kiện trực tuyến và ngoại tuyến.",
//                 items: [
//                     {
//                         title: "Job Fair ảo",
//                         description: "Tham gia hội chợ việc làm trực tuyến để kết nối với nhiều nhà tuyển dụng cùng một lúc từ bất kỳ đâu.",
//                         image: assets.virtual_job_fair_img || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dmlydHVhbCUyMGV2ZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Hội thảo chuyên ngành",
//                         description: "Các buổi hội thảo chuyên đề về phát triển nghề nghiệp, kỹ năng và xu hướng ngành.",
//                         image: assets.workshop_img || "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvcmtzaG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Phỏng vấn mô phỏng",
//                         description: "Luyện tập phỏng vấn với các chuyên gia tuyển dụng và nhận phản hồi chi tiết.",
//                         image: assets.mock_interview_img || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGludGVydmlld3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Xem lịch sự kiện",
//                         link: "/resources/events"
//                     },
//                     secondary: {
//                         text: "Đăng ký tham gia",
//                         link: "/register-events"
//                     }
//                 }
//             }
//         }
//     ];

//     // Hàm mở/đóng accordion
//     const toggleAccordion = (id) => {
//         setExpandedResource(expandedResource === id ? null : id);
//     };

//     // Hàm để chuyển đến trang chi tiết resource
//     const navigateToDetail = (type) => {
//         navigate(`/resources/${type}`);
//     };

//     // Component hiển thị chi tiết resource dưới dạng accordion
//     const ResourceDetail = ({ resource }) => {
//         const { detailedContent } = resource;

//         return (
//             <div className="bg-gray-50 rounded-b-xl p-6 border-t-0 border border-gray-100 animate-fade-in shadow-inner">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-3">{detailedContent.heading}</h3>
//                 <p className="text-gray-600 mb-6">{detailedContent.text}</p>

//                 <div className="grid md:grid-cols-3 gap-5 mb-6">
//                     {detailedContent.items.map((item, idx) => (
//                         <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
//                             <img
//                                 src={item.image}
//                                 alt={item.title}
//                                 className="w-full h-40 object-cover"
//                             />
//                             <div className="p-4">
//                                 <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
//                                 <p className="text-gray-600 text-sm">{item.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex flex-wrap gap-4 mt-4 justify-end">
//                     <button
//                         onClick={() => navigateToDetail(resource.type)}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
//                     >
//                         {detailedContent.cta.primary.text}
//                     </button>
//                     <a
//                         href={detailedContent.cta.secondary.link}
//                         className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
//                     >
//                         {detailedContent.cta.secondary.text}
//                     </a>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <section className="py-16 bg-gradient-to-b from-white to-slate-50">
//             <div className="container mx-auto px-4 2xl:px-20">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Tài nguyên phát triển sự nghiệp</h2>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Khám phá các công cụ và tài nguyên giúp bạn xây dựng sự nghiệp thành công.
//                         Từ hướng dẫn viết CV chuyên nghiệp đến các khóa học nâng cao kỹ năng.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {resources.map((resource) => (
//                         <div key={resource.id} className="flex flex-col">
//                             {/* Card chính */}
//                             <div className="bg-white rounded-t-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 flex flex-col h-full">
//                                 <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
//                                     {resource.icon}
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-3">{resource.title}</h3>
//                                 <p className="text-gray-600 mb-4 flex-grow">{resource.description}</p>

//                                 {/* Thay đổi buttons để có 2 lựa chọn */}
//                                 <div className="flex items-center justify-between mt-4">
//                                     <button
//                                         onClick={() => toggleAccordion(resource.id)}
//                                         className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//                                     >
//                                         <span className="mr-1">
//                                             {expandedResource === resource.id ? 'Thu gọn' : 'Tìm hiểu thêm'}
//                                         </span>
//                                         {expandedResource === resource.id ? (
//                                             <BsChevronUp className="transition-transform" />
//                                         ) : (
//                                             <BsChevronDown className="transition-transform" />
//                                         )}
//                                     </button>

//                                     <button
//                                         onClick={() => navigateToDetail(resource.type)}
//                                         className="text-indigo-600 hover:text-indigo-800 font-medium"
//                                     >
//                                         Xem chi tiết
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Phần mở rộng */}
//                             {expandedResource === resource.id && (
//                                 <ResourceDetail resource={resource} />
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
//                     <div className="grid grid-cols-1 lg:grid-cols-2">
//                         <div className="p-8 md:p-12 flex items-center">
//                             <div>
//                                 <h2 className="text-3xl font-bold text-white mb-4">Trở thành ứng viên nổi bật</h2>
//                                 <p className="text-blue-100 mb-6">
//                                     Tạo hồ sơ miễn phí ngay hôm nay và để nhà tuyển dụng chủ động liên hệ với bạn.
//                                     Tiếp cận các cơ hội việc làm độc quyền và các công cụ phát triển sự nghiệp.
//                                 </p>
//                                 <div className="flex flex-wrap gap-4">
//                                     <a href="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
//                                         Tạo hồ sơ miễn phí
//                                     </a>
//                                     <a href="/employers" className="bg-transparent text-white border border-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors">
//                                         Dành cho nhà tuyển dụng
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="relative h-64 lg:h-auto">
//                             <div className="absolute inset-0 bg-indigo-800/30 backdrop-blur-sm lg:backdrop-blur-none z-10 lg:hidden"></div>
//                             <img
//                                 src={assets.banner_img || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3432&q=80"}
//                                 alt="Career growth"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CareerResources;

// import React, { useState } from "react";
// import { assets } from "../assets/assets";
// import { BsBookmark, BsBarChart, BsPen } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3, MdClose } from "react-icons/md";

// const CareerResources = () => {
//     const [activeResource, setActiveResource] = useState(null);

//     const resources = [
//         {
//             id: 1,
//             icon: <BsBookmark className="text-blue-600" size={26} />,
//             title: "Hướng dẫn viết CV",
//             description: "Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao",
//             link: "/resources/cv-templates",
//             detailedContent: {
//                 heading: "Tạo CV chuyên nghiệp thu hút nhà tuyển dụng",
//                 text: "CV là cơ hội đầu tiên để bạn gây ấn tượng với nhà tuyển dụng. Một CV được thiết kế tốt sẽ giúp bạn nổi bật giữa hàng trăm ứng viên khác.",
//                 items: [
//                     {
//                         title: "Mẫu CV theo ngành nghề",
//                         description: "Các mẫu CV được thiết kế riêng cho từng ngành nghề cụ thể, giúp bạn nổi bật với nhà tuyển dụng.",
//                         image: assets.cv_template_img || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdW1lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Công cụ soát lỗi CV",
//                         description: "Kiểm tra và nhận phản hồi tức thì về CV của bạn, từ định dạng đến nội dung và từ ngữ.",
//                         image: assets.cv_check_img || "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlY2tsaXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Từ khóa theo ngành",
//                         description: "Danh sách từ khóa ATS-friendly giúp CV của bạn vượt qua các hệ thống sàng lọc tự động.",
//                         image: assets.keywords_img || "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5d29yZHN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Bắt đầu tạo CV",
//                         link: "/resume-builder"
//                     },
//                     secondary: {
//                         text: "Xem mẫu CV",
//                         link: "/cv-templates"
//                     }
//                 }
//             }
//         },
//         {
//             id: 2,
//             icon: <MdOutlineSchool className="text-indigo-600" size={28} />,
//             title: "Khóa học kỹ năng",
//             description: "Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến",
//             link: "/resources/courses",
//             detailedContent: {
//                 heading: "Nâng cao kỹ năng với các khóa học chất lượng",
//                 text: "Trong thị trường việc làm cạnh tranh, việc liên tục cập nhật và nâng cao kỹ năng là điều cần thiết để duy trì lợi thế cạnh tranh.",
//                 items: [
//                     {
//                         title: "Kỹ năng chuyên môn",
//                         description: "Các khóa học về lập trình, thiết kế, marketing và nhiều lĩnh vực khác từ các chuyên gia hàng đầu.",
//                         image: assets.technical_course_img || "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Kỹ năng mềm",
//                         description: "Khóa học về giao tiếp, lãnh đạo, quản lý thời gian và giải quyết vấn đề - những kỹ năng quan trọng trong mọi ngành nghề.",
//                         image: assets.soft_skills_img || "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXdvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Chứng chỉ chuyên ngành",
//                         description: "Chuẩn bị cho các kỳ thi chứng chỉ với các khóa học được thiết kế riêng và tài liệu ôn tập.",
//                         image: assets.certification_img || "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2VydGlmaWNhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Khám phá khóa học",
//                         link: "/courses"
//                     },
//                     secondary: {
//                         text: "Khóa học miễn phí",
//                         link: "/free-courses"
//                     }
//                 }
//             }
//         },
//         {
//             id: 3,
//             icon: <BsBarChart className="text-green-600" size={26} />,
//             title: "Thống kê thị trường",
//             description: "Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại",
//             link: "/resources/market-insights",
//             detailedContent: {
//                 heading: "Những số liệu và xu hướng mới nhất về thị trường lao động",
//                 text: "Hiểu rõ về mức lương, kỹ năng được săn đón và cơ hội nghề nghiệp trong các ngành để có định hướng nghề nghiệp phù hợp.",
//                 items: [
//                     {
//                         title: "Báo cáo mức lương",
//                         description: "So sánh mức lương theo vị trí, kinh nghiệm và địa điểm để định giá đúng giá trị thị trường của bạn.",
//                         image: assets.salary_report_img || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcnRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Xu hướng nghề nghiệp",
//                         description: "Phân tích về các ngành nghề đang phát triển, kỹ năng được săn đón và dự báo về tương lai việc làm.",
//                         image: assets.career_trends_img || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dHJlbmR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Công cụ tính lương",
//                         description: "Tính toán mức lương mong đợi dựa trên kinh nghiệm, vị trí và địa điểm làm việc của bạn.",
//                         image: assets.salary_calculator_img || "https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbGN1bGF0b3J8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Xem thống kê lương",
//                         link: "/salary-reports"
//                     },
//                     secondary: {
//                         text: "Tính lương của bạn",
//                         link: "/salary-calculator"
//                     }
//                 }
//             }
//         },
//         {
//             id: 4,
//             icon: <MdMessage className="text-yellow-600" size={28} />,
//             title: "Cộng đồng hỗ trợ",
//             description: "Tham gia cộng đồng chia sẻ kinh nghiệm và kết nối chuyên gia",
//             link: "/resources/community",
//             detailedContent: {
//                 heading: "Kết nối với cộng đồng chuyên gia và người tìm việc",
//                 text: "Tham gia vào cộng đồng để đặt câu hỏi, chia sẻ kinh nghiệm và học hỏi từ những người đi trước trong ngành của bạn.",
//                 items: [
//                     {
//                         title: "Diễn đàn hỏi đáp",
//                         description: "Đặt câu hỏi và nhận câu trả lời từ các chuyên gia và thành viên khác trong cộng đồng.",
//                         image: assets.forum_img || "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9ydW18ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Mentorship",
//                         description: "Kết nối với mentor trong ngành để được hướng dẫn và tư vấn cho con đường sự nghiệp của bạn.",
//                         image: assets.mentorship_img || "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWVudG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Networking",
//                         description: "Tham gia các sự kiện networking online và offline để mở rộng mạng lưới quan hệ nghề nghiệp.",
//                         image: assets.networking_img || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bmV0d29ya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Tham gia cộng đồng",
//                         link: "/community"
//                     },
//                     secondary: {
//                         text: "Tìm mentor",
//                         link: "/find-mentors"
//                     }
//                 }
//             }
//         },
//         {
//             id: 5,
//             icon: <BsPen className="text-purple-600" size={26} />,
//             title: "Blog tư vấn nghề nghiệp",
//             description: "Bài viết và lời khuyên từ các chuyên gia hàng đầu về nghề nghiệp",
//             link: "/resources/career-blog",
//             detailedContent: {
//                 heading: "Lời khuyên về nghề nghiệp từ chuyên gia",
//                 text: "Cập nhật các bài viết với các chiến lược phát triển sự nghiệp, kỹ năng phỏng vấn và thông tin ngành từ các chuyên gia.",
//                 items: [
//                     {
//                         title: "Hướng dẫn phỏng vấn",
//                         description: "Các mẹo, câu hỏi thường gặp và cách chuẩn bị cho phỏng vấn trong mọi ngành nghề.",
//                         image: assets.interview_tips_img || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZXJ2aWV3fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Xây dựng thương hiệu cá nhân",
//                         description: "Chiến lược xây dựng và quản lý thương hiệu cá nhân trên mạng xã hội và trong ngành nghề.",
//                         image: assets.personal_branding_img || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnJhbmRpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Chuyển đổi nghề nghiệp",
//                         description: "Hướng dẫn và kinh nghiệm từ những người đã thành công trong việc chuyển đổi nghề nghiệp.",
//                         image: assets.career_change_img || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyZWVyJTIwY2hhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Đọc các bài viết mới nhất",
//                         link: "/career-blog"
//                     },
//                     secondary: {
//                         text: "Đăng ký nhận bản tin",
//                         link: "/newsletter-signup"
//                     }
//                 }
//             }
//         },
//         {
//             id: 6,
//             icon: <MdDiversity3 className="text-red-600" size={28} />,
//             title: "Sự kiện tuyển dụng",
//             description: "Tham gia các sự kiện tuyển dụng trực tuyến và ngoại tuyến",
//             link: "/resources/events",
//             detailedContent: {
//                 heading: "Các sự kiện tuyển dụng và hội thảo nghề nghiệp",
//                 text: "Kết nối trực tiếp với nhà tuyển dụng và chuyên gia thông qua các sự kiện trực tuyến và ngoại tuyến.",
//                 items: [
//                     {
//                         title: "Job Fair ảo",
//                         description: "Tham gia hội chợ việc làm trực tuyến để kết nối với nhiều nhà tuyển dụng cùng một lúc từ bất kỳ đâu.",
//                         image: assets.virtual_job_fair_img || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dmlydHVhbCUyMGV2ZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Hội thảo chuyên ngành",
//                         description: "Các buổi hội thảo chuyên đề về phát triển nghề nghiệp, kỹ năng và xu hướng ngành.",
//                         image: assets.workshop_img || "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvcmtzaG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
//                     },
//                     {
//                         title: "Phỏng vấn mô phỏng",
//                         description: "Luyện tập phỏng vấn với các chuyên gia tuyển dụng và nhận phản hồi chi tiết.",
//                         image: assets.mock_interview_img || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGludGVydmlld3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
//                     }
//                 ],
//                 cta: {
//                     primary: {
//                         text: "Xem lịch sự kiện",
//                         link: "/events-calendar"
//                     },
//                     secondary: {
//                         text: "Đăng ký tham gia",
//                         link: "/register-events"
//                     }
//                 }
//             }
//         }
//     ];

//     // Modal để hiển thị nội dung chi tiết
//     const ResourceDetailModal = ({ resource, onClose }) => {
//         if (!resource) return null;

//         const { detailedContent } = resource;

//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
//                 <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                     <div className="sticky top-0 z-10 bg-white p-5 border-b flex justify-between items-center">
//                         <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                             {resource.icon}
//                             <span className="ml-3">{resource.title}</span>
//                         </h2>
//                         <button
//                             onClick={onClose}
//                             className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                         >
//                             <MdClose size={24} />
//                         </button>
//                     </div>

//                     <div className="p-6">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-4">{detailedContent.heading}</h3>
//                         <p className="text-gray-600 mb-8">{detailedContent.text}</p>

//                         <div className="grid md:grid-cols-3 gap-6 mb-8">
//                             {detailedContent.items.map((item, idx) => (
//                                 <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
//                                     <img
//                                         src={item.image}
//                                         alt={item.title}
//                                         className="w-full h-40 object-cover"
//                                     />
//                                     <div className="p-4">
//                                         <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
//                                         <p className="text-gray-600 text-sm">{item.description}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex flex-wrap gap-4 mt-8">
//                             <a
//                                 href={detailedContent.cta.primary.link}
//                                 className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
//                             >
//                                 {detailedContent.cta.primary.text}
//                             </a>
//                             <a
//                                 href={detailedContent.cta.secondary.link}
//                                 className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
//                             >
//                                 {detailedContent.cta.secondary.text}
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <section className="py-16 bg-gradient-to-b from-white to-slate-50">
//             <div className="container mx-auto px-4 2xl:px-20">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Tài nguyên phát triển sự nghiệp</h2>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Khám phá các công cụ và tài nguyên giúp bạn xây dựng sự nghiệp thành công.
//                         Từ hướng dẫn viết CV chuyên nghiệp đến các khóa học nâng cao kỹ năng.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {resources.map((resource) => (
//                         <div
//                             key={resource.id}
//                             className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group cursor-pointer"
//                             onClick={() => setActiveResource(resource)}
//                         >
//                             <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
//                                 {resource.icon}
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-800 mb-3">{resource.title}</h3>
//                             <p className="text-gray-600 mb-4">{resource.description}</p>
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     setActiveResource(resource);
//                                 }}
//                                 className="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors"
//                             >
//                                 Tìm hiểu thêm
//                                 <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                                 </svg>
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
//                     <div className="grid grid-cols-1 lg:grid-cols-2">
//                         <div className="p-8 md:p-12 flex items-center">
//                             <div>
//                                 <h2 className="text-3xl font-bold text-white mb-4">Trở thành ứng viên nổi bật</h2>
//                                 <p className="text-blue-100 mb-6">
//                                     Tạo hồ sơ miễn phí ngay hôm nay và để nhà tuyển dụng chủ động liên hệ với bạn.
//                                     Tiếp cận các cơ hội việc làm độc quyền và các công cụ phát triển sự nghiệp.
//                                 </p>
//                                 <div className="flex flex-wrap gap-4">
//                                     <a href="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
//                                         Tạo hồ sơ miễn phí
//                                     </a>
//                                     <a href="/employers" className="bg-transparent text-white border border-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors">
//                                         Dành cho nhà tuyển dụng
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="relative h-64 lg:h-auto">
//                             <div className="absolute inset-0 bg-indigo-800/30 backdrop-blur-sm lg:backdrop-blur-none z-10 lg:hidden"></div>
//                             <img
//                                 src={assets.banner_img || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3432&q=80"}
//                                 alt="Career growth"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modal hiển thị nội dung chi tiết */}
//                 {activeResource && (
//                     <ResourceDetailModal
//                         resource={activeResource}
//                         onClose={() => setActiveResource(null)}
//                     />
//                 )}
//             </div>
//         </section>
//     );
// };

// export default CareerResources;
// import React from "react";
// import { assets } from "../assets/assets";
// import { BsBookmark, BsBarChart, BsPen } from "react-icons/bs";
// import { MdOutlineSchool, MdMessage, MdDiversity3 } from "react-icons/md";

// const CareerResources = () => {
//     const resources = [
//         {
//             id: 1,
//             icon: <BsBookmark className="text-blue-600" size={26} />,
//             title: "Hướng dẫn viết CV",
//             description: "Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao",
//             link: "#"
//         },
//         {
//             id: 2,
//             icon: <MdOutlineSchool className="text-indigo-600" size={28} />,
//             title: "Khóa học kỹ năng",
//             description: "Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến",
//             link: "#"
//         },
//         {
//             id: 3,
//             icon: <BsBarChart className="text-green-600" size={26} />,
//             title: "Thống kê thị trường",
//             description: "Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại",
//             link: "#"
//         },
//         {
//             id: 4,
//             icon: <MdMessage className="text-yellow-600" size={28} />,
//             title: "Cộng đồng hỗ trợ",
//             description: "Tham gia cộng đồng chia sẻ kinh nghiệm và kết nối chuyên gia",
//             link: "#"
//         },
//         {
//             id: 5,
//             icon: <BsPen className="text-purple-600" size={26} />,
//             title: "Blog tư vấn nghề nghiệp",
//             description: "Bài viết và lời khuyên từ các chuyên gia hàng đầu về nghề nghiệp",
//             link: "#"
//         },
//         {
//             id: 6,
//             icon: <MdDiversity3 className="text-red-600" size={28} />,
//             title: "Sự kiện tuyển dụng",
//             description: "Tham gia các sự kiện tuyển dụng trực tuyến và ngoại tuyến",
//             link: "#"
//         }
//     ];

//     return (
//         <section className="py-16 bg-gradient-to-b from-white to-slate-50">
//             <div className="container mx-auto px-4 2xl:px-20">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Tài nguyên phát triển sự nghiệp</h2>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Khám phá các công cụ và tài nguyên giúp bạn xây dựng sự nghiệp thành công.
//                         Từ hướng dẫn viết CV chuyên nghiệp đến các khóa học nâng cao kỹ năng.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {resources.map((resource) => (
//                         <div
//                             key={resource.id}
//                             className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group"
//                         >
//                             <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
//                                 {resource.icon}
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-800 mb-3">{resource.title}</h3>
//                             <p className="text-gray-600 mb-4">{resource.description}</p>
//                             <a href={resource.link} className="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors">
//                                 Tìm hiểu thêm
//                                 <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                                 </svg>
//                             </a>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
//                     <div className="grid grid-cols-1 lg:grid-cols-2">
//                         <div className="p-8 md:p-12 flex items-center">
//                             <div>
//                                 <h2 className="text-3xl font-bold text-white mb-4">Trở thành ứng viên nổi bật</h2>
//                                 <p className="text-blue-100 mb-6">
//                                     Tạo hồ sơ miễn phí ngay hôm nay và để nhà tuyển dụng chủ động liên hệ với bạn.
//                                     Tiếp cận các cơ hội việc làm độc quyền và các công cụ phát triển sự nghiệp.
//                                 </p>
//                                 <div className="flex flex-wrap gap-4">
//                                     <a href="#" className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
//                                         Tạo hồ sơ miễn phí
//                                     </a>
//                                     <a href="#" className="bg-transparent text-white border border-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors">
//                                         Dành cho nhà tuyển dụng
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="relative h-64 lg:h-auto">
//                             <div className="absolute inset-0 bg-indigo-800/30 backdrop-blur-sm lg:backdrop-blur-none z-10 lg:hidden"></div>
//                             <img
//                                 src={assets.banner_img || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3432&q=80"}
//                                 alt="Career growth"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CareerResources;