import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Tiêu đề bài viết không được để trống'],
            trim: true,
            unique: true,
            maxlength: [150, 'Tiêu đề không được vượt quá 150 ký tự'],
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Nội dung bài viết không được để trống'],
        },
        featuredImage: {
            type: String,
            default: '',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        category: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

// Middleware để tự động tạo slug trước khi lưu
blogSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;