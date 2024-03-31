function extractConnectSid(cookieString) {
    // Split the cookie string into individual cookies
    const cookiesArray = cookieString.split(';');
    // Iterate through the cookies to find the 'connect.sid' cookie
    for (const cookie of cookiesArray) {
        // Trim whitespace and split the cookie into key-value pairs
        const [name, value] = cookie.trim().split('=');
        // Check if the cookie key is 'connect.sid'
        if (name === 'connect.sid') {
            // Return the value of the 'connect.sid' cookie
            return value;
        }
    }
    // Return null if 'connect.sid' cookie is not found
    return null;
}

module.exports = { extractConnectSid }