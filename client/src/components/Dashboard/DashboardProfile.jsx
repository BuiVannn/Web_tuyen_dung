import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import {
    User, Briefcase, GraduationCap, MapPin, Mail, Phone,
    LinkedIn, GitHub, Globe, Upload, Edit, Save, X, AlertCircle
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

const DashboardProfile = () => {
    const { backendUrl, userToken, userData, fetchUserData } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        skills: [],
        experience: '',
        education: '',
        location: '',
        about: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userData) {
            setProfileData({
                name: userData.userId?.name || '',
                email: userData.userId?.email || '',
                phone: userData.phone || '',
                title: userData.title || '',
                skills: userData.skills || [],
                experience: userData.experience || '',
                education: userData.education || '',
                location: userData.location || '',
                about: userData.about || '',
                linkedinUrl: userData.linkedinUrl || '',
                githubUrl: userData.githubUrl || '',
                portfolioUrl: userData.portfolioUrl || ''
            });
        }
    }, [userData]);

    const handleSkillAdd = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            toast.info(`Resume selected: ${file.name}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Update basic profile data
            const profileResponse = await axios.put(
                `${backendUrl}/api/users/profile`,
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!profileResponse.data.success) {
                throw new Error(profileResponse.data.message || 'Failed to update profile');
            }

            // Upload avatar if selected
            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', avatarFile);

                const avatarResponse = await axios.post(
                    `${backendUrl}/api/users/update-avatar`,
                    avatarFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (!avatarResponse.data.success) {
                    throw new Error(avatarResponse.data.message || 'Failed to update avatar');
                }
            }

            // Upload resume if selected
            if (resumeFile) {
                const resumeFormData = new FormData();
                resumeFormData.append('resume', resumeFile);

                const resumeResponse = await axios.post(
                    `${backendUrl}/api/users/update-resume`,
                    resumeFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (!resumeResponse.data.success) {
                    throw new Error(resumeResponse.data.message || 'Failed to update resume');
                }
            }

            toast.success('Profile updated successfully');
            fetchUserData();
            setIsEditing(false);
            setAvatarFile(null);
            setResumeFile(null);

        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'An error occurred while updating profile');
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isEditing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isEditing ? (
                        <>
                            <X size={16} className="inline mr-1" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit size={16} className="inline mr-1" />
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Avatar Section */}
                            <div className="md:col-span-1">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <ImageWithFallback
                                            src={avatarPreview || userData.avatar}
                                            alt={profileData.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                        />
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                                            <Upload size={16} />
                                            <input
                                                type="file"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Resume/CV
                                        </label>
                                        <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <div className="flex text-sm text-gray-600">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleResumeChange}
                                                            accept=".pdf,.doc,.docx"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOC, DOCX up to 10MB
                                                </p>
                                                {resumeFile && (
                                                    <p className="text-sm text-blue-600 truncate">
                                                        {resumeFile.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {userData.resume && !resumeFile && (
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Current resume</span>
                                                <a
                                                    href={userData.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={profileData.title}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Frontend Developer"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="text"
                                            id="experience"
                                            name="experience"
                                            value={profileData.experience}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 3 years"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                                        About Me
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={4}
                                        value={profileData.about}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Write a short bio about yourself..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                                        Education
                                    </label>
                                    <textarea
                                        id="education"
                                        name="education"
                                        rows={3}
                                        value={profileData.education}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="List your educational background..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Skills
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {profileData.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleSkillRemove(skill)}
                                                    className="ml-1 text-blue-800 hover:text-blue-900"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Add a skill (e.g. JavaScript)"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSkillAdd}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                            LinkedIn URL
                                        </label>
                                        <input
                                            type="url"
                                            id="linkedinUrl"
                                            name="linkedinUrl"
                                            value={profileData.linkedinUrl}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            id="githubUrl"
                                            name="githubUrl"
                                            value={profileData.githubUrl}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                            Portfolio URL
                                        </label>
                                        <input
                                            type="url"
                                            id="portfolioUrl"
                                            name="portfolioUrl"
                                            value={profileData.portfolioUrl}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://yourportfolio.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Image Section */}
                        <div className="md:col-span-1">
                            <div className="flex flex-col items-center space-y-4">
                                <ImageWithFallback
                                    src={userData.avatar}
                                    alt={userData.userId?.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {userData.userId?.name}
                                </h3>
                                <p className="text-gray-600">{userData.title || 'Job Seeker'}</p>

                                {userData.resume && (
                                    <a
                                        href={userData.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-100"
                                    >
                                        <Upload size={16} className="mr-2" />
                                        View Resume
                                    </a>
                                )}

                                <div className="w-full pt-4 border-t border-gray-200 mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center text-gray-600">
                                            <Mail size={16} className="mr-2 text-gray-400" />
                                            {userData.userId?.email}
                                        </li>
                                        {userData.phone && (
                                            <li className="flex items-center text-gray-600">
                                                <Phone size={16} className="mr-2 text-gray-400" />
                                                {userData.phone}
                                            </li>
                                        )}
                                        {userData.location && (
                                            <li className="flex items-center text-gray-600">
                                                <MapPin size={16} className="mr-2 text-gray-400" />
                                                {userData.location}
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="w-full pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Social Profiles</h4>
                                    <ul className="space-y-2">
                                        {userData.linkedinUrl && (
                                            <li>
                                                <a
                                                    href={userData.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-gray-600 hover:text-blue-600"
                                                >
                                                    <LinkedIn size={16} className="mr-2 text-blue-500" />
                                                    LinkedIn Profile
                                                </a>
                                            </li>
                                        )}
                                        {userData.githubUrl && (
                                            <li>
                                                <a
                                                    href={userData.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-gray-600 hover:text-gray-800"
                                                >
                                                    <GitHub size={16} className="mr-2 text-gray-800" />
                                                    GitHub Profile
                                                </a>
                                            </li>
                                        )}
                                        {userData.portfolioUrl && (
                                            <li>
                                                <a
                                                    href={userData.portfolioUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-gray-600 hover:text-green-600"
                                                >
                                                    <Globe size={16} className="mr-2 text-green-500" />
                                                    Portfolio Website
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="md:col-span-2 space-y-6">
                            {userData.about && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">About Me</h3>
                                    <p className="text-gray-700 whitespace-pre-line">{userData.about}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                                {userData.skills && userData.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No skills added yet</p>
                                )}
                            </div>

                            {userData.experience && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                                        <Briefcase size={18} className="mr-2 text-gray-600" />
                                        Work Experience
                                    </h3>
                                    <p className="text-gray-700">{userData.experience}</p>
                                </div>
                            )}

                            {userData.education && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                                        <GraduationCap size={18} className="mr-2 text-gray-600" />
                                        Education
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line">{userData.education}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardProfile;