const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        const fileName = event.pathParameters.splat;
        const filePath = path.join('/tmp', fileName);

        if (!fs.existsSync(filePath)) {
            return {
                statusCode: 404,
                body: 'Image not found'
            };
        }

        const imageBuffer = fs.readFileSync(filePath);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000'
            },
            body: imageBuffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Error serving image:', error);
        return {
            statusCode: 500,
            body: 'Error serving image'
        };
    }
}; 