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

// Google Sheets Data Handling
async function loadDogs() {
    console.log('loadDogs function started');
    try {
        console.log('Attempting to fetch dogs data from Google Sheets...');
        
        // Initialize Google API if not already initialized
        if (!gapi.client) {
            await new Promise((resolve, reject) => {
                gapi.load('client', () => {
                    gapi.client.init({
                        apiKey: 'AIzaSyBgBMuiA2x8Io766pqfOXvD664D0yFlHjQ',
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
                    }).then(resolve).catch(reject);
                });
            });
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '14o95cEZpVHEpkSxI9jBEHCrcZNkDfbUp7hNP2UmqCrA',
            range: 'Sheet1!A2:K'
        });

        if (!response.result.values) {
            console.log('No dogs found in the sheet');
            return;
        }

        const dogs = response.result.values.map(row => ({
            id: row[0],
            name: row[1],
            location: row[2],
            organization: row[3],
            age: row[4],
            gender: row[5],
            breed: row[6],
            status: row[7],
            image: row[8],
            active: row[9] === 'TRUE',
            timestamp: row[10]
        }));
        
        console.log('Found dogs:', dogs);
        
        const activeDogsGrid = document.querySelector('.active-dogs');
        const archivedDogsGrid = document.querySelector('.archived-dogs');
        
        console.log('Grid elements:', { 
            activeDogsGrid: activeDogsGrid ? 'Found' : 'Not found',
            archivedDogsGrid: archivedDogsGrid ? 'Found' : 'Not found'
        });

        if (activeDogsGrid && archivedDogsGrid) {
            // Clear existing content
            activeDogsGrid.innerHTML = '';
            archivedDogsGrid.innerHTML = '';

            // Sort dogs by active status
            const activeDogs = dogs.filter(dog => dog.active);
            const archivedDogs = dogs.filter(dog => !dog.active);

            // Create and append dog cards
            activeDogs.forEach(dog => {
                const card = createDogCard(dog);
                activeDogsGrid.appendChild(card);
            });

            archivedDogs.forEach(dog => {
                const card = createDogCard(dog);
                archivedDogsGrid.appendChild(card);
            });

            // Initialize hover effects for new cards
            initializeDogCardHoverEffects();
        }
    } catch (error) {
        console.error('Error loading dogs:', error);
        // Fallback to hardcoded data if API fails
        const fallbackDogs = [
            {
                name: 'Sergeant',
                location: 'San Diego, CA',
                organization: 'The Animal Pad',
                age: '6 years',
                gender: 'Male',
                breed: 'Labrador Mix',
                status: 'NEEDS A HOME!',
                image: 'images/image-unavailable.png',
                active: true
            },
            {
                name: 'Finn',
                location: 'Las Vegas, NV',
                organization: 'Desert Paws Rescue',
                age: '1 year',
                gender: 'Male',
                breed: 'Golden Retriever Mix',
                status: 'URGENT',
                image: 'images/image-unavailable.png',
                active: true
            }
        ];

        const activeDogsGrid = document.querySelector('.active-dogs');
        if (activeDogsGrid) {
            activeDogsGrid.innerHTML = '';
            fallbackDogs.forEach(dog => {
                const card = createDogCard(dog);
                activeDogsGrid.appendChild(card);
            });
            initializeDogCardHoverEffects();
        }
    }
}

function createDogCard(dog) {
    const card = document.createElement('div');
    card.className = 'dog-card fade-up';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'dog-image';
    
    const img = document.createElement('img');
    img.src = dog.image;
    img.alt = dog.name;
    imageContainer.appendChild(img);
    
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'dog-info-overlay';
    
    const name = document.createElement('h3');
    name.textContent = dog.name;
    
    const location = document.createElement('p');
    location.className = 'location';
    location.textContent = dog.location;
    
    const organization = document.createElement('p');
    organization.className = 'organization';
    organization.textContent = dog.organization;
    
    const details = document.createElement('div');
    details.className = 'dog-details';
    
    const age = createDetailItem('Age', dog.age);
    const gender = createDetailItem('Gender', dog.gender);
    const breed = createDetailItem('Breed', dog.breed);
    const status = createDetailItem('Status', dog.status);
    
    details.appendChild(age);
    details.appendChild(gender);
    details.appendChild(breed);
    details.appendChild(status);
    
    infoOverlay.appendChild(name);
    infoOverlay.appendChild(location);
    infoOverlay.appendChild(organization);
    infoOverlay.appendChild(details);
    
    card.appendChild(imageContainer);
    card.appendChild(infoOverlay);
    
    return card;
}

function createDetailItem(label, value) {
    const item = document.createElement('div');
    item.className = 'detail-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'detail-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'detail-value';
    valueSpan.textContent = value;
    
    item.appendChild(labelSpan);
    item.appendChild(valueSpan);
    
    return item;
} 