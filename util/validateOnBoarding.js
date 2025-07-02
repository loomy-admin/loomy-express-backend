const moment = require('moment');
const { calculateAgeFromDOB } = require('./dateAndTimeUtil');

const validateOnboardingPayload = ({ dob, grade, board }) => {
    if (!moment(dob, 'YYYY-MM-DD', true).isValid())
        return "DOB must be in 'YYYY-MM-DD' format";

    if (typeof grade !== 'number' || grade < 1 || grade > 12)
        return "Invalid grade (1–12)";

    const validBoards = ['CBSE', 'ICSE', 'State', 'IB', 'Cambridge'];
    if (!validBoards.includes(board))
        return "Invalid board";

    const age = calculateAgeFromDOB(dob);
    if (age < 3 || age > 20)
        return "Invalid age derived from DOB";

    return null; // all good
};

module.exports = {
    validateOnboardingPayload
}
