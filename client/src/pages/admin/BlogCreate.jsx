import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { Upload, Save, XCircle, ArrowLeft } from 'lucide-react';

const BlogCreate = () => {
    // --- STATE VARIABLES ---
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('draft');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // --- Quill Editor setup ---
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // --- HOOKS and CONTEXT ---
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    // --- SIDE EFFECTS ---

    // Khởi tạo Quill Editor - giống như trong AddJob
    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
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
        }
    }, []);

    // Xử lý tạo và thu hồi URL xem trước ảnh
    useEffect(() => {
        let objectUrl = null;
        if (featuredImage) {
            objectUrl = URL.createObjectURL(featuredImage);
            setImagePreview(objectUrl);
        } else {
            setImagePreview(null);
        }
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
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
            toast.error('Trình soạn thảo chưa được khởi tạo.');
            return;
        }

        // Lấy nội dung từ editor - giống AddJob
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

            const response = await axios.post(`${backendUrl}/api/admin/blogs`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Tạo bài viết thành công!');
                navigate('/admin/blogs');
            } else {
                toast.error(response.data.message || "Tạo bài viết thất bại.");
            }
        } catch (error) {
            console.error("Lỗi tạo bài viết:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi tạo bài viết.");
        } finally {
            setSubmitting(false);
        }
    };

    // --- JSX RENDERING ---
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Thêm bài viết mới</h2>
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
                    {/* Container cho Quill Editor - tương tự AddJob */}
                    <div ref={editorRef} className="min-h-[300px] border border-gray-300 rounded-md"></div>
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
                        {/* Input chọn ảnh */}
                        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center">
                            <Upload size={16} className="mr-2" />
                            <span>{imagePreview ? 'Chọn ảnh khác' : 'Chọn ảnh'}</span>
                            <input id="featuredImage" name="featuredImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>

                        {/* Xem trước ảnh */}
                        {imagePreview && (
                            <div className='flex items-center gap-2'>
                                <p className='text-sm text-gray-500 mr-2'>Ảnh đã chọn:</p>
                                <img src={imagePreview} alt="Xem trước" className="h-16 w-auto rounded border border-gray-200 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFeaturedImage(null)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Bỏ chọn ảnh"
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
                        disabled={submitting}
                    >
                        <Save size={18} className="inline-block mr-2 -mt-1" />
                        {submitting ? 'Đang tạo...' : 'Tạo bài viết'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogCreate;
// // src/pages/admin/BlogCreate.jsx

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// // --- THAY ĐỔI IMPORT ---
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// import { useEditor, EditorContent } from '@tiptap/react'; // <<< Import từ TipTap
// import StarterKit from '@tiptap/starter-kit';           // <<< Import StarterKit
// import Placeholder from '@tiptap/extension-placeholder'; // <<< Import Placeholder
// // --- KẾT THÚC THAY ĐỔI IMPORT ---
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// import { Upload, Save, XCircle } from 'lucide-react';

// // --- Component Toolbar đơn giản cho TipTap (Ví dụ) ---
// const MenuBar = ({ editor }) => {
//     if (!editor) {
//         return null;
//     }

//     return (
//         <div className="border border-gray-300 rounded-t-md p-2 flex gap-1 flex-wrap bg-gray-50">
//             <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Bold</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Italic</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`p-1 rounded ${editor.isActive('strike') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Strike</button>
//             <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`p-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Paragraph</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H1</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H2</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Bullet List</button>
//             <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>Ordered List</button>
//             {/* Thêm các nút khác nếu cần */}
//         </div>
//     );
// };
// // ----------------------------------------------------

// const BlogCreate = () => {
//     // --- STATE VARIABLES ---
//     const [title, setTitle] = useState('');
//     // content không cần state riêng vì TipTap tự quản lý, sẽ lấy khi submit
//     // const [content, setContent] = useState(''); // <<< Bỏ state này
//     const [status, setStatus] = useState('draft');
//     const [tags, setTags] = useState('');
//     const [category, setCategory] = useState('');
//     const [featuredImage, setFeaturedImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // --- HOOKS and CONTEXT ---
//     const { backendUrl } = useContext(AppContext);
//     const navigate = useNavigate();

//     // --- TIPTAP EDITOR CONFIGURATION ---
//     const editor = useEditor({
//         extensions: [
//             StarterKit, // Bao gồm các extension cơ bản (bold, italic, heading, list,...)
//             Placeholder.configure({ // Cấu hình placeholder
//                 placeholder: 'Viết nội dung ở đây...',
//             }),
//         ],
//         // Không cần truyền content vào đây ban đầu cho trang Create
//         // content: '', // <<< Bỏ dòng này nếu có
//         editorProps: { // Thuộc tính cho editor div
//             attributes: {
//                 // Thêm class Tailwind cho vùng soạn thảo
//                 class: 'prose max-w-none border border-gray-300 rounded-b-md p-3 min-h-[200px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
//             },
//         },
//         // Không dùng onUpdate ở đây, sẽ lấy content khi submit
//         // onUpdate: ({ editor }) => {
//         //     setContent(editor.getHTML()); // <<< Không cần cập nhật state liên tục
//         // },
//     });
//     // ----------------------------------

//     // --- SIDE EFFECTS (Image Preview Cleanup) --- Giữ nguyên
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

//     // Bỏ hàm handleContentChange
//     // const handleContentChange = (value) => { setContent(value); };

//     // Hàm handleImageChange giữ nguyên
//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             setFeaturedImage(file);
//         } else {
//             setFeaturedImage(null);
//         }
//     };

//     // Hàm handleSubmit - SỬA LẠI CÁCH LẤY CONTENT
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const content = editor.getHTML(); // <<< Lấy HTML content từ TipTap editor

//         if (!title || content === '<p></p>') { // Kiểm tra content rỗng (TipTap trả về <p></p> khi rỗng)
//             toast.error('Tiêu đề và Nội dung là bắt buộc.');
//             return;
//         }
//         setLoading(true);
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('content', content); // <<< Gửi content đã lấy từ editor
//         formData.append('status', status);
//         formData.append('tags', tags);
//         formData.append('category', category);
//         if (featuredImage) {
//             formData.append('featuredImage', featuredImage);
//         }

//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) { toast.error("Yêu cầu xác thực Admin."); setLoading(false); return; }

//             const response = await axios.post(`${backendUrl}/api/admin/blogs`, formData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 toast.success('Tạo bài viết mới thành công!');
//                 navigate('/admin/blogs');
//             } else {
//                 toast.error(response.data.message || "Tạo bài viết thất bại.");
//             }
//         } catch (error) {
//             console.error("Lỗi tạo bài viết:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi tạo bài viết.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- JSX RENDERING ---
//     return (
//         <>
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6">Thêm bài viết mới</h2>

//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
//                 {/* Title */}
//                 <div>
//                     <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
//                     <input
//                         type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>

//                 {/* --- THAY THẾ ReactQuill BẰNG TipTap --- */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
//                     {/* Toolbar cho TipTap */}
//                     <MenuBar editor={editor} />
//                     {/* Vùng nhập liệu của TipTap */}
//                     <EditorContent editor={editor} />
//                 </div>
//                 {/* -------------------------------------- */}

//                 {/* Status */}
//                 <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
//                     <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//                         <option value="draft">Bản nháp (Draft)</option>
//                         <option value="published">Xuất bản (Published)</option>
//                         <option value="archived">Lưu trữ (Archived)</option>
//                     </select>
//                 </div>

//                 {/* Featured Image (Giữ nguyên) */}
//                 <div>
//                     <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
//                     <div className="mt-1 flex items-center gap-4">
//                         <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center">
//                             <Upload size={16} className="mr-2" />
//                             <span>Chọn ảnh</span>
//                             <input id="featuredImage" name="featuredImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
//                         </label>
//                         {imagePreview && (
//                             <div className='flex items-center gap-2'>
//                                 <img src={imagePreview} alt="Xem trước" className="h-16 w-auto rounded border border-gray-200 object-cover" />
//                                 <button type="button" onClick={() => setFeaturedImage(null)} className="text-red-500 hover:text-red-700" title="Xóa ảnh đã chọn"><XCircle size={18} /></button>
//                             </div>
//                         )}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">Chấp nhận file ảnh.</p>
//                 </div>


//                 {/* Tags (Giữ nguyên) */}
//                 <div>
//                     <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
//                     <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ví dụ: react, nodejs" />
//                 </div>


//                 {/* Category (Giữ nguyên) */}
//                 <div>
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
//                     <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ví dụ: Hướng dẫn" />
//                 </div>


//                 {/* Submit and Cancel Buttons (Giữ nguyên) */}
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Link to="/admin/blogs" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"><XCircle size={18} className="mr-2" /> Hủy </Link>
//                     <button type="submit" className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
//                         <Save size={18} className="mr-2" /> {loading ? 'Đang lưu...' : 'Lưu bài viết'}
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// };

// export default BlogCreate;