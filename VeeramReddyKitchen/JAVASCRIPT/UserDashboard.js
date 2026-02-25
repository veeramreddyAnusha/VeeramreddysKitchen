document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadUserData();
    loadDashboardStats();
    loadRecentOrders();
});

function checkUserAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = './UserLogin.html';
        return;
    }
    
    const user = JSON.parse(userData);
    document.getElementById('userInitials').textContent = user.fullName.charAt(0).toUpperCase();
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userInitials').textContent = userData.fullName.charAt(0).toUpperCase();
    }
}

async function loadDashboardStats() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        // Load total orders
        const ordersResponse = await fetch(`http://localhost:8080/GetUserOrders/${userData.userId}`);
        if (ordersResponse.ok) {
            const orders = await ordersResponse.json();
            document.getElementById('totalOrders').textContent = orders.data?.length || 0;
            
            // Calculate total spent
            const totalSpent = orders.data?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
            document.getElementById('totalSpent').textContent = `₹${totalSpent}`;
        }

        // Load cart items count
        const cartResponse = await fetch(`http://localhost:8080/GetUserCart/${userData.userId}`);
        if (cartResponse.ok) {
            const cart = await cartResponse.json();
            const itemCount = cart.data?.items?.length || 0;
            document.getElementById('cartItems').textContent = itemCount;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentOrders() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const response = await fetch(`http://localhost:8080/GetUserOrders/${userData.userId}`);
        if (response.ok) {
            const result = await response.json();
            const orders = result.data || [];
            displayRecentOrders(orders.slice(0, 5)); // Show only recent 5 orders
        }
    } catch (error) {
        console.error('Error loading recent orders:', error);
        document.getElementById('recentOrders').innerHTML = '<p class="text-muted">No recent orders found.</p>';
    }
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-muted">No orders found.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between">
                <div>
                    <strong>Order #${order.orderId}</strong>
                    <br>
                    <small class="text-muted">${new Date(order.orderTime).toLocaleDateString()}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                    <br>
                    <strong>₹${order.totalAmount}</strong>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    switch(status?.toLowerCase()) {
        case 'pending': return 'warning';
        case 'confirmed': return 'info';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function logout() {
    localStorage.removeItem('userData');
    window.location.href = './Home.html';
}