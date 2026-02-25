// document.addEventListener('DOMContentLoaded', function() {
//     checkUserAuth();
//     loadUserData();
//     loadOrderSummary();
    
//     document.getElementById('paymentForm').addEventListener('submit', processPayment);
// });

// function checkUserAuth() {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//         window.location.href = './UserLogin.html';
//         return;
//     }
// }

// // function loadUserData() {
// //     const userData = JSON.parse(localStorage.getItem('userData'));
// //     if (userData) {
// //         document.getElementById('userInitials').textContent = userData.fullName.charAt(0).toUpperCase();
// //     }
// // }


// async function loadUserDetailsFromCart() {
//     const userData = JSON.parse(localStorage.getItem('userData'));
//     if (!userData) return;

//     try {
//         const res = await fetch(
//             `http://localhost:8080/FindUserById?userId=${userData.userId}`
//         );

//         if (!res.ok) throw new Error("Cart fetch failed");

//         const result = await res.json();

//         // ✅ CORRECT PATH
//         const user = result.data.user;

//         document.getElementById('userName').textContent = user.fullName;
//         document.getElementById('userPhone').textContent = user.phone;
//         document.getElementById('userAddress').textContent = user.address;

//     } catch (err) {
//         console.error("User/cart fetch error:", err);
//     }
// }







// function loadOrderSummary() {
//     const orderData = JSON.parse(localStorage.getItem('orderData'));
//     if (!orderData) {
//         window.location.href = './Cart.html';
//         return;
//     }
    
//     document.getElementById('orderSummary').innerHTML = `
//         <div class="card">
//             <div class="card-header bg-success text-white">
//                 <h5>Order Summary</h5>
//             </div>
//             <div class="card-body">
//                 <div class="d-flex justify-content-between mb-2">
//                     <span>Subtotal:</span>
//                     <span>₹${orderData.subtotal}</span>
//                 </div>
//                 <div class="d-flex justify-content-between mb-2">
//                     <span>Delivery:</span>
//                     <span>₹${orderData.delivery}</span>
//                 </div>
//                 <hr>
//                 <div class="d-flex justify-content-between">
//                     <strong>Total:</strong>
//                     <strong>₹${orderData.total}</strong>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// async function processPayment(event) {
//     event.preventDefault();
    
//     const userData = JSON.parse(localStorage.getItem('userData'));
//     const orderData = JSON.parse(localStorage.getItem('orderData'));
//     const paymentMode = document.querySelector('input[name="paymentMode"]:checked').value;
    
//     try {
//         const response = await fetch('http://localhost:8080/CreateOrder', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 userId: userData.userId,
//                 totalAmount: orderData.total,
//                 paymentMode: paymentMode
//             })
//         });

//         if (response.ok) {
//             const result = await response.json();
//             localStorage.removeItem('orderData');
//             alert('Order placed successfully!');
//             window.location.href = './OrderHistory.html';
//         } else {
//             alert('Failed to place order. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error placing order:', error);
//         alert('Error placing order. Please try again.');
//     }
// }

// function logout() {
//     localStorage.removeItem('userData');
//     localStorage.removeItem('orderData');
//     window.location.href = './Home.html';
// }





document.addEventListener('DOMContentLoaded', () => {
    checkUserAuth();
    loadUserInitials();
    loadUserDetailsFromCart();   // ✅ IMPORTANT
    loadOrderSummary();

    document
        .getElementById('paymentForm')
        .addEventListener('submit', processPayment);
});

/* ================= AUTH ================= */
function checkUserAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = './UserLogin.html';
    }
}

/* ================= USER INITIAL ================= */
function loadUserInitials() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userInitials').textContent =
            userData.fullName.charAt(0).toUpperCase();
    }
}

/* ================= FETCH USER FROM CART ================= */
async function loadUserDetailsFromCart() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const res = await fetch(
            `http://localhost:8080/FindUserCartByUserId?userId=${userData.userId}`
        );

        const result = await res.json();
        console.log("CART RESPONSE:", result); // keep for debug

        // ✅ THIS IS THE FIX
        const user = result.data.user;

        document.getElementById('userName').innerText = user.fullName;
        document.getElementById('userPhone').innerText = user.phone;
        document.getElementById('userAddress').innerText = user.address;

    } catch (err) {
        console.error("User load failed:", err);
    }
}


/* ================= ORDER SUMMARY ================= */
function loadOrderSummary() {
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    if (!orderData) {
        window.location.href = './Cart.html';
        return;
    }

    document.getElementById('orderSummary').innerHTML = `
        <div class="card">
            <div class="card-header bg-success text-white">
                <h5>Order Summary</h5>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹${orderData.subtotal}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Delivery:</span>
                    <span>₹${orderData.delivery}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>₹${orderData.total}</strong>
                </div>
            </div>
        </div>
    `;
}

/* ================= PAYMENT ================= */
async function processPayment(event) {
    event.preventDefault();

    const userData = JSON.parse(localStorage.getItem('userData'));
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    const paymentMode =
        document.querySelector('input[name="paymentMode"]:checked').value;

    try {
        const response = await fetch('http://localhost:8080/CreateOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userData.userId,
                totalAmount: orderData.total,
                paymentMode
            })
        });

        if (response.ok) {
            localStorage.removeItem('orderData');
            alert('Order placed successfully!');
            window.location.href = './OrderHistory.html';
        } else {
            alert('Failed to place order');
        }
    } catch (error) {
        console.error(error);
        alert('Error placing order');
    }
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = './Home.html';
}
