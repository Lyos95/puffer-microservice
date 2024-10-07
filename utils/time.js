const { PERIOD } = require("../constants/period");
const { TIME_FRAME, TIME_TYPES } = require("../constants/timeFrames");

function getDateRange(timeframe) {
    const endDate = new Date();
    const startDate = new Date();

    // Calculate the start date based on the timeframe
    switch (TIME_FRAME[timeframe].type) {
        case TIME_TYPES.HOUR:
            startDate.setHours(endDate.getHours() - TIME_FRAME[timeframe].value);
            break;
        case TIME_TYPES.DAY:
            startDate.setDate(endDate.getDate() - TIME_FRAME[timeframe].value);
            break;
        default:
            startDate.setDate(endDate.getDate() - 1);
    }

    return { startDate, endDate };
}

function getPeriod(period) {
    // Calculate the interval based on the period
    return PERIOD[period].value;
}


module.exports = {
    getDateRange,
    getPeriod,
};