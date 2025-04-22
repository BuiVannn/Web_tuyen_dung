import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, UserCheck, User, X, Loader2, LogIn, ArrowRight } from 'lucide-react';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const UserLogin = ({ onClose }) => {
    const navigate = useNavigate();
    const { loginUser, backendUrl, setShowUserLogin } = useContext(AppContext);

    // Form states
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // Close modal when escape key is pressed
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27 && onClose) onClose();
        };

        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (setShowUserLogin) {
            setShowUserLogin(false);
        }
    };

    // Toggle between login and signup
    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
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
                toast.error('Full name is required');
                return;
            }

            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                // Login logic
                const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
                    email,
                    password
                });

                if (data.success) {
                    await loginUser(data.token, data.user);
                    handleClose();
                    navigate('/');
                    toast.success('Login successful');
                } else {
                    toast.error(data.message || 'Login failed');
                }
            } else {
                // Registration logic
                const { data } = await axios.post(`${backendUrl}/api/auth/users/register`, {
                    name,
                    email,
                    password
                });

                if (data.success) {
                    await loginUser(data.token, data.user);
                    handleClose();
                    navigate('/');
                    toast.success('Registration successful!');
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
                                        <p className="text-gray-600 mb-8">Sign in to your job seeker account</p>

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
                                                        placeholder="you@example.com"
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
                                            <User size={80} className="text-white" />
                                        </div>
                                        <h3 className="text-white text-2xl font-bold mb-3">Find your dream job today</h3>
                                        <p className="text-blue-100 mb-6">Access thousands of job opportunities and build your career</p>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">5k+</h4>
                                                <p className="text-sm">Active job posts</p>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">1k+</h4>
                                                <p className="text-sm">Companies hiring</p>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white max-w-[160px]">
                                                <h4 className="font-bold text-xl">24/7</h4>
                                                <p className="text-sm">Career support</p>
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
                                    className="hidden sm:flex w-full md:w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center overflow-hidden"
                                >
                                    <div className="p-8 text-center">
                                        <div className="flex justify-center mb-6">
                                            <UserCheck size={80} className="text-white" />
                                        </div>
                                        <h3 className="text-white text-2xl font-bold mb-3">Join our job seeker community</h3>
                                        <p className="text-green-100 mb-6">Create your profile and start your job search journey today</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Apply to top companies</p>
                                                    <p className="text-xs text-green-100">Connect with leading employers in your field</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Track your applications</p>
                                                    <p className="text-xs text-green-100">Stay organized in your job search</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-left bg-white/20 backdrop-blur-md rounded-lg p-3 text-white">
                                                <div className="mr-3 p-2 bg-white/20 rounded-full">
                                                    <ArrowRight size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Personalized job matches</p>
                                                    <p className="text-xs text-green-100">Find opportunities tailored to your skills</p>
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
                                        <p className="text-gray-600 mb-8">Start your job search journey with us</p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                                                <div className="relative rounded-md">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="John Doe"
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
                                                        placeholder="you@example.com"
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

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 text-white font-medium transition duration-200"
                                            >
                                                {loading ? (
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                ) : (
                                                    <UserCheck size={20} className="mr-2" />
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

export default UserLogin;
// import React, { useState, useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Mail, Lock, Eye, EyeOff, UserCheck, User, X, Loader2, LogIn } from 'lucide-react';
// import { assets } from '../assets/assets';
// import { motion, AnimatePresence } from 'framer-motion';

// const UserLogin = ({ onClose }) => {
//     const navigate = useNavigate();
//     const { loginUser, backendUrl } = useContext(AppContext);

//     // Form states
//     const [isLogin, setIsLogin] = useState(true);
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     // Toggle between login and signup
//     const toggleMode = () => {
//         setIsLogin(!isLogin);
//         // Reset form
//         setName('');
//         setEmail('');
//         setPassword('');
//         setConfirmPassword('');
//         setShowPassword(false);
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validation
//         if (!email || !password) {
//             toast.error('Please fill in all required fields');
//             return;
//         }

//         if (!isLogin) {
//             if (!name) {
//                 toast.error('Full name is required');
//                 return;
//             }

//             if (password !== confirmPassword) {
//                 toast.error('Passwords do not match');
//                 return;
//             }

//             if (password.length < 6) {
//                 toast.error('Password must be at least 6 characters');
//                 return;
//             }
//         }

//         setLoading(true);

//         try {
//             if (isLogin) {
//                 // Login logic
//                 const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
//                     email,
//                     password
//                 });

//                 if (data.success) {
//                     await loginUser(data.token, data.user);
//                     if (onClose) onClose(); // Close modal if provided
//                     navigate('/');
//                     toast.success('Login successful');
//                 } else {
//                     toast.error(data.message || 'Login failed');
//                 }
//             } else {
//                 // Registration logic
//                 const { data } = await axios.post(`${backendUrl}/api/auth/users/register`, {
//                     name,
//                     email,
//                     password
//                 });

//                 if (data.success) {
//                     toast.success('Registration successful! Please sign in');
//                     setIsLogin(true);
//                     setEmail('');
//                     setPassword('');
//                 } else {
//                     toast.error(data.message || 'Registration failed');
//                 }
//             }
//         } catch (error) {
//             console.error('Auth error:', error);
//             toast.error(error.response?.data?.message || 'Authentication failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
//                 {/* Close button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                 >
//                     <X size={24} />
//                 </button>

//                 <div className="p-6">
//                     <div className="flex justify-center mb-4">
//                         <img
//                             src={assets.logo}
//                             alt="JobPortal Logo"
//                             className="h-10 w-auto"
//                         />
//                     </div>
//                     <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">
//                         {isLogin ? 'Welcome back' : 'Create an account'}
//                     </h2>
//                     <p className="text-center text-sm text-gray-600 mb-6">
//                         {isLogin ? 'Sign in to your job seeker account' : 'Start your job search journey with us'}
//                     </p>

//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={isLogin ? 'login' : 'register'}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ duration: 0.2 }}
//                         >
//                             <form onSubmit={handleSubmit} className="space-y-5">
//                                 {!isLogin && (
//                                     <div>
//                                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                                             Full name
//                                         </label>
//                                         <div className="mt-1 relative rounded-md shadow-sm">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <User size={18} className="text-gray-400" />
//                                             </div>
//                                             <input
//                                                 id="name"
//                                                 name="name"
//                                                 type="text"
//                                                 autoComplete="name"
//                                                 required
//                                                 value={name}
//                                                 onChange={(e) => setName(e.target.value)}
//                                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                                 placeholder="John Doe"
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                         Email address
//                                     </label>
//                                     <div className="mt-1 relative rounded-md shadow-sm">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <Mail size={18} className="text-gray-400" />
//                                         </div>
//                                         <input
//                                             id="email"
//                                             name="email"
//                                             type="email"
//                                             autoComplete="email"
//                                             required
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                             placeholder="you@example.com"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                                         Password
//                                     </label>
//                                     <div className="mt-1 relative rounded-md shadow-sm">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <Lock size={18} className="text-gray-400" />
//                                         </div>
//                                         <input
//                                             id="password"
//                                             name="password"
//                                             type={showPassword ? "text" : "password"}
//                                             autoComplete={isLogin ? "current-password" : "new-password"}
//                                             required
//                                             value={password}
//                                             onChange={(e) => setPassword(e.target.value)}
//                                             className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                             placeholder="••••••••"
//                                         />
//                                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 className="text-gray-400 hover:text-gray-500 focus:outline-none"
//                                             >
//                                                 {showPassword ? (
//                                                     <EyeOff size={18} aria-hidden="true" />
//                                                 ) : (
//                                                     <Eye size={18} aria-hidden="true" />
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {!isLogin && (
//                                     <div>
//                                         <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
//                                             Confirm password
//                                         </label>
//                                         <div className="mt-1 relative rounded-md shadow-sm">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <Lock size={18} className="text-gray-400" />
//                                             </div>
//                                             <input
//                                                 id="confirm-password"
//                                                 name="confirm-password"
//                                                 type={showPassword ? "text" : "password"}
//                                                 autoComplete="new-password"
//                                                 required
//                                                 value={confirmPassword}
//                                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                                 placeholder="••••••••"
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {isLogin && (
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="remember-me"
//                                                 name="remember-me"
//                                                 type="checkbox"
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                             />
//                                             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                                                 Remember me
//                                             </label>
//                                         </div>

//                                         <div className="text-sm">
//                                             <a href="#forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//                                                 Forgot password?
//                                             </a>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div>
//                                     <button
//                                         type="submit"
//                                         disabled={loading}
//                                         className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <Loader2 size={20} className="animate-spin mr-2" />
//                                                 {isLogin ? 'Signing in...' : 'Creating account...'}
//                                             </>
//                                         ) : (
//                                             <>
//                                                 {isLogin ? (
//                                                     <>
//                                                         <LogIn size={18} className="mr-2" />
//                                                         Sign in
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <UserCheck size={18} className="mr-2" />
//                                                         Create account
//                                                     </>
//                                                 )}
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </AnimatePresence>

//                     <div className="mt-6">
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-white text-gray-500">
//                                     {isLogin ? "Don't have an account?" : "Already have an account?"}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="mt-6">
//                             <button
//                                 onClick={toggleMode}
//                                 className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 {isLogin ? (
//                                     <>
//                                         <UserCheck size={18} className="mr-2" />
//                                         Create an account
//                                     </>
//                                 ) : (
//                                     <>
//                                         <LogIn size={18} className="mr-2" />
//                                         Sign in to your account
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserLogin;

// import React, { useState, useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
// import { assets } from '../assets/assets';

// const UserLogin = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const { loginUser, backendUrl } = useContext(AppContext);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             toast.error('Please fill in all fields');
//             return;
//         }

//         setLoading(true);

//         try {
//             // Sử dụng đúng API endpoint đã xác định
//             const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
//                 email,
//                 password
//             });

//             console.log('Login response:', data);

//             if (data.success) {
//                 await loginUser(data.token, data.user);
//                 navigate('/');

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

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="flex justify-center">
//                     <img
//                         src={assets.logo}
//                         alt="JobPortal Logo"
//                         className="h-12 w-auto"
//                     />
//                 </div>
//                 <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                     Welcome back
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-600">
//                     Sign in to your job seeker account
//                 </p>
//             </div>

//             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                 Email address
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail size={18} className="text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     name="email"
//                                     type="email"
//                                     autoComplete="email"
//                                     required
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     placeholder="you@example.com"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                                 Password
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock size={18} className="text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     autoComplete="current-password"
//                                     required
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     placeholder="••••••••"
//                                 />
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="text-gray-400 hover:text-gray-500 focus:outline-none"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff size={18} aria-hidden="true" />
//                                         ) : (
//                                             <Eye size={18} aria-hidden="true" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <input
//                                     id="remember-me"
//                                     name="remember-me"
//                                     type="checkbox"
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 />
//                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                                     Remember me
//                                 </label>
//                             </div>

//                             <div className="text-sm">
//                                 <a href="#forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//                                     Forgot your password?
//                                 </a>
//                             </div>
//                         </div>

//                         <div>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Signing in...
//                                     </>
//                                 ) : (
//                                     'Sign in'
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <div className="mt-6">
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-white text-gray-500">
//                                     Don't have an account?
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="mt-6">
//                             <Link
//                                 to="/register"
//                                 className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 <UserCheck size={18} className="mr-2" />
//                                 Create an account
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Login as company shortcut */}
//             <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600">
//                     Are you a recruiter?{' '}
//                     <button
//                         onClick={() => navigate('/company-login')}
//                         className="font-medium text-blue-600 hover:text-blue-500"
//                     >
//                         Login as a company
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default UserLogin;

// import React, { useState, useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const UserLogin = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { loginUser, backendUrl } = useContext(AppContext);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
//                 email,
//                 password
//             });

//             console.log('Login response:', data);

//             if (data.success) {
//                 await loginUser(data.token, data.user);
//                 toast.success('Login successful!');
//                 navigate('/');
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

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email address
//                 </label>
//                 <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//             </div>

//             <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                 </label>
//                 <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//             </div>

//             <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//                 {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//         </form>
//     );
// };

// export default UserLogin;
// // import React, { useState, useContext } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import { useNavigate } from 'react-router-dom';
// // import { assets } from '../assets/assets';
// // import { toast } from 'react-toastify';
// // import axios from 'axios';

// // const UserLogin = () => {
// //     const navigate = useNavigate();
// //     const [state, setState] = useState('Login');
// //     const [name, setName] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [loading, setLoading] = useState(false);
// //     const { loginUser, backendUrl } = useContext(AppContext);

// //     const validateForm = () => {
// //         if (!email || !password) {
// //             toast.error('Please fill in all fields');
// //             return false;
// //         }
// //         if (state === 'Sign Up' && !name) {
// //             toast.error('Please enter your name');
// //             return false;
// //         }
// //         return true;
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (!validateForm()) return;

// //         setLoading(true);
// //         try {
// //             if (state === 'Login') {
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
// //                     email,
// //                     password
// //                 });

// //                 console.log('Login response:', data); // Debug log

// //                 if (data.success) {
// //                     await loginUser(data.token, data.user);
// //                     toast.success('Login successful!');
// //                     navigate('/');
// //                 } else {
// //                     toast.error(data.message || 'Login failed');
// //                 }
// //             } else {
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/register`, {
// //                     name,
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     toast.success('Registration successful! Please login.');
// //                     setState('Login');
// //                     setName('');
// //                     setEmail('');
// //                     setPassword('');
// //                 } else {
// //                     toast.error(data.message || 'Registration failed');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Auth error:', error);
// //             toast.error(
// //                 error.response?.data?.message ||
// //                 (state === 'Login' ? 'Login failed' : 'Registration failed')
// //             );
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //     const handleSubmit_3 = async (e) => {
// //         e.preventDefault();
// //         if (!validateForm()) return;

// //         setLoading(true);
// //         try {
// //             if (state === 'Login') {
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     await loginUser(data.token, data.user);
// //                     toast.success('Login successful!');
// //                     navigate('/');
// //                 } else {
// //                     toast.error(data.message || 'Login failed');
// //                 }
// //             } else {
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/register`, {
// //                     name,
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     toast.success('Registration successful! Please login.');
// //                     setState('Login');
// //                     setName('');
// //                     setEmail('');
// //                     setPassword('');
// //                 } else {
// //                     toast.error(data.message || 'Registration failed');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Auth error:', error);
// //             toast.error(
// //                 error.response?.data?.message ||
// //                 (state === 'Login' ? 'Login failed' : 'Registration failed')
// //             );
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //     const handleSubmit_2 = async (e) => {
// //         e.preventDefault();
// //         if (!validateForm()) return;

// //         setLoading(true);
// //         try {
// //             if (state === 'Login') {
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/login`, {
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     await loginUser(data.token, data.user);
// //                     toast.success('Login successful!');
// //                     navigate('/');
// //                 } else {
// //                     toast.error(data.message || 'Login failed');
// //                 }
// //             } else {
// //                 // Handle registration
// //                 const { data } = await axios.post(`${backendUrl}/api/auth/users/register`, {
// //                     name,
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     toast.success('Registration successful! Please login.');
// //                     setState('Login');
// //                     setName('');
// //                     setEmail('');
// //                     setPassword('');
// //                 } else {
// //                     toast.error(data.message || 'Registration failed');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Auth error:', error);
// //             toast.error(
// //                 error.response?.data?.message ||
// //                 (state === 'Login' ? 'Login failed' : 'Registration failed')
// //             );
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //     const handleSubmit_1 = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);

// //         try {
// //             if (state === 'Login') {
// //                 const success = await loginUser(email, password);
// //                 if (success) {
// //                     toast.success('Login successful!');
// //                     navigate('/');
// //                 }
// //             } else {
// //                 // Handle registration
// //                 const { data } = await axios.post(`${backendUrl}/api/users/register`, {
// //                     name,
// //                     email,
// //                     password
// //                 });

// //                 if (data.success) {
// //                     toast.success('Registration successful! Please login.');
// //                     setState('Login');
// //                     setName('');
// //                     setEmail('');
// //                     setPassword('');
// //                 } else {
// //                     toast.error(data.message || 'Registration failed');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Auth error:', error);
// //             toast.error(
// //                 error.response?.data?.message ||
// //                 (state === 'Login' ? 'Login failed' : 'Registration failed')
// //             );
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //     const handleSubmit_0 = async (e) => {
// //         e.preventDefault();
// //         if (state === 'Login') {
// //             const success = await loginUser(email, password);
// //             if (success) {
// //                 navigate('/');
// //             }
// //         }
// //     };


// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //             <div className="max-w-md w-full space-y-8">
// //                 <div>
// //                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //                         {state === 'Login' ? 'Sign in to your account' : 'Create new account'}
// //                     </h2>
// //                 </div>
// //                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //                     <div className="rounded-md shadow-sm -space-y-px">
// //                         {state === 'Sign Up' && (
// //                             <div>
// //                                 <input
// //                                     type="text"
// //                                     required
// //                                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                                     placeholder="Full name"
// //                                     value={name}
// //                                     onChange={(e) => setName(e.target.value)}
// //                                 />
// //                             </div>
// //                         )}
// //                         <div>
// //                             <input
// //                                 type="email"
// //                                 required
// //                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                                 placeholder="Email address"
// //                                 value={email}
// //                                 onChange={(e) => setEmail(e.target.value)}
// //                             />
// //                         </div>
// //                         <div>
// //                             <input
// //                                 type="password"
// //                                 required
// //                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                                 placeholder="Password"
// //                                 value={password}
// //                                 onChange={(e) => setPassword(e.target.value)}
// //                             />
// //                         </div>
// //                     </div>

// //                     <div>
// //                         <button
// //                             type="submit"
// //                             disabled={loading}
// //                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
// //                         >
// //                             {loading ? 'Please wait...' : (state === 'Login' ? 'Sign in' : 'Sign up')}
// //                         </button>
// //                     </div>

// //                     <div className="text-sm text-center">
// //                         {state === 'Login' ? (
// //                             <p>
// //                                 Don't have an account?{' '}
// //                                 <button
// //                                     type="button"
// //                                     className="font-medium text-indigo-600 hover:text-indigo-500"
// //                                     onClick={() => setState('Sign Up')}
// //                                 >
// //                                     Sign up
// //                                 </button>
// //                             </p>
// //                         ) : (
// //                             <p>
// //                                 Already have an account?{' '}
// //                                 <button
// //                                     type="button"
// //                                     className="font-medium text-indigo-600 hover:text-indigo-500"
// //                                     onClick={() => setState('Login')}
// //                                 >
// //                                     Sign in
// //                                 </button>
// //                             </p>
// //                         )}
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UserLogin;