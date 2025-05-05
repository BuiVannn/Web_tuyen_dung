import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const EditJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Ho Chi Minh');
    const [category, setCategory] = useState('Information Technology');
    const [type, setType] = useState('Full-time');
    const [experience, setExperience] = useState('Entry');

    // Thay đổi trường lương thành 3 trường riêng biệt
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [currency, setCurrency] = useState('USD');

    const [submitting, setSubmitting] = useState(false);
    const [editorInitialized, setEditorInitialized] = useState(false);
    const [editorReady, setEditorReady] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const { backendUrl, companyToken } = useContext(AppContext);

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Expert'];
    const currencies = ['USD', 'VND', 'EUR', 'JPY', 'SGD'];

    // Hàm tải thông tin công việc
    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/jobs/company/${jobId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success && data.job) {
                const job = data.job;

                // Cập nhật state với thông tin công việc
                setTitle(job.title || '');
                setMinSalary(job.minSalary || '');
                setMaxSalary(job.maxSalary || '');
                setCurrency(job.currency || 'USD');
                setLocation(job.location || 'Ho Chi Minh');
                setCategory(job.category || 'Information Technology');
                setType(job.type || 'Full-time');
                setExperience(job.experience || 'Entry');
                setDescription(job.description || '');

            } else {
                setError("Không thể tải thông tin công việc");
                toast.error(data.message || "Không thể tải thông tin công việc");
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError("Lỗi khi tải thông tin công việc");
            toast.error(error.response?.data?.message || "Lỗi khi tải thông tin công việc");
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật công việc
    const updateJob = async (e) => {
        e.preventDefault();

        if (!quillRef.current) {
            toast.error('Trình soạn thảo chưa được khởi tạo. Vui lòng tải lại trang.');
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

        setSubmitting(true);
        try {
            // Lấy nội dung từ editor
            const description = quillRef.current.root.innerHTML;

            // Log dữ liệu để debug
            console.log("Đang cập nhật công việc với dữ liệu:", {
                title,
                description,
                location,
                minSalary: Number(minSalary),
                maxSalary: Number(maxSalary),
                currency,
                type,
                experience,
                category
            });

            const { data } = await axios.put(
                `${backendUrl}/api/jobs/${jobId}`,
                {
                    title,
                    description,
                    location,
                    minSalary: Number(minSalary),
                    maxSalary: Number(maxSalary),
                    currency,
                    type,
                    experience,
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
                toast.success("Cập nhật công việc thành công");
                navigate('/dashboard/manage-jobs');
            } else {
                toast.error(data.message || "Không thể cập nhật công việc");
            }
        } catch (error) {
            console.error('Error updating job:', error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? error.response.data.errors.join(', ') : "Lỗi khi cập nhật công việc");
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Khởi tạo Quill editor sau khi dữ liệu đã tải xong
    useEffect(() => {
        // Chỉ khởi tạo khi chưa khởi tạo trước đó và có editorRef
        if (!editorInitialized && !loading && editorRef.current) {
            console.log("Initializing Quill editor...");

            try {
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

                console.log("Quill editor initialized successfully");

                // Đánh dấu đã khởi tạo xong
                setEditorInitialized(true);
                setEditorReady(true);

                // Đặt nội dung vào editor ngay sau khi khởi tạo
                if (description) {
                    console.log("Setting content to editor after initialization");
                    quillRef.current.root.innerHTML = description;
                }
            } catch (error) {
                console.error("Error initializing Quill editor:", error);
                toast.error("Lỗi khởi tạo trình soạn thảo. Vui lòng tải lại trang.");
            }
        }
    }, [loading, editorInitialized, description]);

    // Tải thông tin công việc khi component mount
    useEffect(() => {
        if (companyToken && jobId) {
            fetchJobDetails();
        }
    }, [companyToken, jobId]);

    // Hiển thị loading
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loading /></div>;
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <div className="container p-4 text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">Lỗi</h2>
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => navigate('/dashboard/manage-jobs')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Quay lại danh sách công việc
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa công việc</h2>

            <form onSubmit={updateJob} className="flex flex-col w-full items-start gap-3">
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
                    {!editorReady && (
                        <div className="flex justify-center items-center p-4 border-2 border-gray-300 rounded bg-gray-50 h-[200px]">
                            <p className="text-gray-500">Đang tải trình soạn thảo...</p>
                        </div>
                    )}
                    <div
                        className="editor-container"
                        style={{
                            minHeight: '200px',
                            display: editorReady ? 'block' : 'none'
                        }}
                    >
                        <div ref={editorRef} style={{ height: '200px' }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={submitting || !editorReady}
                        className={`py-3 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${(submitting || !editorReady) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Đang cập nhật...' : 'Cập nhật công việc'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/manage-jobs')}
                        className="py-3 px-6 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJob;