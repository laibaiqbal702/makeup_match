const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "artist",
    },
    specialization: {
        type: String,
        required: true,
    },
    servicesOffered: {
        type: [String],
        required: true,
    },
    // Add other artist-specific fields here
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
