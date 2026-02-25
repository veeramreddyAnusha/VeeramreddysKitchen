document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadAdminData();
    loadDashboardStats();
    showSection('foodManagement');
});

function checkAdminAuth() {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
        window.location.href = './AdminLogin.html';
        return;
    }
    
    const admin = JSON.parse(adminData);
    document.getElementById('adminInitials').textContent = admin.name.charAt(0).toUpperCase();
}

function loadAdminData() {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    if (adminData) {
        document.getElementById('adminInitials').textContent = adminData.name.charAt(0).toUpperCase();
    }
}

async function loadDashboardStats() {
    try {
        // Load food items count
        const foodResponse = await fetch('http://localhost:8080/FindAllFooditems');
        if (foodResponse.ok) {
            const foodData = await foodResponse.json();
            document.getElementById('totalFoodItems').textContent = foodData.data?.length || 0;
        }

        // Load orders count and revenue
        const ordersResponse = await fetch('http://localhost:8080/GetAllOrders');
        if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            const orders = ordersData.data || [];
            document.getElementById('totalOrders').textContent = orders.length;
            
            const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            document.getElementById('totalRevenue').textContent = `₹${revenue}`;
        }

        // Load users count
        const usersResponse = await fetch('http://localhost:8080/GetAllUsers');
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            document.getElementById('totalUsers').textContent = usersData.data?.length || 0;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.management-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName).style.display = 'block';
    
    // Load section data
    switch(sectionName) {
        case 'foodManagement':
            loadFoodItems();
            break;
        case 'categoryManagement':
            loadCategories();
            break;
        case 'orderManagement':
            loadOrders();
            break;
        case 'userManagement':
            loadUsers();
            break;
    }
}

async function loadFoodItems() {
    try {
        const response = await fetch('http://localhost:8080/FindAllFooditems');
        const data = await response.json();
        const foodItems = data.data || [];
        
        const container = document.getElementById('foodItemsList');
        container.innerHTML = foodItems.map(item => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="data:image/jpeg;base64,${btoa(String.fromCharCode(...item.image))}" 
                                 class="img-fluid rounded" style="height: 60px; width: 60px; object-fit: cover;">
                        </div>
                        <div class="col-md-6">
                            <h6>${item.name}</h6>
                            <small class="text-muted">${item.quantity} - ₹${item.price}</small>
                        </div>
                        <div class="col-md-4 text-end">
                            <button class="btn btn-warning btn-sm me-2" onclick="editFoodItem(${item.foodId})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteFoodItem(${item.foodId})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading food items:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8080/GetAllCategories');
        const data = await response.json();
        const categories = data.data || [];
        
        const container = document.getElementById('categoriesList');
        container.innerHTML = categories.map(category => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6>${category.categoryName}</h6>
                        <div>
                            <button class="btn btn-warning btn-sm me-2" onclick="editCategory(${category.categoryId})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.categoryId})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch('http://localhost:8080/GetAllOrders');
        const data = await response.json();
        const orders = data.data || [];
        
        const container = document.getElementById('ordersList');
        container.innerHTML = orders.map(order => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <strong>Order #${order.orderId}</strong>
                            <br>
                            <small class="text-muted">${new Date(order.orderTime).toLocaleDateString()}</small>
                        </div>
                        <div class="col-md-3">
                            <strong>₹${order.totalAmount}</strong>
                        </div>
                        <div class="col-md-3">
                            <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                        </div>
                        <div class="col-md-3 text-end">
                            <button class="btn btn-info btn-sm" onclick="viewOrderDetails(${order.orderId})">View</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('http://localhost:8080/GetAllUsers');
        const data = await response.json();
        const users = data.data || [];
        
        const container = document.getElementById('usersList');
        container.innerHTML = users.map(user => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <strong>${user.fullName}</strong>
                            <br>
                            <small class="text-muted">${user.email}</small>
                        </div>
                        <div class="col-md-3">
                            <span class="badge bg-${user.isActive ? 'success' : 'danger'}">
                                ${user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">${new Date(user.createdAt).toLocaleDateString()}</small>
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-${user.isActive ? 'warning' : 'success'} btn-sm" 
                                    onclick="toggleUserStatus(${user.userId}, ${user.isActive})">
                                ${user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function showAddFoodModal() {
    // Implementation for add food modal
    alert('Add Food Modal - To be implemented');
}

function showAddCategoryModal() {
    // Implementation for add category modal
    alert('Add Category Modal - To be implemented');
}

function editFoodItem(foodId) {
    alert(`Edit Food Item ${foodId} - To be implemented`);
}

function deleteFoodItem(foodId) {
    if (confirm('Are you sure you want to delete this food item?')) {
        // Implementation for delete food item
        alert(`Delete Food Item ${foodId} - To be implemented`);
    }
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
    localStorage.removeItem('adminData');
    window.location.href = './Home.html';
}