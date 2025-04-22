import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { ArrowLeft, Plus, Trash2, Save, X, Link as LinkIcon } from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { backendUrl } = useContext(AppContext);

    // Refs for Quill editor
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [resource, setResource] = useState({
        type: '',
        title: '',
        description: '',
        items: [],
        relatedResources: []
    });
    const [errors, setErrors] = useState({});

    // State cho item mới
    const [currentItemIndex, setCurrentItemIndex] = useState(-1);
    const [currentItem, setCurrentItem] = useState({
        title: '',
        description: '',
        image: '',
        link: '',
        content: '',
        slug: ''
    });

    // State cho relatedResource mới
    const [currentRelatedIndex, setCurrentRelatedIndex] = useState(-1);
    const [currentRelated, setCurrentRelated] = useState({
        title: '',
        description: '',
        link: ''
    });

    // Danh sách các loại tài nguyên gợi ý cho admin
    const resourceTypeOptions = [
        { value: 'cv-templates', label: 'Mẫu CV và Hướng dẫn' },
        { value: 'courses', label: 'Khóa học kỹ năng' },
        { value: 'market-insights', label: 'Thống kê thị trường' },
        { value: 'community', label: 'Cộng đồng hỗ trợ' },
        { value: 'career-blog', label: 'Blog tư vấn nghề nghiệp' },
        { value: 'events', label: 'Sự kiện tuyển dụng' }
    ];

    // *** SỬA LỖI: Khởi tạo Quill sau khi component đã render ***
    useEffect(() => {
        // Chỉ chạy một lần khi component mount
        return () => {
            // Cleanup khi component unmount
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, []);

    // *** SỬA LỖI: Tạo một useEffect mới chỉ để khởi tạo Quill ***
    useEffect(() => {
        // Chờ một chút để đảm bảo DOM đã cập nhật
        const initQuill = setTimeout(() => {
            if (editorRef.current && !quillRef.current) {
                // Hủy bỏ instance cũ nếu có
                if (editorRef.current.querySelector('.ql-editor')) {
                    editorRef.current.innerHTML = '';
                }

                // Khởi tạo Quill mới
                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }]
                        ]
                    },
                    placeholder: 'Nhập nội dung chi tiết cho item này...',
                });

                // Thiết lập sự kiện text-change
                quillRef.current.on('text-change', function () {
                    const content = quillRef.current.root.innerHTML;
                    setCurrentItem(prev => ({
                        ...prev,
                        content: content
                    }));
                });

                // Set initial content if available
                if (currentItem.content) {
                    quillRef.current.root.innerHTML = currentItem.content;
                }
            }
        }, 100);

        return () => clearTimeout(initQuill);
    }, [currentItemIndex]); // Chạy lại khi currentItemIndex thay đổi

    // *** SỬA LỖI: Cập nhật nội dung Quill khi currentItem thay đổi ***
    useEffect(() => {
        if (quillRef.current && currentItem.content) {
            // Chỉ cập nhật nếu nội dung đã thay đổi và khác với giá trị hiện tại trong editor
            const editorContent = quillRef.current.root.innerHTML;
            if (editorContent !== currentItem.content) {
                quillRef.current.root.innerHTML = currentItem.content;
            }
        }
    }, [currentItem.content]);

    // Fetch resource by ID if in edit mode
    useEffect(() => {
        if (isEditMode && backendUrl) {
            const fetchResource = async () => {
                try {
                    const token = localStorage.getItem('adminToken');
                    if (!token) {
                        toast.error("Yêu cầu xác thực Admin.");
                        navigate('/admin/login');
                        return;
                    }

                    const response = await axios.get(`${backendUrl}/api/admin/resources/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data.success) {
                        setResource(response.data.resource);
                    } else {
                        toast.error(response.data.message || "Không thể tải thông tin tài nguyên.");
                        navigate('/admin/resources');
                    }
                } catch (error) {
                    console.error("Lỗi tải thông tin tài nguyên:", error);
                    toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
                    navigate('/admin/resources');
                } finally {
                    setLoading(false);
                }
            };

            fetchResource();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode, backendUrl, navigate]);

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!resource.type.trim()) newErrors.type = "Loại tài nguyên là bắt buộc";
        if (!resource.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
        if (!resource.description.trim()) newErrors.description = "Mô tả là bắt buộc";

        // Validate resource type format (lowercase, no spaces, only letters, numbers, and hyphens)
        if (resource.type.trim() && !/^[a-z0-9-]+$/.test(resource.type.trim())) {
            newErrors.type = "Loại tài nguyên chỉ chứa chữ thường, số và dấu gạch ngang";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                navigate('/admin/login');
                return;
            }

            // Tất cả dữ liệu sẽ được gửi
            const dataToSend = {
                ...resource,
                slug: resource.slug || resource.type.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
                // Đảm bảo mảng trống là mảng rỗng, không phải undefined
                items: resource.items || [],
                relatedResources: resource.relatedResources || []
            };

            console.log("Sending data to server:", dataToSend); // Debug info

            const url = isEditMode
                ? `${backendUrl}/api/admin/resources/${id}`
                : `${backendUrl}/api/admin/resources`;

            console.log("API endpoint:", url); // Debug info

            const response = isEditMode
                ? await axios.put(
                    url,
                    dataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                : await axios.post(
                    url,
                    dataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

            console.log("Server response:", response.data); // Debug info

            if (response.data.success) {
                toast.success(isEditMode ? "Cập nhật tài nguyên thành công" : "Thêm tài nguyên mới thành công");
                navigate('/admin/resources');
            } else {
                toast.error(response.data.message || (isEditMode ? "Cập nhật tài nguyên thất bại" : "Thêm tài nguyên thất bại"));
            }
        } catch (error) {
            console.error("Lỗi khi lưu tài nguyên:", error);
            console.error("Error details:", error.response?.data || error.message); // More detailed error
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle resource field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setResource({ ...resource, [name]: value });
        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Handling items section
    // Handle add/edit item
    const handleAddEditItem = () => {
        if (!currentItem.title || !currentItem.description || !currentItem.image) {
            toast.error("Tiêu đề, mô tả và hình ảnh là bắt buộc cho mỗi item");
            return;
        }

        // Lấy nội dung từ Quill editor
        let itemContent = currentItem.content;
        if (quillRef.current) {
            itemContent = quillRef.current.root.innerHTML;
        }

        const itemToSave = {
            ...currentItem,
            content: itemContent
        };

        const updatedItems = [...(resource.items || [])];
        if (currentItemIndex >= 0) {
            // Edit existing item
            updatedItems[currentItemIndex] = itemToSave;
        } else {
            // Add new item
            updatedItems.push(itemToSave);
        }

        setResource({ ...resource, items: updatedItems });

        // Reset current item and index
        setCurrentItem({ title: '', description: '', image: '', link: '', content: '', slug: '' });
        setCurrentItemIndex(-1);

        // Reset Quill editor - đã được xử lý trong useEffect khi currentItemIndex thay đổi
    };

    // Edit existing item                
    const handleEditItem = (index) => {
        // *** SỬA LỖI: Đảm bảo item có nội dung không bị undefined ***
        const itemToEdit = {
            ...resource.items[index],
            content: resource.items[index].content || ''
        };

        setCurrentItem(itemToEdit);
        setCurrentItemIndex(index);

        // Quill editor sẽ được cập nhật trong useEffect
    };

    // Khi hủy chỉnh sửa, reset Quill Editor
    const handleCancelItemEdit = () => {
        setCurrentItem({ title: '', description: '', image: '', link: '', content: '', slug: '' });
        setCurrentItemIndex(-1);
    };

    // Delete item
    const handleDeleteItem = (index) => {
        const updatedItems = [...resource.items];
        updatedItems.splice(index, 1);
        setResource({ ...resource, items: updatedItems });

        // If we're editing this item, reset the form
        if (currentItemIndex === index) {
            setCurrentItem({ title: '', description: '', image: '', link: '', content: '', slug: '' });
            setCurrentItemIndex(-1);
        } else if (currentItemIndex > index) {
            // Adjust index if we're editing an item that comes after the deleted one
            setCurrentItemIndex(currentItemIndex - 1);
        }
    };

    // Handle item field change
    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({ ...currentItem, [name]: value });
    };

    // Handling related resources section
    // Handle add/edit related resource
    const handleAddEditRelated = () => {
        if (!currentRelated.title || !currentRelated.description || !currentRelated.link) {
            toast.error("Tiêu đề, mô tả và link là bắt buộc cho mỗi tài nguyên liên quan");
            return;
        }

        const updatedRelated = [...(resource.relatedResources || [])];
        if (currentRelatedIndex >= 0) {
            // Edit existing related
            updatedRelated[currentRelatedIndex] = { ...currentRelated };
        } else {
            // Add new related
            updatedRelated.push({ ...currentRelated });
        }

        setResource({ ...resource, relatedResources: updatedRelated });

        // Reset current related and index
        setCurrentRelated({ title: '', description: '', link: '' });
        setCurrentRelatedIndex(-1);
    };

    // Edit existing related resource
    const handleEditRelated = (index) => {
        setCurrentRelated({ ...resource.relatedResources[index] });
        setCurrentRelatedIndex(index);
    };

    // Delete related resource
    const handleDeleteRelated = (index) => {
        const updatedRelated = [...resource.relatedResources];
        updatedRelated.splice(index, 1);
        setResource({ ...resource, relatedResources: updatedRelated });

        // If we're editing this related, reset the form
        if (currentRelatedIndex === index) {
            setCurrentRelated({ title: '', description: '', link: '' });
            setCurrentRelatedIndex(-1);
        } else if (currentRelatedIndex > index) {
            // Adjust index if we're editing a related that comes after the deleted one
            setCurrentRelatedIndex(currentRelatedIndex - 1);
        }
    };

    // Handle related field change
    const handleRelatedChange = (e) => {
        const { name, value } = e.target;
        setCurrentRelated({ ...currentRelated, [name]: value });
    };

    // Cancel related edit
    const handleCancelRelatedEdit = () => {
        setCurrentRelated({ title: '', description: '', link: '' });
        setCurrentRelatedIndex(-1);
    };

    // Hiển thị gợi ý tự động điền các trường từ template khi người dùng chọn type
    const handleTypeSelection = (e) => {
        const selectedType = e.target.value;

        // Cập nhật trường type
        handleChange({
            target: {
                name: 'type',
                value: selectedType
            }
        });

        // Thiết lập mẫu tiêu đề dựa trên loại được chọn
        const titleSuggestions = {
            'cv-templates': 'Hướng dẫn viết CV',
            'courses': 'Khóa học kỹ năng',
            'market-insights': 'Thống kê thị trường',
            'community': 'Cộng đồng hỗ trợ',
            'career-blog': 'Blog tư vấn nghề nghiệp',
            'events': 'Sự kiện tuyển dụng'
        };

        const descriptionSuggestions = {
            'cv-templates': 'Tạo CV chuyên nghiệp với các mẫu được nhà tuyển dụng đánh giá cao',
            'courses': 'Phát triển các kỹ năng chuyên môn và mềm qua các khóa học trực tuyến',
            'market-insights': 'Tìm hiểu mức lương và xu hướng thị trường lao động hiện tại',
            'community': 'Tham gia cộng đồng chia sẻ kinh nghiệm và kết nối chuyên gia',
            'career-blog': 'Bài viết và lời khuyên từ các chuyên gia hàng đầu về nghề nghiệp',
            'events': 'Tham gia các sự kiện tuyển dụng trực tuyến và ngoại tuyến'
        };

        // Chỉ cập nhật gợi ý nếu các trường rỗng
        if (!resource.title) {
            handleChange({
                target: {
                    name: 'title',
                    value: titleSuggestions[selectedType] || ''
                }
            });
        }

        if (!resource.description) {
            handleChange({
                target: {
                    name: 'description',
                    value: descriptionSuggestions[selectedType] || ''
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <Link to="/admin/resources" className="text-blue-600 hover:text-blue-800">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
                    </h1>
                </div>
                <p className="text-gray-500">
                    {isEditMode
                        ? "Cập nhật thông tin và nội dung của tài nguyên"
                        : "Tạo tài nguyên mới để hiển thị trên trang chủ"}
                </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Loại tài nguyên <span className="text-red-500">*</span>
                        </label>
                        {isEditMode ? (
                            <input
                                type="text"
                                id="type"
                                name="type"
                                value={resource.type}
                                disabled={true}
                                className="w-full px-4 py-2 border rounded-lg border-gray-300 bg-gray-100"
                                placeholder="cv-templates, courses, etc."
                            />
                        ) : (
                            <select
                                id="type"
                                name="type"
                                value={resource.type}
                                onChange={handleTypeSelection}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">-- Chọn loại tài nguyên --</option>
                                {resourceTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} ({option.value})
                                    </option>
                                ))}
                                <option value="custom">Loại khác (tự nhập)</option>
                            </select>
                        )}
                        {resource.type === 'custom' && !isEditMode && (
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg mt-2 border-gray-300"
                                placeholder="Nhập loại tài nguyên tùy chỉnh (VD: interview-tips)"
                                value={resource.customType || ''}
                                onChange={(e) => {
                                    handleChange({
                                        target: {
                                            name: 'type',
                                            value: e.target.value
                                        }
                                    });
                                }}
                            />
                        )}
                        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                        {isEditMode && (
                            <p className="mt-1 text-xs text-gray-500">Loại tài nguyên không thể thay đổi sau khi tạo</p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={resource.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Tiêu đề tài nguyên"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={resource.description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Mô tả ngắn gọn về tài nguyên này"
                    ></textarea>
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Items Section */}
                <div className="mt-8 border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-sm mr-2">1</span>
                        Danh sách items ({resource.items?.length || 0})
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Đây là các items chính được hiển thị trong tài nguyên. Mỗi item cần có tiêu đề, mô tả và hình ảnh.
                    </p>

                    {/* Items List */}
                    <div className="mb-6">
                        {resource.items && resource.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resource.items.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditItem(index)}
                                                className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="Chỉnh sửa item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(index)}
                                                className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                title="Xóa item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Item Preview */}
                                        <div className="pt-6">
                                            {item.image && (
                                                <div className="mb-3 relative overflow-hidden rounded-md">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-40 object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                            {item.link && (
                                                <div className="flex items-center mt-2 text-xs text-blue-600">
                                                    <LinkIcon size={12} className="mr-1" />
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate hover:underline"
                                                    >
                                                        {item.link.length > 30 ? `${item.link.substring(0, 30)}...` : item.link}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-gray-500">Chưa có item nào. Thêm item đầu tiên bên dưới.</p>
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Item Form */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                            {currentItemIndex >= 0 ? (
                                <span className="text-blue-600">Chỉnh sửa item #{currentItemIndex + 1}</span>
                            ) : (
                                <span>Thêm item mới</span>
                            )}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề item <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="itemTitle"
                                    name="title"
                                    value={currentItem.title}
                                    onChange={handleItemChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Tiêu đề item"
                                />
                            </div>
                            <div>
                                <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    URL hình ảnh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="itemImage"
                                    name="image"
                                    value={currentItem.image}
                                    onChange={handleItemChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <div className="mt-1 text-xs text-gray-500 flex items-center">
                                    <span role="img" aria-label="tip" className="mr-1">💡</span>
                                    <span>Hỗ trợ bất kỳ URL hình ảnh hợp lệ</span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="itemDescription"
                                    name="description"
                                    value={currentItem.description}
                                    onChange={handleItemChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Mô tả ngắn gọn về item này"
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="itemLink" className="block text-sm font-medium text-gray-700 mb-1">
                                    Link (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    id="itemLink"
                                    name="link"
                                    value={currentItem.link}
                                    onChange={handleItemChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <label htmlFor="itemContent" className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung chi tiết
                            </label>
                            {/* *** SỬA LỖI: Sử dụng className thay vì style để đảm bảo CSS được áp dụng đúng *** */}
                            <div className="mb-4">
                                <div ref={editorRef} className="bg-white rounded border border-gray-300 quill-editor" style={{ minHeight: "250px" }}></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Nội dung chi tiết hiển thị trên trang chi tiết của item. Sử dụng các công cụ định dạng trên thanh công cụ.
                            </p>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <label htmlFor="itemSlug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug (URL thân thiện)
                            </label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 border-gray-300 rounded-l-lg text-sm">
                                    /resources/{resource.type}/
                                </span>
                                <input
                                    type="text"
                                    id="itemSlug"
                                    name="slug"
                                    value={currentItem.slug}
                                    onChange={handleItemChange}
                                    className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="ten-tai-nguyen"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Để trống để tự động tạo từ tiêu đề. Chỉ sử dụng chữ thường, số và dấu gạch ngang.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            {currentItemIndex >= 0 && (
                                <button
                                    type="button"
                                    onClick={handleCancelItemEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                    <X size={16} className="mr-1" />
                                    Hủy
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleAddEditItem}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                            >
                                {currentItemIndex >= 0 ? (
                                    <>
                                        <Save size={16} className="mr-1" />
                                        Lưu thay đổi
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} className="mr-1" />
                                        Thêm item
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Resources Section */}
                <div className="mt-8 border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <span className="bg-purple-100 text-purple-800 py-1 px-2 rounded text-sm mr-2">2</span>
                        Tài nguyên liên quan ({resource.relatedResources?.length || 0})
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Đây là các tài nguyên liên quan được hiển thị ở cuối trang. Mỗi tài nguyên liên quan cần có tiêu đề, mô tả và link.
                    </p>

                    {/* Related Resources List */}
                    <div className="mb-6">
                        {resource.relatedResources && resource.relatedResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resource.relatedResources.map((related, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-purple-50 relative">
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditRelated(index)}
                                                className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="Chỉnh sửa tài nguyên liên quan"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRelated(index)}
                                                className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                title="Xóa tài nguyên liên quan"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        <h4 className="font-medium text-purple-800 mb-2 mt-4">{related.title}</h4>
                                        <p className="text-sm text-gray-700 mb-2">{related.description}</p>
                                        {related.link && (
                                            <div className="mt-2 flex items-center text-xs text-purple-700">
                                                <LinkIcon size={12} className="mr-1" />
                                                <a
                                                    href={related.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate hover:underline"
                                                >
                                                    {related.link.length > 30 ? `${related.link.substring(0, 30)}...` : related.link}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-8 text-center">
                                <p className="text-gray-600">Chưa có tài nguyên liên quan nào. Thêm bên dưới (không bắt buộc).</p>
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Related Form */}
                    <div className="border border-purple-100 rounded-lg p-5 bg-purple-50">
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                            {currentRelatedIndex >= 0 ? (
                                <span className="text-purple-700">Chỉnh sửa tài nguyên liên quan #{currentRelatedIndex + 1}</span>
                            ) : (
                                <span>Thêm tài nguyên liên quan mới</span>
                            )}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="relatedTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="relatedTitle"
                                    name="title"
                                    value={currentRelated.title}
                                    onChange={handleRelatedChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Tiêu đề tài nguyên liên quan"
                                />
                            </div>
                            <div>
                                <label htmlFor="relatedLink" className="block text-sm font-medium text-gray-700 mb-1">
                                    Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="relatedLink"
                                    name="link"
                                    value={currentRelated.link}
                                    onChange={handleRelatedChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="relatedDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="relatedDescription"
                                    name="description"
                                    value={currentRelated.description}
                                    onChange={handleRelatedChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Mô tả ngắn gọn về tài nguyên liên quan"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            {currentRelatedIndex >= 0 && (
                                <button
                                    type="button"
                                    onClick={handleCancelRelatedEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                    <X size={16} className="mr-1" />
                                    Hủy
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleAddEditRelated}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                            >
                                {currentRelatedIndex >= 0 ? (
                                    <>
                                        <Save size={16} className="mr-1" />
                                        Lưu thay đổi
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} className="mr-1" />
                                        Thêm tài nguyên liên quan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t flex justify-end space-x-4">
                    <Link
                        to="/admin/resources"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                {isEditMode ? 'Cập nhật tài nguyên' : 'Tạo tài nguyên'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourceForm;