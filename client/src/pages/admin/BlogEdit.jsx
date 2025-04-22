import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { Upload, Save, XCircle, ArrowLeft } from 'lucide-react';

const BlogEdit = () => {
    // --- STATE VARIABLES ---
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('draft');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [blogContent, setBlogContent] = useState('');
    const [editorInitialized, setEditorInitialized] = useState(false);

    // --- Quill Editor setup ---
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // --- HOOKS and CONTEXT ---
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const { id: postId } = useParams();

    // 1. Fetch dữ liệu blog từ API TRƯỚC khi khởi tạo Quill
    useEffect(() => {
        const fetchBlogData = async () => {
            if (!postId || !backendUrl) return;

            console.log("Fetching blog data...");
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    toast.error("Yêu cầu xác thực Admin.");
                    setLoading(false);
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get(`${backendUrl}/api/admin/blogs/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    console.log("Blog data fetched successfully");
                    const post = response.data.post;
                    setTitle(post.title || '');
                    setStatus(post.status || 'draft');
                    setTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
                    setCategory(post.category || '');
                    setExistingImageUrl(post.featuredImage || '');

                    // Lưu nội dung blog để sử dụng sau
                    setBlogContent(post.content || '');
                } else {
                    toast.error(response.data.message || "Không tìm thấy bài viết.");
                    navigate('/admin/blogs');
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải bài viết.");
                navigate('/admin/blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [postId, backendUrl, navigate]);

    // 2. Khởi tạo Quill Editor SAU khi loading xong
    useEffect(() => {
        // Chỉ khởi tạo khi đã tải xong dữ liệu và chưa khởi tạo trước đó
        if (!loading && !editorInitialized && editorRef.current) {
            console.log("Initializing Quill editor...");

            try {
                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    placeholder: 'Viết nội dung bài viết ở đây...',
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image'],
                            ['clean']
                        ]
                    }
                });

                console.log("Quill editor initialized successfully");

                // Đánh dấu đã khởi tạo xong
                setEditorInitialized(true);
                setEditorReady(true);

                // Đặt nội dung vào editor
                if (blogContent) {
                    console.log("Setting content to editor immediately after initialization");
                    quillRef.current.root.innerHTML = blogContent;
                }
            } catch (error) {
                console.error("Error initializing Quill editor:", error);
                toast.error("Lỗi khởi tạo trình soạn thảo. Vui lòng tải lại trang.");
            }
        }
    }, [loading, editorInitialized, blogContent]);

    // 3. Xử lý tạo và thu hồi URL xem trước ảnh
    useEffect(() => {
        let objectUrl = null;
        if (featuredImage) {
            objectUrl = URL.createObjectURL(featuredImage);
            setImagePreview(objectUrl);
        } else {
            setImagePreview(null);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [featuredImage]);

    // --- EVENT HANDLERS ---

    // Hàm handleImageChange
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFeaturedImage(e.target.files[0]);
        } else {
            setFeaturedImage(null);
        }
    };

    // Hàm handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quillRef.current) {
            toast.error('Trình soạn thảo chưa được khởi tạo. Vui lòng tải lại trang.');
            return;
        }

        const content = quillRef.current.root.innerHTML;

        if (!title || content === '<p><br></p>' || content === '') {
            toast.error('Tiêu đề và Nội dung là bắt buộc.');
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('tags', tags);
        formData.append('category', category);

        if (featuredImage) {
            formData.append('featuredImage', featuredImage);
        }

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setSubmitting(false);
                navigate('/admin/login');
                return;
            }

            console.log("Submitting update...");
            const response = await axios.put(`${backendUrl}/api/admin/blogs/${postId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Cập nhật bài viết thành công!');
                navigate('/admin/blogs');
            } else {
                toast.error(response.data.message || "Cập nhật bài viết thất bại.");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi cập nhật.");
        } finally {
            setSubmitting(false);
        }
    };

    // --- JSX RENDERING ---

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Chỉnh sửa bài viết</h2>
                <Link to="/admin/blogs" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                {/* Title */}
                <div className="w-full">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề bài viết <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Content - Quill Editor */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung bài viết <span className="text-red-500">*</span>
                    </label>
                    {!editorReady && (
                        <div className="flex justify-center items-center p-4 border border-gray-300 rounded-md bg-gray-50">
                            <p className="text-gray-500">Đang tải trình soạn thảo...</p>
                        </div>
                    )}
                    <div
                        ref={editorRef}
                        className="min-h-[300px] border border-gray-300 rounded-md"
                        style={{ display: editorReady ? 'block' : 'none' }}
                    ></div>
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="draft">Bản nháp (Draft)</option>
                        <option value="published">Xuất bản (Published)</option>
                        <option value="archived">Lưu trữ (Archived)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ví dụ: Hướng dẫn"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ví dụ: react, nodejs"
                        />
                    </div>
                </div>

                {/* Featured Image */}
                <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                    <div className="mt-1 flex flex-wrap items-center gap-4">
                        {/* Hiển thị ảnh cũ nếu có và chưa chọn ảnh mới */}
                        {!imagePreview && existingImageUrl && (
                            <div className='flex items-center gap-2'>
                                <p className='text-sm text-gray-500 mr-2'>Ảnh hiện tại:</p>
                                <img src={existingImageUrl} alt="Ảnh hiện tại" className="h-16 w-auto rounded border border-gray-200 object-cover" />
                            </div>
                        )}

                        {/* Input chọn ảnh mới */}
                        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center">
                            <Upload size={16} className="mr-2" />
                            <span>{existingImageUrl || imagePreview ? 'Chọn ảnh khác' : 'Chọn ảnh'}</span>
                            <input id="featuredImage" name="featuredImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>

                        {/* Xem trước ảnh mới */}
                        {imagePreview && (
                            <div className='flex items-center gap-2'>
                                <p className='text-sm text-gray-500 mr-2'>Ảnh mới:</p>
                                <img src={imagePreview} alt="Xem trước ảnh mới" className="h-16 w-auto rounded border border-gray-200 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFeaturedImage(null)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Bỏ chọn ảnh mới"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Hình ảnh sẽ được hiển thị với tỷ lệ cố định. Khuyến nghị sử dụng ảnh có kích thước 1200x630 pixels.
                    </p>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        to="/admin/blogs"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <XCircle size={18} className="inline-block mr-2 -mt-1" /> Hủy
                    </Link>
                    <button
                        type="submit"
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={submitting || !editorReady}
                    >
                        <Save size={18} className="inline-block mr-2 -mt-1" />
                        {submitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogEdit;
// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css';
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// import { Upload, Save, XCircle, ArrowLeft } from 'lucide-react';

// const BlogEdit = () => {
//     // --- STATE VARIABLES ---
//     const [title, setTitle] = useState('');
//     const [status, setStatus] = useState('draft');
//     const [tags, setTags] = useState('');
//     const [category, setCategory] = useState('');
//     const [featuredImage, setFeaturedImage] = useState(null); // Ảnh MỚI người dùng chọn
//     const [imagePreview, setImagePreview] = useState(null);   // Xem trước ảnh MỚI
//     const [existingImageUrl, setExistingImageUrl] = useState(''); // URL ảnh HIỆN TẠI của bài viết
//     const [loading, setLoading] = useState(true); // Loading khi fetch dữ liệu cũ
//     const [submitting, setSubmitting] = useState(false); // Loading khi submit form

//     // --- Quill Editor setup ---
//     const editorRef = useRef(null);
//     const quillRef = useRef(null);
//     const [contentLoaded, setContentLoaded] = useState(false);

//     // --- HOOKS and CONTEXT ---
//     const { backendUrl } = useContext(AppContext);
//     const navigate = useNavigate();
//     const { id: postId } = useParams(); // Lấy ID bài viết từ URL

//     // --- SIDE EFFECTS ---

//     // Khởi tạo Quill Editor
//     useEffect(() => {
//         if (!quillRef.current && editorRef.current) {
//             quillRef.current = new Quill(editorRef.current, {
//                 theme: 'snow',
//                 placeholder: 'Viết nội dung bài viết ở đây...',
//                 modules: {
//                     toolbar: [
//                         [{ 'header': [1, 2, 3, false] }],
//                         ['bold', 'italic', 'underline', 'strike'],
//                         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                         [{ 'color': [] }, { 'background': [] }],
//                         ['link', 'image'],
//                         ['clean']
//                     ]
//                 }
//             });
//         }
//     }, []);

//     // Fetch dữ liệu bài viết cũ khi component mount
//     useEffect(() => {
//         const fetchPostData = async () => {
//             if (!postId || !backendUrl) return;
//             setLoading(true);
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 if (!token) {
//                     toast.error("Yêu cầu xác thực Admin.");
//                     setLoading(false);
//                     navigate('/admin/login');
//                     return;
//                 }

//                 const response = await axios.get(`${backendUrl}/api/admin/blogs/${postId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 if (response.data.success) {
//                     const post = response.data.post;
//                     setTitle(post.title || '');
//                     setStatus(post.status || 'draft');
//                     setTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
//                     setCategory(post.category || '');
//                     setExistingImageUrl(post.featuredImage || '');

//                     // Đặt nội dung vào editor sau khi đã chắc chắn Quill được khởi tạo
//                     if (quillRef.current && post.content) {
//                         quillRef.current.root.innerHTML = post.content;
//                         setContentLoaded(true);
//                     }
//                 } else {
//                     toast.error(response.data.message || "Không tìm thấy bài viết.");
//                     navigate('/admin/blogs');
//                 }
//             } catch (error) {
//                 console.error("Lỗi tải dữ liệu bài viết:", error);
//                 toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải bài viết.");
//                 navigate('/admin/blogs');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPostData();
//     }, [postId, backendUrl, navigate]);

//     // Kiểm tra và đặt nội dung vào editor nếu editor đã được khởi tạo sau khi dữ liệu được tải
//     useEffect(() => {
//         if (!contentLoaded && !loading && quillRef.current) {
//             const checkContentInterval = setInterval(() => {
//                 if (quillRef.current) {
//                     clearInterval(checkContentInterval);
//                     fetchPostContent();
//                 }
//             }, 200);

//             return () => clearInterval(checkContentInterval);
//         }
//     }, [loading, contentLoaded]);

//     // Hàm lấy nội dung bài viết nếu cần thiết
//     const fetchPostContent = async () => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.get(`${backendUrl}/api/admin/blogs/${postId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success && response.data.post.content && quillRef.current) {
//                 quillRef.current.root.innerHTML = response.data.post.content;
//                 setContentLoaded(true);
//             }
//         } catch (error) {
//             console.error("Lỗi tải nội dung bài viết:", error);
//         }
//     };

//     // Xử lý tạo và thu hồi URL xem trước ảnh MỚI
//     useEffect(() => {
//         let objectUrl = null;
//         if (featuredImage) {
//             objectUrl = URL.createObjectURL(featuredImage);
//             setImagePreview(objectUrl);
//         } else {
//             setImagePreview(null);
//         }
//         return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
//     }, [featuredImage]);

//     // --- EVENT HANDLERS ---

//     // Hàm handleImageChange
//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setFeaturedImage(e.target.files[0]);
//         } else {
//             setFeaturedImage(null);
//         }
//     };

//     // Hàm handleSubmit - Gọi API PUT để cập nhật
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!quillRef.current) {
//             toast.error('Trình soạn thảo chưa được khởi tạo.');
//             return;
//         }

//         const content = quillRef.current.root.innerHTML;

//         if (!title || content === '<p><br></p>' || content === '') {
//             toast.error('Tiêu đề và Nội dung là bắt buộc.');
//             return;
//         }

//         setSubmitting(true);
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('content', content);
//         formData.append('status', status);
//         formData.append('tags', tags);
//         formData.append('category', category);

//         // Chỉ append ảnh MỚI nếu người dùng đã chọn file mới
//         if (featuredImage) {
//             formData.append('featuredImage', featuredImage);
//         }

//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin.");
//                 setSubmitting(false);
//                 navigate('/admin/login');
//                 return;
//             }

//             // Gọi API PUT để cập nhật
//             const response = await axios.put(`${backendUrl}/api/admin/blogs/${postId}`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             if (response.data.success) {
//                 toast.success('Cập nhật bài viết thành công!');
//                 navigate('/admin/blogs'); // Quay lại trang danh sách
//             } else {
//                 toast.error(response.data.message || "Cập nhật bài viết thất bại.");
//             }
//         } catch (error) {
//             console.error("Lỗi cập nhật bài viết:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi cập nhật.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // --- JSX RENDERING ---

//     if (loading) {
//         return (
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex justify-center items-center h-64">
//                     <Loading />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-gray-700">Chỉnh sửa bài viết</h2>
//                 <Link to="/admin/blogs" className="flex items-center text-blue-600 hover:text-blue-800">
//                     <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
//                 </Link>
//             </div>

//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
//                 {/* Title */}
//                 <div className="w-full">
//                     <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                         Tiêu đề bài viết <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>

//                 {/* Content - Quill Editor */}
//                 <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Nội dung bài viết <span className="text-red-500">*</span>
//                     </label>
//                     <div ref={editorRef} className="min-h-[300px]"></div>
//                 </div>

//                 {/* Status */}
//                 <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
//                     <select
//                         id="status"
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                         <option value="draft">Bản nháp (Draft)</option>
//                         <option value="published">Xuất bản (Published)</option>
//                         <option value="archived">Lưu trữ (Archived)</option>
//                     </select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Category */}
//                     <div>
//                         <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
//                         <input
//                             type="text"
//                             id="category"
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Ví dụ: Hướng dẫn"
//                         />
//                     </div>

//                     {/* Tags */}
//                     <div>
//                         <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
//                         <input
//                             type="text"
//                             id="tags"
//                             value={tags}
//                             onChange={(e) => setTags(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Ví dụ: react, nodejs"
//                         />
//                     </div>
//                 </div>

//                 {/* Featured Image */}
//                 <div>
//                     <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
//                     <div className="mt-1 flex flex-wrap items-center gap-4">
//                         {/* Hiển thị ảnh cũ nếu có và chưa chọn ảnh mới */}
//                         {!imagePreview && existingImageUrl && (
//                             <div className='flex items-center gap-2'>
//                                 <p className='text-sm text-gray-500 mr-2'>Ảnh hiện tại:</p>
//                                 <img src={existingImageUrl} alt="Ảnh hiện tại" className="h-16 w-auto rounded border border-gray-200 object-cover" />
//                             </div>
//                         )}

//                         {/* Input chọn ảnh mới */}
//                         <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center">
//                             <Upload size={16} className="mr-2" />
//                             <span>{existingImageUrl || imagePreview ? 'Chọn ảnh khác' : 'Chọn ảnh'}</span>
//                             <input id="featuredImage" name="featuredImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
//                         </label>

//                         {/* Xem trước ảnh mới */}
//                         {imagePreview && (
//                             <div className='flex items-center gap-2'>
//                                 <p className='text-sm text-gray-500 mr-2'>Ảnh mới:</p>
//                                 <img src={imagePreview} alt="Xem trước ảnh mới" className="h-16 w-auto rounded border border-gray-200 object-cover" />
//                                 <button
//                                     type="button"
//                                     onClick={() => setFeaturedImage(null)}
//                                     className="text-red-500 hover:text-red-700"
//                                     title="Bỏ chọn ảnh mới"
//                                 >
//                                     <XCircle size={18} />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500">
//                         Hình ảnh sẽ được hiển thị với tỷ lệ cố định. Khuyến nghị sử dụng ảnh có kích thước 1200x630 pixels.
//                     </p>
//                 </div>

//                 {/* Submit and Cancel Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Link
//                         to="/admin/blogs"
//                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                         <XCircle size={18} className="inline-block mr-2 -mt-1" /> Hủy
//                     </Link>
//                     <button
//                         type="submit"
//                         className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         disabled={submitting}
//                     >
//                         <Save size={18} className="inline-block mr-2 -mt-1" />
//                         {submitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// };

// export default BlogEdit;



// // src/pages/admin/BlogEdit.jsx

// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom'; // Thêm useParams
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useEditor, EditorContent } from '@tiptap/react'; // Dùng TipTap
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// import { Upload, Save, XCircle } from 'lucide-react';

// // --- Component Toolbar cho TipTap (Tái sử dụng từ BlogCreate hoặc import) ---
// const MenuBar = ({ editor }) => {
//     if (!editor) return null;
//     return (
//         <div className="border border-b-0 border-gray-300 rounded-t-md p-2 flex gap-1 flex-wrap bg-gray-50">
//             <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Bold</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Italic</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`p-1 rounded ${editor.isActive('strike') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Strike</button>
//             <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`p-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Paragraph</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H1</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H2</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Bullet List</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Ordered List</button>
//             {/* Thêm nút khác nếu cần */}
//         </div>
//     );
// };
// // ----------------------------------------------------

// const BlogEdit = () => {
//     // --- STATE VARIABLES ---
//     const [title, setTitle] = useState('');
//     // Không cần state content riêng cho TipTap, nhưng cần để set lần đầu
//     const [status, setStatus] = useState('draft');
//     const [tags, setTags] = useState('');
//     const [category, setCategory] = useState('');
//     const [featuredImage, setFeaturedImage] = useState(null); // Ảnh MỚI người dùng chọn
//     const [imagePreview, setImagePreview] = useState(null);   // Xem trước ảnh MỚI
//     const [existingImageUrl, setExistingImageUrl] = useState(''); // URL ảnh HIỆN TẠI của bài viết
//     const [loading, setLoading] = useState(true); // Loading khi fetch dữ liệu cũ
//     const [submitting, setSubmitting] = useState(false); // Loading khi submit form
//     const [initialContent, setInitialContent] = useState(''); // State tạm để lưu content fetch về
//     const [isContentLoaded, setIsContentLoaded] = useState(false); // Cờ để chỉ set content cho TipTap 1 lần

//     // --- HOOKS and CONTEXT ---
//     const { backendUrl } = useContext(AppContext);
//     const navigate = useNavigate();
//     const { id: postId } = useParams(); // Lấy ID bài viết từ URL

//     // --- TIPTAP EDITOR CONFIGURATION ---
//     const editor = useEditor({
//         extensions: [StarterKit, Placeholder.configure({ placeholder: 'Viết nội dung ở đây...' })],
//         content: '', // Khởi tạo rỗng, sẽ set sau khi fetch
//         //editable: !loading, // Chỉ cho phép sửa khi đã load xong dữ liệu ban đầu
//         editable: false,
//         editorProps: {
//             attributes: { class: 'prose max-w-none border border-t-0 border-gray-300 rounded-b-md p-3 min-h-[200px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500', },
//         },
//     });

//     // --- SIDE EFFECTS ---

//     // Fetch dữ liệu bài viết cũ khi component mount hoặc postId thay đổi
//     useEffect(() => {
//         const fetchPostData = async () => {
//             if (!postId || !backendUrl) return;
//             setLoading(true);
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 if (!token) {
//                     toast.error("Yêu cầu xác thực Admin.");
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await axios.get(`${backendUrl}/api/admin/blogs/${postId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 if (response.data.success) {
//                     const post = response.data.post;
//                     setTitle(post.title || '');
//                     setInitialContent(post.content || ''); // Lưu content vào state tạm
//                     setStatus(post.status || 'draft');
//                     setTags(Array.isArray(post.tags) ? post.tags.join(', ') : ''); // Chuyển mảng tags thành chuỗi
//                     setCategory(post.category || '');
//                     setExistingImageUrl(post.featuredImage || ''); // Lưu URL ảnh cũ
//                     setIsContentLoaded(false); // Reset cờ để chuẩn bị set content cho TipTap
//                 } else {
//                     toast.error(response.data.message || "Không tìm thấy bài viết.");
//                     navigate('/admin/blogs'); // Quay về list nếu không tìm thấy
//                 }
//             } catch (error) {
//                 console.error("Lỗi tải dữ liệu bài viết:", error);
//                 toast.error(error.response?.data?.message || "Lỗi máy chủ khi tải bài viết.");
//                 navigate('/admin/blogs');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPostData();
//     }, [postId, backendUrl, navigate]); // Phụ thuộc vào postId và backendUrl

//     // Set content cho TipTap editor SAU KHI fetch xong và editor đã sẵn sàng
//     useEffect(() => {
//         if (editor && initialContent && !isContentLoaded) {
//             editor.commands.setContent(initialContent);
//             setIsContentLoaded(true); // Đánh dấu đã set content
//         }
//         // Không nên để editor vào dependency array nếu không muốn nó chạy lại liên tục
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [editor, initialContent, isContentLoaded]); // Chạy khi editor, initialContent, hoặc cờ thay đổi


//     // Xử lý tạo và thu hồi URL xem trước ảnh MỚI (Giữ nguyên)
//     useEffect(() => {
//         let objectUrl = null;
//         if (featuredImage) {
//             objectUrl = URL.createObjectURL(featuredImage);
//             setImagePreview(objectUrl);
//         } else {
//             setImagePreview(null);
//         }
//         return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
//     }, [featuredImage]);

//     useEffect(() => {
//         // Chỉ thực hiện khi editor đã được khởi tạo
//         if (editor) {
//             // console.log(`Effect based on loading: Setting editable to ${!loading}`); // Thêm log để debug nếu muốn
//             editor.setEditable(!loading); // Dùng command của TipTap để bật/tắt edit
//         }
//     }, [editor, loading]);

//     // --- EVENT HANDLERS ---

//     // Hàm handleImageChange (Giữ nguyên)
//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setFeaturedImage(e.target.files[0]);
//         } else {
//             setFeaturedImage(null);
//         }
//     };

//     // Hàm handleSubmit - Gọi API PUT để cập nhật
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!editor) return; // Chưa có editor thì không làm gì cả
//         const currentContent = editor.getHTML();

//         if (!title || currentContent === '<p></p>') {
//             toast.error('Tiêu đề và Nội dung là bắt buộc.');
//             return;
//         }
//         setSubmitting(true);
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('content', currentContent);
//         formData.append('status', status);
//         formData.append('tags', tags);
//         formData.append('category', category);
//         // Chỉ append ảnh MỚI nếu người dùng đã chọn file mới
//         if (featuredImage) {
//             formData.append('featuredImage', featuredImage);
//         }
//         // Không cần gửi existingImageUrl

//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) { toast.error("Yêu cầu xác thực Admin."); setSubmitting(false); return; }

//             // Gọi API PUT để cập nhật
//             const response = await axios.put(`${backendUrl}/api/admin/blogs/${postId}`, formData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 toast.success('Cập nhật bài viết thành công!');
//                 navigate('/admin/blogs'); // Quay lại trang danh sách
//             } else {
//                 toast.error(response.data.message || "Cập nhật bài viết thất bại.");
//             }
//         } catch (error) {
//             console.error("Lỗi cập nhật bài viết:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi cập nhật.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // --- JSX RENDERING ---

//     if (loading) {
//         return <div className="flex justify-center items-center h-64"><Loading /></div>;
//     }

//     if (!editor) {
//         return <div className="p-6 text-center text-gray-500">Đang khởi tạo trình soạn thảo...</div>;
//     }

//     console.log('FINAL STATE before render - loading:', loading);

//     return (
//         <>
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6">Chỉnh sửa bài viết</h2>
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
//                 {/* Title */}
//                 <div>
//                     <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
//                     <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full input-style" required /> {/* Nên tạo class chung 'input-style' */}
//                 </div>

//                 {/* Content - TipTap */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
//                     <MenuBar editor={editor} />
//                     <EditorContent editor={editor} />
//                 </div>

//                 {/* Status */}
//                 <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
//                     <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full input-style">
//                         <option value="draft">Bản nháp (Draft)</option>
//                         <option value="published">Xuất bản (Published)</option>
//                         <option value="archived">Lưu trữ (Archived)</option>
//                     </select>
//                 </div>

//                 {/* Featured Image */}
//                 <div>
//                     <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
//                     <div className="mt-1 flex flex-wrap items-center gap-4">
//                         {/* Hiển thị ảnh cũ nếu có và chưa chọn ảnh mới */}
//                         {!imagePreview && existingImageUrl && (
//                             <div className='flex items-center gap-2'>
//                                 <p className='text-sm text-gray-500 mr-2'>Ảnh hiện tại:</p>
//                                 <img src={existingImageUrl} alt="Ảnh hiện tại" className="h-16 w-auto rounded border border-gray-200 object-cover" />
//                                 {/* Có thể thêm nút xóa ảnh hiện tại nếu backend hỗ trợ */}
//                             </div>
//                         )}
//                         {/* Input chọn ảnh mới */}
//                         <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center">
//                             <Upload size={16} className="mr-2" />
//                             <span>{existingImageUrl || imagePreview ? 'Chọn ảnh khác' : 'Chọn ảnh'}</span>
//                             <input id="featuredImage" name="featuredImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
//                         </label>
//                         {/* Xem trước ảnh mới */}
//                         {imagePreview && (
//                             <div className='flex items-center gap-2'>
//                                 <p className='text-sm text-gray-500 mr-2'>Ảnh mới:</p>
//                                 <img src={imagePreview} alt="Xem trước ảnh mới" className="h-16 w-auto rounded border border-gray-200 object-cover" />
//                                 <button type="button" onClick={() => setFeaturedImage(null)} className="text-red-500 hover:text-red-700" title="Bỏ chọn ảnh mới"><XCircle size={18} /></button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Tags */}
//                 <div>
//                     <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
//                     <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full input-style" placeholder="Ví dụ: react, nodejs" />
//                 </div>

//                 {/* Category */}
//                 <div>
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
//                     <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full input-style" placeholder="Ví dụ: Hướng dẫn" />
//                 </div>

//                 {/* Submit and Cancel Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Link to="/admin/blogs" className="btn-secondary"><XCircle size={18} className="mr-2" /> Hủy </Link> {/* Nên tạo class chung btn-secondary, btn-primary */}
//                     <button type="submit" className={`btn-primary ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
//                         <Save size={18} className="mr-2" /> {submitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// };

// export default BlogEdit;