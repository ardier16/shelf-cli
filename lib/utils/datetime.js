"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimePeriod = exports.getDayStartDate = void 0;
function getDayStartDate(value) {
    var date = new Date(value);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
exports.getDayStartDate = getDayStartDate;
function formatTimePeriod(seconds) {
    var SECONDS_IN_MINUTE = 60;
    var SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
    var totalHours = Math.floor(seconds / SECONDS_IN_HOUR);
    var leftSeconds = seconds - totalHours * SECONDS_IN_HOUR;
    var totalMinutes = Math.floor(leftSeconds / SECONDS_IN_MINUTE);
    var formatParts = [];
    if (totalHours > 0) {
        formatParts.push(totalHours + "h");
    }
    if (totalMinutes > 0) {
        formatParts.push(totalMinutes + "m");
    }
    return formatParts.length > 0 ? formatParts.join(' ') : '0h';
}
exports.formatTimePeriod = formatTimePeriod;
