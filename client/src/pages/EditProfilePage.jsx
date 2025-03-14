import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Navbar from "../components/Navbar";

const EditProfilePage = () => {
    const defaultUserData = {
        name: "Bui Mau Van",
        title: "AI researcher",
        location: "TP. Ha Noi",
        avatar: "/api/placeholder/100/100",
        email: "buimauvan004@.com",
        phone: "0123456789",
        summary: "AI với 3 năm kinh nghiệm làm việc với ML, DL. Tôi đam mê tạo ra những mô hình AI tốt.",
        skills: ["Machine Learning", "DeepLearning", "Python", "JavaScript", "HTML/CSS", "Java", "Tailwind CSS", "Git"],
        experience: [
            {
                company: "Tech Solutions Inc.",
                position: "Fullstack Developer",
                duration: "01/2030 - Hiện tại",
                description: "Phát triển và bảo trì các ứng dụng web sử dụng ReactJS và Redux. Tối ưu hiệu suất ứng dụng và cải thiện trải nghiệm người dùng."
            },
            {
                company: "Vin AI",
                position: "Junior Developer",
                duration: "06/2026 - 12/2030",
                description: "Làm việc trong nhóm phát triển thuật toán AI"
            }
        ],
        education: [
            {
                school: "Học Viện Công nghệ Bưu chính Viễn thông",
                degree: "Kỹ sư Công nghệ thông tin",
                year: "2022-2027"
            }
        ],
        projects: [
            {
                name: "E-commerce Platform",
                description: "Website thương mại điện tử với tính năng giỏ hàng, thanh toán và quản lý đơn hàng.",
                technologies: "ReactJS, NodeJS, MongoDB"
            }
        ],
        languages: ["Tiếng Việt (Bản địa)", "Tiếng Anh (Trung cấp)"],
        certificates: ["AWS Certified Developer", "React Developer Certificate"]
    };

    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: defaultUserData
    });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control,
        name: "experience"
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education"
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects"
    });

    const onSubmit = (data) => {
        console.log("Dữ liệu đã chỉnh sửa:", data);
        // Gửi dữ liệu lên backend (Node.js API) tại đây
    };

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Thông tin cơ bản */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Họ và tên</label>
                                <input
                                    {...register("name")}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Chức danh</label>
                                <input
                                    {...register("title")}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Địa điểm</label>
                                <input
                                    {...register("location")}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    {...register("email")}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Số điện thoại</label>
                                <input
                                    {...register("phone")}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                        </div>
                        <label className="block text-sm font-medium mt-4">Giới thiệu</label>
                        <textarea
                            {...register("summary")}
                            className="mt-1 p-2 w-full border rounded-md"
                            rows="4"
                        />
                    </div>

                    {/* Kỹ năng */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Kỹ năng</h2>
                        <input
                            {...register("skills")}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Nhập kỹ năng, cách nhau bằng dấu phẩy"
                        />
                    </div>

                    {/* Kinh nghiệm làm việc */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Kinh nghiệm làm việc</h2>
                        {experienceFields.map((item, index) => (
                            <div key={item.id} className="mb-4 p-4 border rounded-md">
                                <input
                                    {...register(`experience.${index}.company`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Tên công ty"
                                />
                                <input
                                    {...register(`experience.${index}.position`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Vị trí"
                                />
                                <input
                                    {...register(`experience.${index}.duration`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Thời gian"
                                />
                                <textarea
                                    {...register(`experience.${index}.description`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Mô tả"
                                    rows="3"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="mt-2 text-red-500"
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendExperience({ company: "", position: "", duration: "", description: "" })}
                            className="text-blue-500"
                        >
                            + Thêm kinh nghiệm
                        </button>
                    </div>

                    {/* Học vấn */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Học vấn</h2>
                        {educationFields.map((item, index) => (
                            <div key={item.id} className="mb-4 p-4 border rounded-md">
                                <input
                                    {...register(`education.${index}.school`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Trường học"
                                />
                                <input
                                    {...register(`education.${index}.degree`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Bằng cấp"
                                />
                                <input
                                    {...register(`education.${index}.year`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Năm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="mt-2 text-red-500"
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendEducation({ school: "", degree: "", year: "" })}
                            className="text-blue-500"
                        >
                            + Thêm học vấn
                        </button>
                    </div>

                    {/* Dự án */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Dự án</h2>
                        {projectFields.map((item, index) => (
                            <div key={item.id} className="mb-4 p-4 border rounded-md">
                                <input
                                    {...register(`projects.${index}.name`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Tên dự án"
                                />
                                <textarea
                                    {...register(`projects.${index}.description`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Mô tả"
                                    rows="3"
                                />
                                <input
                                    {...register(`projects.${index}.technologies`)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Công nghệ sử dụng"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeProject(index)}
                                    className="mt-2 text-red-500"
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendProject({ name: "", description: "", technologies: "" })}
                            className="text-blue-500"
                        >
                            + Thêm dự án
                        </button>
                    </div>

                    {/* Ngôn ngữ và chứng chỉ */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Ngôn ngữ</h2>
                        <input
                            {...register("languages")}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Nhập ngôn ngữ, cách nhau bằng dấu phẩy"
                        />
                    </div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Chứng chỉ</h2>
                        <input
                            {...register("certificates")}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Nhập chứng chỉ, cách nhau bằng dấu phẩy"
                        />
                    </div>

                    {/* Nút điều khiển */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 bg-gray-300 rounded-md"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProfilePage;