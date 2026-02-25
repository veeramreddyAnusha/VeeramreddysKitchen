document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadUserProfile();
});

function checkUserAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = './UserLogin.html';
        return;
    }
}

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userInitials').textContent = userData.fullName.charAt(0).toUpperCase();
        document.getElementById('displayFullName').textContent = userData.fullName || '';
        document.getElementById('displayEmail').textContent = userData.email || '';
        document.getElementById('displayPhone').textContent = userData.phone || 'Not provided';
        document.getElementById('displayAddress').textContent = userData.address || 'Not provided';
        
        document.getElementById('editFullName').value = userData.fullName || '';
        document.getElementById('editEmail').value = userData.email || '';
        document.getElementById('editPhone').value = userData.phone || '';
        document.getElementById('editAddress').value = userData.address || '';
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
    
    loadUserProfile();
}

async function saveEdit(field) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
    const newValue = input.value;
    
    if (!newValue && field !== 'address' && field !== 'phone') {
        alert('Field cannot be empty');
        return;
    }
    
    const updateData = {
        userId: userData.userId,
        fullName: field === 'fullName' ? newValue : userData.fullName,
        email: field === 'email' ? newValue : userData.email,
        phone: field === 'phone' ? (newValue ? parseInt(newValue) : null) : userData.phone,
        address: field === 'address' ? newValue : userData.address
    };
    
    try {
        const response = await fetch('http://localhost:8080/UserUpdate', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok || response.status === 302) {
            userData[field] = field === 'phone' ? (newValue ? parseInt(newValue) : null) : newValue;
            localStorage.setItem('userData', JSON.stringify(userData));
            
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
    localStorage.removeItem('userData');
    window.location.href = './Home.html';
}

async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone!')) return;
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    try {
        const response = await fetch(`http://localhost:8080/deleteUser?userId=${userData.userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 302) {
            alert('Account deleted successfully!');
            localStorage.removeItem('userData');
            window.location.href = './Home.html';
        } else {
            alert('Failed to delete account');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting account');
    }
}
