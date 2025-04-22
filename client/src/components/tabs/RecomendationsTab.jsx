import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Building, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from '../Loading';

const RecommendationsTab = () => {
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [hasSkills, setHasSkills] = useState(false);

    // Lấy profile người dùng để kiểm tra kỹ năng
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userToken) return;

            try {
                const response = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (response.data.success && response.data.profile) {
                    setUserProfile(response.data.profile);
                    // Kiểm tra xem người dùng có kỹ năng hay không
                    setHasSkills(
                        response.data.profile.skills &&
                        response.data.profile.skills.length > 0
                    );
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        fetchProfile();
    }, [backendUrl, userToken]);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            if (!userToken) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${backendUrl}/api/users/recommended-jobs`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (response.data.success) {
                    setJobs(response.data.jobs);
                } else {
                    setError(response.data.message || 'Failed to fetch recommendations');
                }
            } catch (err) {
                console.error('Error fetching recommended jobs:', err);
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, [backendUrl, userToken]);

    const handleApplyClick = async (jobId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/users/apply`,
                { jobId },
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                toast.success('Ứng tuyển thành công!');
                // Optional: Remove job from list or mark as applied
            } else {
                toast.error(response.data.message || 'Không thể ứng tuyển công việc này');
            }
        } catch (err) {
            console.error('Error applying for job:', err);
            const errorMsg = err.response?.data?.message || 'Đã xảy ra lỗi khi ứng tuyển';

            // Kiểm tra lỗi đã ứng tuyển
            if (errorMsg.includes('already applied')) {
                toast.info('Bạn đã ứng tuyển vị trí này trước đó');
            } else {
                toast.error(errorMsg);
            }
        }
    };

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            if (!userToken) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${backendUrl}/api/users/recommended-jobs`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (response.data.success) {
                    setJobs(response.data.jobs);
                } else {
                    setError(response.data.message || 'Failed to fetch recommendations');
                }
            } catch (err) {
                console.error('Error fetching recommended jobs:', err);
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, [backendUrl, userToken]);

    const handleApplyClick_0 = async (jobId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/users/apply`,
                { jobId },
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                toast.success('Ứng tuyển thành công!');
                // Optional: Remove job from list or mark as applied
            } else {
                toast.error(response.data.message || 'Không thể ứng tuyển công việc này');
            }
        } catch (err) {
            console.error('Error applying for job:', err);
            const errorMsg = err.response?.data?.message || 'Đã xảy ra lỗi khi ứng tuyển';

            // Kiểm tra lỗi đã ứng tuyển
            if (errorMsg.includes('already applied')) {
                toast.info('Bạn đã ứng tuyển vị trí này trước đó');
            } else {
                toast.error(errorMsg);
            }
        }
    };

    const handleSaveJob = (jobId) => {
        // Thực hiện logic lưu job (có thể triển khai sau)
        toast.info('Tính năng đang được phát triển');
    };

    const viewJobDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
                <p>Lỗi: {error}</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-8">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">Chưa có gợi ý việc làm</h3>

                {hasSkills ? (
                    <p className="text-gray-500 mt-1">
                        Hiện chưa có việc làm phù hợp với kỹ năng của bạn. Hãy kiểm tra lại sau.
                    </p>
                ) : (
                    <p className="text-gray-500 mt-1">
                        Thêm kỹ năng vào hồ sơ để nhận gợi ý việc làm phù hợp
                    </p>
                )}

                <button
                    onClick={() => navigate('/profile/edit')}
                    className="mt-4 text-blue-600 hover:underline flex items-center justify-center mx-auto"
                >
                    {hasSkills ? 'Cập nhật hồ sơ' : 'Thêm kỹ năng'} <ArrowRight size={16} className="ml-1" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase size={20} className="mr-2 text-blue-600" />
                Việc làm phù hợp với bạn
            </h2>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => viewJobDetails(job._id)}>
                                    {job.title}
                                </h3>
                                <p className="text-gray-600 flex items-center">
                                    <Building size={16} className="mr-1 text-gray-400" />
                                    {job.companyId?.name || 'Công ty ẩn danh'}
                                </p>
                                <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-4">
                                    <span className="flex items-center">
                                        <MapPin size={14} className="mr-1" />
                                        {job.location || 'Remote'}
                                    </span>
                                    {job.salary && (
                                        <span className="flex items-center">
                                            <DollarSign size={14} className="mr-1" />
                                            {job.salary}
                                        </span>
                                    )}
                                </div>

                                {/* Skills tags */}
                                {job.requiredSkills && job.requiredSkills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.requiredSkills.length > 3 && (
                                            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                                +{job.requiredSkills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-sm font-medium mb-1 text-green-600">{job.matchScore}% phù hợp</div>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${job.matchScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => handleApplyClick(job._id)}
                                className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700 transition"
                            >
                                Ứng tuyển ngay
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewJobDetails(job._id)}
                                    className="text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded hover:bg-blue-50 transition"
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => handleSaveJob(job._id)}
                                    className="text-gray-600 flex items-center text-sm hover:text-gray-900"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationsTab;