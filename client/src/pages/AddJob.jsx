import React, { use, useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Ho Chi Minh');
    const [category, setCategory] = useState('Information Technology');
    const [type, setType] = useState('Full-time'); // New field
    const [experience, setExperience] = useState('Entry'); // New field
    const [salary, setSalary] = useState('');
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    // const [title, setTitle] = useState('');
    // const [location, setLocation] = useState('Bangalore');
    // const [category, setCategory] = useState('Programming');
    // const [level, setLevel] = useState('Beginner level')
    // const [salary, setSalary] = useState(0);
    // const editorRef = useRef(null)
    // const quillRef = useRef(null)

    const { backendUrl, companyToken } = useContext(AppContext)

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const description = quillRef.current.root.innerHTML;
            const { data } = await axios.post(
                `${backendUrl}/api/companies/post-job`,
                {
                    title,
                    description,
                    location,
                    salary,
                    type, // Add new field
                    experience, // Add new field 
                    category
                },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                setTitle('');
                setSalary('');
                quillRef.current.root.innerHTML = "";
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm công việc");
        }
    };
    const onSubmitHandler_1 = async (e) => {
        e.preventDefault()

        try {
            const description = quillRef.current.root.innerHTML
            const { data } = await axios.post(
                `${backendUrl}/api/companies/post-job`,
                { title, description, location, salary, category, level },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (data.success) {
                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm công việc")
        }
    }
    const onSubmitHandler_0 = async (e) => {
        e.preventDefault()

        try {

            const description = quillRef.current.root.innerHTML
            const { data } = await axios.post(backendUrl + '/api/company/post-job',
                { title, description, location, salary, category, level },
                { headers: { token: companyToken } }
            )
            if (data.success) {

                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }
    useEffect(() => {
        // initiate quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
        }
    }, [])

    return (
        <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
            {/* Job Title */}
            <div className="w-full">
                <p className="mb-2">Job Title <span className="text-red-500">*</span></p>
                <input
                    type="text"
                    placeholder="Enter job title"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                    required
                    className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                />
            </div>

            {/* Job Description */}
            <div className="w-full max-w-lg">
                <p className="my-2">Job Description <span className="text-red-500">*</span></p>
                <div ref={editorRef}></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {/* Job Type - New Field */}
                <div>
                    <p className="mb-2">Job Type <span className="text-red-500">*</span></p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        required
                    >
                        {jobTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Experience Level - New Field */}
                <div>
                    <p className="mb-2">Experience Level <span className="text-red-500">*</span></p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={experience}
                        onChange={e => setExperience(e.target.value)}
                        required
                    >
                        {experienceLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                {/* Job Category */}
                <div>
                    <p className="mb-2">Job Category <span className="text-red-500">*</span></p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    >
                        {JobCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Job Location */}
                <div>
                    <p className="mb-2">Job Location <span className="text-red-500">*</span></p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                    >
                        {JobLocations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Salary */}
                <div>
                    <p className="mb-2">Salary Range <span className="text-red-500">*</span></p>
                    <input
                        type="text"
                        placeholder="e.g. $1000-2000"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={salary}
                        onChange={e => setSalary(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-28 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800"
            >
                Add Job
            </button>
        </form>
    );
};

export default AddJob;
//     return (
//         <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3 ">
//             {/* tieu de job */}
//             <div className="w-full ">
//                 <p className="mb-2">Job Title</p>
//                 <input type="text" placeholder="Type here"
//                     onChange={e => setTitle(e.target.value)} value={title}
//                     required
//                     className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded "
//                 />
//             </div>
//             {/* mo ta */}
//             <div className="w-full max-w-lg">
//                 <p className="my-2">Job Description</p>
//                 <div ref={editorRef}>

//                 </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
//                 <div>
//                     <p className="mb-2">Job Category</p>
//                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setCategory(e.target.value)}>
//                         {JobCategories.map((category, index) => (
//                             <option key={index} value={category}>{category}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <p className="mb-2">Job Location</p>
//                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLocation(e.target.value)}>
//                         {JobLocations.map((location, index) => (
//                             <option key={index} value={location}>{location}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <p className="mb-2">Job Level</p>
//                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLevel(e.target.value)}>
//                         <option value="Beginer level">Beginer Level</option>
//                         <option value="Intermediate level">Intermediate Level</option>
//                         <option value="Senior level">Senior Level</option>
//                     </select>
//                 </div>


//             </div>

//             <div>
//                 <p className="mb-2">Job Salary</p>
//                 <input min={0} className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" onChange={e => setSalary(e.target.value)} type="Number" placeholder="2500" />
//             </div>

//             <button className="w-28 py-3 mt-4 bg-black text-white rounded">Add</button>
//         </form>
//     )
// }

// export default AddJob 