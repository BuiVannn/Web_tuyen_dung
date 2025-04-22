import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create and export the context
export const AppContext = createContext();
export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // chung
    const [resources, setResources] = useState([]);
    // User states
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
    const [userData, setUserData] = useState(null);
    const [isUserDataLoading, setIsUserDataLoading] = useState(false); // Add this line - MISSING STATE
    const [userApplications, setUserApplications] = useState([]);
    const [showUserLogin, setShowUserLogin] = useState(false);

    // Company states 
    const [companyToken, setCompanyToken] = useState(localStorage.getItem('companyToken') || null);
    const [companyData, setCompanyData] = useState(null);
    const [isCompanyDataLoading, setIsCompanyDataLoading] = useState(false); // Add this line
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
    const [adminData, setAdminData] = useState(null);
    const [isAdminDataLoading, setIsAdminDataLoading] = useState(false);


    // Jobs states
    const [jobs, setJobs] = useState([]);
    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });
    const [isSearched, setIsSearched] = useState(false);

    // Fetch jobs
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs`);
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Error fetching jobs');
        }
    };

    // Fetch company data
    // Trong hàm fetchCompanyData của AppContext:
    const fetchCompanyData = async () => {
        try {
            if (!companyToken) return;

            setIsCompanyDataLoading(true);

            const { data } = await axios.get(`${backendUrl}/api/companies/company`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                setCompanyData(data.company); // Đảm bảo lưu toàn bộ object company
            } else {
                // Xử lý lỗi nếu cần
                setCompanyToken(null);
                localStorage.removeItem('companyToken');
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setCompanyToken(null);
            localStorage.removeItem('companyToken');
        } finally {
            setIsCompanyDataLoading(false);
        }
    };
    const fetchCompanyData_3 = async () => {
        try {
            setIsCompanyDataLoading(true);
            if (!companyToken) {
                setIsCompanyDataLoading(false);
                return;
            }

            const { data } = await axios.get(`${backendUrl}/api/companies/company`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            console.log("Company data fetch response:", data);

            if (data.success) {
                setCompanyData(data.company);
            } else {
                setCompanyToken(null);
                localStorage.removeItem('companyToken');
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                setCompanyToken(null);
                localStorage.removeItem('companyToken');
            }
            toast.error('Error fetching company data');
        } finally {
            setIsCompanyDataLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            setIsUserDataLoading(true);
            if (!userToken) {
                setIsUserDataLoading(false);
                return null;
            }

            console.log('Fetching user profile with token:', userToken);

            const response = await axios.get(`${backendUrl}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            console.log('Fetch user profile response:', response.data);

            if (response.data.success && response.data.profile) {
                setUserData(response.data.profile);
                return response.data.profile;
            } else {
                console.error('API indicated failure fetching profile:', response.data.message);
                if (!isUserDataLoading) {
                    toast.error(response.data.message || 'Failed to fetch user profile data.');
                }
                setUserData(null);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                if (!isUserDataLoading) {
                    toast.error('Session expired or invalid. Please login again.');
                }
                localStorage.removeItem('userToken');
                setUserToken(null);
            } else {
                if (!isUserDataLoading) {
                    toast.error('Failed to fetch user data');
                }
            }
            setUserData(null);
            return null;
        } finally {
            setIsUserDataLoading(false);
        }
    };

    // Define fetchUserApplications
    const fetchUserApplications = async () => {
        try {
            if (!userToken) return;

            const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            console.log('Applications response:', data);
            if (data.success) {
                setUserApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Error fetching applications');
        }
    };

    const fetchResources = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/resources`);
            if (data.success) {
                setResources(data.resources);
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    };

    // User authentication
    const loginUser = async (token, userBasicInfo) => {
        try {
            console.log('Setting user token:', token);
            localStorage.setItem('userToken', token);
            setUserToken(token);

            // Đặt biến để theo dõi thành công
            let success = false;

            // Nếu có thông tin cơ bản từ API response
            if (userBasicInfo) {
                const initialUserData = {
                    userId: {
                        _id: userBasicInfo._id,
                        name: userBasicInfo.name,
                        email: userBasicInfo.email
                    }
                    // Các trường khác sẽ được fetch sau
                };
                setUserData(initialUserData);
                success = true;
            }

            fetchUserData().catch(err => {
                console.error('Error fetching full user data:', err);
            });

            // Chỉ hiển thị toast success tại đây, không trong UserLogin
            if (success) {
                toast.success('Login successful!', {
                    toastId: 'login-success', // Thêm ID để tránh trùng lặp
                    autoClose: 2000, // Tự động đóng sau 2 giây
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false, // Không dừng khi hover
                    draggable: true,
                });
            }

            return success;
        } catch (error) {
            console.error('Login error in context:', error);
            localStorage.removeItem('userToken');
            setUserToken(null);
            setUserData(null);
            toast.error('Failed to process login');
            return false;
        }
    };
    const loginUser_0 = async (token, user) => {
        try {
            localStorage.setItem('userToken', token);
            setUserToken(token);

            // If we have basic user data from login, set it temporarily
            if (user) {
                setUserData(user);
            }

            // Fetch full profile data
            await fetchUserData();
            return true;
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('userToken');
            setUserToken(null);
            setUserData(null);
            toast.error('Login failed');
            return false;
        }
    };

    const logoutUser = () => {
        console.log('Logging out user...');
        setUserToken(null);
        setUserData(null);
        setUserApplications([]);
        localStorage.removeItem('userToken');
    };

    const loginCompany = async (token, company) => {
        try {
            localStorage.setItem('companyToken', token);
            setCompanyToken(token);

            // If we have basic company data from login, set it temporarily
            if (company) {
                setCompanyData(company);
            }

            // Fetch full company data
            await fetchCompanyData();
            return true;
        } catch (error) {
            console.error('Company login error:', error);
            localStorage.removeItem('companyToken');
            setCompanyToken(null);
            setCompanyData(null);
            toast.error('Company login failed');
            return false;
        }
    };

    const logoutCompany = () => {
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem('companyToken');
        setShowRecruiterLogin(false);
    };

    const fetchAdminData = async () => {
        try {
            setIsAdminDataLoading(true);
            if (!adminToken) {
                setIsAdminDataLoading(false);
                return;
            }

            const { data } = await axios.get(`${backendUrl}/api/admin/profile`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (data.success) {
                setAdminData(data.admin);
            } else {
                setAdminToken(null);
                localStorage.removeItem('adminToken');
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                setAdminToken(null);
                localStorage.removeItem('adminToken');
            }
            toast.error('Error fetching admin data');
        } finally {
            setIsAdminDataLoading(false);
        }
    };

    // Thêm hàm loginAdmin
    const loginAdmin = async (token, admin) => {
        try {
            localStorage.setItem('adminToken', token);
            setAdminToken(token);

            // If we have basic admin data from login, set it temporarily
            if (admin) {
                setAdminData(admin);
            }

            // Fetch full admin data
            await fetchAdminData();
            return true;
        } catch (error) {
            console.error('Admin login error:', error);
            localStorage.removeItem('adminToken');
            setAdminToken(null);
            setAdminData(null);
            toast.error('Admin login failed');
            return false;
        }
    };

    // Thêm hàm logoutAdmin
    const logoutAdmin = () => {
        setAdminToken(null);
        setAdminData(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
    };

    // Thêm phần kiểm tra adminToken trong useEffect ban đầu
    useEffect(() => {
        console.log("AppContext initializing...");
        // Fetch jobs regardless of login state
        fetchJobs();

        // Check for stored tokens
        const storedUserToken = localStorage.getItem('userToken');
        const storedCompanyToken = localStorage.getItem('companyToken');
        const storedAdminToken = localStorage.getItem('adminToken');

        console.log("Stored tokens - User:", storedUserToken ? "exists" : "none",
            "Company:", storedCompanyToken ? "exists" : "none",
            "Admin:", storedAdminToken ? "exists" : "none");

        // If tokens exist, fetch data
        if (storedUserToken) {
            console.log("User token found, fetching user data...");
            fetchUserData();
            fetchUserApplications();
            fetchResources();
        }

        if (storedCompanyToken) {
            console.log("Company token found, fetching company data...");
            fetchCompanyData();
        }

        if (storedAdminToken) {
            console.log("Admin token found, fetching admin data...");
            fetchAdminData();
        }

        console.log("AppContext initialization complete");
    }, []);


    // Initial setup on mount
    useEffect(() => {
        console.log("AppContext initializing...");
        // Fetch jobs regardless of login state
        fetchJobs();

        // Check for stored tokens
        const storedUserToken = localStorage.getItem('userToken');
        const storedCompanyToken = localStorage.getItem('companyToken');

        console.log("Stored tokens - User:", storedUserToken ? "exists" : "none",
            "Company:", storedCompanyToken ? "exists" : "none");

        // If tokens exist, fetch data
        if (storedUserToken) {
            console.log("User token found, fetching user data...");
            fetchUserData();
            fetchUserApplications();
            fetchResources();
        }

        if (storedCompanyToken) {
            console.log("Company token found, fetching company data...");
            fetchCompanyData();
        }

        console.log("AppContext initialization complete");
    }, []);

    // Context value
    const value = {
        backendUrl,
        // User
        userToken,
        setUserToken,
        userData,
        setUserData,
        isUserDataLoading,
        userApplications,
        setUserApplications,
        loginUser,
        logoutUser,
        showUserLogin,        // Add this
        setShowUserLogin,
        // Company
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        isCompanyDataLoading,
        showRecruiterLogin,
        setShowRecruiterLogin,
        loginCompany,
        logoutCompany,
        // Jobs
        jobs,
        setJobs,
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        // Functions
        fetchJobs,
        fetchCompanyData,
        fetchUserData,
        fetchUserApplications,
        resources,
        fetchResources,

        // Admin
        adminToken,
        setAdminToken,
        adminData,
        setAdminData,
        isAdminDataLoading,
        loginAdmin,
        logoutAdmin,
        fetchAdminData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
// ban nay da ok
// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Create and export the context
// export const AppContext = createContext();
// export const AppContextProvider = (props) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;

//     // User states
//     const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
//     const [userData, setUserData] = useState(null);
//     const [isUserDataLoading, setIsUserDataLoading] = useState(false);
//     const [userApplications, setUserApplications] = useState([]);

//     // Company states
//     const [companyToken, setCompanyToken] = useState(localStorage.getItem('companyToken'));
//     const [companyData, setCompanyData] = useState(null);
//     const [isCompanyDataLoading, setIsCompanyDataLoading] = useState(false);
//     const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

//     // Jobs states
//     const [jobs, setJobs] = useState([]);
//     const [searchFilter, setSearchFilter] = useState({
//         title: '',
//         location: ''
//     });
//     const [isSearched, setIsSearched] = useState(false);

//     // Fetch jobs
//     const fetchJobs = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/jobs`);
//             if (data.success) {
//                 setJobs(data.jobs);
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//             toast.error('Error fetching jobs');
//         }
//     };

//     // Fetch company data
//     const fetchCompanyData = async () => {
//         try {
//             if (!companyToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/companies/company`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (data.success) {
//                 setCompanyData(data.company);
//             } else {
//                 setCompanyToken(null);
//                 localStorage.removeItem('companyToken');
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching company data:', error);
//             setCompanyToken(null);
//             localStorage.removeItem('companyToken');
//             toast.error('Error fetching company data');
//         }
//     };

//     const fetchUserData = async (token) => {
//         console.log('Attempting to fetch user data with token:', token); // Log token đang dùng
//         setIsUserDataLoading(true); // Bắt đầu loading
//         try {
//             const response = await axios.get(`${backendUrl}/api/users/profile`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}` // Sử dụng token được truyền vào
//                 }
//             });

//             console.log('Fetch user profile response:', response.data); // Log response

//             if (response.data.success && response.data.profile) {
//                 setUserData(response.data.profile); // <<< Sửa ở đây: dùng data.profile
//                 console.log('User profile data set:', response.data.profile);
//                 return response.data.profile; // Trả về profile data
//             } else {
//                 // Nếu API trả về success: false hoặc không có profile -> token có thể hợp lệ nhưng có lỗi khác
//                 console.error('API indicated failure fetching profile:', response.data.message);
//                 toast.error(response.data.message || 'Failed to fetch user profile data.');
//                 // Không xóa token ở đây trừ khi chắc chắn lỗi là do token
//                 setUserData(null); // Xóa data cũ nếu có
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error fetching user profile:', error);
//             // Nếu lỗi là 401 hoặc 403, rất có thể token không hợp lệ/hết hạn
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 toast.error('Session expired or invalid. Please login again.');
//                 // Xóa token không hợp lệ và reset state
//                 localStorage.removeItem('userToken');
//                 setUserToken(null);
//                 setUserData(null);
//             } else {
//                 // Lỗi mạng hoặc lỗi server khác
//                 toast.error(error.response?.data?.message || 'An error occurred while fetching user data.');
//                 setUserData(null); // Xóa data cũ nếu có
//             }
//             return null;
//         } finally {
//             setIsUserDataLoading(false); // Kết thúc loading dù thành công hay thất bại
//         }
//     };
//     const fetchUserData_1 = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
//                 headers: {
//                     'Authorization': `Bearer ${userToken}`
//                 }
//             });

//             console.log('Fetch user data response:', data); // Debug log

//             if (data.success && data.user) {
//                 // Ensure resume URL is properly set
//                 const userData = {
//                     ...data.user,
//                     resume: data.user.resume || '' // Ensure resume is at least an empty string
//                 };
//                 setUserData(userData);
//                 return userData;
//             } else {
//                 toast.error(data.message || 'Failed to fetch user data');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             toast.error('Failed to fetch user data');
//             return null;
//         }
//     };
//     const fetchUserData_0 = async () => {
//         try {
//             if (!userToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/auth/users/profile`, {
//                 headers: {
//                     'Authorization': `Bearer ${userToken}`
//                 }
//             });

//             if (data.success) {
//                 setUserData(data.user);
//             } else {
//                 setUserToken(null);
//                 localStorage.removeItem('userToken');
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             setUserToken(null);
//             localStorage.removeItem('userToken');
//             toast.error(error.response?.data?.message || 'Error fetching user data');
//         }
//     };

//     // Define fetchUserApplications before using it in useEffect
//     const fetchUserApplications = async () => {
//         try {
//             if (!userToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/auth/users/applications`, {
//                 headers: {
//                     'Authorization': `Bearer ${userToken}`
//                 }
//             });
//             console.log('Applications response:', data); // Debug log
//             if (data.success) {
//                 setUserApplications(data.applications);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching applications:', error);
//             toast.error(error.response?.data?.message || 'Error fetching applications');
//         }
//     };


//     // User authentication
//     const loginUser = async (token, user) => {
//         try {
//             // Set token trong localStorage
//             localStorage.setItem('userToken', token);
//             setUserToken(token);
//             setUserData(user);
//             await fetchUserData();
//             // Test token validity ngay sau khi login
//             // const testResponse = await axios.get(`${backendUrl}/api/users/profile`, {
//             // headers: {
//             // 'Authorization': `Bearer ${token}`
//             // }
//             // });

//             // if (!testResponse.data.success) {
//             // throw new Error('Token validation failed');
//             // }

//             return true;
//         } catch (error) {
//             console.error('Login error:', error);
//             localStorage.removeItem('userToken');
//             setUserToken(null);
//             setUserData(null);
//             toast.error('Login failed: ' + error.message);
//             return false;
//         }
//     };
//     const loginUser_1 = async (token, user) => {
//         try {
//             setUserToken(token);
//             setUserData(user);
//             localStorage.setItem('userToken', token);
//             return true;
//         } catch (error) {
//             console.error('Login error:', error);
//             toast.error('Login failed');
//             return false;
//         }
//     };
//     const loginUser_0 = async (email, password) => {
//         try {
//             const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
//                 email,
//                 password
//             });

//             if (data.success) {
//                 setUserToken(data.token);
//                 setUserData(data.user);
//                 localStorage.setItem('userToken', data.token);
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Login failed');
//             return false;
//         }
//     };

//     const logoutUser = () => {
//         // Clear user data
//         setUserToken(null);
//         setUserData(null);
//         setUserApplications([]);
//         localStorage.removeItem('userToken');

//         // Debug log
//         console.log('Logging out user, data cleared');

//         // Redirect to home
//         window.location.href = '/';
//     };
//     const logoutUser_1 = () => {
//         setUserToken(null);
//         setUserData(null);
//         localStorage.removeItem('userToken');
//         navigate('/');
//     };
//     const logoutUser_0 = () => {
//         setUserToken(null);
//         setUserData(null);
//         localStorage.removeItem('userToken');
//     };

//     const loginCompany = async (token, company) => {
//         try {
//             localStorage.setItem('companyToken', token);
//             setCompanyToken(token);
//             setCompanyData(company);
//             await fetchCompanyData(); // Fetch full company data
//             return true;
//         } catch (error) {
//             console.error('Company login error:', error);
//             return false;
//         }
//     };

//     const logoutCompany = () => {
//         // Clear user data
//         setUserToken(null);
//         setUserData(null);
//         localStorage.removeItem('userToken');

//         // Clear company data
//         setCompanyToken(null);
//         setCompanyData(null);
//         localStorage.removeItem('companyToken');

//         setShowRecruiterLogin(false);
//     };
//     useEffect(() => {
//         const initAuth = async () => {
//             if (userToken) {
//                 await fetchUserData();
//             }
//             if (companyToken) {
//                 await fetchCompanyData();
//             }
//         };

//         initAuth();
//     }, []);


//     // Effect hooks
//     useEffect(() => {
//         // Initial data fetch
//         fetchJobs();

//         // Restore sessions
//         const storedUserToken = localStorage.getItem('userToken');
//         const storedCompanyToken = localStorage.getItem('companyToken');

//         if (storedUserToken) {
//             setUserToken(storedUserToken);
//         }
//         if (storedCompanyToken) {
//             setCompanyToken(storedCompanyToken);
//         }
//     }, []);

//     useEffect(() => {
//         if (userToken) {
//             fetchUserData();
//             fetchUserApplications();
//         }
//     }, [userToken]);

//     useEffect(() => {
//         const token = localStorage.getItem('userToken');
//         if (token) {
//             setUserToken(token);
//         }
//     }, []);
//     useEffect(() => {
//         if (companyToken) {
//             fetchCompanyData();
//         }
//     }, [companyToken]);

//     useEffect(() => {
//         const initializeUserSession = async () => {
//             const storedUserToken = localStorage.getItem('userToken');
//             if (storedUserToken && !userData && !isUserDataLoading) { // Chỉ fetch nếu có token, chưa có data và không đang loading
//                 console.log("Found stored user token, fetching user data...");
//                 await fetchUserData(storedUserToken);
//             } else if (!storedUserToken) {
//                 setIsUserDataLoading(false); // Không có token thì không loading
//             }
//         };
//         initializeUserSession();
//         // Dependency array rỗng nếu chỉ muốn chạy 1 lần khi mount
//         // Hoặc thêm dependency nếu cần chạy lại khi yếu tố nào đó thay đổi (cẩn thận vòng lặp)
//     }, []); // Chạy một lần khi component mount để kiểm tra token ban đầu

//     // Effect riêng để fetch data khi token thay đổi (ví dụ sau khi login)
//     useEffect(() => {
//         const handleTokenChange = async () => {
//             if (userToken && !userData && !isUserDataLoading) { // Chỉ fetch nếu token mới được set, chưa có data và không đang loading
//                 console.log("User token changed/set, fetching user data...");
//                 await fetchUserData(userToken);
//             } else if (!userToken) {
//                 // Nếu token bị xóa (logout), đảm bảo userData cũng bị xóa
//                 setUserData(null);
//                 setIsUserDataLoading(false);
//             }
//         };
//         handleTokenChange();
//     }, [userToken]); // Chạy lại khi userToken thay đổi
//     // Context value
//     const value = {
//         backendUrl,
//         // User
//         userToken,
//         setUserToken,
//         userData,
//         setUserData,
//         userApplications,
//         setUserApplications,
//         loginUser,
//         logoutUser,
//         // Company
//         loginCompany,
//         logoutCompany,
//         companyToken,
//         setCompanyToken,
//         companyData,
//         setCompanyData,
//         showRecruiterLogin,
//         setShowRecruiterLogin,
//         // Jobs
//         jobs,
//         setJobs,
//         searchFilter,
//         setSearchFilter,
//         isSearched,
//         setIsSearched,
//         // Functions
//         fetchJobs,
//         fetchCompanyData,
//         fetchUserData,
//         fetchUserApplications
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     );
// };

// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// //import { useAuth, useUser } from "@clerk/clerk-react";

// export const AppContext = createContext()
// export const AppContextProvider = (props) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL
//     //const { user } = useUser()
//     //const { getToken } = useAuth()
//     const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
//     const [userData, setUserData] = useState(null);
//     const [searchFilter, setSearchFilter] = useState({
//         title: '',
//         location: ''
//     })
//     const [isSearched, setIsSearched] = useState(false)
//     const [jobs, setJobs] = useState([])
//     const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
//     //const [companyToken, setCompanyToken] = useState(null)
//     const [companyToken, setCompanyToken] = useState(localStorage.getItem('companyToken'));
//     const [companyData, setCompanyData] = useState(null)
//     //const [userData, setUserData] = useState(null)
//     const [userApplications, setUserApplications] = useState([])
//     const loginUser = async (email, password) => {
//         try {
//             const { data } = await axios.post(`${backendUrl}/api/users/login`, {
//                 email,
//                 password
//             });

//             if (data.success) {
//                 setUserToken(data.token);
//                 setUserData(data.user);
//                 localStorage.setItem('userToken', data.token);
//                 toast.success(data.message);
//                 return true;
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//             return false;
//         }
//     };

//     const logoutUser = () => {
//         setUserToken(null);
//         setUserData(null);
//         localStorage.removeItem('userToken');
//     };

//     // function to fetch jobs
//     const fetchJobs = async () => {
//         try {
//             setJobs([]); // Reset jobs state trước khi fetch
//             const { data } = await axios.get(`${backendUrl}/api/jobs`, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('Jobs response:', data); // Debug log

//             if (data.success) {
//                 setJobs(data.jobs);
//             } else {
//                 toast.error(data.message || 'Không thể tải danh sách công việc');
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//             toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách công việc');
//         }
//     };
//     const fetchJobs_0 = async () => {
//         try {
//             const { data } = await axios.get(backendUrl + '/api/jobs')
//             if (data.success) {
//                 setJobs(data.jobs)
//                 console.log(data.jobs);

//             }
//             else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//         //setJobs(jobsData)
//     }

//     // func to fetch company data
//     const fetchCompanyData = async () => {
//         try {
//             if (!companyToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/companies/profile`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             console.log('Fetching company data with token:', companyToken);

//             if (data.success) {
//                 setCompanyData(data.company);
//                 console.log('Company data received:', data.company);
//             } else {
//                 toast.error(data.message || 'Could not fetch company data');
//                 setCompanyToken(null);
//                 localStorage.removeItem('companyToken');
//             }
//         } catch (error) {
//             console.error('Error fetching company data:', error);
//             toast.error(error.response?.data?.message || 'Error fetching company data');
//             setCompanyToken(null);
//             localStorage.removeItem('companyToken');
//         }
//     };
//     const fetchCompanyData_2 = async () => {
//         try {
//             if (!companyToken) return;

//             // Change from /companies/profile to /companies/company
//             const { data } = await axios.get(`${backendUrl}/api/companies/company`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             console.log('Fetching company data with token:', companyToken); // Debug log

//             if (data.success) {
//                 setCompanyData(data.company);
//                 console.log('Company data received:', data.company);
//             } else {
//                 toast.error(data.message || 'Could not fetch company data');
//                 setCompanyToken(null);
//                 localStorage.removeItem('companyToken');
//             }
//         } catch (error) {
//             console.error('Error fetching company data:', error);
//             toast.error(error.response?.data?.message || 'Error fetching company data');
//             setCompanyToken(null);
//             localStorage.removeItem('companyToken');
//         }
//     };
//     const fetchCompanyData_1 = async () => {
//         try {
//             if (!companyToken) return;

//             // Sửa endpoint từ /companies/company thành /companies/profile
//             const { data } = await axios.get(`${backendUrl}/api/companies/profile`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             console.log('Fetching company profile with token:', companyToken); // Debug log

//             if (data.success) {
//                 setCompanyData(data.company);
//                 console.log('Company data received:', data.company);
//             } else {
//                 toast.error(data.message || 'Could not fetch company data');
//                 setCompanyToken(null);
//                 localStorage.removeItem('companyToken');
//             }
//         } catch (error) {
//             console.error('Error fetching company data:', error);
//             toast.error(error.response?.data?.message || 'Error fetching company data');
//             setCompanyToken(null);
//             localStorage.removeItem('companyToken');
//         }
//     };
//     const fetchCompanyData_0 = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/company/company`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`  // Sửa từ token thành Bearer token
//                 }
//             });

//             if (data.success) {
//                 setCompanyData(data.company);
//                 console.log('Company data:', data);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching company data:', error);
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };
//     // const fetchCompanyData = async () => {
//     // try {
//     // const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
//     //
//     // if (data.success) {
//     // setCompanyData(data.company)
//     // console.log(data);
//     //
//     // }
//     // else {
//     // toast.error(data.message)
//     // }
//     // } catch (error) {
//     // toast.error(error.message)
//     // }
//     // }

//     // func to fetch user data
//     const fetchUserData = async () => {
//         try {
//             if (!userToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
//                 headers: { Authorization: `Bearer ${userToken}` }
//             });

//             if (data.success) {
//                 setUserData(data.user);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };
//     const fetchUserData_0 = async () => {
//         try {
//             const token = await getToken();

//             const { data } = await axios.get(backendUrl + '/api/user/user',
//                 { headers: { Authorization: `Bearer ${token}` } }
//             )

//             if (data.success) {
//                 setUserData(data.user)
//             }
//             else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     // func to fetch user's applied applications data
//     const fetchUserApplications = async () => {
//         try {
//             if (!userToken) return;

//             const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
//                 headers: { Authorization: `Bearer ${userToken}` }
//             });

//             if (data.success) {
//                 setUserApplications(data.applications);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };
//     const fetchUserApplications_0 = async () => {
//         try {

//             const token = await getToken()

//             const { data } = await axios.get(backendUrl + '/api/user/applications',
//                 { headers: { Authorization: `Bearer ${token}` } }
//             )

//             if (data.success) {
//                 setUserApplications(data.applications)

//             }
//             else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//         // Remove duplicate effects
//         const init = async () => {
//             // Load stored tokens
//             const storedCompanyToken = localStorage.getItem('companyToken');
//             const storedUserToken = localStorage.getItem('userToken');

//             if (storedCompanyToken) {
//                 setCompanyToken(storedCompanyToken);
//                 await fetchCompanyData();
//             }

//             if (storedUserToken) {
//                 setUserToken(storedUserToken);
//                 await fetchUserData();
//                 await fetchUserApplications();
//             }

//             await fetchJobs();
//         };

//         init();
//     }, []); // Run only once on mount
//     // useEffect(() => {
//     //Load user data if token exists
//     // if (userToken) {
//     // fetchUserData();
//     // fetchUserApplications();
//     // }
//     // }, [userToken]);
//     //
//     // useEffect(() => {
//     // fetchJobs()
//     // const storedCompanyToken = localStorage.getItem('companyToken')
//     // if (storedCompanyToken) {
//     // setCompanyToken(storedCompanyToken)
//     // }
//     // }, [])
//     //
//     // useEffect(() => {
//     // if (companyToken) {
//     // fetchCompanyData();
//     // } else {
//     // setCompanyData(null); // Clear company data if no token
//     // }
//     // }, [companyToken])
//     //
//     // useEffect(() => {
//     // const storedCompanyToken = localStorage.getItem('companyToken');
//     // if (storedCompanyToken) {
//     // setCompanyToken(storedCompanyToken);
//     // fetchCompanyData(); // Fetch immediately when token is set
//     // }
//     // }, []);
//     // useEffect(() => {
//     // fetchJobs();
//     // }, []);

//     // useEffect(() => {
//     // if (user) {
//     // fetchUserData()
//     // fetchUserApplications()
//     // }
//     // }, [user])
//     const value = {
//         userToken,
//         setUserToken,
//         loginUser,
//         logoutUser,
//         setSearchFilter,
//         searchFilter,
//         isSearched,
//         setIsSearched,
//         jobs,
//         setJobs,
//         showRecruiterLogin,
//         setShowRecruiterLogin,
//         companyToken,
//         setCompanyToken,
//         companyData,
//         setCompanyData,
//         backendUrl,
//         userData,
//         setUserData,
//         userApplications,
//         setUserApplications,
//         fetchUserData,
//         fetchUserApplications,
//     }

//     return (<AppContext.Provider value={value}>
//         {props.children}
//     </AppContext.Provider>)
// }



// // test

// // import { createContext, useEffect, useState, useContext } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { useAuth, useUser } from "@clerk/clerk-react";

// // export const AppContext = createContext();

// // export const AppContextProvider = ({ children }) => {
// //     const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// //     const { user } = useUser();
// //     const { getToken } = useAuth();

// //     // Trạng thái tìm kiếm
// //     const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
// //     const [isSearched, setIsSearched] = useState(false);

// //     // Công việc và nhà tuyển dụng
// //     const [jobs, setJobs] = useState([]);
// //     const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
// //     const [companyToken, setCompanyToken] = useState(null);
// //     const [companyData, setCompanyData] = useState(null);

// //     // Ứng viên
// //     const [userData, setUserData] = useState(null);
// //     const [userApplications, setUserApplications] = useState([]);

// //     // Trạng thái admin
// //     const [adminUsers, setAdminUsers] = useState([]);
// //     const [adminJobs, setAdminJobs] = useState([]);
// //     const [adminApplications, setAdminApplications] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState(null);

// //     // Cấu hình API với token tự động
// //     const api = axios.create({ baseURL: backendUrl });

// //     api.interceptors.request.use(
// //         async (config) => {
// //             const token = await getToken();
// //             if (token) {
// //                 config.headers.Authorization = `Bearer ${token}`;
// //             }
// //             return config;
// //         },
// //         (error) => Promise.reject(error)
// //     );

// //     // 🔹 Lấy danh sách công việc
// //     const fetchJobs = async () => {
// //         try {
// //             const { data } = await api.get("/jobs");
// //             if (data.success) setJobs(data.jobs);
// //             else toast.error(data.message);
// //         } catch (error) {
// //             toast.error(error.message);
// //         }
// //     };

// //     // 🔹 Lấy dữ liệu công ty
// //     const fetchCompanyData = async () => {
// //         if (!companyToken) return;
// //         try {
// //             const { data } = await api.get("/company/company", { headers: { token: companyToken } });
// //             if (data.success) setCompanyData(data.company);
// //             else toast.error(data.message);
// //         } catch (error) {
// //             toast.error(error.message);
// //         }
// //     };

// //     // 🔹 Lấy dữ liệu ứng viên
// //     const fetchUserData = async () => {
// //         try {
// //             const { data } = await api.get("/user/user");
// //             if (data.success) setUserData(data.user);
// //             else toast.error(data.message);
// //         } catch (error) {
// //             toast.error(error.message);
// //         }
// //     };

// //     // 🔹 Lấy danh sách ứng tuyển của ứng viên
// //     const fetchUserApplications = async () => {
// //         try {
// //             const { data } = await api.get("/user/applications");
// //             if (data.success) setUserApplications(data.applications);
// //             else toast.error(data.message);
// //         } catch (error) {
// //             toast.error(error.message);
// //         }
// //     };

// //     // 🔹 Admin: Lấy danh sách người dùng
// //     const fetchAdminUsers = async () => {
// //         setLoading(true);
// //         try {
// //             const { data } = await api.get("/admin/users");
// //             setAdminUsers(data);
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Error fetching users");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // 🔹 Admin: Lấy danh sách công việc
// //     const fetchAdminJobs = async () => {
// //         setLoading(true);
// //         try {
// //             const { data } = await api.get("/admin/jobs");
// //             setAdminJobs(data);
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Error fetching jobs");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // 🔹 Admin: Lấy danh sách ứng tuyển
// //     const fetchAdminApplications = async () => {
// //         setLoading(true);
// //         try {
// //             const { data } = await api.get("/admin/applications");
// //             setAdminApplications(data);
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Error fetching applications");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // 🔹 Admin: Cập nhật vai trò người dùng
// //     const updateUserRole = async (userId, role) => {
// //         setLoading(true);
// //         try {
// //             const { data } = await api.put(`/admin/users/${userId}`, { role });
// //             setAdminUsers(adminUsers.map((user) => (user._id === userId ? data : user)));
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Error updating user");
// //             throw err;
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // 🔹 Admin: Xóa người dùng
// //     const deleteUser = async (userId) => {
// //         setLoading(true);
// //         try {
// //             await api.delete(`/admin/users/${userId}`);
// //             setAdminUsers(adminUsers.filter((user) => user._id !== userId));
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Error deleting user");
// //             throw err;
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // 🔥 useEffect: Gọi API khi ứng dụng tải lên
// //     useEffect(() => {
// //         fetchJobs();
// //         const storedCompanyToken = localStorage.getItem("companyToken");
// //         if (storedCompanyToken) setCompanyToken(storedCompanyToken);
// //     }, []);

// //     useEffect(() => {
// //         if (companyToken) fetchCompanyData();
// //     }, [companyToken]);

// //     useEffect(() => {
// //         if (user) {
// //             fetchUserData();
// //             fetchUserApplications();
// //         }
// //     }, [user]);

// //     const value = {
// //         // Tìm kiếm công việc
// //         searchFilter, setSearchFilter, isSearched, setIsSearched,
// //         // Công việc & công ty
// //         jobs, setJobs, showRecruiterLogin, setShowRecruiterLogin,
// //         companyToken, setCompanyToken, companyData, setCompanyData,
// //         // Ứng viên
// //         userData, setUserData, userApplications, setUserApplications,
// //         // Admin
// //         adminUsers, adminJobs, adminApplications, fetchAdminUsers,
// //         fetchAdminJobs, fetchAdminApplications, updateUserRole, deleteUser,
// //         // API & trạng thái
// //         backendUrl, api, loading, error,
// //         // Fetch functions
// //         fetchUserData, fetchUserApplications,
// //     };

// //     return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// // };

// // export const useAppContext = () => useContext(AppContext);
