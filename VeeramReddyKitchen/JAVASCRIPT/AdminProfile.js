document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
    loadAdminProfile();
});

function checkAdminAuth() {
    const stored = localStorage.getItem("adminData");
    if (!stored) {
        window.location.href = "./AdminLogin.html";
    }
}

async function loadAdminProfile() {

    const stored = localStorage.getItem("adminData");
    if (!stored) return;

    const adminData = JSON.parse(stored);

    if (!adminData.adminId) return;

    try {

        const response = await fetch(
            `http://localhost:8080/FindAdminById?adminId=${adminData.adminId}`
        );

        const result = await response.json();

        console.log("Backend Response:", result);

        if (result.status === 302 && result.data) {

            const admin = result.data;

            localStorage.setItem("adminData", JSON.stringify(admin));

            document.getElementById("displayName").textContent =
                admin.name || "Not provided";

            document.getElementById("displayEmail").textContent =
                admin.email || "Not provided";

            document.getElementById("displayPhone").textContent =
                admin.phone ?? "Not provided";

            document.getElementById("displayAddress").textContent =
                admin.address || "Not provided";

            document.getElementById("editName").value =
                admin.name || "";

            document.getElementById("editEmail").value =
                admin.email || "";

            document.getElementById("editPhone").value =
                admin.phone || "";

            document.getElementById("editAddress").value =
                admin.address || "";

        } else {
            alert("Admin not found");
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

    const adminData = JSON.parse(localStorage.getItem("adminData"));
    if (!adminData || !adminData.adminId) {
        alert("Admin not found");
        return;
    }

    const input = document.getElementById(`edit${capitalize(field)}`);
    const newValue = input.value.trim();

    const updateData = {
    adminId: adminData.adminId,
    name: field === "name" ? newValue : adminData.name,
    email: field === "email" ? newValue : adminData.email,
    phone: field === "phone"
        ? (newValue === "" ? null : parseInt(newValue))
        : adminData.phone,
    address: field === "address"
        ? newValue
        : adminData.address
  };

    try {

        const response = await fetch("http://localhost:8080/AdminUpdate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)   // ✅ FIXED
        });

        const result = await response.json();

        console.log("Update Response:", result);

        if (result.status === 302) {

            if (result.data) {
                localStorage.setItem("adminData", JSON.stringify(result.data));
            }

            loadAdminProfile();
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

    localStorage.removeItem("adminData");

    window.location.href = "./Home.html";
}

async function deleteAccount() {

    const confirmDelete = confirm("Are you sure you want to delete account?");
    if (!confirmDelete) return;

    const adminData = JSON.parse(localStorage.getItem("adminData"));

    try {

        const response = await fetch(
            `http://localhost:8080/deleteAdmin?adminId=${adminData.adminId}`,
            { method: "DELETE" }
        );

        if (response.ok) {

            localStorage.removeItem("adminData");

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