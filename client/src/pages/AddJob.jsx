import React, { useContext, useEffect, useRef, useState } from "react";
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
    const [type, setType] = useState('Full-time');
    const [experience, setExperience] = useState('Entry');

    // Trường lương
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [currency, setCurrency] = useState('USD');

    // Trường kỹ năng (nếu cần)
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [preferredSkills, setPreferredSkills] = useState([]);

    const [submitting, setSubmitting] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const { backendUrl, companyToken } = useContext(AppContext);

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];
    const currencies = ['USD', 'VND', 'EUR', 'JPY', 'SGD'];

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!quillRef.current) {
            toast.error("Trình soạn thảo chưa được khởi tạo. Vui lòng tải lại trang.");
            return;
        }

        // Lấy nội dung từ editor
        const description = quillRef.current.root.innerHTML;

        // Kiểm tra nội dung editor có trống không
        if (!description || description === '<p><br></p>') {
            toast.error("Vui lòng nhập mô tả công việc");
            return;
        }

        // Kiểm tra dữ liệu lương hợp lệ
        if (!minSalary || !maxSalary) {
            toast.error("Vui lòng nhập đầy đủ thông tin mức lương");
            return;
        }

        // Kiểm tra minSalary <= maxSalary
        if (Number(minSalary) > Number(maxSalary)) {
            toast.error("Mức lương tối thiểu không thể lớn hơn mức lương tối đa");
            return;
        }

        // Hiển thị đầy đủ dữ liệu sẽ gửi đi để debug
        console.log("Dữ liệu công việc sẽ gửi đi:", {
            title,
            description,
            location,
            minSalary: Number(minSalary),
            maxSalary: Number(maxSalary),
            currency,
            type,
            experience,
            category,
            // Thêm các trường khác nếu cần
        });

        setSubmitting(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/jobs`,
                {
                    title,
                    description,
                    location,
                    minSalary: Number(minSalary),
                    maxSalary: Number(maxSalary),
                    currency,
                    type,
                    experience,
                    category,
                    // requiredSkills, // Nếu cần
                    // preferredSkills, // Nếu cần
                    // Đảm bảo các trường khác trong mô hình Job cũng được gửi đi
                },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message || "Đăng tuyển công việc thành công!");
                // Reset form sau khi đăng thành công
                setTitle('');
                setMinSalary('');
                setMaxSalary('');
                setCurrency('USD');
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = "";
                }
            } else {
                toast.error(data.message || "Không thể đăng tuyển công việc!");
            }
        } catch (error) {
            console.error("Lỗi khi đăng tuyển:", error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? error.response.data.errors.join(', ') : "Lỗi khi thêm công việc");
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        // initiate quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link'],
                        ['clean']
                    ]
                },
                placeholder: 'Nhập mô tả công việc chi tiết...'
            });
        }
    }, []);

    return (
        <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
            <h2 className="text-2xl font-semibold mb-4">Đăng tuyển công việc mới</h2>

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
            <div className="w-full">
                <p className="my-2">Job Description <span className="text-red-500">*</span></p>
                <div ref={editorRef} style={{ minHeight: "200px" }}></div>
                <div className="text-sm text-gray-500 mt-1">Mô tả chi tiết công việc, yêu cầu và quyền lợi</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
                {/* Job Type */}
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

                {/* Experience Level */}
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

                {/* Min Salary - Trường mới */}
                <div>
                    <p className="mb-2">Mức lương tối thiểu <span className="text-red-500">*</span></p>
                    <input
                        type="number"
                        placeholder="VD: 1000"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={minSalary}
                        onChange={e => setMinSalary(e.target.value)}
                        min="0"
                        required
                    />
                </div>

                {/* Max Salary - Trường mới */}
                <div>
                    <p className="mb-2">Mức lương tối đa <span className="text-red-500">*</span></p>
                    <input
                        type="number"
                        placeholder="VD: 2000"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={maxSalary}
                        onChange={e => setMaxSalary(e.target.value)}
                        min="0"
                        required
                    />
                </div>

                {/* Currency - Trường mới */}
                <div>
                    <p className="mb-2">Đơn vị tiền tệ <span className="text-red-500">*</span></p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        required
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>{curr}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 mt-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {submitting ? 'Đang xử lý...' : 'Đăng tuyển công việc'}
            </button>
        </form>
    );
};

export default AddJob;
// import React, { useContext, useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import { JobCategories, JobLocations } from "../assets/assets";
// import axios from "axios";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";

// const AddJob = () => {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [location, setLocation] = useState('Ho Chi Minh');
//     const [category, setCategory] = useState('Information Technology');
//     const [type, setType] = useState('Full-time');
//     const [experience, setExperience] = useState('Entry');

//     // Thay đổi trường lương thành 3 trường riêng biệt
//     const [minSalary, setMinSalary] = useState('');
//     const [maxSalary, setMaxSalary] = useState('');
//     const [currency, setCurrency] = useState('USD');

//     const [submitting, setSubmitting] = useState(false);

//     const editorRef = useRef(null);
//     const quillRef = useRef(null);

//     const { backendUrl, companyToken } = useContext(AppContext);

//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
//     const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];
//     const currencies = ['USD', 'VND', 'EUR', 'JPY', 'SGD'];

//     const onSubmitHandler = async (e) => {
//         e.preventDefault();

//         // Kiểm tra dữ liệu lương hợp lệ
//         if (!minSalary || !maxSalary) {
//             toast.error("Vui lòng nhập đầy đủ thông tin mức lương");
//             return;
//         }

//         // Kiểm tra minSalary <= maxSalary
//         if (Number(minSalary) > Number(maxSalary)) {
//             toast.error("Mức lương tối thiểu không thể lớn hơn mức lương tối đa");
//             return;
//         }

//         setSubmitting(true);
//         try {
//             const description = quillRef.current.root.innerHTML;
//             const { data } = await axios.post(
//                 `${backendUrl}/api/companies/post-job`,
//                 {
//                     title,
//                     description,
//                     location,
//                     minSalary: Number(minSalary),
//                     maxSalary: Number(maxSalary),
//                     currency,
//                     type,
//                     experience,
//                     category
//                 },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success(data.message || "Đăng tuyển công việc thành công!");
//                 // Reset form sau khi đăng thành công
//                 setTitle('');
//                 setMinSalary('');
//                 setMaxSalary('');
//                 setCurrency('USD');
//                 quillRef.current.root.innerHTML = "";
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error("Lỗi khi đăng tuyển:", error);
//             toast.error(error.response?.data?.message || "Lỗi khi thêm công việc");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     useEffect(() => {
//         // initiate quill only once
//         if (!quillRef.current && editorRef.current) {
//             quillRef.current = new Quill(editorRef.current, {
//                 theme: 'snow',
//                 modules: {
//                     toolbar: [
//                         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//                         ['bold', 'italic', 'underline', 'strike'],
//                         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                         [{ 'indent': '-1' }, { 'indent': '+1' }],
//                         [{ 'color': [] }, { 'background': [] }],
//                         ['link'],
//                         ['clean']
//                     ]
//                 },
//                 placeholder: 'Nhập mô tả công việc chi tiết...'
//             });
//         }
//     }, []);

//     return (
//         <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
//             <h2 className="text-2xl font-semibold mb-4">Đăng tuyển công việc mới</h2>

//             {/* Job Title */}
//             <div className="w-full">
//                 <p className="mb-2">Job Title <span className="text-red-500">*</span></p>
//                 <input
//                     type="text"
//                     placeholder="Enter job title"
//                     onChange={e => setTitle(e.target.value)}
//                     value={title}
//                     required
//                     className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
//                 />
//             </div>

//             {/* Job Description */}
//             <div className="w-full">
//                 <p className="my-2">Job Description <span className="text-red-500">*</span></p>
//                 <div ref={editorRef} style={{ minHeight: "200px" }}></div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
//                 {/* Job Type */}
//                 <div>
//                     <p className="mb-2">Job Type <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={type}
//                         onChange={e => setType(e.target.value)}
//                         required
//                     >
//                         {jobTypes.map((type) => (
//                             <option key={type} value={type}>{type}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Experience Level */}
//                 <div>
//                     <p className="mb-2">Experience Level <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={experience}
//                         onChange={e => setExperience(e.target.value)}
//                         required
//                     >
//                         {experienceLevels.map((level) => (
//                             <option key={level} value={level}>{level}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Job Category */}
//                 <div>
//                     <p className="mb-2">Job Category <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={category}
//                         onChange={e => setCategory(e.target.value)}
//                         required
//                     >
//                         {JobCategories.map((cat) => (
//                             <option key={cat} value={cat}>{cat}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Job Location */}
//                 <div>
//                     <p className="mb-2">Job Location <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={location}
//                         onChange={e => setLocation(e.target.value)}
//                         required
//                     >
//                         {JobLocations.map((loc) => (
//                             <option key={loc} value={loc}>{loc}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Min Salary - Trường mới */}
//                 <div>
//                     <p className="mb-2">Mức lương tối thiểu <span className="text-red-500">*</span></p>
//                     <input
//                         type="number"
//                         placeholder="VD: 1000"
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={minSalary}
//                         onChange={e => setMinSalary(e.target.value)}
//                         min="0"
//                         required
//                     />
//                 </div>

//                 {/* Max Salary - Trường mới */}
//                 <div>
//                     <p className="mb-2">Mức lương tối đa <span className="text-red-500">*</span></p>
//                     <input
//                         type="number"
//                         placeholder="VD: 2000"
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={maxSalary}
//                         onChange={e => setMaxSalary(e.target.value)}
//                         min="0"
//                         required
//                     />
//                 </div>

//                 {/* Currency - Trường mới */}
//                 <div>
//                     <p className="mb-2">Đơn vị tiền tệ <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={currency}
//                         onChange={e => setCurrency(e.target.value)}
//                         required
//                     >
//                         {currencies.map((curr) => (
//                             <option key={curr} value={curr}>{curr}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`px-6 py-3 mt-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//             >
//                 {submitting ? 'Đang xử lý...' : 'Đăng tuyển công việc'}
//             </button>
//         </form>
//     );
// };

// export default AddJob;



// import React, { use, useContext, useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import { JobCategories, JobLocations } from "../assets/assets";
// import axios from "axios";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";

// const AddJob = () => {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [location, setLocation] = useState('Ho Chi Minh');
//     const [category, setCategory] = useState('Information Technology');
//     const [type, setType] = useState('Full-time'); // New field
//     const [experience, setExperience] = useState('Entry'); // New field
//     const [salary, setSalary] = useState('');
//     const editorRef = useRef(null);
//     const quillRef = useRef(null);
//     // const [title, setTitle] = useState('');
//     // const [location, setLocation] = useState('Bangalore');
//     // const [category, setCategory] = useState('Programming');
//     // const [level, setLevel] = useState('Beginner level')
//     // const [salary, setSalary] = useState(0);
//     // const editorRef = useRef(null)
//     // const quillRef = useRef(null)

//     const { backendUrl, companyToken } = useContext(AppContext)

//     const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
//     const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];

//     const onSubmitHandler = async (e) => {
//         e.preventDefault();

//         try {
//             const description = quillRef.current.root.innerHTML;
//             const { data } = await axios.post(
//                 `${backendUrl}/api/companies/post-job`,
//                 {
//                     title,
//                     description,
//                     location,
//                     salary,
//                     type, // Add new field
//                     experience, // Add new field
//                     category
//                 },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success(data.message);
//                 setTitle('');
//                 setSalary('');
//                 quillRef.current.root.innerHTML = "";
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Lỗi khi thêm công việc");
//         }
//     };
//     const onSubmitHandler_1 = async (e) => {
//         e.preventDefault()

//         try {
//             const description = quillRef.current.root.innerHTML
//             const { data } = await axios.post(
//                 `${backendUrl}/api/companies/post-job`,
//                 { title, description, location, salary, category, level },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             )

//             if (data.success) {
//                 toast.success(data.message)
//                 setTitle('')
//                 setSalary(0)
//                 quillRef.current.root.innerHTML = ""
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Lỗi khi thêm công việc")
//         }
//     }
//     const onSubmitHandler_0 = async (e) => {
//         e.preventDefault()

//         try {

//             const description = quillRef.current.root.innerHTML
//             const { data } = await axios.post(backendUrl + '/api/company/post-job',
//                 { title, description, location, salary, category, level },
//                 { headers: { token: companyToken } }
//             )
//             if (data.success) {

//                 toast.success(data.message)
//                 setTitle('')
//                 setSalary(0)
//                 quillRef.current.root.innerHTML = ""
//             }
//             else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }

//     }
//     useEffect(() => {
//         // initiate quill only once
//         if (!quillRef.current && editorRef.current) {
//             quillRef.current = new Quill(editorRef.current, {
//                 theme: 'snow',
//             })
//         }
//     }, [])

//     return (
//         <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
//             {/* Job Title */}
//             <div className="w-full">
//                 <p className="mb-2">Job Title <span className="text-red-500">*</span></p>
//                 <input
//                     type="text"
//                     placeholder="Enter job title"
//                     onChange={e => setTitle(e.target.value)}
//                     value={title}
//                     required
//                     className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
//                 />
//             </div>

//             {/* Job Description */}
//             <div className="w-full max-w-lg">
//                 <p className="my-2">Job Description <span className="text-red-500">*</span></p>
//                 <div ref={editorRef}></div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
//                 {/* Job Type - New Field */}
//                 <div>
//                     <p className="mb-2">Job Type <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={type}
//                         onChange={e => setType(e.target.value)}
//                         required
//                     >
//                         {jobTypes.map((type) => (
//                             <option key={type} value={type}>{type}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Experience Level - New Field */}
//                 <div>
//                     <p className="mb-2">Experience Level <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={experience}
//                         onChange={e => setExperience(e.target.value)}
//                         required
//                     >
//                         {experienceLevels.map((level) => (
//                             <option key={level} value={level}>{level}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Job Category */}
//                 <div>
//                     <p className="mb-2">Job Category <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={category}
//                         onChange={e => setCategory(e.target.value)}
//                         required
//                     >
//                         {JobCategories.map((cat) => (
//                             <option key={cat} value={cat}>{cat}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Job Location */}
//                 <div>
//                     <p className="mb-2">Job Location <span className="text-red-500">*</span></p>
//                     <select
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={location}
//                         onChange={e => setLocation(e.target.value)}
//                         required
//                     >
//                         {JobLocations.map((loc) => (
//                             <option key={loc} value={loc}>{loc}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Salary */}
//                 <div>
//                     <p className="mb-2">Salary Range <span className="text-red-500">*</span></p>
//                     <input
//                         type="text"
//                         placeholder="e.g. $1000-2000"
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//                         value={salary}
//                         onChange={e => setSalary(e.target.value)}
//                         required
//                     />
//                 </div>
//             </div>

//             <button
//                 type="submit"
//                 className="w-28 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800"
//             >
//                 Add Job
//             </button>
//         </form>
//     );
// };

// export default AddJob;
// //     return (
// //         <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3 ">
// //             {/* tieu de job */}
// //             <div className="w-full ">
// //                 <p className="mb-2">Job Title</p>
// //                 <input type="text" placeholder="Type here"
// //                     onChange={e => setTitle(e.target.value)} value={title}
// //                     required
// //                     className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded "
// //                 />
// //             </div>
// //             {/* mo ta */}
// //             <div className="w-full max-w-lg">
// //                 <p className="my-2">Job Description</p>
// //                 <div ref={editorRef}>

// //                 </div>
// //             </div>

// //             <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
// //                 <div>
// //                     <p className="mb-2">Job Category</p>
// //                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setCategory(e.target.value)}>
// //                         {JobCategories.map((category, index) => (
// //                             <option key={index} value={category}>{category}</option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 <div>
// //                     <p className="mb-2">Job Location</p>
// //                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLocation(e.target.value)}>
// //                         {JobLocations.map((location, index) => (
// //                             <option key={index} value={location}>{location}</option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 <div>
// //                     <p className="mb-2">Job Level</p>
// //                     <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLevel(e.target.value)}>
// //                         <option value="Beginer level">Beginer Level</option>
// //                         <option value="Intermediate level">Intermediate Level</option>
// //                         <option value="Senior level">Senior Level</option>
// //                     </select>
// //                 </div>


// //             </div>

// //             <div>
// //                 <p className="mb-2">Job Salary</p>
// //                 <input min={0} className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" onChange={e => setSalary(e.target.value)} type="Number" placeholder="2500" />
// //             </div>

// //             <button className="w-28 py-3 mt-4 bg-black text-white rounded">Add</button>
// //         </form>
// //     )
// // }

// // export default AddJob 