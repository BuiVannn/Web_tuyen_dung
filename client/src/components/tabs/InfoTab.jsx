import React from 'react';
import { ExternalLink, MapPin, Mail, Phone, Award, Languages, BarChart2 } from 'lucide-react';

const InfoTab = ({ userData }) => {
    // Truy cập đúng cấu trúc dữ liệu
    const userEmail = userData?.userId?.email || 'Email not available';
    const userPhone = userData?.phone || 'Phone not available';
    const userBio = userData?.bio || 'No biography available';
    const userSkills = userData?.skills || [];
    const userSocialLinks = userData?.socialLinks || { linkedin: '', github: '', portfolio: '' };
    const userLanguages = userData?.languages || [];
    const userCertificates = userData?.certificates || [];
    const userInterests = userData?.interests || [];

    return (
        <div className="space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Giới thiệu
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{userBio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                    <BarChart2 size={20} className="mr-2 text-blue-600" />
                    Kỹ năng
                </h3>
                {userSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {userSkills.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 italic">Chưa có kỹ năng nào được thêm vào</p>
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                        <Mail size={18} className="text-gray-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-gray-700">{userEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                        <Phone size={18} className="text-gray-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Điện thoại</p>
                            <p className="text-gray-700">{userPhone}</p>
                        </div>
                    </div>
                    {userData?.location && (
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                            <MapPin size={18} className="text-gray-500 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500">Địa điểm</p>
                                <p className="text-gray-700">{userData.location}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Certificates */}
            {userCertificates && userCertificates.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                        <Award size={20} className="mr-2 text-blue-600" />
                        Chứng chỉ
                    </h3>
                    <div className="space-y-3">
                        {userCertificates.map((cert, index) => (
                            <div key={index} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <Award size={16} className="text-orange-500 mr-3 mt-1" />
                                <div>
                                    <p className="text-gray-800 font-medium">{cert.name || cert}</p>
                                    {cert.issuer && <p className="text-gray-600 text-sm">Tổ chức cấp: {cert.issuer}</p>}
                                    {cert.date && <p className="text-gray-500 text-sm">Ngày cấp: {new Date(cert.date).toLocaleDateString()}</p>}
                                    {cert.url && (
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-sm flex items-center mt-1 hover:underline"
                                        >
                                            <ExternalLink size={14} className="mr-1" />
                                            Xem chứng chỉ
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {userLanguages && userLanguages.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                        <Languages size={20} className="mr-2 text-blue-600" />
                        Ngôn ngữ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userLanguages.map((lang, index) => (
                            <div key={index} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <Languages size={16} className="text-green-500 mr-3" />
                                <div>
                                    <p className="text-gray-800 font-medium">{lang.name || lang}</p>
                                    {lang.level && <p className="text-gray-500 text-sm">Trình độ: {lang.level}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Interests */}
            {userInterests && userInterests.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Sở thích
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {userInterests.map((interest, index) => (
                            <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links */}
            {(userSocialLinks.linkedin || userSocialLinks.github || userSocialLinks.portfolio) && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                        <ExternalLink size={20} className="mr-2 text-blue-600" />
                        Liên kết mạng xã hội
                    </h3>
                    <div className="space-y-3">
                        {userSocialLinks.linkedin && (
                            <a href={userSocialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-600">
                                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                                LinkedIn
                            </a>
                        )}
                        {userSocialLinks.github && (
                            <a href={userSocialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                                <svg className="w-5 h-5 mr-3 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                        )}
                        {userSocialLinks.portfolio && (
                            <a href={userSocialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-green-600">
                                <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Portfolio/Website
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoTab;
// import React from 'react';
// import { ExternalLink, MapPin, Mail, Phone, Award, Languages, BarChart2 } from 'lucide-react';

// const InfoTab = ({ userData }) => {
//     // Truy cập đúng cấu trúc dữ liệu
//     const userEmail = userData?.userId?.email || 'Email not available';
//     const userPhone = userData?.phone || 'Phone not available';
//     const userBio = userData?.bio || 'No biography available';
//     const userSkills = userData?.skills || [];
//     const userSocialLinks = userData?.socialLinks || { linkedin: '', github: '', portfolio: '' };
//     const userLanguages = userData?.languages || [];
//     const userCertificates = userData?.certificates || [];
//     const userInterests = userData?.interests || [];

//     return (
//         <div className="space-y-8">
//             {/* Bio */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
//                     <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     Giới thiệu
//                 </h3>
//                 <p className="text-gray-600 whitespace-pre-line">{userBio}</p>
//             </div>

//             {/* Skills */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                     <BarChart2 size={20} className="mr-2 text-blue-600" />
//                     Kỹ năng
//                 </h3>
//                 {userSkills.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {userSkills.map((skill, index) => (
//                             <div key={index} className="flex items-center">
//                                 <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
//                                 <span className="text-gray-700">{skill}</span>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-4 bg-gray-50 rounded-lg">
//                         <p className="text-gray-500 italic">Chưa có kỹ năng nào được thêm vào</p>
//                     </div>
//                 )}
//             </div>

//             {/* Contact Information */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                     <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     Thông tin liên hệ
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
//                         <Mail size={18} className="text-gray-500 mr-3" />
//                         <div>
//                             <p className="text-xs text-gray-500">Email</p>
//                             <p className="text-gray-700">{userEmail}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
//                         <Phone size={18} className="text-gray-500 mr-3" />
//                         <div>
//                             <p className="text-xs text-gray-500">Điện thoại</p>
//                             <p className="text-gray-700">{userPhone}</p>
//                         </div>
//                     </div>
//                     {userData?.location && (
//                         <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
//                             <MapPin size={18} className="text-gray-500 mr-3" />
//                             <div>
//                                 <p className="text-xs text-gray-500">Địa điểm</p>
//                                 <p className="text-gray-700">{userData.location}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Certificates */}
//             {userCertificates && userCertificates.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                         <Award size={20} className="mr-2 text-blue-600" />
//                         Chứng chỉ
//                     </h3>
//                     <div className="space-y-3">
//                         {userCertificates.map((cert, index) => (
//                             <div key={index} className="flex items-start">
//                                 <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-2"></div>
//                                 <div>
//                                     <p className="text-gray-700 font-medium">{cert.name || cert}</p>
//                                     {cert.date && <p className="text-gray-500 text-sm">{cert.date}</p>}
//                                     {cert.issuer && <p className="text-gray-500 text-sm">Cấp bởi: {cert.issuer}</p>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Languages */}
//             {userLanguages && userLanguages.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                         <Languages size={20} className="mr-2 text-blue-600" />
//                         Ngôn ngữ
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {userLanguages.map((lang, index) => (
//                             <div key={index} className="flex items-center">
//                                 <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
//                                 <span className="text-gray-700">{lang.name || lang}</span>
//                                 {lang.level && <span className="text-gray-500 text-sm ml-2">({lang.level})</span>}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Interests */}
//             {userInterests && userInterests.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                         <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                         </svg>
//                         Sở thích
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                         {userInterests.map((interest, index) => (
//                             <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                                 {interest}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Social Links */}
//             {(userSocialLinks.linkedin || userSocialLinks.github || userSocialLinks.portfolio) && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//                         <ExternalLink size={20} className="mr-2 text-blue-600" />
//                         Liên kết mạng xã hội
//                     </h3>
//                     <div className="space-y-3">
//                         {userSocialLinks.linkedin && (
//                             <a href={userSocialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-600">
//                                 <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
//                                 </svg>
//                                 LinkedIn
//                             </a>
//                         )}
//                         {userSocialLinks.github && (
//                             <a href={userSocialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900">
//                                 <svg className="w-5 h-5 mr-3 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                                 </svg>
//                                 GitHub
//                             </a>
//                         )}
//                         {userSocialLinks.portfolio && (
//                             <a href={userSocialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-green-600">
//                                 <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
//                                 </svg>
//                                 Portfolio/Website
//                             </a>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InfoTab;