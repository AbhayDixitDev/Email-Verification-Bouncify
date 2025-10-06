
const ct = require('countries-and-timezones');
function getGmtOffset(timezone) {
    const timezoneData = ct.getTimezone(timezone);

    if (!timezoneData) {
        throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Get the UTC offset in minutes for the specific timezone
    const timezoneOffsetMinutes = timezoneData.utcOffset;
    
    // Convert minutes to hours and minutes
    const hours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
    const minutes = Math.abs(timezoneOffsetMinutes) % 60;
    const sign = timezoneOffsetMinutes >= 0 ? '+' : '-';
    
    // Format as (GMT±HH:MM)
    return `(GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')})`;
}
module.exports = { getGmtOffset };