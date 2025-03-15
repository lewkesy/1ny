// Image loading optimization
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const img = item.querySelector('img');
        item.classList.add('loading');
        
        img.onload = () => {
            item.classList.remove('loading');
        };
        
        img.onerror = () => {
            item.classList.remove('loading');
            img.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
        };
    });
});

// Optimize category switching
const optimizeImages = (section) => {
    const images = section.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (!img.complete) {
            const menuItem = img.closest('.menu-item');
            menuItem.classList.add('loading');
            img.onload = () => menuItem.classList.remove('loading');
        }
    });
};

// Menu items data
let menuData = { items: {} };

// Initialize image loading states
function initializeImageLoading(container) {
    const menuItems = container.querySelectorAll('.menu-item');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const menuItem = entry.target;
                const img = menuItem.querySelector('img');
                loadImage(img, menuItem);
                observer.unobserve(menuItem);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading when image is 50px from viewport
        threshold: 0.1
    });

    menuItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // Create image container if it doesn't exist
            let container = item.querySelector('.image-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'image-container';
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);
            }

            // Add loading class and blur effect
            item.classList.add('loading');
            img.classList.add('blur-up');
            
            // Add loading progress bar
            const progress = document.createElement('div');
            progress.className = 'loading-progress';
            container.appendChild(progress);

            // Observe the menu item
            imageObserver.observe(item);
        }
    });
}

// Load image with progress tracking
function loadImage(img, menuItem) {
    return new Promise((resolve, reject) => {
        // Create a new image object
        const newImg = new Image();
        
        // Add original source
        const originalSrc = img.getAttribute('data-src') || img.src;
        newImg.src = originalSrc;

        // Track loading progress
        const progressBar = menuItem.querySelector('.loading-progress');
        if (progressBar && newImg.complete === false) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', originalSrc, true);
            xhr.responseType = 'arraybuffer';
            
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    progressBar.style.width = percentComplete + '%';
                }
            };
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    progressBar.style.width = '100%';
                }
            };
            
            xhr.send();
        }

        // Handle successful load
        newImg.onload = () => {
            img.src = newImg.src;
            menuItem.classList.remove('loading');
            img.classList.add('loaded');
            
            // Remove progress bar after animation
            if (progressBar) {
                setTimeout(() => progressBar.remove(), 300);
            }
            
            resolve();
        };

        // Handle error
        newImg.onerror = () => {
            menuItem.classList.remove('loading');
            menuItem.classList.add('error');
            img.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
            reject();
        };
    });
}

// Preload images for visible section
function preloadImagesForCategory(category) {
    const section = document.getElementById(category);
    if (!section) return;

    const images = Array.from(section.querySelectorAll('.menu-item img'));
    const preloadPromises = images.map(img => {
        const menuItem = img.closest('.menu-item');
        return loadImage(img, menuItem);
    });

    return Promise.all(preloadPromises);
}

// Load menu data from static JSON file
async function loadMenuData() {
    try {
        console.log('Loading menu data...');
        const response = await fetch('./data/menu-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuData = await response.json();
        console.log('Loaded menu data:', menuData);

        // Display the default category
        const defaultCategory = document.querySelector('.category-btn.active').dataset.category;
        console.log('Displaying default category:', defaultCategory);
        displayCategory(defaultCategory);
    } catch (error) {
        console.error('Error loading menu data:', error);
        alert('Failed to load menu items. Please try again later.');
    }
}

// Display category items
function displayCategory(category) {
    console.log('Displaying category:', category);
    console.log('Current menu data:', menuData);
    
    const section = document.getElementById(category);
    if (!section) {
        console.error('Section not found:', category);
        return;
    }

    // Clear existing items but keep the header
    const header = section.querySelector('h2').textContent;
    section.innerHTML = `<h2>${header}</h2>`;

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    // Filter and display items for this category
    let itemsInCategory = 0;
    Object.entries(menuData.items).forEach(([id, item]) => {
        console.log('Checking item:', id, 'with category:', item.category, 'against:', category);
        if (item.category === category) {
            itemsInCategory++;
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.itemId = id;
            
            menuItem.innerHTML = `
                <div class="image-container">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" class="blur-up">
                    <div class="loading-progress"></div>
                </div>
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
            `;
            
            menuItem.addEventListener('click', () => showPopup(id));
            grid.appendChild(menuItem);
        }
    });
    
    console.log(`Found ${itemsInCategory} items in category ${category}`);
    section.appendChild(grid);
    initializeImageLoading(section);
    
    // Preload images for this category
    preloadImagesForCategory(category);
}

// Show popup with item details
function showPopup(itemId) {
    const itemData = menuData.items[itemId];
    if (!itemData) return;

    const popup = document.querySelector('.popup-overlay');
    const popupImage = popup.querySelector('.popup-image img');
    const popupTitle = popup.querySelector('.popup-details h2');
    const popupPrice = popup.querySelector('.popup-details .price');
    const popupDescription = popup.querySelector('.popup-details .description');
    const popupIngredients = popup.querySelector('.ingredients ul');
    const popupAllergens = popup.querySelector('.allergens p');

    popupImage.src = itemData.image;
    popupImage.alt = itemData.name;
    popupTitle.textContent = itemData.name;
    popupPrice.textContent = itemData.price;
    popupDescription.textContent = itemData.description;
    
    popupIngredients.innerHTML = '';
    itemData.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        popupIngredients.appendChild(li);
    });
    
    popupAllergens.textContent = itemData.allergens;
    
    popup.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

// Close popup handler
function closePopupHandler() {
    const popup = document.querySelector('.popup-overlay');
    popup.classList.remove('active');
    setTimeout(() => {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Search functionality
function performSearch(query) {
    query = query.toLowerCase();
    const searchResults = document.getElementById('search-results');
    const menuSections = document.querySelectorAll('.menu-section');
    
    if (query) {
        menuSections.forEach(section => section.style.display = 'none');
        searchResults.style.display = 'grid';
    } else {
        menuSections.forEach(section => {
            section.style.display = section.classList.contains('active') ? 'block' : 'none';
        });
        searchResults.style.display = 'none';
        return;
    }

    searchResults.innerHTML = '';
    
    const results = Object.entries(menuData.items).filter(([id, item]) => {
        const searchText = `${item.name} ${item.description} ${item.ingredients.join(' ')}`.toLowerCase();
        return searchText.includes(query);
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No items found</div>';
        return;
    }

    results.forEach(([id, item]) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.itemId = id;
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>
        `;
        
        menuItem.addEventListener('click', () => showPopup(id));
        searchResults.appendChild(menuItem);
    });

    initializeImageLoading(searchResults);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load menu data
    loadMenuData();

    // Set up category navigation
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.menu-section').forEach(section => section.classList.remove('active'));
            
            button.classList.add('active');
            const category = button.dataset.category;
            const activeSection = document.getElementById(category);
            activeSection.classList.add('active');
            
            displayCategory(category);
        });
    });

    // Set up search with debouncing
    const searchInput = document.getElementById('menu-search');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value.trim());
        }, 300);
    });

    // Set up popup handlers
    const popup = document.querySelector('.popup-overlay');
    const closePopup = document.querySelector('.close-popup');
    
    closePopup.addEventListener('click', closePopupHandler);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopupHandler();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopupHandler();
        }
    });
}); 