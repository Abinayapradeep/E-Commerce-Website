// Product data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
        category: "electronics",
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Modern Office Chair",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=200&fit=crop",
        category: "furniture",
        rating: 4.3,
        reviews: 89
    },
    {
        id: 3,
        name: "Smart Fitness Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        category: "electronics",
        rating: 4.7,
        reviews: 256
    },
    {
        id: 4,
        name: "Minimalist Desk Lamp",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop",
        category: "furniture",
        rating: 4.2,
        reviews: 67
    },
    {
        id: 5,
        name: "Vintage Leather Jacket",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop",
        category: "clothing",
        rating: 4.6,
        reviews: 143
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
        category: "electronics",
        rating: 4.4,
        reviews: 198
    },
    {
        id: 7,
        name: "Coffee Table",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
        category: "furniture",
        rating: 4.1,
        reviews: 45
    },
    {
        id: 8,
        name: "Designer T-Shirt",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
        category: "clothing",
        rating: 4.3,
        reviews: 87
    }
];

// Global state
let cart = JSON.parse(localStorage.getItem('ecommerce-cart')) || [];
let currentCategory = 'all';
let currentPage = 'home';

// DOM elements
const pages = {
    home: document.getElementById('home-page'),
    cart: document.getElementById('cart-page'),
    checkout: document.getElementById('checkout-page')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderProducts();
    updateCartUI();
});

function initializeApp() {
    // Show home page by default
    showPage('home');
    updateCartCount();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });

    // Category filters
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            showPage('checkout');
            renderCheckoutSummary();
        }
    });

    // Checkout form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCheckout();
    });
}

function showPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Show/hide pages
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    pages[pageName].classList.add('active');

    currentPage = pageName;

    // Update page-specific content
    if (pageName === 'cart') {
        updateCartUI();
    } else if (pageName === 'checkout') {
        renderCheckoutSummary();
    }
}

function filterProducts(category) {
    currentCategory = category;
    
    // Update category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    renderProducts();
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(product => product.category === currentCategory);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${capitalizeFirst(product.category)}</div>
                <h4 class="product-name">${product.name}</h4>
                <div class="product-rating">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary btn-full" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show success feedback
    showNotification('Item added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function updateCartUI() {
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItemsList = document.getElementById('cart-items-list');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'grid';
    
    // Update cart items count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-items-count').textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
    // Render cart items
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-category">${capitalizeFirst(item.category)}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-subtotal">
                <span>Subtotal: $${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    
    // Update summary
    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('summary-items').textContent = totalItems;
    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

function renderCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-info">
                <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                <div class="checkout-item-details">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
                </div>
            </div>
            <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

function handleCheckout() {
    // Simulate order processing
    showNotification('Order placed successfully! Thank you for your purchase.');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Redirect to home page
    setTimeout(() => {
        showPage('home');
    }, 2000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
