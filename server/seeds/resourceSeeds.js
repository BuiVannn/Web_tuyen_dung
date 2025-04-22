import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "../models/Resource.js";

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for seeding"))
    .catch(err => console.error("MongoDB connection error:", err));

// Dữ liệu mẫu
const resourcesData = [
    {
        type: "cv-templates",
        title: "Hướng dẫn viết CV",
        description: "Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao",
        items: [
            {
                title: "Mẫu CV theo ngành nghề",
                description: "Các mẫu CV được thiết kế riêng cho từng ngành nghề cụ thể, giúp bạn nổi bật với nhà tuyển dụng.",
                image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdW1lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
                link: "/cv-templates/by-industry"
            },
            {
                title: "Công cụ soát lỗi CV",
                description: "Kiểm tra và nhận phản hồi tức thì về CV của bạn, từ định dạng đến nội dung và từ ngữ.",
                image: "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlY2tsaXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
                link: "/cv-checker"
            },
            {
                title: "Từ khóa theo ngành",
                description: "Danh sách từ khóa ATS-friendly giúp CV của bạn vượt qua các hệ thống sàng lọc tự động.",
                image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5d29yZHN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                link: "/cv-keywords"
            }
        ],
        relatedResources: [
            {
                title: "Viết thư xin việc hiệu quả",
                description: "Cách viết thư xin việc thu hút sự chú ý của nhà tuyển dụng",
                link: "/resources/cover-letters"
            },
            {
                title: "Chuẩn bị portfolio",
                description: "Hướng dẫn tạo portfolio ấn tượng cho từng ngành nghề",
                link: "/resources/portfolio-guides"
            }
        ]
    },
    {
        type: "courses",
        title: "Khóa học kỹ năng",
        description: "Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến",
        items: [
            {
                title: "Kỹ năng chuyên môn",
                description: "Các khóa học về lập trình, thiết kế, marketing và nhiều lĩnh vực khác từ các chuyên gia hàng đầu.",
                image: "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
                link: "/courses/technical"
            },
            {
                title: "Kỹ năng mềm",
                description: "Khóa học về giao tiếp, lãnh đạo, quản lý thời gian và giải quyết vấn đề - những kỹ năng quan trọng trong mọi ngành nghề.",
                image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXdvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                link: "/courses/soft-skills"
            },
            {
                title: "Chứng chỉ chuyên ngành",
                description: "Chuẩn bị cho các kỳ thi chứng chỉ với các khóa học được thiết kế riêng và tài liệu ôn tập.",
                image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2VydGlmaWNhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                link: "/courses/certifications"
            }
        ],
        relatedResources: [
            {
                title: "Lộ trình học tập",
                description: "Các lộ trình học tập cho các ngành nghề khác nhau",
                link: "/resources/learning-paths"
            },
            {
                title: "Tài liệu miễn phí",
                description: "Kho tài liệu học tập miễn phí cho nhiều lĩnh vực",
                link: "/resources/free-materials"
            }
        ]
    },
    {
        type: "market-insights",
        title: "Thống kê thị trường",
        description: "Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại",
        items: [
            {
                title: "Báo cáo mức lương",
                description: "So sánh mức lương theo vị trí, kinh nghiệm và địa điểm để định giá đúng giá trị thị trường của bạn.",
                image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcnRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
                link: "/market-insights/salary-reports"
            },
            {
                title: "Xu hướng nghề nghiệp",
                description: "Phân tích về các ngành nghề đang phát triển, kỹ năng được săn đón và dự báo về tương lai việc làm.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dHJlbmR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                link: "/market-insights/career-trends"
            },
            {
                title: "Công cụ tính lương",
                description: "Tính toán mức lương mong đợi dựa trên kinh nghiệm, vị trí và địa điểm làm việc của bạn.",
                image: "https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbGN1bGF0b3J8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                link: "/market-insights/salary-calculator"
            }
        ],
        relatedResources: [
            {
                title: "Báo cáo ngành",
                description: "Báo cáo chi tiết về các ngành nghề cụ thể",
                link: "/resources/industry-reports"
            },
            {
                title: "Phân tích khu vực",
                description: "Phân tích thị trường lao động theo khu vực địa lý",
                link: "/resources/regional-analysis"
            }
        ]
    }
];

// Hàm seed dữ liệu
const seedResources = async () => {
    try {
        // Xóa dữ liệu cũ
        await Resource.deleteMany({});
        console.log("Deleted existing resources");

        // Thêm dữ liệu mới
        const createdResources = await Resource.insertMany(resourcesData);
        console.log(`Created ${createdResources.length} resources`);

        mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error seeding resources:", error);
        process.exit(1);
    }
};

// Chạy hàm seed
seedResources();