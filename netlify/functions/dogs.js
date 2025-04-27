const fs = require('fs');
const path = require('path');

// In-memory storage for dogs
let dogs = [];

// Get all dogs
function getDogs() {
    return dogs;
}

// Save dogs
function saveDogs(newDogs) {
    dogs = newDogs;
}

// Save image
function saveImage(base64Data, dogId) {
    const base64DataWithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64DataWithoutPrefix, 'base64');
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'dogs', `${dogId}.jpg`);
    
    // Ensure directory exists
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(imagePath, imageBuffer);
    return `/images/dogs/${dogId}.jpg`;
}

exports.handler = async (event, context) => {
    // Log the incoming request
    console.log('Event:', event);
    console.log('Context:', context);

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { httpMethod, path, body } = event;
        const pathParts = path.split('/');
        const dogId = pathParts[pathParts.length - 2];
        const data = body ? JSON.parse(body) : null;

        switch (httpMethod) {
            case 'GET':
                return {
                    statusCode: 200,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(getDogs())
                };

            case 'POST':
                if (path.endsWith('/edit')) {
                    const dogIndex = dogs.findIndex(d => d.id === dogId);
                    if (dogIndex === -1) {
                        return {
                            statusCode: 404,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ error: 'Dog not found' })
                        };
                    }

                    const updatedDog = { ...dogs[dogIndex] };
                    updatedDog.name = data.name;
                    updatedDog.location = data.location;
                    updatedDog.organization = data.organization;
                    updatedDog.age = data.age;
                    updatedDog.gender = data.gender;
                    updatedDog.breed = data.breed;
                    updatedDog.status = data.status;

                    if (data.image) {
                        const imagePath = saveImage(data.image, dogId);
                        updatedDog.image = imagePath;
                    }

                    dogs[dogIndex] = updatedDog;
                    saveDogs(dogs);

                    return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedDog)
                    };
                } else if (path.endsWith('/delete')) {
                    const dogIndex = dogs.findIndex(d => d.id === dogId);
                    if (dogIndex === -1) {
                        return {
                            statusCode: 404,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ error: 'Dog not found' })
                        };
                    }

                    dogs.splice(dogIndex, 1);
                    saveDogs(dogs);

                    return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ success: true })
                    };
                } else if (path.endsWith('/archive')) {
                    const dogIndex = dogs.findIndex(d => d.id === dogId);
                    if (dogIndex === -1) {
                        return {
                            statusCode: 404,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ error: 'Dog not found' })
                        };
                    }

                    dogs[dogIndex].active = false;
                    saveDogs(dogs);

                    return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ success: true })
                    };
                } else {
                    // Handle new dog creation
                    if (!data || !data.image) {
                        return {
                            statusCode: 400,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ error: 'Image is required' })
                        };
                    }

                    const newDog = {
                        id: Date.now().toString(),
                        name: data.name,
                        location: data.location,
                        organization: data.organization,
                        age: data.age,
                        gender: data.gender,
                        breed: data.breed,
                        status: data.status,
                        active: true,
                        createdAt: new Date().toISOString()
                    };

                    const imagePath = saveImage(data.image, newDog.id);
                    newDog.image = imagePath;

                    dogs.push(newDog);
                    saveDogs(dogs);

                    return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newDog)
                    };
                }

            default:
                return {
                    statusCode: 405,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
}; 