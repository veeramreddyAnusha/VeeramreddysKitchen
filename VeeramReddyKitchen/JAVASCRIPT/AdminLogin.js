function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('bx-hide');
        eyeIcon.classList.add('bx-show');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('bx-show');
        eyeIcon.classList.add('bx-hide');
    }
}

const ADMIN_SECRET = "VKNPAREDDY";

function verifyAdminSecret() {
    const input = document.getElementById("adminSecretInput").value;
    const error = document.getElementById("adminGateError");

    if (input === ADMIN_SECRET) {
        document.getElementById("adminGate").style.display = "none";
        document.querySelector(".admin-content").style.display = "block";
    } else {
        error.style.display = "block";
    }
}



document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/AdminLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok || response.status === 302) {
            const result = await response.json();
            
            if (result.status === 302 && result.data) {
                // Clear user data if exists
                localStorage.removeItem('userData');
                
                localStorage.setItem('adminData', JSON.stringify({
                    adminId: result.data.adminId,
                    email: result.data.email,
                    name: result.data.name
                }));
                
                alert('Admin login successful!');
                window.location.href = './FoodItem.html';
            } else {
                alert('Invalid email or password.');
            }
        } else {
            alert('Invalid email or password.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Network error. Please check if the server is running.');
    }
});