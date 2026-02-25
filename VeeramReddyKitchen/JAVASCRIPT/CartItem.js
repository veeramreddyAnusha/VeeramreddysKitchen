let cartItemsData = [];
let cartUser = null;

async function loadCartItems() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData || !userData.userId) {
        window.location.href = 'UserLogin.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/fetch/${userData.userId}`);
        const result = await response.json();
        
       console.log('Cart response:', result);

if (result.data && result.data.items && result.data.items.length > 0) {
    cartItemsData = result.data.items;
    displayCartItems(result.data.items);
    calculateTotal(result.data.items);
}
else if (result.data && result.data.cartItems && result.data.cartItems.length > 0) {
            cartItemsData = result.data.cartItems;
            displayCartItems(result.data.cartItems);
            calculateTotal(result.data.cartItems);
        } else {
            document.getElementById('emptyCart').style.display = 'block';
            document.getElementById('cartSummary').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading cart items:', error);
        document.getElementById('emptyCart').style.display = 'block';
        document.getElementById('cartSummary').style.display = 'none';
    }
}

function displayCartItems(items) {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';
    
    items.forEach(item => {
        const imageData = item.foodItem.image ? `data:image/jpeg;base64,${item.foodItem.image}` : '../IMAGES/placeholder.jpg';
        
        const cartItemHTML = `
            <div class="cart-item">
                <img src="${imageData}" alt="${item.foodItem.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.foodItem.name}</div>
                    <div class="cart-item-quantity">Qty: ${item.quantity}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <button class="btn-remove" onclick="removeItem(${item.cartItemId})">Remove</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', cartItemHTML);
    });
}

function calculateTotal(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const gst = subtotal * 0.05;
    const total = subtotal + deliveryFee + gst;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('deliveryFee').textContent = deliveryFee.toFixed(2);
    document.getElementById('gst').textContent = gst.toFixed(2);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
    document.getElementById('cartSummary').style.display = 'block';
}

async function removeItem(cartItemId) {
    try {
        const response = await fetch(`http://localhost:8080/deleteCartItem/${cartItemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadCartItems();
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

async function proceedToPayment() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.userId) {
        alert("Please login again");
        return;
    }

    // ✅ ADD THIS: FETCH USER FROM DATABASE
    let userFromDb = {};
    try {
        const res = await fetch(
            `http://localhost:8080/FindUserById?userId=${userData.userId}`
        );
        const result = await res.json();
        console.log("USER FETCH RESPONSE:", result);

        userFromDb = result.data; // ✅ DIRECT USER OBJECT
    } catch (err) {
        console.error("User fetch failed", err);
        alert("Unable to load user details");
        return;
    }

    // ---------- EXISTING CODE (UNCHANGED) ----------
    const subtotal = cartItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const gst = subtotal * 0.05;
    const total = subtotal + deliveryFee + gst;

    const itemsList = cartItemsData.map(item => `
        <div class="d-flex justify-content-between mb-2">
            <span>${item.foodItem.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const modal = `
        <div class="modal fade" id="paymentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Payment Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="paymentForm">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control"
                                    id="paymentName"
                                    value="${userFromDb.fullName || ''}" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-control"
                                    id="paymentPhone"
                                    value="${userFromDb.phone || ''}" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Delivery Address</label>
                                <textarea class="form-control"
                                    id="paymentAddress"
                                    rows="3" required>${userFromDb.address || ''}</textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Payment Method</label>
                                <select class="form-control" id="paymentMethod" required>
                                    <option value="">Select Payment Method</option>
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Credit/Debit Card</option>
                                </select>
                            </div>

                            <hr>
                            <h6 class="mb-3">Order Summary</h6>
                            ${itemsList}
                            <hr>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>₹${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Delivery Fee:</span>
                                <span>₹${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>GST (5%):</span>
                                <span>₹${gst.toFixed(2)}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between">
                                <strong>Total Amount:</strong>
                                <strong class="text-success">₹${total.toFixed(2)}</strong>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="confirmPayment()">Confirm Order</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
    new bootstrap.Modal(document.getElementById('paymentModal')).show();
}


async function confirmPayment() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = document.getElementById('paymentName').value;
    const phone = document.getElementById('paymentPhone').value;
    const address = document.getElementById('paymentAddress').value;
    const method = document.getElementById('paymentMethod').value;
    
    if (!name || !phone || !address || !method) {
        alert('Please fill all fields');
        return;
    }
    
    const subtotal = cartItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const gst = subtotal * 0.05;
    const totalAmount = subtotal + deliveryFee + gst;
    
    try {
        // Create order
        const orderResponse = await fetch(`http://localhost:8080/orders/create/${userData.userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                totalAmount: totalAmount,
                status: 'Pending'
            })
        });
        
        if (!orderResponse.ok) {
            alert('Failed to create order');
            return;
        }
        
        const orderData = await orderResponse.json();
        const orderId = orderData.data.orderId;
        
        // Add order items
        for (const item of cartItemsData) {
            await fetch(`http://localhost:8080/order-items/add/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    foodItem: { foodId: item.foodItem.foodId },
                    quantity: item.quantity,
                    price: item.price
                })
            });
        }
        
        // Create payment record
        await fetch(`http://localhost:8080/create/${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMode: method,
                paymentStatus: 'Completed'
            })
        });
        
        // Clear cart items
        for (const item of cartItemsData) {
            await fetch(`http://localhost:8080/deleteCartItem/${item.cartItemId}`, {
                method: 'DELETE'
            });
        }
        
        alert('Order placed successfully!');
        bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
        window.location.href = 'FoodItem.html';
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
    }
}

document.addEventListener('DOMContentLoaded', loadCartItems);
