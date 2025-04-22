// Thêm schema cho comment
const commentSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
    },
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'user.model'
        },
        model: {
            type: String,
            enum: ['User', 'Admin', 'Company'],
            required: true
        },
        name: String,
        avatar: String
    },
    content: {
        type: String,
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);