function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

// --- Forgot Password ---
function fpShowMsg(msg, isError) {
    const el = document.getElementById('fp-msg');
    el.textContent = msg;
    el.style.color = isError ? 'red' : 'green';
    el.style.display = 'block';
}

async function fpSendOtp() {
    const email = document.getElementById('fp-email').value.trim();
    if (!validateEmail(email)) { fpShowMsg('Enter a valid email.', true); return; }
    try {
        const res = await fetch(`http://localhost:8080/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' });
        const text = await res.text();
        if (res.ok) {
            fpShowMsg('OTP sent to your email.', false);
            document.getElementById('fp-step1').style.display = 'none';
            document.getElementById('fp-step2').style.display = 'block';
        } else {
            fpShowMsg(text || 'Email not found.', true);
        }
    } catch { fpShowMsg('Server error. Try again.', true); }
}

async function fpVerifyOtp() {
    const email = document.getElementById('fp-email').value.trim();
    const otp = document.getElementById('fp-otp').value.trim();
    if (!otp) { fpShowMsg('Enter the OTP.', true); return; }
    try {
        const res = await fetch(`http://localhost:8080/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: 'POST' });
        const text = await res.text();
        if (res.ok && text === 'OTP verified') {
            fpShowMsg('OTP verified.', false);
            document.getElementById('fp-step2').style.display = 'none';
            document.getElementById('fp-step3').style.display = 'block';
        } else {
            fpShowMsg('Invalid OTP. Try again.', true);
        }
    } catch { fpShowMsg('Server error. Try again.', true); }
}

async function fpResetPassword() {
    const email = document.getElementById('fp-email').value.trim();
    const newPass = document.getElementById('fp-newpass').value;
    const confirmPass = document.getElementById('fp-confirmpass').value;
    if (newPass.length < 6) { fpShowMsg('Password must be at least 6 characters.', true); return; }
    if (newPass !== confirmPass) { fpShowMsg('Passwords do not match.', true); return; }
    try {
        const res = await fetch(`http://localhost:8080/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPass)}`, { method: 'POST' });
        const text = await res.text();
        if (res.ok) {
            fpShowMsg('Password reset successful! You can now login.', false);
            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
                document.getElementById('fp-step1').style.display = 'block';
                document.getElementById('fp-step3').style.display = 'none';
                document.getElementById('fp-email').value = '';
                document.getElementById('fp-otp').value = '';
                document.getElementById('fp-newpass').value = '';
                document.getElementById('fp-confirmpass').value = '';
                document.getElementById('fp-msg').style.display = 'none';
            }, 2000);
        } else {
            fpShowMsg(text || 'Reset failed. Try again.', true);
        }
    } catch { fpShowMsg('Server error. Try again.', true); }
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