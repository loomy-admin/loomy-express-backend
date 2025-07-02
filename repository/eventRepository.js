const connectToSupabase = require('../connectors/connectToSupabase'); // your db.js
const logger = require('../connectors/logger');

const supabase = connectToSupabase();

// Insert a new event
const insertEvent = async (eventData) => {
  logger.info("eventRepository.insertEvent START");

  const {
    eventType,
    email,
    URL,
    ipAddress,
    httpMethod,
    requestPayload,
    createdAt
  } = eventData;

  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        event_type: eventType,
        email: email,
        url: URL,
        ip_address: ipAddress, // if it's an array column in Supabase, this is fine
        http_method: httpMethod,
        request_payload: requestPayload,
        created_at: createdAt
      }])
      .select(); // equivalent to `returning *`

    if (error) {
      throw error;
    }

    logger.info('Event inserted successfully');
    return data[0]; // same as result[0]
  } catch (err) {
    logger.error('Error inserting event:', err);
    throw err;
  } finally {
    logger.info("eventRepository.insertEvent STOP");
  }
};

// Fetch all events
const getAllEvents = async () => {
  logger.info("eventRepository.getAllEvents START");

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    logger.error('Error fetching events:', err);
    throw err;
  } finally {
    logger.info("eventRepository.getAllEvents STOP");
  }
};

module.exports = {
  insertEvent,
  getAllEvents,
};
