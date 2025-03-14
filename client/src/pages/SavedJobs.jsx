import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Icon xoá
import JobCard from "../components/JobCard"; // Dùng lại component JobCard
import Navbar from "../components/Navbar";

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        const jobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
        setSavedJobs(jobs);
        console.log(jobs);
    }, []);

    // const removeJob = (jobId) => {
    // const updatedJobs = savedJobs.filter((id) => id !== jobId);
    // localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
    // setSavedJobs(updatedJobs);
    // };
    const removeJob = (jobId) => {
        const updatedJobs = savedJobs.filter(job => job._id !== jobId);
        setSavedJobs(updatedJobs);
        localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
        console.log("🗑 Removed Job:", jobId);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
                {savedJobs.length === 0 ? (
                    <p>No saved jobs yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedJobs.map((job) => (
                            <div key={job._id} className="relative">
                                <JobCard job={job} />
                                {/* Nút xóa đặt ở góc trên bên phải */}
                                <button
                                    onClick={() => removeJob(job._id)}
                                    className="absolute top-5 right-5 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-all"
                                >
                                    <FaTrash className="text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>


                )}
                <button onClick={() => navigate("/")} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Back Home
                </button>
            </div>
        </>
    );
};

export default SavedJobs;
