document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadUserData();
    loadOrderHistory();
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

async function loadOrderHistory() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const response = await fetch(`http://localhost:8080/GetUserOrders/${userData.userId}`);
        if (response.ok) {
            const result = await response.json();
            const orders = result.data || [];
            displayOrders(orders);
        } else {
            throw new Error('Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersContainer').innerHTML = 
            '<div class="alert alert-danger">Failed to load orders. Please try again later.</div>';
    } finally {
        hideLoading();
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bx bx-package" style="font-size: 4rem; color: #198754;"></i>
                <h4 class="mt-3">No Orders Yet</h4>
                <p class="text-muted">Start shopping to see your orders here!</p>
                <a href="./FoodItem.html" class="btn btn-success">Browse Food Items</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">Order #${order.orderId}</h5>
                    <small class="text-muted">${new Date(order.orderTime).toLocaleString()}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-${getStatusColor(order.status)} fs-6">${order.status}</span>
                    <br>
                    <strong class="text-success">₹${order.totalAmount}</strong>
                </div>
            </div>
            <div class="card-body">
                <div id="orderItems-${order.orderId}">
                    <button class="btn btn-outline-success btn-sm" onclick="loadOrderItems(${order.orderId})">
                        View Items
                    </button>
                </div>
                <div class="mt-3">
                    <button class="btn btn-success btn-sm me-2" onclick="reorderItems(${order.orderId})">
                        Reorder
                    </button>
                    <button class="btn btn-outline-success btn-sm me-2" onclick="downloadInvoice(${order.orderId})">
                        Download Invoice
                    </button>
                    ${order.status.toLowerCase() === 'delivered' ? 
                        `<button class="btn btn-warning btn-sm" onclick="showReviewModal(${order.orderId})">
                            Write Review
                        </button>` : ''
                    }
                </div>
            </div>
        </div>
    `).join('');
}

async function loadOrderItems(orderId) {
    const container = document.getElementById(`orderItems-${orderId}`);
    container.innerHTML = '<div class="spinner-border spinner-border-sm text-success"></div> Loading items...';

    try {
        const response = await fetch(`http://localhost:8080/GetOrderItems/${orderId}`);
        if (response.ok) {
            const result = await response.json();
            const items = result.data || [];
            
            container.innerHTML = `
                <div class="row">
                    ${items.map(item => `
                        <div class="col-md-6 mb-2">
                            <div class="d-flex align-items-center">
                                <img src="data:image/jpeg;base64,${btoa(String.fromCharCode(...item.foodItem.image))}" 
                                     class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <h6 class="mb-0">${item.foodItem.name}</h6>
                                    <small class="text-muted">Qty: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-outline-secondary btn-sm mt-2" onclick="hideOrderItems(${orderId})">
                    Hide Items
                </button>
            `;
        }
    } catch (error) {
        container.innerHTML = '<small class="text-danger">Failed to load items</small>';
    }
}

function hideOrderItems(orderId) {
    const container = document.getElementById(`orderItems-${orderId}`);
    container.innerHTML = `
        <button class="btn btn-outline-success btn-sm" onclick="loadOrderItems(${orderId})">
            View Items
        </button>
    `;
}

async function reorderItems(orderId) {
    try {
        const response = await fetch(`http://localhost:8080/ReorderItems/${orderId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Items added to cart successfully!');
            window.location.href = './Cart.html';
        } else {
            alert('Failed to reorder items. Please try again.');
        }
    } catch (error) {
        console.error('Error reordering items:', error);
        alert('Error reordering items. Please try again.');
    }
}

function downloadInvoice(orderId) {
    // Implementation for downloading invoice
    window.open(`http://localhost:8080/DownloadInvoice/${orderId}`, '_blank');
}

function showReviewModal(orderId) {
    // Implementation for review modal
    alert(`Review modal for order ${orderId} - To be implemented`);
}

function getStatusColor(status) {
    switch(status?.toLowerCase()) {
        case 'pending': return 'warning';
        case 'confirmed': return 'info';
        case 'processing': return 'primary';
        case 'shipped': return 'info';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('userData');
    window.location.href = './Home.html';
}