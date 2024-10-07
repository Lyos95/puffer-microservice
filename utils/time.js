const { Period } = require("../constants/period");
const { TIME_FORMAT_OPTIONS } = require("../constants/timeFormat");
const { TimeFrame, TimeTypes } = require("../constants/timeFrames");

function getDateRange(timeframe) {
    const endDate = new Date();
    const startDate = new Date();

    // Calculate the start date based on the timeframe
    switch (TimeFrame[timeframe].type) {
        case TimeTypes.HOUR:
            startDate.setHours(endDate.getHours() - TimeFrame[timeframe].value);
            break;
        case TimeTypes.DAY:
            startDate.setDate(endDate.getDate() - TimeFrame[timeframe].value);
            break;
        default:
            startDate.setDate(endDate.getDate() - 1);
    }

    return { startDate, endDate };
}

function getPeriod(period) {
    // Calculate the interval based on the period
    return Period[period].value;
}

function convertDateStampToTimeFormat(
    datestamp,
    format
) {
    if (format === TIME_FORMAT_OPTIONS.GMT2) {
        return new Date(datestamp).toLocaleString("en-GB", {timeZone: "Europe/Paris"});
    }else if(format === TIME_FORMAT_OPTIONS.GMT1){
        return new Date(datestamp).toLocaleString("en-GB", {timeZone: "Europe/Lisbon"});
    }
    return new Date(datestamp).toLocaleString("en-GB", { timeZone: "UTC" });
}


module.exports = {
    getDateRange,
    getPeriod,
    convertDateStampToTimeFormat
};