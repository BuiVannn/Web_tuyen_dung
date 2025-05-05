import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApplyJobForm = ({ job, onSuccess }) => {
    const navigate = useNavigate();
    const { userToken, backendUrl, userData, fetchUserData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null); // File object for new resume upload
    const [formData, setFormData] = useState({
        jobId: job?._id || '',
        fullName: '',
        email: '',
        phoneNumber: '',
        birthYear: '',
        education: '',
        coverLetter: '',
        useExistingResume: true // Default to using existing resume if available
    });

    // Initialize form with user data if available
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: userData.name || '',
                email: userData.email || ''
            }));
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        // For checkboxes use checked, for other inputs use value
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setResume(file);
                setFormData(prev => ({ ...prev, useExistingResume: false }));
            } else {
                toast.error('Please upload a PDF file');
                e.target.value = null;
            }
        }
    };

    // Helper to handle resume upload
    const uploadResume = async () => {
        // If using existing resume, no need to upload a new one
        if (formData.useExistingResume || !resume) {
            return null; // Return null to indicate no new upload
        }

        const formDataUpload = new FormData();
        formDataUpload.append('resume', resume);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formDataUpload,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                await fetchUserData(); // Refresh user data to get new resume URL
                return data.resume; // Return the new resume URL
            } else {
                throw new Error(data.message || 'Resume upload failed');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userToken) {
            toast.error('Please login to apply for this job');
            navigate('/login?redirect=' + encodeURIComponent(`/jobs/${job._id}`));
            return;
        }

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.phoneNumber) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);

            // Check if current user has a resume, if not and not uploading new one, show error
            if (!userData?.resume && !resume && formData.useExistingResume) {
                toast.error('Please upload a resume');
                return;
            }

            // Upload resume if a new one is provided
            if (resume && !formData.useExistingResume) {
                await uploadResume();
            }

            // Now submit the application
            const { data } = await axios.post(
                `${backendUrl}/api/users/apply`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Application submitted successfully');
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Apply job error:', error);
            toast.error(error.response?.data?.message || 'Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    // Education level options
    const educationOptions = [
        'High School',
        'Associate Degree',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD',
        'Other'
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for {job?.title}</h2>

            {userData?.resume && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-blue-800">You have a resume on file</p>
                            <p className="text-sm text-blue-600">You can use your existing resume or upload a new one</p>
                        </div>
                        <a
                            href={userData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                            View Resume
                        </a>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                                Birth Year
                            </label>
                            <input
                                type="number"
                                id="birthYear"
                                name="birthYear"
                                value={formData.birthYear}
                                onChange={handleInputChange}
                                min="1950"
                                max={new Date().getFullYear() - 15}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                            Highest Education
                        </label>
                        <select
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select education level</option>
                            {educationOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Resume</h3>

                    {userData?.resume && (
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id="useExistingResume"
                                name="useExistingResume"
                                checked={formData.useExistingResume}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="useExistingResume" className="ml-2 block text-sm text-gray-700">
                                Use my existing resume
                            </label>
                        </div>
                    )}

                    {(!userData?.resume || !formData.useExistingResume) && (
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Resume <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center">
                                <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    <span>{resume ? resume.name : "Choose PDF file"}</span>
                                    <input
                                        type="file"
                                        onChange={handleResumeChange}
                                        accept="application/pdf"
                                        className="sr-only"
                                        required={!userData?.resume}
                                    />
                                </label>
                                {resume && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResume(null);
                                            if (userData?.resume) {
                                                setFormData(prev => ({ ...prev, useExistingResume: true }));
                                            }
                                        }}
                                        className="ml-2 text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">PDF format only, max 2MB</p>
                        </div>
                    )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Cover Letter</h3>

                    <div className="form-group">
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                            Why are you interested in this position?
                        </label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Briefly describe why you're interested in this position and what makes you a good fit."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyJobForm;