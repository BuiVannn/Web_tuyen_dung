import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    resume: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    // Thêm trường mới
    availability: {
        type: String,
        enum: ['Đang tìm việc', 'Đang làm việc', 'Sẵn sàng cho cơ hội mới', 'Không tìm việc'],
        default: 'Đang tìm việc'
    },
    socialLinks: {
        linkedin: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        },
        portfolio: {
            type: String,
            default: ''
        }
    },
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldOfStudy: {
                type: String
            },
            from: {
                type: Date
            },
            to: {
                type: Date
            },
            description: {
                type: String
            }
        }
    ],
    experience: [
        {
            position: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    projects: [
        {
            name: {
                type: String,
                required: true
            },
            technologies: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            }
        }
    ],
    // Thêm trường mới
    languages: [
        {
            name: String,
            level: String
        }
    ],
    certificates: [
        {
            name: String,
            issuer: String,
            date: Date,
            url: String
        }
    ],
    interests: [String]
}, {
    timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;