const mongoose = require('mongoose');

// Define the schema for the events collection
const eventSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    userName: { type: String },
    URL: { type: String, required: true },
    ipAddress: { type: [String], required: true },  // Array to store multiple IP addresses
    httpMethod: { type: String, required: true },
    requestPayload: { type: String, default: '' },  // Default empty string if not provided
    createdAt: { type: Date, default: Date.now }  // Automatically set to current date
});

// Create the Event model
const Event = mongoose.model('events', eventSchema);

module.exports = Event;
