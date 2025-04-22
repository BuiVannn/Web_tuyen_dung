import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoTab from './tabs/InfoTab';
import ResumeTab from './tabs/ResumeTab';
import RecommendationsTab from './tabs/RecomendationsTab';

const ProfileContent = ({ userData }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');

    // Đảm bảo rằng tab được chọn theo URL hash (ví dụ: #resume)
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'resume' || hash === 'recommendations') {
            setActiveTab(hash);
        }
    }, []);

    // Cập nhật URL hash khi tab thay đổi
    useEffect(() => {
        if (activeTab !== 'info') {
            window.location.hash = activeTab;
        } else {
            // Xóa hash nếu là tab mặc định
            if (window.location.hash) {
                window.history.pushState('', document.title, window.location.pathname);
            }
        }
    }, [activeTab]);

    return (
        <div className="px-8 pb-8">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'info'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Thông tin
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resume'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Kinh nghiệm và Dự án
                    </button>
                    <button
                        onClick={() => setActiveTab('recommendations')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'recommendations'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Việc làm phù hợp
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'info' && <InfoTab userData={userData} />}
                {activeTab === 'resume' && <ResumeTab userData={userData} navigate={navigate} />}
                {activeTab === 'recommendations' && <RecommendationsTab />}
            </div>
        </div>
    );
};

export default ProfileContent;