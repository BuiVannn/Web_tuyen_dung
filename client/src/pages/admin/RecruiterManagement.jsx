// src/pages/Admin/RecruiterManagement.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Building } from 'lucide-react';

const RecruiterManagement = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterVerified, setFilterVerified] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    useEffect(() => {
        // Simulate API call to fetch recruiters
        setTimeout(() => {
            const dummyRecruiters = [
                {
                    id: 1,
                    name: 'Toan',
                    email: 'b@techcorp.com',
                    phone: '0123456789',
                    company: 'Tech Corporation',
                    position: 'HR Manager',
                    location: 'Boston, MA',
                    verified: true,
                    status: 'active',
                    activeJobs: 8,
                    totalHires: 12,
                    registeredDate: '2023-05-10'
                },
                {
                    id: 2,
                    name: 'Bui Mau Van',
                    email: 'a@gmail.com',
                    phone: '0366444092',
                    company: 'InnovaTech Solutions',
                    position: 'Talent Acquisition Lead',
                    location: 'San Francisco, CA',
                    verified: true,
                    status: 'active',
                    activeJobs: 15,
                    totalHires: 24,
                    registeredDate: '2023-03-22'
                },
                // {
                // id: 3,
                // name: 'David Johnson',
                // email: 'david@startupinc.com',
                // phone: '+1 (555) 777-8899',
                // company: 'Startup Inc.',
                // position: 'CEO',
                // location: 'Austin, TX',
                // verified: false,
                // status: 'pending',
                // activeJobs: 0,
                // totalHires: 0,
                // registeredDate: '2023-10-15'
                // },
                // {
                // id: 4,
                // name: 'Amanda Lee',
                // email: 'amanda@globalfirm.com',
                // phone: '+1 (555) 333-6677',
                // company: 'Global Firm',
                // position: 'Recruitment Manager',
                // location: 'Chicago, IL',
                // verified: true,
                // status: 'inactive',
                // activeJobs: 0,
                // totalHires: 9,
                // registeredDate: '2023-02-18'
                // }
            ];

            setRecruiters(dummyRecruiters);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter and search recruiters
    const filteredRecruiters = recruiters.filter(recruiter => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || recruiter.status === filterStatus;

        const matchesVerified = filterVerified === 'all' ||
            (filterVerified === 'verified' && recruiter.verified) ||
            (filterVerified === 'unverified' && !recruiter.verified);

        return matchesSearch && matchesStatus && matchesVerified;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecruiters.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);

    const handleActivateRecruiter = (id) => {
        setRecruiters(prev => prev.map(recruiter =>
            recruiter.id === id ? { ...recruiter, status: 'active' } : recruiter
        ));
    };

    const handleDeactivateRecruiter = (id) => {
        setRecruiters(prev => prev.map(recruiter =>
            recruiter.id === id ? { ...recruiter, status: 'inactive' } : recruiter
        ));
    };

    const handleVerifyRecruiter = (id) => {
        setRecruiters(prev => prev.map(recruiter =>
            recruiter.id === id ? { ...recruiter, verified: true } : recruiter
        ));
    };

    const handleDeleteRecruiter = (id) => {
        if (window.confirm('Are you sure you want to delete this recruiter?')) {
            setRecruiters(prev => prev.filter(recruiter => recruiter.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title="Manage Recruiters" />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 w-full md:w-96">
                            <Search size={20} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or company..."
                                className="outline-none w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                            <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
                                <Filter size={18} className="text-gray-400 mr-2" />
                                <select
                                    className="outline-none bg-transparent"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
                                <CheckCircle size={18} className="text-gray-400 mr-2" />
                                <select
                                    className="outline-none bg-transparent"
                                    value={filterVerified}
                                    onChange={(e) => setFilterVerified(e.target.value)}
                                >
                                    <option value="all">All Verification</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                </select>
                            </div>

                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Add Recruiter
                            </button>
                        </div>
                    </div>

                    {/* Recruiters Table */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recruiter</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentItems.map((recruiter) => (
                                            <tr key={recruiter.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                                            {recruiter.name.split(' ').map(word => word[0]).join('')}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{recruiter.name}</div>
                                                            <div className="text-sm text-gray-500">{recruiter.position}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Building size={16} className="text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{recruiter.company}</div>
                                                            <div className="text-sm text-gray-500">{recruiter.location}</div>
                                                        </div>
                                                        {recruiter.verified && (
                                                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{recruiter.email}</div>
                                                    <div className="text-sm text-gray-500">{recruiter.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${recruiter.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : recruiter.status === 'inactive'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {recruiter.status.charAt(0).toUpperCase() + recruiter.status.slice(1)}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">Since {recruiter.registeredDate}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{recruiter.activeJobs} active jobs</div>
                                                    <div className="text-sm text-gray-500">{recruiter.totalHires} total hires</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="text-indigo-600 hover:text-indigo-900">
                                                            <Eye size={18} />
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <Edit size={18} />
                                                        </button>
                                                        {!recruiter.verified && (
                                                            <button
                                                                className="text-blue-600 hover:text-blue-900"
                                                                onClick={() => handleVerifyRecruiter(recruiter.id)}
                                                                title="Verify Company"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}
                                                        {recruiter.status === 'inactive' || recruiter.status === 'pending' ? (
                                                            <button
                                                                className="text-green-600 hover:text-green-900"
                                                                onClick={() => handleActivateRecruiter(recruiter.id)}
                                                                title="Activate Account"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="text-amber-600 hover:text-amber-900"
                                                                onClick={() => handleDeactivateRecruiter(recruiter.id)}
                                                                title="Deactivate Account"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteRecruiter(recruiter.id)}
                                                            title="Delete Account"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {indexOfLastItem > filteredRecruiters.length
                                                ? filteredRecruiters.length
                                                : indexOfLastItem}
                                        </span>{" "}
                                        of <span className="font-medium">{filteredRecruiters.length}</span> recruiters
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecruiterManagement;