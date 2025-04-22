import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, Building, ArrowRight, UserPlus, LogIn, Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterLogin = ({ onClose }) => {
    const navigate = useNavigate();
    const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext);

    // Form states
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Close modal when escape key is pressed
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    // Handle closing the modal
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (setShowRecruiterLogin) {
            setShowRecruiterLogin(false);
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Clear image selection
    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    // Toggle between login and signup
    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setImage(null);
        setImagePreview(null);
        setShowPassword(false);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!isLogin) {
            if (!name) {
                toast.error('Company name is required');
                return;
            }

            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            if (!image) {
                toast.error('Company logo is required');
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                // Login logic
                const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
                    email,
                    password
                });
                if (data.success) {
                    // 1. First store data locally
                    localStorage.setItem('companyToken', data.token);

                    // 2. Update app context with company data
                    setCompanyToken(data.token);
                    setCompanyData(data.company);

                    // 3. Show success message
                    toast.success('Login successful');

                    // 4. IMPORTANT: Navigate FIRST, then close modal
                    // This prevents any redirect conflicts
                    // navigate('/dashboard', { replace: true });
                    navigate('/', { replace: true });

                    // 5. Close the modal AFTER navigation with a slight delay
                    setTimeout(() => {
                        if (onClose) {
                            onClose();
                        } else if (setShowRecruiterLogin) {
                            setShowRecruiterLogin(false);
                        }
                    }, 100);
                } else {
                    toast.error(data.message || 'Login failed');
                }


            } else {
                // Registration logic
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('image', image);

                const { data } = await axios.post(
                    `${backendUrl}/api/companies/register`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (data.success) {
                    // 1. First store data locally
                    localStorage.setItem('companyToken', data.token);

                    // 2. Update app context with company data
                    setCompanyToken(data.token);
                    setCompanyData(data.company);

                    // 3. Show success message
                    toast.success('Registration successful!');

                    // 4. IMPORTANT: Navigate FIRST, then close modal
                    navigate('/', { replace: true });

                    // 5. Close the modal AFTER navigation with a slight delay
                    setTimeout(() => {
                        if (onClose) {
                            onClose();
                        } else if (setShowRecruiterLogin) {
                            setShowRecruiterLogin(false);
                        }
                    }, 100);
                } else {
                    toast.error(data.message || 'Registration failed');
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-2xl">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-500" />
                </button>

                <div className="flex flex-col md:flex-row min-h-[600px] max-h-[80vh]">
                    <AnimatePresence initial={false}>
                        {isLogin ? (
                            <>
                                {/* Login form (left side when logging in) */}
                                <motion.div
                                    key="login-form"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "tween", duration: 0.5 }}
                                    className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center"
                                >
                                    <div className="max-w-md mx-auto w-full">
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
                                        <p className="text-gray-600 mb-8">Sign in to your recruiter account</p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="company@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff size={18} aria-hidden="true" />
                                                            ) : (
                                                                <Eye size={18} aria-hidden="true" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        id="remember-me"
                                                        name="remember-me"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <div className="text-sm">
                                                    <a href="#forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                                        Forgot password?
                                                    </a>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium transition duration-200"
                                            >
                                                {loading ? (
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                ) : (
                                                    <LogIn size={20} className="mr-2" />
                                                )}
                                                {loading ? 'Signing in...' : 'Sign in'}
                                            </button>
                                        </form>

                                        <div className="mt-6 text-center">
                                            <p className="text-gray-600 text-sm">
                                                Don't have an account yet?{' '}
                                                <button
                                                    onClick={toggleMode}
                                                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                                >
                                                    Create an account
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Image side (right side when logging in) */}
                                <motion.div
                                    key="login-image"
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "tween", duration: 0.5 }}
                                    className="hidden sm:flex w-full md:w-1/2 bg-blue-600 items-center justify-center overflow-hidden"
                                >
                                    <div className="p-8 text-center">
                                        <div className="flex justify-center mb-6">
                                            <Building size={80} className="text-white" />
                                        </div>
                                        <h3 className="text-white text-2xl font-bold mb-3">Hire top talent efficiently</h3>
                                        <p className="text-blue-100 mb-6">Access our pool of qualified candidates and streamline your recruitment process</p>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">10k+</h4>
                                                <p className="text-sm">Active job seekers</p>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">24/7</h4>
                                                <p className="text-sm">Candidate access</p>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">85%</h4>
                                                <p className="text-sm">Hiring success rate</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {/* Image side (left side when signing up) */}
                                <motion.div
                                    key="signup-image"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "tween", duration: 0.5 }}
                                    className="w-full md:w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center overflow-hidden"
                                >
                                    <div className="p-8 text-center">
                                        <div className="flex justify-center mb-6">
                                            <UserPlus size={80} className="text-white" />
                                        </div>
                                        <h3 className="text-white text-2xl font-bold mb-3">Join our recruiting platform</h3>
                                        <p className="text-green-100 mb-6">Create your company profile and start finding perfect candidates today</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Post unlimited jobs</p>
                                                    <p className="text-xs text-green-100">Reach thousands of qualified candidates</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Advanced filtering</p>
                                                    <p className="text-xs text-green-100">Find exactly who you're looking for</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Application tracking</p>
                                                    <p className="text-xs text-green-100">Streamline your hiring process</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Registration form (right side when signing up) */}
                                <motion.div
                                    key="signup-form"
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "tween", duration: 0.5 }}
                                    className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center"
                                >
                                    <div className="max-w-md mx-auto w-full">
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an account</h2>
                                        <p className="text-gray-600 mb-8">Start hiring top talent for your company</p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company name</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Building size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="company-name"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="Your company name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email address</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="signup-email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="company@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="signup-password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff size={18} aria-hidden="true" />
                                                            ) : (
                                                                <Eye size={18} aria-hidden="true" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm password</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="confirm-password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Company logo</label>
                                                <div className="flex items-center space-x-4">
                                                    {imagePreview ? (
                                                        <div className="relative">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Company logo"
                                                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={clearImage}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload size={24} className="text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                                required
                                                            />
                                                        </label>
                                                    )}
                                                    <div className="text-sm text-gray-500">
                                                        <p>Upload your company logo</p>
                                                        <p className="text-xs">PNG, JPG up to 2MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 text-white font-medium transition duration-200"
                                            >
                                                {loading ? (
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                ) : (
                                                    <UserPlus size={20} className="mr-2" />
                                                )}
                                                {loading ? 'Creating account...' : 'Create account'}
                                            </button>
                                        </form>

                                        <div className="mt-6 text-center">
                                            <p className="text-gray-600 text-sm">
                                                Already have an account?{' '}
                                                <button
                                                    onClick={toggleMode}
                                                    className="font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none"
                                                >
                                                    Sign in
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RecruiterLogin;
// import React, { useContext, useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/AppContext";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'
// import { toast } from "react-toastify";

// const RecruiterLogin = () => {

//     const navigate = useNavigate()

//     const [state, setState] = useState('Login')
//     const [name, setName] = useState('')
//     const [password, setPassword] = useState('')
//     const [email, setEmail] = useState('')

//     const [image, setImage] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

//     const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

//     const onSubmitHandler = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             // const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//             // email,
//             // password
//             // });

//             // if (data.success) {
//             // localStorage.setItem('companyToken', data.token);
//             // setCompanyToken(data.token);
//             // setCompanyData(data.company);
//             // setShowRecruiterLogin(false);
//             // navigate('/dashboard/manage-jobs');
//             // toast.success('Login successful');
//             // }
//             if (state === "Login") {
//                 const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//                     email,
//                     password
//                 });

//                 if (data.success) {
//                     // Save to localStorage first
//                     localStorage.setItem('companyToken', data.token);

//                     // Then update context
//                     setCompanyToken(data.token);
//                     setCompanyData(data.company);

//                     // Close modal and redirect
//                     setShowRecruiterLogin(false);
//                     navigate('/dashboard');

//                     // Show success message last
//                     toast.success('Login successful');
//                 } else {
//                     toast.error(data.message || 'Login failed');
//                 }
//             } else {
//                 // Handle registration...
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             toast.error(error.response?.data?.message || 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const onSubmitHandler_4 = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//                 email,
//                 password
//             });

//             if (data.success) {
//                 localStorage.setItem('companyToken', data.token);
//                 setCompanyToken(data.token);
//                 setCompanyData(data.company);
//                 setShowRecruiterLogin(false);
//                 navigate('/dashboard/manage-jobs'); // Navigate to specific route
//                 toast.success('Login successful');
//             } else {
//                 toast.error(data.message || 'Login failed');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             toast.error(error.response?.data?.message || 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const onSubmitHandler_3 = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//                 email,
//                 password
//             });

//             if (data.success) {
//                 localStorage.setItem('companyToken', data.token);
//                 setCompanyToken(data.token);
//                 setCompanyData(data.company);
//                 setShowRecruiterLogin(false);
//                 navigate('/dashboard');
//                 toast.success('Login successful');
//             } else {
//                 toast.error(data.message || 'Login failed');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             toast.error(error.response?.data?.message || 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const onSubmitHandler_2 = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//                 email,
//                 password
//             });

//             if (data.success) {
//                 console.log('Login response:', data); // Debug log
//                 setCompanyData(data.company);
//                 setCompanyToken(data.token);
//                 localStorage.setItem('companyToken', data.token);
//                 toast.success('Login successful!');
//                 setShowRecruiterLogin(false);
//                 navigate('/dashboard');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             toast.error(error.response?.data?.message || 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const onSubmitHandler_0 = async (e) => {
//         e.preventDefault();

//         if (state === 'Sign Up' && !isTextDataSubmited) {
//             return setIsTextDataSubmited(true);
//         }

//         setLoading(true);
//         try {
//             if (state === "Login") {
//                 const { data } = await axios.post(`${backendUrl}/api/companies/login`, {
//                     email,
//                     password
//                 });
//                 console.log('Login response:', data);

//                 if (data.success) {
//                     setCompanyData(data.company);
//                     setCompanyToken(data.token);
//                     localStorage.setItem('companyToken', data.token);
//                     toast.success('Login successful!');
//                     setShowRecruiterLogin(false);
//                     navigate('/dashboard');
//                 }
//             } else {
//                 const formData = new FormData();
//                 formData.append('name', name);
//                 formData.append('password', password);
//                 formData.append('email', email);
//                 formData.append('image', image);

//                 const { data } = await axios.post(`${backendUrl}/api/companies/register`,
//                     formData,
//                     {
//                         headers: {
//                             'Content-Type': 'multipart/form-data'
//                         }
//                     }
//                 );

//                 if (data.success) {
//                     setCompanyData(data.company);
//                     setCompanyToken(data.token);
//                     localStorage.setItem('companyToken', data.token);
//                     toast.success('Registration successful!');
//                     setShowRecruiterLogin(false);
//                     navigate('/dashboard');
//                 }
//             }
//         } catch (error) {
//             console.error('Auth error:', error);
//             toast.error(error.response?.data?.message || 'Authentication failed');
//         } finally {
//             setLoading(false);
//         }
//     }
//     const onSubmitHandler_1 = async (e) => {
//         e.preventDefault()

//         if (state == 'Sign Up' && !isTextDataSubmited) {
//             return setIsTextDataSubmited(true)
//         }

//         try {

//             if (state === "Login") {
//                 const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })

//                 if (data.success) {

//                     setCompanyData(data.company)
//                     setCompanyToken(data.token)
//                     localStorage.setItem('companyToken', data.token)
//                     setShowRecruiterLogin(false)
//                     navigate('/dashboard')
//                 }
//                 else {
//                     toast.error(data.message)
//                 }
//             }
//             else {
//                 const formData = new FormData()
//                 formData.append('name', name)
//                 formData.append('password', password)
//                 formData.append('email', email)
//                 formData.append('image', image)

//                 const { data } = await axios.post(backendUrl + '/api/company/register', formData)

//                 if (data.success) {

//                     setCompanyData(data.company)
//                     setCompanyToken(data.token)
//                     localStorage.setItem('companyToken', data.token)
//                     setShowRecruiterLogin(false)
//                     navigate('/dashboard')
//                 }
//                 else {
//                     toast.error(data.message)
//                 }
//             }
//         } catch (error) {
//             toast.error(error.message)

//         }
//     }

//     useEffect(() => {
//         document.body.style.overflow = 'hidden'

//         return () => {
//             document.body.style.overflow = 'unset'
//         }
//     }, [])

//     return (
//         <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
//             <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500" action="">
//                 <h1 className="text-center text-2xl text-neutral-700 font-medium">Recruiter {state}</h1>
//                 <p className="text-sm">Welcome back! Please sign in to continue!!</p>
//                 {state === 'Sign Up' && isTextDataSubmited
//                     ? <>
//                         <div className="flex items-center gap-4 my-10">
//                             <label htmlFor="image">
//                                 <img className="w-16 rounded-full" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
//                                 <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
//                             </label>
//                             <p>Upload Company <br /> Logo</p>
//                         </div>
//                     </>
//                     :
//                     <>

//                         {state !== 'Login' && (
//                             <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
//                                 <img src={assets.person_icon} alt="" />
//                                 <input className="outline-none text-sm" onChange={e => setName(e.target.value)} value={name} type="text" placeholder="Company name" required />
//                             </div>
//                         )}
//                         <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
//                             <img src={assets.email_icon} alt="" />
//                             <input className="outline-none text-sm" onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Email Id" required />
//                         </div>

//                         <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
//                             <img src={assets.lock_icon} alt="" />
//                             <input className="outline-none text-sm" onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Passwod" required />
//                         </div>


//                     </>
//                 }



//                 {state === 'Login' && <p className="text-sm text-blue-600 mt-4 cursor-pointer">Forgot password?</p>}

//                 {/* <button type='submit' className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"> */}
//                 {/* {state === 'Login' ? 'login' : isTextDataSubmited ? 'create account' : 'next'} */}
//                 {/* </button> */}
//                 <button
//                     type='submit'
//                     className="bg-blue-600 w-full text-white py-2 rounded-full mt-4 disabled:opacity-50"
//                     disabled={loading}
//                 >
//                     {loading ? 'Please wait...' : state === 'Login' ? 'Login' : isTextDataSubmited ? 'Create Account' : 'Next'}
//                 </button>
//                 {
//                     state === 'Login'
//                         ? <p className="mt-5 text-center">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState("Sign Up")}>Sign Up</span></p>
//                         : <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState("Login")}>Login</span></p>
//                 }
//                 <img onClick={e => setShowRecruiterLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />

//             </form>
//         </div>
//     )
// }

// export default RecruiterLogin 