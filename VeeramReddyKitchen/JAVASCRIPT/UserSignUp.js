function generateUserId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VRK${timestamp}${random}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const userIdField = document.getElementById('userId');
    if (userIdField) {
        userIdField.value = generateUserId();
    }
});

function togglePassword() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('bxs-show');
        eyeIcon.classList.add('bxs-hide');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('bxs-hide');
        eyeIcon.classList.add('bxs-show');
    }
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const phoneError = document.getElementById('phoneError');
    const signupError = document.getElementById('signupError');
    
    phoneError.style.display = 'none';
    signupError.style.display = 'none';
    
    if (phone && phone.length !== 10) {
        phoneError.style.display = 'block';
        return;
    }
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: phone ? parseInt(phone) : null,
        address: document.getElementById('address').value || null,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('http://localhost:8080/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
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
        console.error('Error:', error);
        signupError.textContent = 'Network error. Please try again.';
        signupError.style.display = 'block';
    }
});
