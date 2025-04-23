// Mock product data
const mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Tech Product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 99,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
    image: `https://via.placeholder.com/300`,
    category: ['laptops', 'smartphones', 'accessories', 'wearables'][Math.floor(Math.random() * 4)],
    brand: ['Apple', 'Samsung', 'Dell', 'Sony', 'Microsoft'][Math.floor(Math.random() * 5)],
    inStock: Math.random() > 0.2,
    isNew: Math.random() > 0.7,
    isFeatured: Math.random() > 0.8,
    description: `This is a detailed description for Tech Product ${i + 1}. It features the latest technology and innovative design to enhance your tech experience. Perfect for everyday use with long-lasting battery life and premium build quality.`,
    images: [
        `https://via.placeholder.com/600`,
        `https://via.placeholder.com/600`,
        `https://via.placeholder.com/600`,
        `https://via.placeholder.com/600`,
    ],
    colors: ['Black', 'White', 'Silver', 'Blue', 'Red'],
    specs: [
        { name: 'Dimensions', value: '12.8 x 8.3 x 0.6 inches' },
        { name: 'Weight', value: '2.8 pounds' },
        { name: 'Battery Life', value: 'Up to 10 hours' },
        { name: 'Warranty', value: '1 year limited' },
    ]
}));

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const currentYearElements = document.querySelectorAll('#current-year');

// Set current year in footer
currentYearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
});

// Mobile menu toggle
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Toggle icon
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCounts.forEach(el => {
        el.textContent = count;
    });
}

function addToCart(productId, quantity = 1) {
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    
    // Show confirmation
    alert(`${product.name} added to cart!`);
}

// Initialize cart count
updateCartCount();

// Product Card Template
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                
                <div class="product-badges">
                    ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                    ${product.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
                </div>
                
                <button class="wishlist-btn">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            
            <div class="product-info">
                <a href="product-detail.html?id=${product.id}">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                
                <div class="product-rating">
                    <div class="stars">
                        ${Array(5).fill('').map((_, i) => 
                            `<i class="fas fa-star"></i>`
                        ).join('')}
                    </div>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price-actions">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button 
                        class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                        ${!product.inStock ? 'disabled' : ''}
                        onclick="addToCart(${product.id})"
                    >
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
                
                ${!product.inStock ? '<p class="out-of-stock">Out of stock</p>' : ''}
            </div>
        </div>
    `;
}

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    const featuredProducts = mockProducts.filter(product => product.isFeatured).slice(0, 4);
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => 
        createProductCard(product)
    ).join('');
}

// Products Page Functionality
function initProductsPage() {
    const productsContainer = document.getElementById('products-container');
    const resultsCount = document.getElementById('results-count');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const sortSelect = document.getElementById('sort-select');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const priceRange = document.getElementById('price-range');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const brandFilters = document.querySelectorAll('.brand-filter');
    
    if (!productsContainer) return;
    
    let filteredProducts = [...mockProducts];
    let selectedCategories = [];
    let selectedBrands = [];
    let currentPriceRange = 1000;
    let viewMode = 'grid';
    
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        selectedCategories = [categoryParam];
        
        // Check the corresponding checkbox
        const checkbox = document.getElementById(`category-${categoryParam}`);
        if (checkbox) checkbox.checked = true;
    }
    
    // Filter toggle for mobile
    if (filterToggleBtn && filtersSidebar) {
        filterToggleBtn.addEventListener('click', () => {
            filtersSidebar.classList.toggle('active');
        });
    }
    
    // View mode toggle
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            viewMode = 'grid';
            productsContainer.className = 'product-grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            renderProducts();
        });
        
        listViewBtn.addEventListener('click', () => {
            viewMode = 'list';
            productsContainer.className = 'product-list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            renderProducts();
        });
    }
    
    // Price range filter
    if (priceRange && minPrice && maxPrice) {
        priceRange.addEventListener('input', (e) => {
            currentPriceRange = parseInt(e.target.value);
            maxPrice.textContent = `$${currentPriceRange}`;
            applyFilters();
        });
    }
    
    // Category filters
    if (categoryFilters) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                if (filter.checked) {
                    selectedCategories.push(filter.value);
                } else {
                    selectedCategories = selectedCategories.filter(cat => cat !== filter.value);
                }
                applyFilters();
            });
        });
    }
    
    // Brand filters
    if (brandFilters) {
        brandFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                if (filter.checked) {
                    selectedBrands.push(filter.value);
                } else {
                    selectedBrands = selectedBrands.filter(brand => brand !== filter.value);
                }
                applyFilters();
            });
        });
    }
    
    // Sort products
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applyFilters();
        });
    }
    
    function applyFilters() {
        // Filter by category
        if (selectedCategories.length > 0) {
            filteredProducts = mockProducts.filter(product => 
                selectedCategories.includes(product.category)
            );
        } else {
            filteredProducts = [...mockProducts];
        }
        
        // Filter by brand
        if (selectedBrands.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                selectedBrands.includes(product.brand)
            );
        }
        
        // Filter by price
        filteredProducts = filteredProducts.filter(product => 
            product.price <= currentPriceRange
        );
        
        // Sort products
        const sortValue = sortSelect ? sortSelect.value : 'featured';
        
        if (sortValue === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating') {
            filteredProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        }
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `Showing ${filteredProducts.length} products`;
        }
        
        renderProducts();
    }
    
    function renderProducts() {
        if (!productsContainer) return;
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters to find what you're looking for.</p>
                </div>
            `;
            return;
        }
        
        if (viewMode === 'grid') {
            productsContainer.innerHTML = filteredProducts.map(product => 
                createProductCard(product)
            ).join('');
        } else {
            productsContainer.innerHTML = filteredProducts.map(product => `
                <div class="product-list-item">
                    <div class="product-list-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-list-info">
                        <h3 class="product-list-title">${product.name}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                ${Array(5).fill('').map((_, i) => 
                                    `<i class="fas fa-star"></i>`
                                ).join('')}
                            </div>
                            <span class="review-count">(${product.reviews})</span>
                        </div>
                        <p class="product-list-meta">
                            Category: ${product.category}<br>
                            Brand: ${product.brand}
                        </p>
                        <div class="product-list-price-actions">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <button 
                                class="btn btn-primary ${!product.inStock ? 'disabled' : ''}" 
                                ${!product.inStock ? 'disabled' : ''}
                                onclick="addToCart(${product.id})"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Initial render
    applyFilters();
}

// Product Detail Page
function loadProductDetail(productId) {
    const productDetailContainer = document.getElementById('product-detail');
    const productDescriptionEl = document.getElementById('product-description');
    const productSpecsEl = document.getElementById('product-specs');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!productDetailContainer) return;
    
    // Convert productId to number if it's a string
    if (typeof productId === 'string') {
        productId = parseInt(productId);
    }
    
    const product = mockProducts.find(p => p.id === productId) || mockProducts[0];
    
    // Update page title
    document.title = `${product.name} - TechRealm`;
    
    // Render product detail
    productDetailContainer.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${product.images[0]}" alt="${product.name}" id="main-product-image">
            </div>
            <div class="thumbnail-grid">
                ${product.images.map((image, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${image}" alt="${product.name} thumbnail ${index + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="product-info-detail">
            <h1 class="product-title-detail">${product.name}</h1>
            
            <div class="product-rating-detail">
                <div class="stars">
                    ${Array(5).fill('').map((_, i) => 
                        `<i class="fas fa-star"></i>`
                    ).join('')}
                </div>
                <span class="review-count">${product.rating} (${product.reviews} reviews)</span>
            </div>
            
            <div class="product-price-detail">$${product.price.toFixed(2)}</div>
            
            <p class="product-description">${product.description}</p>
            
            <div class="product-colors">
                <div class="color-label">Color</div>
                <div class="color-options">
                    ${product.colors.map((color, index) => `
                        <div 
                            class="color-option ${index === 0 ? 'active' : ''}" 
                            style="background-color: ${color.toLowerCase()}"
                            data-color="${color}"
                        >
                            ${index === 0 ? '✓' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="product-quantity">
                <div class="quantity-label">Quantity</div>
                <div class="quantity-control">
                    <button class="quantity-btn" id="decrease-quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" min="1" max="10" value="1" class="quantity-input" id="product-quantity">
                    <button class="quantity-btn" id="increase-quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <div class="product-actions">
                <button 
                    class="add-to-cart-btn-detail ${!product.inStock ? 'disabled' : ''}" 
                    id="add-to-cart-btn"
                    ${!product.inStock ? 'disabled' : ''}
                >
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <div class="action-buttons">
                    <button class="action-btn">
                        <i class="far fa-heart"></i>
                        <span>Wishlist</span>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-share-alt"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
            
            <div class="product-specs">
                <h3 class="specs-title">Specifications</h3>
                <div class="specs-grid">
                    ${product.specs.map(spec => `
                        <div class="spec-item">
                            <span class="spec-label">${spec.name}</span>
                            <span class="spec-value">${spec.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Update product description in tab
    if (productDescriptionEl) {
        productDescriptionEl.textContent = product.description;
    }
    
    // Update product specs in tab
    if (productSpecsEl) {
        productSpecsEl.innerHTML = `
            ${product.specs.map(spec => `
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">${spec.name}</span>
                    <span class="text-gray-600">${spec.value}</span>
                </div>
            `).join('')}
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Model Number</span>
                <span class="text-gray-600">TR-${product.id}X</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Release Date</span>
                <span class="text-gray-600">January 2023</span>
            </div>
        `;
    }
    
    // Tab functionality
    if (tabButtons && tabPanes) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Image gallery functionality
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const index = parseInt(thumbnail.getAttribute('data-index'));
                mainImage.src = product.images[index];
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });
    }
    
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    let selectedColor = product.colors[0];
    
    if (colorOptions.length) {
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectedColor = option.getAttribute('data-color');
                
                // Update active color
                colorOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.innerHTML = '';
                });
                
                option.classList.add('active');
                option.innerHTML = '✓';
            });
        });
    }
    
    // Quantity controls
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 10) {
                value = 10;
            }
            
            quantityInput.value = value;
        });
    }
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (addToCartBtn && product.inStock) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity);
        });
    }
}

// Cart Page
function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartEmpty = document.getElementById('cart-empty');
    
    if (!cartContainer || !cartEmpty) return;
    
    if (cart.length === 0) {
        cartContainer.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
        return;
    }
    
    cartContainer.classList.remove('hidden');
    cartEmpty.classList.add('hidden');
    
    // Calculate cart totals
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Render cart items and summary
    cartContainer.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-content">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <p class="cart-item-meta">Unit Price: $${item.price.toFixed(2)}</p>
                            <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="cart-quantity-btn decrease-cart-quantity" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-quantity-input">${item.quantity}</span>
                            <button class="cart-quantity-btn increase-cart-quantity" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <h3 class="cart-summary-title">Order Summary</h3>
            
            <div class="cart-summary-row">
                <span class="cart-summary-label">Subtotal</span>
                <span class="cart-summary-value">$${total.toFixed(2)}</span>
            </div>
            
            <div class="cart-summary-total">
                <span class="cart-summary-total-label">Total</span>
                <span class="cart-summary-total-value">$${total.toFixed(2)}</span>
            </div>
            
            <button class="checkout-btn">
                Proceed to Checkout
            </button>
        </div>
    `;
    
    // Add event listeners for cart actions
    const decreaseButtons = document.querySelectorAll('.decrease-cart-quantity');
    const increaseButtons = document.querySelectorAll('.increase-cart-quantity');
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            updateCartItemQuantity(id, -1);
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            updateCartItemQuantity(id, 1);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            removeCartItem(id);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeCartItem(id);
    } else {
        saveCart();
        loadCart();
    }
}

// Remove item from cart
function removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    loadCart();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Set current year in footer
    const currentYearElements = document.querySelectorAll('#current-year');
    currentYearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});