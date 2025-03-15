// DOM Elements
const loginSection = document.getElementById('login-section');
const managementSection = document.getElementById('management-section');
const loginForm = document.getElementById('login-form');
const addItemForm = document.getElementById('add-item-form');
const itemsList = document.getElementById('items-list');
const filterCategory = document.getElementById('filter-category');
const imageInput = document.getElementById('item-image');
const imagePreview = document.getElementById('image-preview');

// Simple authentication (In a real application, this should be server-side)
const MANAGER_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Menu items data
let menuData = { items: {} };

// Load menu data
async function loadMenuData() {
    try {
        const response = await fetch('http://localhost:3000/api/menu');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        menuData = await response.json();
        loadItems();
    } catch (error) {
        console.error('Error loading menu data:', error);
        alert('Failed to load menu items. Please try again later.');
    }
}

// Load items into the management view
function loadItems() {
    const itemsList = document.getElementById('items-list');
    const filterCategory = document.getElementById('filter-category').value;
    itemsList.innerHTML = '';

    Object.entries(menuData.items).forEach(([id, item]) => {
        if (filterCategory === 'all' || item.category === filterCategory) {
            const itemCard = createItemCard(id, item);
            itemsList.appendChild(itemCard);
        }
    });
}

// Create item card for management view
function createItemCard(id, item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>
            <p class="category">${item.category}</p>
        </div>
        <button class="delete-btn" onclick="deleteItem('${id}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return card;
}

// Add new item
async function addItem(e) {
    e.preventDefault();
    
    try {
        const form = e.target;
        const formData = new FormData(form);
        
        // Send the form data including the file
        const response = await fetch('http://localhost:3000/api/menu', {
            method: 'POST',
            body: formData // FormData will automatically set the correct Content-Type
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item');
        }
        
        const result = await response.json();
        menuData.items[result.id] = result;
        
        // Reset form and preview
        form.reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('image-preview').classList.remove('active');
        
        showMessage('Item added successfully', 'success');
        loadItems();
    } catch (error) {
        console.error('Error adding item:', error);
        showMessage(error.message || 'Failed to add item. Please try again.', 'error');
    }
}

// Delete item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        delete menuData.items[id];
        showMessage('Item deleted successfully', 'success');
        loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        showMessage('Failed to delete item. Please try again.', 'error');
    }
}

// Show message
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    const targetSection = document.querySelector('.add-item-section');
    targetSection.insertBefore(message, targetSection.firstChild);

    setTimeout(() => message.remove(), 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadMenuData();

    // Set up form submission
    document.getElementById('add-item-form').addEventListener('submit', addItem);

    // Set up category filter
    document.getElementById('filter-category').addEventListener('change', loadItems);

    // Set up image preview
    document.getElementById('item-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            const preview = document.getElementById('image-preview');
            
            preview.innerHTML = '<div class="loading-indicator"></div>';
            preview.classList.add('active');

            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };

            reader.readAsDataURL(file);
        }
    });
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === MANAGER_CREDENTIALS.username && password === MANAGER_CREDENTIALS.password) {
        loginSection.style.display = 'none';
        managementSection.style.display = 'block';
        loadItems();
    } else {
        showMessage('Invalid credentials', 'error');
    }
}); 