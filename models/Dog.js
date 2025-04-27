const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['AVAILABLE', 'PENDING', 'ADOPTED!'],
        default: 'AVAILABLE'
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateArchived: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Add indexes for common queries
dogSchema.index({ isArchived: 1, dateAdded: -1 });
dogSchema.index({ isArchived: 1, dateArchived: -1 });

module.exports = mongoose.model('Dog', dogSchema); 