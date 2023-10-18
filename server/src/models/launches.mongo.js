const mongoose = require('mongoose');

const launchesSchema = mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required:true,
    },
    rocket: {
        type: String,
        required:true,
    },
    launchDate: {
        type: Date,
        required:true,
    },
    // target: {
    //     type: mongoose.ObjectId,
    //     ref:'Planet',
    // },
    target:{
        type: String,
    },
    customers:[ String ], // Array of string 
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default:true,
    },
});

module.exports = mongoose.model('Launch',launchesSchema);
// launchesSchema is assigned to "launches" collection, (as mongodb collection should always be plural noun)
