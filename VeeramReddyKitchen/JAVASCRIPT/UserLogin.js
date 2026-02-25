// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation function
function validatePassword(password) {
    return password.length >= 6;
}

// Toggle password visibility
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

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Client-side validation
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/UserLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok || response.status === 302) {
            const result = await response.json();
            console.log('Login response:', result);
            
            // Check if login was successful (status 302 means success in your backend)
            if (result.status === 302 && result.data) {
                // Clear admin data if exists
                localStorage.removeItem('adminData');
                
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify({
                    userId: result.data.userId,
                    email: result.data.email,
                    fullName: result.data.fullName
                }));
                
                alert('Login successful!');
                window.location.href = './FoodItem.html';
            } else {
                alert('Invalid email or password. Please check your credentials.');
            }
        } else {
            const errorText = await response.text();
            console.log('Login error:', errorText);
            alert('Invalid email or password. Please check your credentials.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Network error. Please check if the server is running.');
    }
});

// after successful login
localStorage.setItem("userData", JSON.stringify({
    userId: result.data.userId,
    fullName: result.data.fullName,
    phone: result.data.phone,
    address: result.data.address
}));
