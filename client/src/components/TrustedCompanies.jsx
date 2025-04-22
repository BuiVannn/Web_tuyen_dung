import React from 'react';
import { assets } from "../assets/assets";

const TrustedCompanies = () => {
    // Tạo mảng logo lớn hơn để tạo hiệu ứng vô hạn
    // Nhân đôi các logo để tạo hiệu ứng chạy liên tục
    const logos = [
        assets.microsoft_logo,
        assets.amazon_logo,
        assets.samsung_logo,
        assets.accenture_logo,
        assets.adobe_logo,
        assets.walmart_logo,
        // Lặp lại để tạo hiệu ứng vô hạn
        assets.microsoft_logo,
        assets.amazon_logo,
        assets.samsung_logo,
        assets.accenture_logo,
        assets.adobe_logo,
        assets.walmart_logo
    ];

    return (
        <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">
                    Được tin dùng bởi các công ty hàng đầu
                </h2>

                <div className="relative overflow-hidden py-4 px-2">
                    {/* Logo slider - primary row */}
                    <div className="flex logos-slide animate-scroll">
                        {logos.map((logo, index) => (
                            <div
                                key={`logo-1-${index}`}
                                className="mx-8 flex items-center justify-center min-w-[120px]"
                            >
                                <img
                                    src={logo}
                                    alt={`Company logo ${index}`}
                                    className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Logo slider - secondary row (opposite direction) */}
                    <div className="flex logos-slide-reverse animate-scroll-reverse mt-8">
                        {[...logos].reverse().map((logo, index) => (
                            <div
                                key={`logo-2-${index}`}
                                className="mx-8 flex items-center justify-center min-w-[120px]"
                            >
                                <img
                                    src={logo}
                                    alt={`Company logo ${index}`}
                                    className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10">
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Hàng nghìn công ty đang tìm kiếm nhân tài trên nền tảng của chúng tôi.
                        Khám phá cơ hội việc làm tốt nhất từ các thương hiệu hàng đầu thế giới.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;