import React from 'react';

const ProfileHeader = ({ userData }) => {
    return (
        <div>
            {/* Header với ảnh nền và avatar */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute -bottom-16 left-8">
                    <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                        <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="pt-20 px-8 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                        <p className="text-gray-600">{userData.title}</p>
                        <p className="text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {userData.location}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            Tải CV
                        </button>
                        <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition">
                            Liên hệ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;