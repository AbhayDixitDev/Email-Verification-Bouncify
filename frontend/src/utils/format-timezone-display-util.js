// Helper function to format timezone display
const formatTimezoneDisplay = (tz) => {
    if (!tz || !tz.key || !tz.value) {
        return '';
    }

    // Backend now sends properly formatted GMT string like "(GMT+05:30)"
    const gmtPart = tz.value;
    
    // Convert "Region/City" to just "City" and replace underscores with spaces
    const location = tz.key.split('/').pop().replace(/_/g, ' ');

    return `${gmtPart} ${location}`;
};
export default formatTimezoneDisplay;