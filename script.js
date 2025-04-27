// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing...');
    
    // Add loaded class to body after a short delay
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('Body loaded class added');
    }, 100);

    // Initialize animation observers
    initializeAnimations();
    
    // Initialize Google Sheets API
    gapi.load('client', initClient);
    
    // Initialize dog cards and related functionality
    loadDogs();
    
    // Add click handler for contact button
    initializeContactButton();
    
    // Initialize smooth scroll
    initializeSmoothScroll();

    // Initialize parallax effect
    initializeParallax();

    // Scroll Animation Observer
    const sections = document.querySelectorAll('.about-section, .dogs-section, .projects-section');

    // Initialize sections as hidden
    sections.forEach(section => {
        section.classList.add('section-hidden');
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
            } else {
                entry.target.classList.remove('section-visible');
                entry.target.classList.add('section-hidden');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Scroll Animation Observer
    const aboutSection = document.querySelector('.about-section');
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove any existing classes first
                aboutSection.classList.remove('visible', 'visible-up');
                aboutText.classList.remove('visible', 'visible-up');
                aboutImage.classList.remove('visible', 'visible-up');
                
                // Add the appropriate classes with a small delay to ensure reset
                setTimeout(() => {
                    aboutSection.classList.add('visible');
                    aboutText.classList.add('visible');
                    aboutImage.classList.add('visible');
                }, 50);
            } else {
                // Remove all animation classes when out of view
                aboutSection.classList.remove('visible', 'visible-up');
                aboutText.classList.remove('visible', 'visible-up');
                aboutImage.classList.remove('visible', 'visible-up');
            }
        });
    }, observerOptions);

    aboutObserver.observe(aboutSection);
});

function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right, .scale-up');
    console.log('Found animated elements:', animatedElements.length);
    
    // Log each animated element for debugging
    animatedElements.forEach(el => {
        console.log('Animated element:', {
            classes: el.className,
            type: el.tagName,
            text: el.textContent.trim().slice(0, 50)
        });
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Intersection observed:', {
                target: entry.target.className,
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio
            });
            
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Element became visible:', entry.target.className);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    animatedElements.forEach(element => observer.observe(element));
    console.log('Animation observer initialized');
}

function initializeDogSection() {
    // Temporarily disabled dog card creation
    // createDogCards();
    
    // Handle "View Past Dogs" button click
    const viewPastDogsBtn = document.querySelector('.view-past-dogs');
    const archivedDogsGrid = document.querySelector('.archived-dogs');
    
    if (viewPastDogsBtn && archivedDogsGrid) {
        console.log('View Past Dogs button found');
        viewPastDogsBtn.addEventListener('click', () => {
            archivedDogsGrid.classList.toggle('hidden');
            viewPastDogsBtn.textContent = archivedDogsGrid.classList.contains('hidden') 
                ? 'View Past Dogs' 
                : 'Hide Past Dogs';
            console.log('Archived dogs visibility toggled');
        });
    }

    // Add hover effect for dog cards
    initializeDogCardHoverEffects();
}

function initializeDogCardHoverEffects() {
    const dogCards = document.querySelectorAll('.dog-card');
    console.log('Found dog cards for hover effect:', dogCards.length);
    
    dogCards.forEach(card => {
        const overlay = card.querySelector('.dog-info-overlay');
        if (!overlay) return;
        
        card.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            console.log('Mouse enter on dog card:', card.querySelector('h3').textContent);
        });
        
        card.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            console.log('Mouse leave on dog card:', card.querySelector('h3').textContent);
        });
    });
}

function initializeContactButton() {
    const contactButton = document.querySelector('.contact-btn');
    if (contactButton) {
        contactButton.addEventListener('click', () => {
            window.location.href = 'mailto:kris@krisherl.com';
            console.log('Contact button clicked');
        });
    }
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('Smooth scroll to:', this.getAttribute('href'));
            }
        });
    });
}

function initializeParallax() {
    const background = document.querySelector('body::before');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        // Apply subtle parallax effect
        document.body.style.backgroundPositionY = `${scrollDiff * 0.5}px`;
        
        lastScrollY = currentScrollY;
    });
}

// Google Sheets API configuration
const SPREADSHEET_ID = '14o95cEZpVHEpkSxI9jBEHCrcZNkDfbUp7hNP2UmqCrA';
const API_KEY = 'AIzaSyBgBMuiA2x8Io766pqfOXvD664D0yFlHjQ';
const RANGE = 'Dogs!A2:H'; // Assuming your data starts from row 2

// Initialize Google Sheets API
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        console.log('Google Sheets API initialized');
        loadDogs();
    }).catch(error => {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Airtable configuration
const AIRTABLE_API_KEY = 'patsbLBy7jhZyOH4v.9e1e7bd60b252166f5f476714d43e71b52e1f56dcb3b516c03c9ab59929f87e2';
const AIRTABLE_BASE_ID = 'app2MQot7bw8qRw8E';
const AIRTABLE_TABLE_NAME = 'Dogs';

// Load dogs from Airtable
async function loadDogs() {
    console.log('loadDogs function started');
    try {
        console.log('Attempting to fetch dogs data from Airtable...');
        
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dogs from Airtable');
        }

        const data = await response.json();
        console.log('Loaded dogs from Airtable:', data);

        if (!data.records || data.records.length === 0) {
            console.log('No data found in Airtable, using sample data');
            displaySampleDogs();
            return;
        }

        const dogs = data.records.map(record => ({
            name: record.fields.Name || '',
            location: record.fields.Location || '',
            organization: record.fields.Organization || '',
            age: record.fields.Age || '',
            gender: record.fields.Gender || '',
            breed: record.fields.Breed || '',
            status: record.fields.Status || '',
            info: record.fields.Info || '',
            image: record.fields.Image?.[0]?.url || 'images/image-unavailable.png'
        }));

        displayDogs(dogs);
    } catch (error) {
        console.error('Error loading dogs:', error);
        displaySampleDogs();
    }
}

// Display dogs in the grid
function displayDogs(dogs) {
    const activeDogsGrid = document.querySelector('.active-dogs');
    if (!activeDogsGrid) {
        console.error('Active dogs grid not found');
        return;
    }

    // Clear existing content
    activeDogsGrid.innerHTML = '';

    // Create and append dog cards
    dogs.forEach(dog => {
        const dogCard = createDogCard(dog);
        activeDogsGrid.appendChild(dogCard);
    });

    console.log('Dogs displayed:', dogs.length);
}

// Create a dog card element
function createDogCard(dog) {
    const card = document.createElement('div');
    card.className = 'dog-card';
    card.innerHTML = `
        <div class="dog-image-container">
            <img src="${dog.image || 'images/image-unavailable.png'}" alt="${dog.name}" class="dog-image">
            <div class="dog-stamp">${dog.status}</div>
        </div>
        <div class="dog-info-popup">
            <h3>${dog.name}</h3>
            <p class="location">${dog.location}</p>
            <p class="organization">${dog.organization}</p>
            <div class="dog-details">
                <p><span class="detail-label">Age:</span> ${dog.age}</p>
                <p><span class="detail-label">Gender:</span> ${dog.gender}</p>
                <p><span class="detail-label">Breed:</span> ${dog.breed}</p>
                ${dog.info ? `<p class="dog-info">${dog.info}</p>` : ''}
            </div>
        </div>
    `;
    return card;
}

// Display sample dogs if API fails
function displaySampleDogs() {
    const dogs = [
        {
            name: 'Sergeant',
            location: 'San Diego, CA',
            organization: 'The Animal Pad',
            age: '6 years',
            gender: 'Male',
            breed: 'Labrador Mix',
            status: 'NEEDS A HOME!',
            info: 'Loves long walks and playing fetch',
            image: 'images/dogs/dog-sergeant.jpg'
        },
        {
            name: 'Finn',
            location: 'Las Vegas, NV',
            organization: 'Desert Paws Rescue',
            age: '1 year',
            gender: 'Male',
            breed: 'Golden Retriever Mix',
            status: 'URGENT',
            info: 'Great with kids and other dogs',
            image: 'images/dogs/dog-finn.jpg'
        }
    ];
    displayDogs(dogs);
} 