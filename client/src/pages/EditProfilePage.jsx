import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast, Slide } from 'react-toastify';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { backendUrl, userToken } = useContext(AppContext);
    const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'basic');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState({
        title: '',
        bio: '',
        phone: '',
        location: '',
        skills: [],
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: ''
        },
        education: [],
        experience: [],
        projects: [],
        languages: [],
        certificates: [],
        interests: []
    });

    // State cho việc nhập kỹ năng
    const [skillInput, setSkillInput] = useState('');

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (data.success && data.profile) {
                    console.log("Loaded profile data:", data.profile);

                    // Đặt dữ liệu profile vào state
                    setUserProfile({
                        title: data.profile.title || '',
                        bio: data.profile.bio || '',
                        phone: data.profile.phone || '',
                        location: data.profile.location || '',
                        skills: data.profile.skills || [],
                        socialLinks: data.profile.socialLinks || {
                            linkedin: '',
                            github: '',
                            portfolio: ''
                        },
                        education: data.profile.education && data.profile.education.length > 0
                            ? data.profile.education
                            : [],
                        experience: data.profile.experience && data.profile.experience.length > 0
                            ? data.profile.experience
                            : [],
                        projects: data.profile.projects && data.profile.projects.length > 0
                            ? data.profile.projects
                            : [],
                        languages: data.profile.languages && data.profile.languages.length > 0
                            ? data.profile.languages
                            : [],
                        certificates: data.profile.certificates && data.profile.certificates.length > 0
                            ? data.profile.certificates
                            : [],
                        interests: data.profile.interests && data.profile.interests.length > 0
                            ? data.profile.interests
                            : [],
                        availability: data.profile.availability || 'Đang tìm việc'
                    });

                    if (data.profile.interests && data.profile.interests.length > 0) {
                        setInterestsInput(data.profile.interests.join(', '));
                    }
                    // Nếu section được chỉ định trong URL, di chuyển đến section đó
                    const section = searchParams.get('section');
                    if (section) {
                        setActiveSection(section);
                    }
                } else {
                    toast.error("Không thể tải thông tin hồ sơ");
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Không thể tải thông tin hồ sơ');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [backendUrl, userToken, searchParams]);

    // Handle input changes for basic fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile({ ...userProfile, [name]: value });
    };

    // Handle social links change
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setUserProfile({
            ...userProfile,
            socialLinks: { ...userProfile.socialLinks, [name]: value }
        });
    };

    // Handle skill input change
    const handleSkillInputChange = (e) => {
        setSkillInput(e.target.value);
    };

    // Handle adding a skill (fixed)
    const handleAddSkill = () => {
        if (skillInput.trim()) {
            // Chia chuỗi nhập vào thành mảng kỹ năng, phân tách bởi dấu phẩy
            const newSkills = skillInput
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill && !userProfile.skills.includes(skill));

            // Cập nhật danh sách kỹ năng
            if (newSkills.length > 0) {
                setUserProfile({
                    ...userProfile,
                    skills: [...userProfile.skills, ...newSkills]
                });
                setSkillInput(''); // Xóa input sau khi thêm
            }
        }
    };

    // Handle removing a skill
    const handleRemoveSkill = (skillToRemove) => {
        setUserProfile({
            ...userProfile,
            skills: userProfile.skills.filter(skill => skill !== skillToRemove)
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Xử lý interests từ input trước khi gửi
            const processedInterests = interestsInput
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            // Tạo object mới với dữ liệu đã xử lý
            const updatedProfile = {
                ...userProfile,
                interests: processedInterests
            };

            // Gửi request cập nhật lên server
            const response = await axios.put(
                `${backendUrl}/api/users/profile`,
                updatedProfile,
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                toast.success('Hồ sơ đã được cập nhật thành công');
                navigate('/profile');
            } else {
                toast.error(response.data.message || 'Không thể cập nhật hồ sơ');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    // Handle adding new education entry
    const addEducation = () => {
        setUserProfile({
            ...userProfile,
            education: [
                ...userProfile.education,
                { school: '', degree: '', fieldOfStudy: '', from: '', to: '', description: '' }
            ]
        });
    };

    // Handle adding new experience entry
    const addExperience = () => {
        setUserProfile({
            ...userProfile,
            experience: [
                ...userProfile.experience,
                { position: '', company: '', from: '', to: '', current: false, description: '' }
            ]
        });
    };

    // Handle adding new project
    const addProject = () => {
        setUserProfile({
            ...userProfile,
            projects: [
                ...userProfile.projects,
                { name: '', technologies: '', description: '', url: '' }
            ]
        });
    };

    // Handle education field changes
    const handleEducationChange = (index, field, value) => {
        const newEducation = [...userProfile.education];
        newEducation[index][field] = value;
        setUserProfile({ ...userProfile, education: newEducation });
    };

    // Handle experience field changes
    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...userProfile.experience];
        newExperience[index][field] = value;
        setUserProfile({ ...userProfile, experience: newExperience });
    };

    // Handle project field changes
    const handleProjectChange = (index, field, value) => {
        const newProjects = [...userProfile.projects];
        newProjects[index][field] = value;
        setUserProfile({ ...userProfile, projects: newProjects });
    };

    // Remove education entry
    const removeEducation = (index) => {
        setUserProfile({
            ...userProfile,
            education: userProfile.education.filter((_, i) => i !== index)
        });
    };

    // Remove experience entry
    const removeExperience = (index) => {
        setUserProfile({
            ...userProfile,
            experience: userProfile.experience.filter((_, i) => i !== index)
        });
    };

    // Remove project
    const removeProject = (index) => {
        setUserProfile({
            ...userProfile,
            projects: userProfile.projects.filter((_, i) => i !== index)
        });
    };

    const handleAvailabilityChange = (e) => {
        setUserProfile({
            ...userProfile,
            availability: e.target.value
        });
    };

    const addLanguage = () => {
        setUserProfile(prev => ({
            ...prev,
            languages: [...prev.languages, { name: '', level: '' }]
        }));
    };

    const handleLanguageChange = (index, field, value) => {
        setUserProfile(prev => {
            const updatedLanguages = [...prev.languages];
            updatedLanguages[index] = {
                ...updatedLanguages[index],
                [field]: value
            };
            return { ...prev, languages: updatedLanguages };
        });
    };

    const removeLanguage = (index) => {
        setUserProfile(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const addCertificate = () => {
        setUserProfile(prev => ({
            ...prev,
            certificates: [...prev.certificates, { name: '', issuer: '', date: '', url: '' }]
        }));
    };

    const handleCertificateChange = (index, field, value) => {
        setUserProfile(prev => {
            const updatedCertificates = [...prev.certificates];
            updatedCertificates[index] = {
                ...updatedCertificates[index],
                [field]: value
            };
            return { ...prev, certificates: updatedCertificates };
        });
    };

    const removeCertificate = (index) => {
        setUserProfile(prev => ({
            ...prev,
            certificates: prev.certificates.filter((_, i) => i !== index)
        }));
    };

    // Thêm state mới cho giá trị thô
    const [interestsInput, setInterestsInput] = useState('');

    // Cập nhật trong useEffect để khởi tạo giá trị
    useEffect(() => {
        if (userProfile.interests && userProfile.interests.length > 0) {
            setInterestsInput(userProfile.interests.join(', '));
        }
    }, [userProfile.interests]);

    // Hàm xử lý thay đổi input
    const handleInterestsInputChange = (e) => {
        setInterestsInput(e.target.value);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <Loading />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-blue-600 text-white">
                        <h1 className="text-xl font-semibold">Chỉnh sửa hồ sơ</h1>
                    </div>

                    <div className="p-6">
                        {/* Section tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-6">
                                <button
                                    onClick={() => setActiveSection('basic')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'basic'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Thông tin cơ bản
                                </button>
                                <button
                                    onClick={() => setActiveSection('education')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'education'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Học vấn
                                </button>
                                <button
                                    onClick={() => setActiveSection('experience')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'experience'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Kinh nghiệm
                                </button>
                                <button
                                    onClick={() => setActiveSection('projects')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'projects'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Dự án
                                </button>
                                <button
                                    onClick={() => setActiveSection('additional')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'additional'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Thông tin bổ sung
                                </button>
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            {activeSection === 'basic' && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Chức danh</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={userProfile.title || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ví dụ: Frontend Developer"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Giới thiệu bản thân</label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows="4"
                                            value={userProfile.bio || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Giới thiệu ngắn về bản thân..."
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={userProfile.phone || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Số điện thoại liên hệ"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm</label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={userProfile.location || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Thành phố, quốc gia"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Kỹ năng</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                id="skills"
                                                value={skillInput}
                                                onChange={handleSkillInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nhập các kỹ năng, phân cách bằng dấu phẩy (,)"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSkill();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSkill}
                                                className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {userProfile.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                                                    >
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Ví dụ: JavaScript, React, Node.js</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Liên kết mạng xã hội</h3>

                                        <div className="mt-3 space-y-4">
                                            <div>
                                                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                                                <input
                                                    type="url"
                                                    id="linkedin"
                                                    name="linkedin"
                                                    value={userProfile.socialLinks?.linkedin || ''}
                                                    onChange={handleSocialChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
                                                <input
                                                    type="url"
                                                    id="github"
                                                    name="github"
                                                    value={userProfile.socialLinks?.github || ''}
                                                    onChange={handleSocialChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="https://github.com/username"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">Portfolio/Website</label>
                                                <input
                                                    type="url"
                                                    id="portfolio"
                                                    name="portfolio"
                                                    value={userProfile.socialLinks?.portfolio || ''}
                                                    onChange={handleSocialChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Trạng thái tìm việc</label>
                                        <select
                                            id="availability"
                                            name="availability"
                                            value={userProfile.availability || 'Đang tìm việc'}
                                            onChange={handleAvailabilityChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Đang tìm việc">Đang tìm việc</option>
                                            <option value="Đang làm việc">Đang làm việc</option>
                                            <option value="Sẵn sàng cho cơ hội mới">Sẵn sàng cho cơ hội mới</option>
                                            <option value="Không tìm việc">Không tìm việc</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {activeSection === 'education' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Học vấn</h3>
                                        <button
                                            type="button"
                                            onClick={addEducation}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Thêm học vấn
                                        </button>
                                    </div>

                                    {userProfile.education.length === 0 ? (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">Bạn chưa thêm thông tin học vấn nào</p>
                                            <button
                                                type="button"
                                                onClick={addEducation}
                                                className="mt-2 text-blue-600 hover:underline"
                                            >
                                                Thêm thông tin học vấn
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {userProfile.education.map((edu, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Trường</label>
                                                            <input
                                                                type="text"
                                                                value={edu.school || ''}
                                                                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Tên trường"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                                                            <input
                                                                type="text"
                                                                value={edu.degree || ''}
                                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Ví dụ: Cử nhân, Thạc sĩ"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Chuyên ngành</label>
                                                        <input
                                                            type="text"
                                                            value={edu.fieldOfStudy || ''}
                                                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Chuyên ngành học"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Từ</label>
                                                            <input
                                                                type="date"
                                                                value={edu.from ? new Date(edu.from).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => handleEducationChange(index, 'from', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Đến</label>
                                                            <input
                                                                type="date"
                                                                value={edu.to ? new Date(edu.to).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => handleEducationChange(index, 'to', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                                        <textarea
                                                            rows="3"
                                                            value={edu.description || ''}
                                                            onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Mô tả về quá trình học tập"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Experience */}
                            {activeSection === 'experience' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Kinh nghiệm làm việc</h3>
                                        <button
                                            type="button"
                                            onClick={addExperience}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Thêm kinh nghiệm
                                        </button>
                                    </div>

                                    {userProfile.experience.length === 0 ? (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">Bạn chưa thêm kinh nghiệm làm việc nào</p>
                                            <button
                                                type="button"
                                                onClick={addExperience}
                                                className="mt-2 text-blue-600 hover:underline"
                                            >
                                                Thêm kinh nghiệm làm việc
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {userProfile.experience.map((exp, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                                            <input
                                                                type="text"
                                                                value={exp.position || ''}
                                                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Vị trí công việc"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Công ty</label>
                                                            <input
                                                                type="text"
                                                                value={exp.company || ''}
                                                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Tên công ty"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Từ</label>
                                                            <input
                                                                type="date"
                                                                value={exp.from ? new Date(exp.from).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => handleExperienceChange(index, 'from', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Đến</label>
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="date"
                                                                    value={exp.to ? new Date(exp.to).toISOString().split('T')[0] : ''}
                                                                    onChange={(e) => handleExperienceChange(index, 'to', e.target.value)}
                                                                    disabled={exp.current}
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div className="mt-1 flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`current-${index}`}
                                                                    checked={exp.current || false}
                                                                    onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                                                                    Hiện tại đang làm việc
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
                                                        <textarea
                                                            rows="3"
                                                            value={exp.description || ''}
                                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Mô tả về trách nhiệm và thành tựu"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Projects */}
                            {activeSection === 'projects' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dự án</h3>
                                        <button
                                            type="button"
                                            onClick={addProject}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Thêm dự án
                                        </button>
                                    </div>

                                    {userProfile.projects.length === 0 ? (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">Bạn chưa thêm dự án nào</p>
                                            <button
                                                type="button"
                                                onClick={addProject}
                                                className="mt-2 text-blue-600 hover:underline"
                                            >
                                                Thêm dự án
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {userProfile.projects.map((project, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProject(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Tên dự án</label>
                                                        <input
                                                            type="text"
                                                            value={project.name || ''}
                                                            onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Tên dự án"
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Công nghệ sử dụng</label>
                                                        <input
                                                            type="text"
                                                            value={project.technologies || ''}
                                                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="React, Node.js, MongoDB..."
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">URL</label>
                                                        <input
                                                            type="url"
                                                            value={project.url || ''}
                                                            onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://github.com/username/project-name"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Mô tả dự án</label>
                                                        <textarea
                                                            rows="3"
                                                            value={project.description || ''}
                                                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Mô tả về dự án, đóng góp của bạn và kết quả đạt được"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Additional */}
                            {activeSection === 'additional' && (
                                <div className="space-y-6">
                                    {/* Languages */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Ngôn ngữ</h3>
                                        <div className="space-y-4">
                                            {userProfile.languages && userProfile.languages.map((lang, index) => (
                                                <div key={index} className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={lang.name || ''}
                                                        onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                                                        placeholder="Tên ngôn ngữ"
                                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                    />
                                                    <select
                                                        value={lang.level || ''}
                                                        onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                    >
                                                        <option value="">Chọn trình độ</option>
                                                        <option value="Cơ bản">Cơ bản</option>
                                                        <option value="Trung cấp">Trung cấp</option>
                                                        <option value="Thành thạo">Thành thạo</option>
                                                        <option value="Bản ngữ">Bản ngữ</option>
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLanguage(index)}
                                                        className="p-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addLanguage}
                                                className="text-blue-600 hover:underline flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Thêm ngôn ngữ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Certificates */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Chứng chỉ</h3>
                                        <div className="space-y-4">
                                            {userProfile.certificates && userProfile.certificates.map((cert, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertificate(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
                                                            <input
                                                                type="text"
                                                                value={cert.name || ''}
                                                                onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                                placeholder="Ví dụ: AWS Certified Developer"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Tổ chức cấp</label>
                                                            <input
                                                                type="text"
                                                                value={cert.issuer || ''}
                                                                onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                                placeholder="Ví dụ: Amazon Web Services"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Ngày cấp</label>
                                                            <input
                                                                type="date"
                                                                value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">URL xác thực (nếu có)</label>
                                                            <input
                                                                type="url"
                                                                value={cert.url || ''}
                                                                onChange={(e) => handleCertificateChange(index, 'url', e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                                placeholder="https://example.com/verify/cert123"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addCertificate}
                                                className="text-blue-600 hover:underline flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Thêm chứng chỉ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Sở thích</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Các sở thích của bạn</label>
                                            <textarea
                                                value={interestsInput}
                                                onChange={handleInterestsInputChange}
                                                rows="3"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                placeholder="Đọc sách, Du lịch, Thể thao, Âm nhạc,..."
                                            ></textarea>
                                            <p className="mt-1 text-xs text-gray-500">Phân cách bằng dấu phẩy (,)</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="mt-6 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfilePage;
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Loading from '../components/Loading';
// import { Save, X } from 'lucide-react'; // Icons

// const EditProfilePage = () => {
//     const { backendUrl, userToken, fetchUserProfile } = useContext(AppContext); // Giả sử có hàm fetchUserProfile
//     const navigate = useNavigate();
//     const [profileData, setProfileData] = useState({
//         phone: '',
//         location: '',
//         bio: '',
//         skills: [],
//         education: [],
//         experience: [],
//         socialLinks: { linkedin: '', github: '', portfolio: '' }
//         // Không bao gồm name, email, avatar, resume ở đây vì chúng được quản lý riêng hoặc không đổi
//     });
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState(null);
//     const [skillInput, setSkillInput] = useState(''); // Input cho kỹ năng mới

//     // Fetch current profile data on mount
//     useEffect(() => {
//         const fetchProfile = async () => {
//             if (!userToken) {
//                 navigate('/login'); // Redirect nếu chưa đăng nhập
//                 return;
//             }
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(`${backendUrl}/api/users/profile`, {
//                     headers: { 'Authorization': `Bearer ${userToken}` }
//                 });
//                 if (response.data.success && response.data.profile) {
//                     const fetchedProfile = response.data.profile;
//                     // Chỉ lấy các trường có thể chỉnh sửa vào state
//                     setProfileData({
//                         phone: fetchedProfile.phone || '',
//                         location: fetchedProfile.location || '',
//                         bio: fetchedProfile.bio || '',
//                         skills: fetchedProfile.skills || [],
//                         education: fetchedProfile.education || [],
//                         experience: fetchedProfile.experience || [],
//                         socialLinks: fetchedProfile.socialLinks || { linkedin: '', github: '', portfolio: '' }
//                     });
//                 } else {
//                     setError(response.data.message || "Failed to fetch profile data.");
//                     toast.error("Không thể tải dữ liệu hồ sơ để chỉnh sửa.");
//                 }
//             } catch (err) {
//                 console.error("Error fetching profile for edit:", err);
//                 setError(err.response?.data?.message || err.message || "An error occurred.");
//                 toast.error("Lỗi khi tải dữ liệu hồ sơ.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProfile();
//     }, [backendUrl, userToken, navigate]);

//     // --- Handlers for simple fields ---
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProfileData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSocialChange = (e) => {
//         const { name, value } = e.target;
//         setProfileData(prev => ({
//             ...prev,
//             socialLinks: { ...prev.socialLinks, [name]: value }
//         }));
//     };

//     // --- Handlers for Skills ---
//     const handleAddSkill = () => {
//         if (skillInput && !profileData.skills.includes(skillInput.trim())) {
//             setProfileData(prev => ({
//                 ...prev,
//                 skills: [...prev.skills, skillInput.trim()]
//             }));
//             setSkillInput(''); // Clear input
//         }
//     };

//     const handleRemoveSkill = (skillToRemove) => {
//         setProfileData(prev => ({
//             ...prev,
//             skills: prev.skills.filter(skill => skill !== skillToRemove)
//         }));
//     };

//     // --- Handlers for Education/Experience (Simplified Example) ---
//     // (Bạn có thể tạo component riêng cho việc thêm/sửa/xóa Education/Experience phức tạp hơn)
//     const handleAddItem = (field) => {
//         setProfileData(prev => ({
//             ...prev,
//             [field]: [...prev[field], {}] // Thêm một object rỗng
//         }));
//     };

//     const handleRemoveItem = (field, index) => {
//         setProfileData(prev => ({
//             ...prev,
//             [field]: prev[field].filter((_, i) => i !== index)
//         }));
//     };

//     const handleItemChange = (field, index, e) => {
//         const { name, value } = e.target;
//         setProfileData(prev => {
//             const updatedItems = [...prev[field]];
//             updatedItems[index] = { ...updatedItems[index], [name]: value };
//             return { ...prev, [field]: updatedItems };
//         });
//     };


//     // --- Form Submission ---
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         setError(null);
//         try {
//             const response = await axios.put(`${backendUrl}/api/users/profile`, profileData, {
//                 headers: { 'Authorization': `Bearer ${userToken}` }
//             });
//             if (response.data.success) {
//                 toast.success("Profile updated successfully!");
//                 if (fetchUserProfile) fetchUserProfile(); // Cập nhật context nếu có
//                 navigate('/dashboard/profile'); // Quay về trang profile
//             } else {
//                 setError(response.data.message || "Failed to update profile.");
//                 toast.error(response.data.message || "Cập nhật hồ sơ thất bại.");
//             }
//         } catch (err) {
//             console.error("Error updating profile:", err);
//             const message = err.response?.data?.message || err.message || "An error occurred.";
//             setError(message);
//             // Hiển thị lỗi validation nếu có
//             if (err.response?.data?.errors) {
//                 Object.values(err.response.data.errors).forEach(errorMsg => toast.error(errorMsg.message));
//             } else {
//                 toast.error("Lỗi khi cập nhật hồ sơ.");
//             }
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen"><Loading /></div>;
//     }

//     if (error && !profileData) { // Chỉ hiển thị lỗi nghiêm trọng nếu không load được data ban đầu
//         return <div className="container mx-auto p-4 text-center text-red-600">{error}</div>;
//     }

//     return (
//         <div className="container mx-auto p-4 sm:p-8">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Edit Your Profile</h2>
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">

//                 {/* Basic Info */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                         <input
//                             type="tel"
//                             id="phone"
//                             name="phone"
//                             value={profileData.phone}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             placeholder="Your phone number"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                         <input
//                             type="text"
//                             id="location"
//                             name="location"
//                             value={profileData.location}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             placeholder="City, Country"
//                         />
//                     </div>
//                 </div>

//                 {/* Bio */}
//                 <div>
//                     <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About Me (Bio)</label>
//                     <textarea
//                         id="bio"
//                         name="bio"
//                         rows="4"
//                         value={profileData.bio}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         placeholder="Tell us a little about yourself..."
//                     ></textarea>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
//                     <div className="flex items-center gap-2 mb-2">
//                         <input
//                             type="text"
//                             value={skillInput}
//                             onChange={(e) => setSkillInput(e.target.value)}
//                             className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             placeholder="Add a skill (e.g., React, Node.js)"
//                             onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
//                         />
//                         <button
//                             type="button"
//                             onClick={handleAddSkill}
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
//                         >
//                             Add
//                         </button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                         {profileData.skills.map((skill, index) => (
//                             <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                                 {skill}
//                                 <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700">
//                                     <X size={14} />
//                                 </button>
//                             </span>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Education - Simplified Example */}
//                 <div className="border-t pt-6">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-800">Education</h3>
//                     {profileData.education.map((edu, index) => (
//                         <div key={index} className="mb-4 p-4 border rounded-md relative space-y-3">
//                             <button
//                                 type="button"
//                                 onClick={() => handleRemoveItem('education', index)}
//                                 className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                             >
//                                 <X size={18} />
//                             </button>
//                             <input type="text" name="school" value={edu.school || ''} onChange={(e) => handleItemChange('education', index, e)} placeholder="School/University" className="w-full px-3 py-2 border rounded-md" />
//                             <input type="text" name="degree" value={edu.degree || ''} onChange={(e) => handleItemChange('education', index, e)} placeholder="Degree" className="w-full px-3 py-2 border rounded-md" />
//                             {/* Add other fields: fieldOfStudy, from, to, description */}
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => handleAddItem('education')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
//                         + Add Education
//                     </button>
//                 </div>

//                 {/* Experience - Simplified Example */}
//                 <div className="border-t pt-6">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-800">Work Experience</h3>
//                     {profileData.experience.map((exp, index) => (
//                         <div key={index} className="mb-4 p-4 border rounded-md relative space-y-3">
//                             <button
//                                 type="button"
//                                 onClick={() => handleRemoveItem('experience', index)}
//                                 className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                             >
//                                 <X size={18} />
//                             </button>
//                             <input type="text" name="company" value={exp.company || ''} onChange={(e) => handleItemChange('experience', index, e)} placeholder="Company Name" className="w-full px-3 py-2 border rounded-md" />
//                             <input type="text" name="position" value={exp.position || ''} onChange={(e) => handleItemChange('experience', index, e)} placeholder="Job Title" className="w-full px-3 py-2 border rounded-md" />
//                             {/* Add other fields: from, to, description */}
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => handleAddItem('experience')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
//                         + Add Experience
//                     </button>
//                 </div>


//                 {/* Social Links */}
//                 <div className="border-t pt-6">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-800">Social Links</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
//                             <input type="url" id="linkedin" name="linkedin" value={profileData.socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 border rounded-md" />
//                         </div>
//                         <div>
//                             <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
//                             <input type="url" id="github" name="github" value={profileData.socialLinks.github} onChange={handleSocialChange} placeholder="https://github.com/..." className="w-full px-3 py-2 border rounded-md" />
//                         </div>
//                         <div>
//                             <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">Portfolio/Website</label>
//                             <input type="url" id="portfolio" name="portfolio" value={profileData.socialLinks.portfolio} onChange={handleSocialChange} placeholder="https://yourportfolio.com" className="w-full px-3 py-2 border rounded-md" />
//                         </div>
//                     </div>
//                 </div>


//                 {/* Error Message */}
//                 {error && <p className="text-red-600 text-sm">{error}</p>}

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-4 pt-4 border-t">
//                     <button
//                         type="button"
//                         onClick={() => navigate('/dashboard/profile')} // Go back without saving
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-200"
//                         disabled={saving}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 inline-flex items-center gap-2"
//                         disabled={saving}
//                     >
//                         {saving ? <Loading size={20} /> : <Save size={20} />}
//                         {saving ? 'Saving...' : 'Save Changes'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditProfilePage;

// import React, { useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import Navbar from "../components/Navbar";

// const EditProfilePage = () => {
//     const defaultUserData = {
//         name: "Bui Mau Van",
//         title: "AI researcher",
//         location: "TP. Ha Noi",
//         avatar: "/api/placeholder/100/100",
//         email: "buimauvan004@.com",
//         phone: "0123456789",
//         summary: "AI với 3 năm kinh nghiệm làm việc với ML, DL. Tôi đam mê tạo ra những mô hình AI tốt.",
//         skills: ["Machine Learning", "DeepLearning", "Python", "JavaScript", "HTML/CSS", "Java", "Tailwind CSS", "Git"],
//         experience: [
//             {
//                 company: "Tech Solutions Inc.",
//                 position: "Fullstack Developer",
//                 duration: "01/2030 - Hiện tại",
//                 description: "Phát triển và bảo trì các ứng dụng web sử dụng ReactJS và Redux. Tối ưu hiệu suất ứng dụng và cải thiện trải nghiệm người dùng."
//             },
//             {
//                 company: "Vin AI",
//                 position: "Junior Developer",
//                 duration: "06/2026 - 12/2030",
//                 description: "Làm việc trong nhóm phát triển thuật toán AI"
//             }
//         ],
//         education: [
//             {
//                 school: "Học Viện Công nghệ Bưu chính Viễn thông",
//                 degree: "Kỹ sư Công nghệ thông tin",
//                 year: "2022-2027"
//             }
//         ],
//         projects: [
//             {
//                 name: "E-commerce Platform",
//                 description: "Website thương mại điện tử với tính năng giỏ hàng, thanh toán và quản lý đơn hàng.",
//                 technologies: "ReactJS, NodeJS, MongoDB"
//             }
//         ],
//         languages: ["Tiếng Việt (Bản địa)", "Tiếng Anh (Trung cấp)"],
//         certificates: ["AWS Certified Developer", "React Developer Certificate"]
//     };

//     const { register, control, handleSubmit, reset } = useForm({
//         defaultValues: defaultUserData
//     });

//     const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
//         control,
//         name: "experience"
//     });

//     const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
//         control,
//         name: "education"
//     });

//     const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
//         control,
//         name: "projects"
//     });

//     const onSubmit = (data) => {
//         console.log("Dữ liệu đã chỉnh sửa:", data);
//         // Gửi dữ liệu lên backend (Node.js API) tại đây
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//                 <h1 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h1>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Thông tin cơ bản */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium">Họ và tên</label>
//                                 <input
//                                     {...register("name")}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Chức danh</label>
//                                 <input
//                                     {...register("title")}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Địa điểm</label>
//                                 <input
//                                     {...register("location")}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Email</label>
//                                 <input
//                                     {...register("email")}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Số điện thoại</label>
//                                 <input
//                                     {...register("phone")}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                 />
//                             </div>
//                         </div>
//                         <label className="block text-sm font-medium mt-4">Giới thiệu</label>
//                         <textarea
//                             {...register("summary")}
//                             className="mt-1 p-2 w-full border rounded-md"
//                             rows="4"
//                         />
//                     </div>

//                     {/* Kỹ năng */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Kỹ năng</h2>
//                         <input
//                             {...register("skills")}
//                             className="mt-1 p-2 w-full border rounded-md"
//                             placeholder="Nhập kỹ năng, cách nhau bằng dấu phẩy"
//                         />
//                     </div>

//                     {/* Kinh nghiệm làm việc */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Kinh nghiệm làm việc</h2>
//                         {experienceFields.map((item, index) => (
//                             <div key={item.id} className="mb-4 p-4 border rounded-md">
//                                 <input
//                                     {...register(`experience.${index}.company`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Tên công ty"
//                                 />
//                                 <input
//                                     {...register(`experience.${index}.position`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Vị trí"
//                                 />
//                                 <input
//                                     {...register(`experience.${index}.duration`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Thời gian"
//                                 />
//                                 <textarea
//                                     {...register(`experience.${index}.description`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Mô tả"
//                                     rows="3"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeExperience(index)}
//                                     className="mt-2 text-red-500"
//                                 >
//                                     Xóa
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => appendExperience({ company: "", position: "", duration: "", description: "" })}
//                             className="text-blue-500"
//                         >
//                             + Thêm kinh nghiệm
//                         </button>
//                     </div>

//                     {/* Học vấn */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Học vấn</h2>
//                         {educationFields.map((item, index) => (
//                             <div key={item.id} className="mb-4 p-4 border rounded-md">
//                                 <input
//                                     {...register(`education.${index}.school`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Trường học"
//                                 />
//                                 <input
//                                     {...register(`education.${index}.degree`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Bằng cấp"
//                                 />
//                                 <input
//                                     {...register(`education.${index}.year`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Năm"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeEducation(index)}
//                                     className="mt-2 text-red-500"
//                                 >
//                                     Xóa
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => appendEducation({ school: "", degree: "", year: "" })}
//                             className="text-blue-500"
//                         >
//                             + Thêm học vấn
//                         </button>
//                     </div>

//                     {/* Dự án */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Dự án</h2>
//                         {projectFields.map((item, index) => (
//                             <div key={item.id} className="mb-4 p-4 border rounded-md">
//                                 <input
//                                     {...register(`projects.${index}.name`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Tên dự án"
//                                 />
//                                 <textarea
//                                     {...register(`projects.${index}.description`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Mô tả"
//                                     rows="3"
//                                 />
//                                 <input
//                                     {...register(`projects.${index}.technologies`)}
//                                     className="mt-1 p-2 w-full border rounded-md"
//                                     placeholder="Công nghệ sử dụng"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeProject(index)}
//                                     className="mt-2 text-red-500"
//                                 >
//                                     Xóa
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => appendProject({ name: "", description: "", technologies: "" })}
//                             className="text-blue-500"
//                         >
//                             + Thêm dự án
//                         </button>
//                     </div>

//                     {/* Ngôn ngữ và chứng chỉ */}
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Ngôn ngữ</h2>
//                         <input
//                             {...register("languages")}
//                             className="mt-1 p-2 w-full border rounded-md"
//                             placeholder="Nhập ngôn ngữ, cách nhau bằng dấu phẩy"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold mb-4">Chứng chỉ</h2>
//                         <input
//                             {...register("certificates")}
//                             className="mt-1 p-2 w-full border rounded-md"
//                             placeholder="Nhập chứng chỉ, cách nhau bằng dấu phẩy"
//                         />
//                     </div>

//                     {/* Nút điều khiển */}
//                     <div className="flex justify-end gap-4">
//                         <button
//                             type="button"
//                             onClick={() => reset()}
//                             className="px-4 py-2 bg-gray-300 rounded-md"
//                         >
//                             Hủy
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//                         >
//                             Lưu
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default EditProfilePage;