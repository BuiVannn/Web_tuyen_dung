import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Building, Globe, Users, MapPin, Calendar, Phone, Mail, Edit } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const CompanyProfile = () => {
    const { companyData, companyToken, backendUrl, setCompanyData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        hiredCandidates: 0,
    });

    useEffect(() => {
        if (companyToken && companyData) {
            fetchCompanyStats();
        }
    }, [companyToken, companyData]);

    const fetchCompanyStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/companies/stats`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching company stats:', error);
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Company Header/Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 flex items-end">
                    <div className="container mx-auto px-6 relative">
                        <div className="absolute -bottom-16 flex items-end">
                            <ImageWithFallback
                                src={companyData.image}
                                alt={companyData.name}
                                className="w-32 h-32 rounded-lg border-4 border-white bg-white object-cover shadow-md"
                            />
                            <div className="ml-6 mb-4">
                                <h1 className="text-3xl font-bold text-white">{companyData.name}</h1>
                                <p className="text-blue-100 flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    {companyData.location || "Location not specified"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content with padding for absolute positioned image */}
                <div className="pt-20 px-6 pb-6">
                    <div className="flex justify-end mb-4">
                        <Link
                            to="/dashboard/edit-profile"
                            className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                        >
                            <Edit size={16} /> Edit Profile
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Jobs</p>
                                    <p className="text-2xl font-semibold">{stats.activeJobs}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Applications</p>
                                    <p className="text-2xl font-semibold">{stats.totalApplications}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Hired Candidates</p>
                                    <p className="text-2xl font-semibold">{stats.hiredCandidates}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">About Company</h2>
                                <p className="text-gray-700 mb-4">
                                    {companyData.description || "No company description provided yet. Add information about your company, mission, and values to attract the best candidates."}
                                </p>

                                {companyData.foundedYear && (
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Calendar size={18} className="mr-2" />
                                        <span>Founded: {companyData.foundedYear}</span>
                                    </div>
                                )}

                                {companyData.website && (
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Globe size={18} className="mr-2" />
                                        <a
                                            href={companyData.website.startsWith('http') ? companyData.website : `https://${companyData.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {companyData.website}
                                        </a>
                                    </div>
                                )}

                                {companyData.employees && (
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Users size={18} className="mr-2" />
                                        <span>{companyData.employees} Employees</span>
                                    </div>
                                )}
                            </div>

                            {companyData.benefits && companyData.benefits.length > 0 && (
                                <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-xl font-semibold mb-4">Company Benefits</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {companyData.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Mail size={18} className="text-gray-500 mr-2" />
                                        <span>{companyData.email}</span>
                                    </div>
                                    {companyData.phone && (
                                        <div className="flex items-center">
                                            <Phone size={18} className="text-gray-500 mr-2" />
                                            <span>{companyData.phone}</span>
                                        </div>
                                    )}
                                    {companyData.location && (
                                        <div className="flex items-center">
                                            <MapPin size={18} className="text-gray-500 mr-2" />
                                            <span>{companyData.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {companyData.industry && (
                                <div className="bg-white border rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold mb-4">Industry</h2>
                                    <div className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                                        {companyData.industry}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;