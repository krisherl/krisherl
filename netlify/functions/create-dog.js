const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Dogs';

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        const dogData = JSON.parse(event.body);

        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: [{
                    fields: dogData
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to create dog record');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error creating dog:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 