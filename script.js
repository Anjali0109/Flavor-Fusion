// Global variables
let cart = [];
let currentCuisine = '';
let currentItem = '';
let currentPrice = 0;

// DOM elements
const cuisineCards = document.querySelectorAll('.cuisine-card');
const menuSection = document.getElementById('menu');
const customizationModal = document.getElementById('customization-modal');
const modalItemName = document.getElementById('modal-item-name');
const itemTotalPrice = document.getElementById('item-total-price');
const quantityInput = document.querySelector('.quantity');
const viewCartBtn = document.getElementById('view-cart-btn');
const cartSection = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const orderSuccessSection = document.getElementById('order-success');

// Event listeners for cuisine selection
cuisineCards.forEach(card => {
    card.addEventListener('click', () => {
        currentCuisine = card.getAttribute('data-cuisine');
        showMenu(currentCuisine);
    });
});

// Show menu for selected cuisine
function showMenu(cuisine) {
    menuSection.style.display = 'block';
    
    // Hide ALL cuisine menus first
    const allMenus = document.querySelectorAll('.menu-items');
    allMenus.forEach(menu => {
        menu.style.display = 'none';
    });
    
    // Show only the selected cuisine's menu with a flexible display
    const selectedMenu = document.getElementById(`${cuisine}-menu`);
    selectedMenu.style.display = 'flex';
    selectedMenu.style.flexWrap = 'wrap';
    selectedMenu.style.gap = '20px';
    selectedMenu.style.justifyContent = 'center';
    
    // Style the menu items for responsive layout
    const menuItems = selectedMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.flex = '1 1 300px';
        item.style.maxWidth = '400px';
        item.style.margin = '10px';
    });
    
    window.location.href = '#menu';
    
    if (cart.length > 0) {
        viewCartBtn.style.display = 'inline-block';
    }
}

// Customize buttons
document.querySelectorAll('.customize-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentItem = btn.getAttribute('data-item');
        currentPrice = parseFloat(btn.getAttribute('data-price'));
        modalItemName.textContent = `Customize ${currentItem}`;
        itemTotalPrice.textContent = `$${currentPrice.toFixed(2)}`;
        quantityInput.value = 1;
        customizationModal.style.display = 'flex';
    });
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    customizationModal.style.display = 'none';
});

// Quantity buttons
document.querySelector('.decrease').addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
        updateItemPrice();
    }
});

document.querySelector('.increase').addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    quantity++;
    quantityInput.value = quantity;
    updateItemPrice();
});

// Update item price based on quantity and add-ons
function updateItemPrice() {
    let quantity = parseInt(quantityInput.value);
    let addonPrice = 0;
    
    document.querySelectorAll('input[name="addon"]:checked').forEach(addon => {
        if (addon.value === 'cheese') addonPrice += 1.50;
        if (addon.value === 'vegetables') addonPrice += 1.00;
        if (addon.value === 'sauce') addonPrice += 0.75;
    });
    
    let totalPrice = (currentPrice + addonPrice) * quantity;
    itemTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Add event listeners for add-ons to update price
document.querySelectorAll('input[name="addon"]').forEach(addon => {
    addon.addEventListener('change', updateItemPrice);
});

// Add to cart button
document.querySelector('.add-to-cart').addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    let spiceLevel = document.querySelector('input[name="spice"]:checked').value;
    let addons = [];
    let specialInstructions = document.querySelector('textarea').value;
    let addonPrice = 0;
    
    document.querySelectorAll('input[name="addon"]:checked').forEach(addon => {
        addons.push(addon.value);
        if (addon.value === 'cheese') addonPrice += 1.50;
        if (addon.value === 'vegetables') addonPrice += 1.00;
        if (addon.value === 'sauce') addonPrice += 0.75;
    });
    
    let itemTotalPrice = (currentPrice + addonPrice) * quantity;
    
    cart.push({
        name: currentItem,
        quantity: quantity,
        spiceLevel: spiceLevel,
        addons: addons,
        specialInstructions: specialInstructions,
        price: currentPrice,
        addonPrice: addonPrice,
        totalPrice: itemTotalPrice
    });
    
    customizationModal.style.display = 'none';
    viewCartBtn.style.display = 'inline-block';
    
    // Show feedback
    alert(`${quantity} ${currentItem} added to cart!`);
});

// View cart button
viewCartBtn.addEventListener('click', () => {
    showCart();
});

// Show cart function
function showCart() {
    menuSection.style.display = 'none';
    cartSection.style.display = 'block';
    
    // Clear previous cart items
    while (cartItemsContainer.firstChild) {
        cartItemsContainer.removeChild(cartItemsContainer.firstChild);
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 30px;">
                <p>Your cart is empty. Add some delicious items!</p>
            </div>
        `;
        document.getElementById('checkout-btn').disabled = true;
    } else {
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            let cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            let addonText = item.addons.length > 0 ? 
                `Add-ons: ${item.addons.join(', ')}` : '';
            
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name} x${item.quantity} (${item.spiceLevel})</h4>
                    <p>${addonText}</p>
                    ${item.specialInstructions ? `<p>Note: ${item.specialInstructions}</p>` : ''}
                </div>
                <div class="cart-item-price">$${item.totalPrice.toFixed(2)}</div>
                <button class="remove-item" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer; margin-left: 10px;">✕</button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            totalPrice += item.totalPrice;
        });
        
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        document.getElementById('checkout-btn').disabled = false;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                showCart();
            });
        });
    }
}

// Back to menu button
document.getElementById('back-to-menu').addEventListener('click', () => {
    cartSection.style.display = 'none';
    showMenu(currentCuisine);
});

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
    cartSection.style.display = 'none';
    orderSuccessSection.style.display = 'block';
    document.getElementById('order-number').textContent = `FL${Math.floor(100000 + Math.random() * 900000)}`;
});

// New order button
document.getElementById('new-order-btn').addEventListener('click', () => {
    // Reset cart and return to cuisine selection
    cart = [];
    orderSuccessSection.style.display = 'none';
    viewCartBtn.style.display = 'none';
    window.scrollTo(0, 0);
});

// Window click to close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === customizationModal) {
        customizationModal.style.display = 'none';
    }
});

// Apply responsive styles on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for responsive menu layout
    const style = document.createElement('style');
    style.textContent = `
        .menu-items {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        
        .menu-item {
            flex: 1 1 300px;
            max-width: 400px;
            margin: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .menu-item:hover {
            transform: translateY(-5px);
        }
        
        @media (max-width: 768px) {
            .menu-item {
                flex: 1 1 100%;
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
});