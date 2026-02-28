// document.addEventListener('DOMContentLoaded', function() {
//     checkUserAuth();
//     loadUserProfile();
// });

// function checkUserAuth() {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//         window.location.href = './UserLogin.html';
//         return;
//     }
// }

// function loadUserProfile() {

//     const userData = JSON.parse(localStorage.getItem("userData"))

//     if (!userData) return;

//     document.getElementById("displayFullName").textContent =
//         userData.fullName || "Not provided";

//     document.getElementById("displayEmail").textContent =
//         userData.email || "Not provided";

//     document.getElementById("displayPhone").textContent =
//         userData.phone || "Not provided";

//     document.getElementById("displayAddress").textContent =
//         userData.address || "Not provided";

//     document.getElementById("editFullName").value =
//         userData.fullName || "";

//     document.getElementById("editEmail").value =
//         userData.email || "";

//     document.getElementById("editPhone").value =
//         userData.phone || "";

//     document.getElementById("editAddress").value =
//         userData.address || "";
// }

// function enableEdit(field) {
//     const display = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
//     const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
//     const row = display.closest('.row');
    
//     display.style.display = 'none';
//     input.style.display = 'block';
    
//     row.querySelector('.bx-edit').style.display = 'none';
//     row.querySelector('.bx-check').style.display = 'inline';
//     row.querySelector('.bx-x').style.display = 'inline';
// }

// function cancelEdit(field) {
//     const display = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
//     const input = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
//     const row = display.closest('.row');
    
//     display.style.display = 'inline';
//     input.style.display = 'none';
    
//     row.querySelector('.bx-edit').style.display = 'inline';
//     row.querySelector('.bx-check').style.display = 'none';
//     row.querySelector('.bx-x').style.display = 'none';
    
//     loadUserProfile();
// }

// async function saveEdit(field) {

//     const userData = JSON.parse(localStorage.getItem('userData'));

//     if (!userData || !userData.userId) {
//         alert("User not found. Please login again.");
//         return;
//     }

//     const inputId = `edit${field.charAt(0).toUpperCase() + field.slice(1)}`;
//     const displayId = `display${field.charAt(0).toUpperCase() + field.slice(1)}`;

//     const input = document.getElementById(inputId);
//     const newValue = input.value.trim();

//     if (!newValue && field !== "address" && field !== "phone") {
//         alert("Field cannot be empty");
//         return;
//     }

//     const updateData = {
//         userId: userData.userId,
//         fullName: field === "fullName" ? newValue : userData.fullName,
//         email: field === "email" ? newValue : userData.email,
//         phone: field === "phone"
//             ? (newValue ? Number(newValue) : null)
//             : userData.phone,
//         address: field === "address"
//             ? newValue
//             : userData.address
//     };

//     try {
//         const response = await fetch("http://localhost:8080/UserUpdate", {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(updateData)
//         });

//         const result = await response.json();

//         console.log("Backend Response:", result); // 🔍 Debug

//         if (response.ok) {

//             const updatedUser = result.data;

//             // 🔥 Important: store only updated user object
//             localStorage.setItem("userData", JSON.stringify(updatedUser));

//             // 🔥 Update display safely
//             const displayElement = document.getElementById(displayId);

//             if (updatedUser[field] !== null && updatedUser[field] !== undefined) {
//                 displayElement.textContent = updatedUser[field];
//             } else {
//                 displayElement.textContent = "Not provided";
//             }

//             cancelEdit(field);

//             alert("Updated successfully!");

//         } else {
//             alert(result.message || "Failed to update user");
//         }

//     } catch (error) {
//         console.error("Update Error:", error);
//         alert("Server error while updating profile.");
//     }
// }



// function logout() {
//     localStorage.removeItem('userData');
//     window.location.href = './Home.html';
// }

// async function deleteAccount() {

//     const confirmDelete = confirm(
//         "Are you sure you want to delete your account? This action cannot be undone!"
//     );

//     if (!confirmDelete) return;

//     const userData = JSON.parse(localStorage.getItem("userData"));

//     if (!userData || !userData.userId) {
//         alert("User not logged in.");
//         return;
//     }

//     try {
//         const response = await fetch(
//             `http://localhost:8080/deleteUser?userId=${userData.userId}`,
//             {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         const data = await response.json();   // ✅ Read JSON

//         if (response.ok) {
//             alert(data.message || "Account deleted successfully!");
//             localStorage.removeItem("userData");
//             window.location.href = "./Home.html";
//         } else {
//             alert(data.message || "Failed to delete account");
//         }

//     } catch (error) {
//         console.error("Delete Error:", error);
//         alert("Server error while deleting account.");
//     }
// }












document.addEventListener("DOMContentLoaded", () => {
    checkUserAuth();
    loadUserProfile();
});

function checkUserAuth() {
    const stored = localStorage.getItem("userData");
    if (!stored) {
        window.location.href = "./UserLogin.html";
    }
}

async function loadUserProfile() {

    const stored = localStorage.getItem("userData");
    if (!stored) return;

    const userData = JSON.parse(stored);
    if (!userData.userId) return;

    try {
        const response = await fetch(
            `http://localhost:8080/FindUserById?userId=${userData.userId}`
        );

        const result = await response.json();

        console.log("Backend Response:", result);

        // 🔥 CHECK YOUR CUSTOM STATUS
        if (result.status === 302 && result.data) {

            const user = result.data;

            localStorage.setItem("userData", JSON.stringify(user));

            document.getElementById("displayFullName").textContent =
                user.fullName || "Not provided";

            document.getElementById("displayEmail").textContent =
                user.email || "Not provided";

            document.getElementById("displayPhone").textContent =
                user.phone ?? "Not provided";

            document.getElementById("displayAddress").textContent =
                user.address || "Not provided";

            document.getElementById("editFullName").value =
                user.fullName || "";

            document.getElementById("editEmail").value =
                user.email || "";

            document.getElementById("editPhone").value =
                user.phone || "";

            document.getElementById("editAddress").value =
                user.address || "";

        } else {
            alert("User not found");
        }

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function enableEdit(field) {
    const display = document.getElementById(`display${capitalize(field)}`);
    const input = document.getElementById(`edit${capitalize(field)}`);
    const row = display.closest(".row");

    display.style.display = "none";
    input.style.display = "block";

    row.querySelector(".bx-edit").style.display = "none";
    row.querySelector(".bx-check").style.display = "inline";
    row.querySelector(".bx-x").style.display = "inline";
}

function cancelEdit(field) {
    const display = document.getElementById(`display${capitalize(field)}`);
    const input = document.getElementById(`edit${capitalize(field)}`);
    const row = display.closest(".row");

    display.style.display = "inline";
    input.style.display = "none";

    row.querySelector(".bx-edit").style.display = "inline";
    row.querySelector(".bx-check").style.display = "none";
    row.querySelector(".bx-x").style.display = "none";
}

async function saveEdit(field) {

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.userId) {
        alert("User not found");
        return;
    }

    const input = document.getElementById(`edit${capitalize(field)}`);
    const newValue = input.value.trim();

    const updateData = {
        userId: userData.userId,
        fullName: field === "fullName" ? newValue : userData.fullName,
        email: field === "email" ? newValue : userData.email,
        phone: field === "phone"
            ? (newValue ? parseInt(newValue) : null)
            : userData.phone,
        address: field === "address"
            ? newValue
            : userData.address
    };

    try {
        const response = await fetch("http://localhost:8080/UserUpdate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok && result.data) {

            // Store updated user
            localStorage.setItem("userData", JSON.stringify(result.data));

            // Reload fresh profile
            loadUserProfile();

            cancelEdit(field);

            alert("Updated successfully!");

        } else {
            alert("Update failed");
        }

    } catch (error) {
        console.error("Update error:", error);
        alert("Server error while updating");
    }
}

function logout() {
    localStorage.removeItem("userData");
    window.location.href = "./Home.html";
}

async function deleteAccount() {

    const confirmDelete = confirm("Are you sure you want to delete account?");
    if (!confirmDelete) return;

    const userData = JSON.parse(localStorage.getItem("userData"));

    try {
        const response = await fetch(
            `http://localhost:8080/deleteUser?userId=${userData.userId}`,
            { method: "DELETE" }
        );

        const result = await response.json();

        if (response.ok) {
            localStorage.removeItem("userData");
            window.location.href = "./Home.html";
        } else {
            alert("Delete failed");
        }

    } catch (error) {
        console.error("Delete error:", error);
    }
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}