import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        enum: ['online', 'onsite', 'phone'],
        default: 'online'
    },
    meetingLink: {
        type: String
    },
    meetingAddress: {
        type: String
    },
    interviewType: {
        type: String,
        enum: ['technical', 'hr', 'culture', 'screening', 'final'],
        default: 'screening'
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'rescheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    userConfirmed: {
        type: Boolean,
        default: false
    },
    userFeedback: {
        type: String
    },
    companyFeedback: {
        type: String
    }
}, {
    timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;