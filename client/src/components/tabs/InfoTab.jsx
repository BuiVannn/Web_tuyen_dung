import React from 'react';

const InfoTab = ({ userData }) => {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Giới thiệu</h2>
                <p className="text-gray-700">{userData.summary}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{userData.email}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{userData.phone}</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Kỹ năng</h2>
                <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Ngôn ngữ</h2>
                <div className="flex flex-wrap gap-2">
                    {userData.languages.map((language, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                            {language}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Chứng chỉ</h2>
                <ul className="list-disc list-inside text-gray-700">
                    {userData.certificates.map((cert, index) => (
                        <li key={index}>{cert}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InfoTab;