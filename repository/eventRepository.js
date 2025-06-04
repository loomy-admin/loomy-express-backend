const logger = require('../connectors/logger');
const Event = require('../models/Events');  // Import the Event model

// Insert event logic
const insertEvent = async (eventData) => {
    try {
        const event = new Event(eventData);  // Create a new Event instance with event data
        await event.save();  // Save the event to the database
        logger.info('Event inserted successfully');
    } catch (error) {
        logger.error('Error inserting event:', error);
    }
};

// Export the insertEvent function to be used in other files
module.exports = {
    insertEvent
};
