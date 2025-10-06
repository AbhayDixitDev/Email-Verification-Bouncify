const mongoose = require('mongoose');

const EmailValidationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: ''
    },
    provider: {
        type: String,
        default: 'bouncify'
    },
    usedCredits: {
        type: Number,
        default: 1
    },
    result: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('EmailValidation', EmailValidationSchema);


