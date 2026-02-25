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



document.getElementById('adminSignUpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const phoneError = document.getElementById('phoneError');
    const signupError = document.getElementById('signupError');
    
    phoneError.style.display = 'none';
    signupError.style.display = 'none';
    
    if (!name) {
        alert('Please enter your full name.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    if (phone && phone.length !== 10) {
        phoneError.style.display = 'block';
        return;
    }
    
    const adminData = {
        name: name,
        email: email,
        phone: phone ? parseInt(phone) : null,
        address: document.getElementById('address').value || null,
        password: password
    };
    
    try {
        const response = await fetch('http://localhost:8080/saveAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        
        if (response.ok || response.status === 302 || response.status === 200) {
            window.location.href = './Home.html';
        } else if (response.status === 400 || response.status === 409) {
            signupError.textContent = 'Your email and phone number are already registered';
            signupError.style.display = 'block';
        } else {
            signupError.textContent = 'Your email and phone number are already registered';
            signupError.style.display = 'block';
        }
    } catch (error) {
        console.error('Network Error:', error);
        signupError.textContent = 'Network error. Please try again.';
        signupError.style.display = 'block';
    }
});
