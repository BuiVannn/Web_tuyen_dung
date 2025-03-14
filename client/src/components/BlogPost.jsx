import React from "react";
import { useNavigate } from "react-router-dom";

const BlogPost = ({ post, onEdit, onDelete, isManageMode }) => {
    const navigate = useNavigate();

    return (
        <div
            className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/blog/${post.id}`)}
        >
            {/* className="bg-white shadow-md rounded-lg p-4 mb-4"> */}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.author} - {post.date}</p>
            <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
            {isManageMode && (
                <div className="mt-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="text-blue-500 mr-2">Sửa</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="text-red-500">Xóa</button>
                </div>
            )}
            {/* <p className="text-gray-700 mt-2">{post.content}</p> */}
            {/* <div className="text-sm text-gray-500 mt-2"> */}
            {/* <p>Đăng bởi: {post.author}</p> */}
            {/* <p>Ngày: {post.date}</p> */}
            {/* </div> */}
            {/* {isManageMode && (<div className="mt-4 flex space-x-2"><button onClick={onEdit} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Sửa</button><button onClick={onDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Xóa</button></div>)} */}

        </div>
    );
};

export default BlogPost;