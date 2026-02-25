document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadAdminProfile();
});

function checkAdminAuth() {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
        window.location.href = './AdminLogin.html';
        return;
    }
}

function loadAdminProfile() {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    if (adminData) {
        document.getElementById('adminInitials').textContent = adminData.name.charAt(0).toUpperCase();
        document.getElementById('displayName').textContent = adminData.name || '';
        document.getElementById('displayEmail').textContent = adminData.email || '';
        document.getElementById('displayPhone').textContent = adminData.phone || 'Not provided';
        document.getElementById('displayAddress').textContent = adminData.address || 'Not provided';
        
        document.getElementById('editName').value = adminData.name || '';
        document.getElementById('editEmail').value = adminData.email || '';
        document.getElementById('editPhone').value = adminData.phone || '';
        document.getElementById('editAddress').value = adminData.address || '';
    }
}

function enableEdit(field) {
    const display = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const row = display.closest('.row');
    
    display.style.display = 'none';
    input.style.display = 'block';
    
    row.querySelector('.bx-edit').style.display = 'none';
    row.querySelector('.bx-check').style.display = 'inline';
    row.querySelector('.bx-x').style.display = 'inline';
}

function cancelEdit(field) {
    const display = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const row = display.closest('.row');
    
    display.style.display = 'inline';
    input.style.display = 'none';
    
    row.querySelector('.bx-edit').style.display = 'inline';
    row.querySelector('.bx-check').style.display = 'none';
    row.querySelector('.bx-x').style.display = 'none';
    
    loadAdminProfile();
}

async function saveEdit(field) {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const newValue = input.value;
    
    if (!newValue && field !== 'address' && field !== 'phone') {
        alert('Field cannot be empty');
        return;
    }
    
    const updateData = {
        adminId: adminData.adminId,
        name: field === 'name' ? newValue : adminData.name,
        email: field === 'email' ? newValue : adminData.email,
        phone: field === 'phone' ? (newValue ? parseInt(newValue) : null) : adminData.phone,
        address: field === 'address' ? newValue : adminData.address
    };
    
    try {
        const response = await fetch('http://localhost:8080/AdminUpdate', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok || response.status === 302) {
            adminData[field] = field === 'phone' ? (newValue ? parseInt(newValue) : null) : newValue;
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            const display = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
            display.textContent = newValue || 'Not provided';
            
            cancelEdit(field);
            alert('Updated successfully!');
        } else {
            alert('Failed to update');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating profile');
    }
}

function logout() {
    localStorage.removeItem('adminData');
    window.location.href = './Home.html';
}

async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your admin account? This action cannot be undone!')) return;
    
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    
    try {
        const response = await fetch(`http://localhost:8080/deleteAdmin?adminId=${adminData.adminId}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 302) {
            alert('Account deleted successfully!');
            localStorage.removeItem('adminData');
            window.location.href = './Home.html';
        } else {
            alert('Failed to delete account');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting account');
    }
}
