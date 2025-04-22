import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { XCircle, PlusCircle, Loader2 } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

// Industry options
const INDUSTRY_OPTIONS = [
    'Information Technology',
    'Healthcare',
    'Education',
    'Finance & Banking',
    'Manufacturing',
    'Retail',
    'Marketing & Advertising',
    'Construction',
    'Hospitality & Tourism',
    'Media & Entertainment',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Real Estate',
    'Legal Services',
    'Agriculture',
    'Non-Profit',
    'Telecommunications',
    'Automotive',
    'Consulting',
    'Other'
];

// Employee size options
const EMPLOYEE_SIZE_OPTIONS = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5001+ employees'
];

const EditCompanyProfile = () => {
    const navigate = useNavigate();
    const { companyData, companyToken, backendUrl, setCompanyData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        foundedYear: '',
        industry: '',
        employees: '',
        description: '',
        benefits: [],
        currentBenefit: '' // Temporary field for adding benefits
    });

    // Image file for upload
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (companyData) {
            setFormData({
                name: companyData.name || '',
                email: companyData.email || '',
                phone: companyData.phone || '',
                website: companyData.website || '',
                location: companyData.location || '',
                foundedYear: companyData.foundedYear || '',
                industry: companyData.industry || '',
                employees: companyData.employees || '',
                description: companyData.description || '',
                benefits: companyData.benefits || [],
                currentBenefit: ''
            });
            setPreviewImage(companyData.image);
        }
    }, [companyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const addBenefit = () => {
        if (formData.currentBenefit.trim()) {
            setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, prev.currentBenefit.trim()],
                currentBenefit: ''
            }));
        }
    };

    const removeBenefit = (index) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    };

    // Hàm xử lý submit trong component EditCompanyProfile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First, upload image if there's a new one
            let imageUrl = companyData.image;

            if (imageFile) {
                setUploadingImage(true);
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);

                const imageResponse = await axios.post(
                    `${backendUrl}/api/companies/upload-image`,
                    uploadFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${companyToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (imageResponse.data.success) {
                    imageUrl = imageResponse.data.imageUrl;
                } else {
                    toast.error('Failed to upload company logo');
                    setLoading(false);
                    setUploadingImage(false);
                    return;
                }
                setUploadingImage(false);
            }

            // Then update company profile
            const { currentBenefit, ...dataToSend } = formData;

            console.log("Sending data to update profile:", {
                ...dataToSend,
                image: imageUrl
            });

            const updateResponse = await axios.put(
                `${backendUrl}/api/companies/profile`,
                {
                    ...dataToSend,
                    image: imageUrl
                },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Update response:", updateResponse.data);

            if (updateResponse.data.success) {
                toast.success('Company profile updated successfully');

                // Cập nhật dữ liệu trong context
                setCompanyData(updateResponse.data.company);

                // Chuyển hướng sau khi đã cập nhật context
                navigate('/dashboard/profile');
            } else {
                toast.error(updateResponse.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit_0 = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First, upload image if there's a new one
            let imageUrl = companyData.image;

            if (imageFile) {
                setUploadingImage(true);
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);

                const imageResponse = await axios.post(
                    `${backendUrl}/api/companies/upload-image`,
                    uploadFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${companyToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (imageResponse.data.success) {
                    imageUrl = imageResponse.data.imageUrl;
                } else {
                    toast.error('Failed to upload company logo');
                    setLoading(false);
                    setUploadingImage(false);
                    return;
                }
                setUploadingImage(false);
            }

            // Then update company profile
            const { currentBenefit, ...dataToSend } = formData;

            const updateResponse = await axios.put(
                `${backendUrl}/api/companies/profile`,
                {
                    ...dataToSend,
                    image: imageUrl
                },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (updateResponse.data.success) {
                toast.success('Company profile updated successfully');
                setCompanyData(updateResponse.data.company);
                navigate('/dashboard/profile');
            } else {
                toast.error(updateResponse.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!companyData) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Company Profile</h1>

                <form onSubmit={handleSubmit}>
                    {/* Company Logo */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                        <div className="flex items-center">
                            <div className="relative">
                                <ImageWithFallback
                                    src={previewImage}
                                    alt={formData.name}
                                    className="w-24 h-24 rounded-lg object-cover border bg-gray-100"
                                />
                                {uploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                        <Loader2 className="animate-spin h-8 w-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-5">
                                <label htmlFor="company-logo" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                    Change Logo
                                </label>
                                <input
                                    id="company-logo"
                                    name="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Recommended: 400x400px, max 2MB
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name*</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Company Details */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Company Details</h2>

                            <div className="mb-4">
                                <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                                <input
                                    type="number"
                                    id="foundedYear"
                                    name="foundedYear"
                                    value={formData.foundedYear}
                                    onChange={handleChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                <select
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select an industry</option>
                                    {INDUSTRY_OPTIONS.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                <select
                                    id="employees"
                                    name="employees"
                                    value={formData.employees}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select company size</option>
                                    {EMPLOYEE_SIZE_OPTIONS.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe your company, mission, values, and what makes you unique..."
                        ></textarea>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Benefits</label>
                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={formData.currentBenefit}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentBenefit: e.target.value }))}
                                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add a benefit (e.g. Healthcare, Flexible work hours)"
                            />
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
                            >
                                <PlusCircle size={20} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                    <span className="text-sm">{benefit}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeBenefit(index)}
                                        className="ml-1 text-blue-500 hover:text-blue-700"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            ))}
                            {formData.benefits.length === 0 && (
                                <p className="text-sm text-gray-500">No benefits added yet. Benefits help attract better candidates!</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/profile')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyProfile;