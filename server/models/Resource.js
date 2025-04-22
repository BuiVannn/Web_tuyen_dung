import mongoose from 'mongoose';

// Sửa lại schema để slug không còn là unique
const resourceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // Thêm slug cho resource (KHÔNG đặt unique: true)
    slug: {
        type: String,
        // Bỏ ràng buộc unique ở đây
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    items: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            link: {
                type: String
            },
            content: {
                type: String
            },
            slug: {
                type: String
            }
        }
    ],
    relatedResources: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

// Middleware để tự động tạo slug từ type nếu không có
resourceSchema.pre('save', function (next) {
    // Tạo slug cho resource từ type nếu chưa có
    if (!this.slug && this.type) {
        this.slug = this.type
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Tạo slug cho các item nếu chưa có
    if (this.items && this.items.length > 0) {
        this.items.forEach(item => {
            if (!item.slug && item.title) {
                item.slug = item.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }
        });
    }
    next();
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
// import mongoose from "mongoose";

// const resourceSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         required: true,
//         enum: ['article', 'guide', 'template', 'cv-templates', 'blog', 'news'], // Thêm 'blog' và 'news'
//         index: true
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     slug: {
//         type: String,
//         unique: true,
//         index: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     content: {
//         type: String,
//         required: function () {
//             return ['article', 'guide', 'blog', 'news'].includes(this.type); // Nội dung đầy đủ cho blog
//         }
//     },
//     featuredImage: {
//         url: String,
//         publicId: String
//     },
//     category: {
//         type: String,
//         enum: ['Career Advice', 'Interview Tips', 'Resume Building', 'Job Search', 'Industry Insights', 'General']
//     },
//     author: {
//         name: String,
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Admin'
//         }
//     },
//     status: {
//         type: String,
//         enum: ['draft', 'published', 'archived'],
//         default: 'published'
//     },
//     tags: [String],
//     items: [{ // Cho các resource cần danh sách items như CV templates
//         title: String,
//         description: String,
//         image: String,
//         link: String
//     }],
//     relatedResources: [{
//         resourceId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Resource'
//         },
//         title: String
//     }],
//     viewCount: {
//         type: Number,
//         default: 0
//     }
// }, {
//     timestamps: true
// });

// export default mongoose.model("Resource", resourceSchema);


// import mongoose from "mongoose";

// const resourceSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     items: [
//         {
//             title: {
//                 type: String,
//                 required: true
//             },
//             description: {
//                 type: String,
//                 required: true
//             },
//             image: {
//                 type: String,
//                 required: true
//             },
//             link: String
//         }
//     ],
//     relatedResources: [
//         {
//             title: String,
//             description: String,
//             link: String
//         }
//     ],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, { timestamps: true });

// export default mongoose.model("Resource", resourceSchema);