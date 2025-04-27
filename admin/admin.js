// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const addDogForm = document.getElementById('addDogForm');
const logoutBtn = document.getElementById('logoutBtn');
const currentDogsList = document.getElementById('currentDogsList');
const archivedDogsList = document.getElementById('archivedDogsList');

// Constants
const STORAGE_KEY = 'krisherl_dogs_data';
const MAX_ACTIVE_DOGS = 4;

// State
let dogsData = loadDogsData();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in
    if (isLoggedIn()) {
        showDashboard();
    }
    
    // Initialize event listeners
    loginForm.addEventListener('submit', handleLogin);
    addDogForm.addEventListener('submit', handleAddDog);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Render initial dogs lists
    renderDogsList();
});

// Login/Logout Handlers
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication - replace with proper authentication later
    if (username === 'admin' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials');
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    hideDashboard();
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function hideDashboard() {
    dashboardSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
}

// Dog Management
function handleAddDog(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newDog = {
        id: Date.now().toString(),
        name: formData.get('name'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        breed: formData.get('breed'),
        location: formData.get('location'),
        organization: formData.get('organization'),
        status: formData.get('status'),
        archived: false,
        dateAdded: new Date().toISOString()
    };

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newDog.image = event.target.result;
            addDogToList(newDog);
        };
        reader.readAsDataURL(imageFile);
    }
}

function addDogToList(newDog) {
    const activeDogs = dogsData.filter(dog => !dog.archived);
    
    // If we already have max active dogs, archive the oldest one
    if (activeDogs.length >= MAX_ACTIVE_DOGS) {
        const oldestDog = activeDogs.sort((a, b) => 
            new Date(a.dateAdded) - new Date(b.dateAdded)
        )[0];
        
        const dogIndex = dogsData.findIndex(dog => dog.id === oldestDog.id);
        if (dogIndex !== -1) {
            dogsData[dogIndex].archived = true;
            dogsData[dogIndex].status = 'ADOPTED!';
        }
    }
    
    // Add new dog
    dogsData.push(newDog);
    saveDogsData();
    renderDogsList();
    addDogForm.reset();
}

function updateDogStatus(dogId, newStatus) {
    const dogIndex = dogsData.findIndex(dog => dog.id === dogId);
    if (dogIndex !== -1) {
        dogsData[dogIndex].status = newStatus;
        if (newStatus === 'ADOPTED!') {
            dogsData[dogIndex].archived = true;
        }
        saveDogsData();
        renderDogsList();
    }
}

function deleteDog(dogId) {
    dogsData = dogsData.filter(dog => dog.id !== dogId);
    saveDogsData();
    renderDogsList();
}

// Rendering
function renderDogsList() {
    const activeDogs = dogsData.filter(dog => !dog.archived);
    const archivedDogs = dogsData.filter(dog => dog.archived);
    
    currentDogsList.innerHTML = activeDogs.map(dog => createDogCard(dog)).join('');
    archivedDogsList.innerHTML = archivedDogs.map(dog => createDogCard(dog)).join('');
    
    // Update main page dogs data
    updateMainPageDogs(dogsData);
}

function createDogCard(dog) {
    return `
        <div class="dog-card">
            <img src="${dog.image}" alt="${dog.name}">
            <h4>${dog.name}</h4>
            <p>${dog.breed} • ${dog.age}</p>
            <p>${dog.location}</p>
            <p>${dog.organization}</p>
            <p class="status">${dog.status}</p>
            <div class="dog-actions">
                ${!dog.archived ? `
                    <button onclick="updateDogStatus('${dog.id}', 'ADOPTED!')">Mark Adopted</button>
                    <button onclick="updateDogStatus('${dog.id}', 'URGENT')">Mark Urgent</button>
                ` : ''}
                <button onclick="deleteDog('${dog.id}')">Delete</button>
            </div>
        </div>
    `;
}

// Data Management
function loadDogsData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

function saveDogsData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dogsData));
}

function updateMainPageDogs(dogs) {
    // Create the dogs data array for the main page
    const dogsArray = dogs.map(dog => ({
        name: dog.name,
        location: dog.location,
        organization: dog.organization,
        age: dog.age,
        gender: dog.gender,
        breed: dog.breed,
        image: dog.image,
        status: dog.status,
        archived: dog.archived
    }));
    
    // Save to a file that the main page can access
    const dogsScript = `const dogs = ${JSON.stringify(dogsArray, null, 2)};`;
    
    // Create a Blob and download it
    const blob = new Blob([dogsScript], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '../script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 