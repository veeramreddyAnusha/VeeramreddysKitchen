document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadUserData();
    loadCartItems();
});

function checkUserAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = './UserLogin.html';
        return;
    }
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userInitials').textContent = userData.fullName.charAt(0).toUpperCase();
    }
}

async function loadCartItems() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const response = await fetch(`http://localhost:8080/get/${userData.userId}`);
        if (response.ok) {
            const result = await response.json();
            const cart = result.data;
            displayCartItems(cart?.items || []);
        } else {
            displayCartItems([]);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        displayCartItems([]);
    }
}

function displayCartItems(cartItems) {
    const container = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bx bx-cart" style="font-size: 4rem; color: #198754;"></i>
                <h4 class="mt-3">Your Cart is Empty</h4>
                <p class="text-muted">Add some delicious items to your cart!</p>
                <a href="./FoodItem.html" class="btn btn-success">Browse Food Items</a>
            </div>
        `;
        if (summaryContainer) summaryContainer.style.display = 'none';
        return;
    }

    let totalAmount = 0;
    
    container.innerHTML = `
        <div class="row">
            ${cartItems.map(item => {
                const itemTotal = item.quantity * item.price;
                totalAmount += itemTotal;
                
                return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100">
                            <img src="data:image/jpeg;base64,${btoa(String.fromCharCode(...item.foodItem.image))}" 
                                 class="card-img-top" style="height: 200px; object-fit: cover;" 
                                 alt="${item.foodItem.name}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${item.foodItem.name}</h5>
                                <p class="card-text">${item.foodItem.quantity}</p>
                                <p class="card-text"><strong>₹${item.price}</strong></p>
                                
                                <div class="mt-auto">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <span>Quantity:</span>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-outline-success btn-sm" onclick="updateQuantity(${item.cartItemId}, ${item.quantity - 1})">
                                                -
                                            </button>
                                            <span class="btn btn-outline-success btn-sm disabled">${item.quantity}</span>
                                            <button class="btn btn-outline-success btn-sm" onclick="updateQuantity(${item.cartItemId}, ${item.quantity + 1})">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <strong>Total: ₹${itemTotal}</strong>
                                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.cartItemId})">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Display order summary
    if (summaryContainer) {
        summaryContainer.style.display = 'block';
        summaryContainer.innerHTML = `
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5>Order Summary</h5>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Items (${cartItems.length}):</span>
                        <span>₹${totalAmount}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Delivery:</span>
                        <span>₹50</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-3">
                        <strong>Total:</strong>
                        <strong>₹${totalAmount + 50}</strong>
                    </div>
                    <button class="btn btn-success w-100" onclick="proceedToCheckout(${totalAmount + 50})">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }
}

async function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/UpdateCartItem/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            loadCartItems();
        } else {
            alert('Failed to update quantity');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Error updating quantity');
    }
}

async function removeFromCart(cartItemId) {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
        const response = await fetch(`http://localhost:8080/delete/${cartItemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCartItems();
        } else {
            alert('Failed to remove item');
        }
    } catch (error) {
        console.error('Error removing item:', error);
        alert('Error removing item');
    }
}

async function proceedToCheckout(totalAmount) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const orderData = {
            totalAmount: totalAmount,
            status: 'PENDING',
            orderTime: new Date().toISOString()
        };
        
        const response = await fetch(`http://localhost:8080/orders/create/${userData.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Order placed successfully!');
            window.location.href = './OrderHistory.html';
        } else {
            alert('Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        // Store order data for payment page
        const orderData = {
            subtotal: totalAmount - 50,
            delivery: 50,
            total: totalAmount
        };
        localStorage.setItem('orderData', JSON.stringify(orderData));
        window.location.href = './Payment.html';
    }
}

function logout() {
    localStorage.removeItem('userData');
    window.location.href = './Home.html';
}