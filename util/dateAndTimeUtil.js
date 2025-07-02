const moment = require('moment');  // Using moment.js for date formatting

// Function to generate timestamp in the given format: YYYY-MM-DDTHH:mm:ss.nnnnnnnnnZ
function generateTimeStamp() {
    const now = moment();  // Get current date and time
    const nanoseconds = now.milliseconds() * 1000000;  // Convert milliseconds to nanoseconds
    return `${now.format('YYYY-MM-DDTHH:mm:ss')}.${String(nanoseconds).padStart(9, '0')}Z`;
}

function convertToTimestamp(inputDate) {
    const momentDate = moment(inputDate); // Parse input date
    const nanoseconds = momentDate.milliseconds() * 1000000; // Convert milliseconds to nanoseconds
    return `${momentDate.format('YYYY-MM-DDTHH:mm:ss')}.${String(nanoseconds).padStart(9, '0')}Z`;
}

// Function to validate date in ISO 8601 format (with nanoseconds)
function validateDate(value) {
    const date = moment(value, moment.ISO_8601, true);
    if (!date.isValid()) {
        return false;
    }

    // Check if the nanoseconds part exists and is 9 digits long, and ends with 'Z'
    const parts = value.split('.');
    if (parts.length > 1) {
        const [seconds, nanoseconds] = parts;
        if (nanoseconds.length !== 9 || !value.endsWith('Z')) {
            return false;
        }
    }

    // Check if the provided date is in the future
    if (date.isBefore(moment())) {
        return false;
    }

    return true;
}

function calculateAgeFromDOB(dob) {
    if (!dob || !moment(dob, moment.ISO_8601, true).isValid()) return null;

    const birthDate = moment(dob);
    const today = moment();

    return today.diff(birthDate, 'years');
}

module.exports = { generateTimeStamp, validateDate, convertToTimestamp, calculateAgeFromDOB };
