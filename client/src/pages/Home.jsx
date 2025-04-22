import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import RecruiterDashboardPreview from "../components/RecruiterDashboardPreview"; // Component mới
import CareerResources from "../components/CareerResources";
import FeaturedBlogPosts from "../components/FeaturedBlogPosts"; // Thêm component mới
import Footer from "../components/Footer";
import AdvancedJobFilter from "../components/AdvancedJobFilter";
import TrustedCompanies from "../components/TrustedCompanies";
import { AppContext } from "../context/AppContext";

const Home = () => {
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const { companyToken, companyData } = useContext(AppContext);

    // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
    const isRecruiter = !!companyToken && !!companyData;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {isRecruiter ? (
                // Giao diện cho Recruiter
                <div className="container mx-auto px-4 py-8">
                    <RecruiterDashboardPreview companyData={companyData} />
                </div>
            ) : (
                // Giao diện cho Job Seeker
                <>
                    <Hero onToggleAdvanced={setShowAdvancedFilter} />
                    <TrustedCompanies />

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showAdvancedFilter ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="container mx-auto px-4 py-4">
                            <AdvancedJobFilter />
                        </div>
                    </div>

                    <div id="job-results" className="py-2"></div>
                    <JobListing />
                </>
            )}

            {/* Hiển thị cho cả 2 loại người dùng */}
            <FeaturedBlogPosts />
            <CareerResources />
            <Footer />
        </div>
    );
};

export default Home;
// import React, { useState, useContext } from "react";
// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import JobListing from "../components/JobListing";
// import RecruiterDashboardPreview from "../components/RecruiterDashboardPreview"; // Component mới
// import CareerResources from "../components/CareerResources";
// import FeaturedBlogPosts from "../components/FeaturedBlogPosts";
// import Footer from "../components/Footer";
// import AdvancedJobFilter from "../components/AdvancedJobFilter";
// import TrustedCompanies from "../components/TrustedCompanies";
// import { AppContext } from "../context/AppContext";

// const Home = () => {
//     const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
//     const { companyToken, companyData } = useContext(AppContext);

//     // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
//     const isRecruiter = !!companyToken && !!companyData;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />

//             {isRecruiter ? (
//                 // Giao diện cho Recruiter
//                 <div className="container mx-auto px-4 py-8">
//                     <RecruiterDashboardPreview companyData={companyData} />
//                 </div>
//             ) : (
//                 // Giao diện cho Job Seeker
//                 <>
//                     <Hero onToggleAdvanced={setShowAdvancedFilter} />
//                     <TrustedCompanies />

//                     <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showAdvancedFilter ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
//                         }`}>
//                         <div className="container mx-auto px-4 py-4">
//                             <AdvancedJobFilter />
//                         </div>
//                     </div>

//                     <div id="job-results" className="py-2"></div>
//                     <JobListing />
//                 </>
//             )}

//             {/* Hiển thị cho cả 2 loại người dùng */}
//             <CareerResources />
//             <Footer />
//         </div>
//     );
// };

// export default Home;



// // import React, { useState } from "react";
// // import Navbar from "../components/Navbar";
// // import Hero from "../components/Hero";
// // import JobListing from "../components/JobListing";
// // // import AppDownload from "../components/AppDownload"; // Bỏ component cũ
// // import CareerResources from "../components/CareerResources"; // Thêm component mới
// // import Footer from "../components/Footer";
// // import AdvancedJobFilter from "../components/AdvancedJobFilter";
// // import TrustedCompanies from "../components/TrustedCompanies";

// // const Home = () => {
// //     const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

// //     return (
// //         <div className="min-h-screen bg-gray-50">
// //             <Navbar />
// //             <Hero onToggleAdvanced={setShowAdvancedFilter} />

// //             <TrustedCompanies />

// //             <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showAdvancedFilter ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
// //                 }`}>
// //                 <div className="container mx-auto px-4 py-4">
// //                     <AdvancedJobFilter />
// //                 </div>
// //             </div>

// //             <div id="job-results" className="py-2"></div>

// //             <JobListing />

// //             {/* Thay thế AppDownload bằng CareerResources */}
// //             <CareerResources />

// //             <Footer />
// //         </div>
// //     );
// // };

// // export default Home;








// // import React from "react";
// // import Navbar from "../components/Navbar";
// // import Hero from "../components/Hero";
// // import JobListing from "../components/JobListing";
// // import AppDownload from "../components/AppDownload";
// // import Footer from "../components/Footer";
// // import AdvancedJobFilter from "../components/AdvancedJobFilter";
// // import JobMatchIndicator from "../components/JobMatchIndicator";
// // const Home = () => {
// //     return (
// //         <div>
// //             <Navbar />
// //             <Hero />
// //             <AdvancedJobFilter />
// //             {/* <JobMatchIndicator /> */}
// //             <JobListing />
// //             <AppDownload />
// //             <Footer />
// //         </div>
// //     )
// // }

// // export default Home