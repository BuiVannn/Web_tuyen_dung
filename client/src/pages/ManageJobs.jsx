//import React from "react";
import { manageJobsData } from "../assets/assets";
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

// them 
import React, { useState } from "react";



const ManageJobs = () => {

    const navigate = useNavigate()

    //them
    const [showDeleteColumn, setShowDeleteColumn] = useState(false);
    const [selectedJobs, setSelectedJobs] = useState([]);
    //
    const toggleDeleteMode = () => {
        setShowDeleteColumn(!showDeleteColumn);
        setSelectedJobs([]); // Reset chọn job khi bật/tắt
    };
    const handleSelectJob = (jobId) => {
        setSelectedJobs((prev) =>
            prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
        );
    };

    const deleteSelectedJobs = () => {
        console.log("Deleting jobs:", selectedJobs);
        // Gọi API hoặc cập nhật state để xóa job
    };

    return (
        <div className="container p-4 max-w-5xl">
            <div className="overflow-x-auto ">
                <table className="min-w-full bg-white border border-gray-200 border-collapse max-sm:text-sm mt-4">
                    <thead>
                        <tr>
                            {/* test */}
                            {showDeleteColumn && (
                                <th className="py-2 px-4 border-b border-gray-300 text-center w-16">Select</th>
                            )}

                            {/*  */}
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
                            <th className="py-2 px-4 border-b text-left ">Job Title</th>
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
                            <th className="py-2 px-4 border-b text-center ">Applicants</th>
                            <th className="py-2 px-4 border-b text-left ">Visible</th>
                        </tr>
                    </thead>

                    <tbody>
                        {manageJobsData.map((job, index) => (
                            <tr key={index} className="text-gray-700">
                                {/* test */}
                                {showDeleteColumn && (
                                    <td className="py-2 px-4 border-b">
                                        <input className="scale-125 ml-4" type="checkbox"
                                            onChange={() => handleSelectJob(job.id)} />
                                    </td>
                                )}
                                {/*  */}
                                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{job.title}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format('ll')}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                                <td className="py-2 px-4 border-b text-center">{job.applicants}</td>
                                <td className="py-2 px-4 border-b">
                                    <input className="scale-125 ml-4" type="checkbox" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*  */}
            {/* <div className="mt-4 flex justify-end"> */}
            {/* <button onClick={() => navigate('/dashboard/add-job')} className="bg-black text-white py-2 px-4 rounded ">Add new job</button> */}
            {/* </div> */}

            {/* them xoa job */}
            {/* <div className="mt-4 flex justify-end"> */}
            {/* <button onClick={() => navigate('/dashboard/add-job')} className="bg-black text-white py-2 px-4 rounded ">Delete job</button> */}
            {/* </div> */}

            <div className="mt-4 flex justify-end gap-2">
                <button
                    onClick={() => navigate('/dashboard/add-job')}
                    className="bg-black text-white py-2 px-4 rounded w-[140px] text-center"
                >
                    Add new job
                </button>

                {/* test */}
                <button
                    onClick={() => navigate('/dashboard/add-job')}
                    className="bg-[#FDBB30] text-white py-2 px-4 rounded w-[140px] text-center"
                >
                    Edit job
                </button>
                {/* test */}
                <button
                    onClick={toggleDeleteMode}
                    className="bg-red-500 text-white py-2 px-4 rounded w-[140px] text-center"
                >
                    {showDeleteColumn ? "Cancel" : "Delete job"}
                </button>

                {showDeleteColumn && (
                    <button
                        onClick={deleteSelectedJobs}
                        className="bg-red-700 text-white py-2 px-4 rounded w-[140px] text-center"
                    >
                        Confirm Delete
                    </button>
                )}


            </div>

        </div>
    )
}

export default ManageJobs 