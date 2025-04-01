function getTime() {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        formatMatcher: 'best fit',
        timeStyle: 'long',
        timeZone: 'Asia/Kolkata'
    }).format(date);
    return formattedDate
}
module.exports = { getTime };