const mongoose = require('mongoose');

const makeupArtistSchema = new mongoose.Schema({
    artistID: {
        type: String,
        required: true,
        unique: true
    },
    saloonName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        enum: ['Lahore', 'Karachi', 'Islamabad'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    instagramID: String,
    specialization: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    servicesFor: {
        type: [{
            type: String,
            enum: ['Male', 'Female', 'Other']
        }],
        required: true
    },
    serviceType: {
        type: String,
        enum: ['HOME', 'SALOON'],
        required: true
    },
    description: {
         type:String,
         required:true
    },

    availabilityDays: {
    type: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    required: true
    },
    maxPrice: {
        type: Number,
        required: true
    },
    minPrice: {
        type: Number, 
        required: true
    },userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       }
    
},{ timestamps: true });

module.exports = mongoose.model('MakeupArtist', makeupArtistSchema); 