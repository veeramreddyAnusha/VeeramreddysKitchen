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

    if (!userData || !userData.userId) {
        alert("User not found");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/deleteUser?userId=${userData.userId}`,
            { method: "DELETE" }
        );

        const result = await response.json();

        console.log("Delete Response:", result);

        // ✅ Check backend custom status
        if (result.status === 302) {

            localStorage.removeItem("userData");

            alert("Account deleted successfully");

            window.location.href = "./Home.html";

        } else {
            alert(result.message || "Delete failed");
        }

    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error while deleting");
    }
}