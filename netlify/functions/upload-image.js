const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        // Parse the multipart form data
        const boundary = event.headers['content-type'].split('=')[1];
        const body = Buffer.from(event.body, 'base64');
        const parts = body.toString().split(boundary);

        // Find the file part
        const filePart = parts.find(part => part.includes('Content-Type: image/'));
        if (!filePart) {
            return {
                statusCode: 400,
                body: 'No image file found'
            };
        }

        // Extract the file data
        const fileData = filePart.split('\r\n\r\n')[1].split('\r\n--')[0];
        const fileName = `dog-${Date.now()}.jpg`;
        const filePath = path.join('/tmp', fileName);

        // Save the file
        fs.writeFileSync(filePath, Buffer.from(fileData, 'base64'));

        // Return the URL of the uploaded file
        return {
            statusCode: 200,
            body: JSON.stringify({
                url: `/.netlify/images/${fileName}`
            })
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            statusCode: 500,
            body: 'Error uploading image'
        };
    }
}; 