// Dùng để quản lý trạng thái của icon bookmark.
import React, { useState, useEffect } from "react";


import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// test
//import { FaHeart, FaRegHeart } from "react-icons/fa"; // Icon trái tim
//import { useAuth } from "@clerk/clerk-react"; // Sử dụng Clerk để lấy user

//Biểu tượng bookmark để lưu công việc yêu thích.
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

// Component này nhận một đối tượng job, chứa thông tin về công việc (title, location, level, description,...).
const JobCard = ({ job }) => {

    const navigate = useNavigate()

    // test
    //isFavorite: true nếu công việc đã được lưu vào danh sách yêu thích, ngược lại là false.
    const [isFavorite, setIsFavorite] = useState(false);
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        //setIsFavorite(savedJobs.includes(job._id));
        // const found = savedJobs.some((savedJob) => savedJob._id === job._id);
        // setIsFavorite(found);
        setIsFavorite(savedJobs.some(item => item._id === job._id));
    }, [job._id]);
    const toggleFavorite = () => {
        console.log("Clicked!");
        let savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        if (isFavorite) {
            //savedJobs = savedJobs.filter((id) => id !== job._id);
            savedJobs = savedJobs.filter(item => item._id !== job._id);
        } else {
            //savedJobs.push(job._id);
            savedJobs.push(job);
        }
        localStorage.setItem("favoriteJobs", JSON.stringify(savedJobs));
        setIsFavorite(!isFavorite);
        console.log("Saved Jobs After Update:", savedJobs);
    };
    // 
    return (
        <div className="border p-6 shadow rounded">
            <div className="flex jutify-between items-center">
                <img className="h-8" src={assets.company_icon} alt="" />
                {/* test */}
                <div className="ml-auto">
                    <button onClick={toggleFavorite} className="text-red-500 text-xl">
                        {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                </div>


                {/*  */}
            </div>
            <h4 className="font-medium text-xl mt-2">{job.title}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded ">{job.location}</span>
                <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded ">{job.level}</span>
            </div>
            <p className="text-gray-500 text-sm mt-4" dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>
            <div className="mt-4 flex gap-4 text-sm">
                <button onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} className="bg-blue-600 text-white px-4 py-2 rounded">Apply now</button>
                <button onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} className="text-gray-500 border border-gray-500 rounded px-4 py-2">Learn more</button>

            </div>
        </div>
    )
}

export default JobCard