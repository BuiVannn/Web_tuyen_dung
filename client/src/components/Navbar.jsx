import React, { useContext } from "react";
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Navbar = () => {

    // Mở cửa sổ đăng nhập của Clerk.
    const { openSignIn } = useClerk()

    // Chứa thông tin của người dùng đã đăng nhập.
    const { user } = useUser()

    // Dùng để điều hướng.
    const navigate = useNavigate()

    // Hàm bật modal đăng nhập cho nhà tuyển dụng.
    const { setShowRecruiterLogin } = useContext(AppContext)

    return (
        <div className="shadow py-4">
            <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
                {/* Hiển thị logo và điều hướng về trang chủ */}
                <img onClick={() => navigate('/')} className="cursor-pointer" src={assets.logo} alt="" />

                {/* Đăng nhập*/}
                {

                    user
                        // nếu người dùng đã đăng nhập
                        ?
                        <div className="flex items-center justify-between gap-3 bg-white shadow-sm px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-5">
                                <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Blog</Link>

                                <Link to={'/applications'} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Applied Jobs</Link>

                                <Link to={"/saved-jobs"} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Saved Jobs</Link>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="max-sm:hidden text-gray-700 font-medium">Hi, {user.firstName + " " + user.lastName}</p>
                                <UserButton />
                            </div>
                        </div>

                        // nếu chưa đăng nhập
                        : <div className="flex gap-4 max-sm:text-xs">
                            {/* <button className="text-gray-600">Recruiter Login</button> */}
                            <button onClick={e => setShowRecruiterLogin(true)} className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">Recruiter Login</button>
                            <button onClick={e => openSignIn()} className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">User Login</button>
                            {/* <button className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">Login</button> */}
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar