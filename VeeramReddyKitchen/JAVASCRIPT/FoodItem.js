// Food items data
let foodItems = [];
let isAdmin = false;
let currentUser = null;



// Check if admin is logged in
function checkAdminStatus() {
    const adminData = localStorage.getItem('adminData');
    const userData = localStorage.getItem('userData');
    
    if (adminData) {
        isAdmin = true;
        currentUser = JSON.parse(adminData);
        updateUserDisplay(currentUser.name || currentUser.email, true);
    } else if (userData) {
        isAdmin = false;
        currentUser = JSON.parse(userData);
        updateUserDisplay(currentUser.fullName || currentUser.email, false);
        // Show floating cart for users only - don't load count yet
        document.getElementById('floatingCart').style.display = 'block';
        document.getElementById('cartCount').textContent = '0';
    } else {
        // Not logged in, redirect to login
        window.location.href = './UserLogin.html';
    }
}

function updateUserDisplay(name, isAdminUser) {
    const initial = name.charAt(0).toUpperCase();
    const userInitialElement = document.getElementById('userInitial');
    const userNameElement = document.getElementById('userName');
    
    if (userInitialElement && userNameElement) {
        userInitialElement.textContent = initial;
        userNameElement.textContent = name;
    }
}

function editProfile() {
    if (isAdmin) {
        window.location.href = './AdminProfile.html';
    } else {
        window.location.href = './UserProfile.html';
    }
}

async function deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    
    try {
        if (isAdmin) {
            const response = await fetch(`http://localhost:8080/deleteAdmin?adminId=${currentUser.adminId}`, {
                method: 'DELETE'
            });
            if (response.ok || response.status === 302) {
                alert('Profile deleted successfully!');
                logout();
            } else {
                alert('Failed to delete profile');
            }
        } else {
            const response = await fetch(`http://localhost:8080/deleteUser?userId=${currentUser.userId}`, {
                method: 'DELETE'
            });
            if (response.ok || response.status === 302) {
                alert('Profile deleted successfully!');
                logout();
            } else {
                alert('Failed to delete profile');
            }
        }
    } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Error deleting profile');
    }
}

function logout() {
    localStorage.removeItem('adminData');
    localStorage.removeItem('userData');
    window.location.href = './Home.html';
}

// Load food items from backend
async function loadFoodItems() {
    try {
        const response = await fetch('http://localhost:8080/FindAllFooditems');
        console.log('Response status:', response.status);
        if (response.ok || response.status === 302) {
            const result = await response.json();
            console.log('Backend response:', result);
            foodItems = result.data || result;
            console.log('Food items:', foodItems);
            displayFoodItems();
        } else {
            throw new Error('Failed to fetch');
        }
    } catch (error) {
        console.error('Error loading food items:', error);
        foodItems = [];
        displayFoodItems();
    } finally {
        hideLoading();
    }
}

// Display food items
function displayFoodItems() {
    const container = document.getElementById('foodItemsContainer');
    
    let html = '';
    
    // Add "Add New" card if admin
    if (isAdmin) {
        html += `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card food-item-card h-100 border-success" style="border: 2px dashed #198754;">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
                        <i class="bx bx-plus" style="font-size: 3rem; color: #198754;"></i>
                        <h5 class="text-success mt-2">Add New Food Item</h5>
                        <button class="btn btn-success mt-3" onclick="showAddForm()">
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (foodItems.length === 0) {
        container.innerHTML = html + '<div class="col-12 text-center"><p>No food items available</p></div>';
        return;
    }
    
    html += foodItems.map(item => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card food-item-card h-100">
                <img src="${getImageSrc(item)}" 
                     class="food-item-image" 
                     alt="${item.name}"
                     onerror="this.src='../IMAGES/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="food-item-name">${item.name}</h5>
                    <p class="food-item-quantity">${item.quantity}</p>
                    <p class="food-item-price mt-auto">₹${item.price}</p>
                    ${isAdmin ? `
                        <div class="btn-group mt-2" role="group">
                            <button class="btn btn-warning btn-sm" onclick="editItem(${item.foodId})">
                                Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.foodId})">
                                Delete
                            </button>
                        </div>
                    ` : `
                        <div class="mt-2" id="cartControl-${item.foodId}">
                            <button class="btn btn-success btn-sm w-100" onclick="showQuantityControls(${item.foodId})">
                                Add to Cart
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Get image source for display
function getImageSrc(item) {
    if (item.image) {
        // If image is already a base64 string (from simulation)
        if (typeof item.image === 'string') {
            return `data:image/jpeg;base64,${item.image}`;
        }
        // If image is byte array (from backend)
        if (item.image.length > 0) {
            return `data:image/jpeg;base64,${btoa(String.fromCharCode(...item.image))}`;
        }
    }
    return '../IMAGES/placeholder.jpg';
}

function showQuantityControls(foodId) {
    const controlDiv = document.getElementById(`cartControl-${foodId}`);
    controlDiv.innerHTML = `
        <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-outline-success btn-sm" onclick="decrementQuantity(${foodId})">
                <i class='bx bx-minus'></i>
            </button>
            <span class="mx-3 fw-bold" id="quantity-${foodId}">1</span>
            <button class="btn btn-outline-success btn-sm" onclick="incrementQuantity(${foodId})">
                <i class='bx bx-plus'></i>
            </button>
        </div>
    `;
    // Update count immediately
    incrementCartCount();
    // Add to cart in background
    addToCart(foodId, 1);
}

function incrementQuantity(foodId) {
    const quantityElement = document.getElementById(`quantity-${foodId}`);
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    // Update count immediately
    incrementCartCount();
    // Add to cart in background
    addToCart(foodId, quantity);
}

function decrementQuantity(foodId) {
    const quantityElement = document.getElementById(`quantity-${foodId}`);
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
        // Update count immediately
        decrementCartCount();
        // Update cart in background
        addToCart(foodId, quantity);
    } else {
        // Update count immediately
        decrementCartCount();
        // Remove from cart and show Add to Cart button again
        removeFromCart(foodId);
        const controlDiv = document.getElementById(`cartControl-${foodId}`);
        controlDiv.innerHTML = `
            <button class="btn btn-success btn-sm w-100" onclick="showQuantityControls(${foodId})">
                Add to Cart
            </button>
        `;
    }
}

// Add item to cart
async function addToCart(foodId, quantity) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        alert('Please login to add items to cart');
        window.location.href = './UserLogin.html';
        return;
    }

    try {
        // First create cart if doesn't exist
        await fetch(`http://localhost:8080/save/${userData.userId}`, {
            method: 'POST'
        });
        
        // Get cart to get cartId
        const cartResponse = await fetch(`http://localhost:8080/fetch/${userData.userId}`);
        if (!cartResponse.ok) {
            console.error('Failed to get cart');
            return Promise.reject('Failed to get cart');
        }
        
        const cartData = await cartResponse.json();
        if (!cartData.data || !cartData.data.cartId) {
            console.error('Cart data invalid:', cartData);
            return Promise.reject('Invalid cart data');
        }
        
        const cartId = cartData.data.cartId;
        
        // Add item to cart
        await fetch(`http://localhost:8080/add?cartId=${cartId}&foodId=${foodId}&quantity=${quantity}`, {
            method: 'POST'
        });
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error adding to cart:', error);
        return Promise.reject(error);
    }
}

async function removeFromCart(foodId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return Promise.resolve();

    try {
        const cartResponse = await fetch(`http://localhost:8080/fetch/${userData.userId}`);
        const cartData = await cartResponse.json();
        
        if (cartData.data && cartData.data.cartItems) {
            const cartItem = cartData.data.cartItems.find(item => item.foodItem.foodId === foodId);
            if (cartItem) {
                await fetch(`http://localhost:8080/deleteCartItem/${cartItem.cartItemId}`, {
                    method: 'DELETE'
                });
            }
        }
        return Promise.resolve();
    } catch (error) {
        console.error('Error removing from cart:', error);
        return Promise.reject(error);
    }
}


/* =========================
   ADD ITEM
========================= */


function showAddForm() {
    // Load categories first
    loadCategories().then(categories => {
        const categoryOptions = categories.map(cat => 
            `<option value="${cat.categoryId}">${cat.categoryName}</option>`
        ).join('');
        
        const modal = `
            <div class="modal fade" id="addItemModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Food Item</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addItemForm">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" id="itemName" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Price (₹)</label>
                                    <input type="number" step="1" min="0" class="form-control" id="itemPrice" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Quantity</label>
                                    <input type="text" class="form-control" id="itemQuantity" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Category</label>
                                    <select class="form-control" id="itemCategory" required>
                                        <option value="">Select Category</option>
                                        ${categoryOptions}
                                    </select>
                                </div>
                                <div class="mb-3">
                        <label class="form-label">Change Image</label>
                        <input type="file"
                               id="editItemImage"
                               class="form-control"
                               accept="image/*">
                    </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success" onclick="addNewItem()">Add Item</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        new bootstrap.Modal(document.getElementById('addItemModal')).show();
    });
}

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8080/FindAllCategoryies');
        if (response.ok || response.status === 302) {
            const result = await response.json();
            console.log('Categories response:', result);
            const categories = result.data || result || [];
            console.log('Categories loaded:', categories);
            return categories;
        } else {
            console.error('Failed to load categories, status:', response.status);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
    return [];
}

async function addNewItem() {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const quantity = document.getElementById('itemQuantity').value;
    const categoryId = document.getElementById('itemCategory').value;
  const imageInput = document.getElementById('editItemImage');
const imageFile = imageInput ? imageInput.files[0] : null;

    const adminData = JSON.parse(localStorage.getItem('adminData'));
    
    if (!imageFile) {
        alert('Please select an image');
        return;
    }
    
    if (!categoryId) {
        alert('Please select a category');
        return;
    }
    
    if (!adminData || !adminData.adminId) {
        alert('Admin not logged in properly');
        return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('quantity', quantity);
    formData.append('price', parseFloat(price));
    formData.append('image', imageFile);
    formData.append('adminId', adminData.adminId); // Use logged-in admin's ID
    formData.append('categoryId', categoryId); // Use selected category
    
    try {
        const response = await fetch('http://localhost:8080/saveFoodItem', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Item added successfully!');
            loadFoodItems();
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            alert('Failed to add item: Server error');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Network error. Please check if server is running.');
    }
    
    bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}



/* =========================
   EDIT FOOD ITEM
========================= */
async function editItem(foodId) {
    const item = foodItems.find(f => f.foodId === foodId);
    if (!item) return;

    const catRes = await fetch("http://localhost:8080/FindAllCategoryies");
    const catJson = await catRes.json();
    const categories = catJson.data || [];

    const categoryOptions = categories.map(cat =>
        `<option value="${cat.categoryId}"
            ${cat.categoryId === (item.category?.categoryId || item.categoryId) ? "selected" : ""}>
            ${cat.categoryName}
        </option>`
    ).join("");

    document.getElementById("editItemModal")?.remove();

    const modalHtml = `
    <div class="modal fade" id="editItemModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Edit Food Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input id="editItemName" class="form-control"
                               value="${item.name}" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Price (₹)</label>
                        <input id="editItemPrice" type="number"
                               class="form-control"
                               value="${item.price}" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Quantity</label>
                        <input id="editItemQty" class="form-control"
                               value="${item.quantity}" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Category</label>
                        <select id="editItemCategory" class="form-select">
                            ${categoryOptions}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Change Image</label>
                        <input type="file"
                               id="editItemImage"
                               class="form-control"
                               accept="image/*">
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary"
                            data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-success"
                            onclick="updateItem(${foodId})">
                        Update
                    </button>
                </div>

            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    new bootstrap.Modal(document.getElementById("editItemModal")).show();
}


/* =========================
   UPDATE FOOD ITEM
========================= */
async function updateItem(foodId) {

    const formData = new FormData();

    formData.append("foodId", foodId);
    formData.append(
        "name",
        document.getElementById("editItemName").value.trim()
    );
    formData.append(
        "price",
        document.getElementById("editItemPrice").value
    );
    formData.append(
        "quantity",
        document.getElementById("editItemQty").value.trim()
    );
    formData.append(
        "categoryId",
        document.getElementById("editItemCategory").value
    );

    const imageInput = document.getElementById("editItemImage");
    if (imageInput && imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    try {
        const res = await fetch("http://localhost:8080/FoodItemUpdate", {
            method: "PUT",
            body: formData   // ✅ DO NOT set headers
        });

        if (!res.ok) {
            throw new Error("Update failed with status " + res.status);
        }

        alert("Food item updated successfully");

        bootstrap.Modal
            .getInstance(document.getElementById("editItemModal"))
            .hide();

        loadFoodItems();

    } catch (error) {
        console.error("Update error:", error);
        alert("Error updating food item");
    }
}






/* =========================
  DELETE FOOD ITEM
========================= */


async function deleteItem(foodId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        const response = await fetch(`http://localhost:8080/deleteFoodItem?foodId=${foodId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Item deleted successfully!');
            loadFoodItems();
        } else {
            alert('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
    }
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function incrementCartCount() {
    const cartCount = document.getElementById('cartCount');
    let count = parseInt(cartCount.textContent);
    count++;
    cartCount.textContent = count;
}

function decrementCartCount() {
    const cartCount = document.getElementById('cartCount');
    let count = parseInt(cartCount.textContent);
    if (count > 0) {
        count--;
        cartCount.textContent = count;
    }
}

async function updateCartCount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    try {
        const cartResponse = await fetch(`http://localhost:8080/fetch/${userData.userId}`);
        if (!cartResponse.ok) {
            document.getElementById('floatingCart').style.display = 'block';
            document.getElementById('cartCount').textContent = '0';
            return;
        }
        
        const cartData = await cartResponse.json();
        
        const floatingCart = document.getElementById('floatingCart');
        const cartCount = document.getElementById('cartCount');
        
        if (cartData.data && cartData.data.cartItems && cartData.data.cartItems.length > 0) {
            const totalItems = cartData.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            floatingCart.style.display = 'block';
        } else {
            cartCount.textContent = '0';
            floatingCart.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
        document.getElementById('floatingCart').style.display = 'block';
        document.getElementById('cartCount').textContent = '0';
    }
}










const BASE_URL = "http://localhost:8080";
const itemsContainer = document.getElementById("itemsContainer");
const categoryMenu = document.getElementById("categoryMenu");



function redirectToAllItems() {
  window.location.href = "FoodItem.html"; // 👈 exact file name
}


function toggleCategoryAdminUI() {
  const addCategorySection = document.getElementById("addCategorySection");
  if (!addCategorySection) return;

  if (isAdmin) {
    addCategorySection.style.display = "flex"; // or block
  } else {
    addCategorySection.style.display = "none";
  }
}



async function loadItemsByCategory(categoryId) {
  try {
    const res = await fetch(
      `${BASE_URL}/FindFoodItemsByCategory?categoryId=${categoryId}`
    );
    const result = await res.json();
    foodItems = result.data || [];
    displayFoodItems();
  } catch (err) {
    console.error("Category load error:", err);
    foodItems = [];
    displayFoodItems();
  }
}



/* ================= FETCH CATEGORIES ================= */
function fetchCategories() {
  fetch(`${BASE_URL}/FindAllCategoryies`)
    .then(res => res.json())
    .then(res => {
      const categories = res.data || [];

      categoryMenu.innerHTML = `
  <li>
    <span class="cat active"
      onclick="setActiveCategory(this); loadFoodItems()">
      All
    </span>
  </li>
`;


      categories.forEach(c => {
        categoryMenu.innerHTML += `
    <li data-id="${c.categoryId}">
      <span class="cat"
        onclick="setActiveCategory(this); loadItemsByCategory(${c.categoryId})">
        ${c.categoryName}
      </span>

      ${isAdmin ? `
        <span onclick="editCategory(this)">✏️</span>
        <span onclick="deleteCategory(${c.categoryId})">🗑️</span>
      ` : ``}
    </li>
  `;
      });
    })
    .catch(err => console.error("Category error:", err));
}


function setActiveCategory(el) {
  document.querySelectorAll(".cat").forEach(c =>
    c.classList.remove("active")
  );
  el.classList.add("active");
}





/* ================= ACTIVE CATEGORY ================= */
function setActiveCategory(el) {
  document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
}

/* ================= LOAD ALL ITEMS ================= */
document.addEventListener("DOMContentLoaded", () => {
  checkAdminStatus();
  toggleCategoryAdminUI();

  fetchCategories();
  loadFoodItems();

  if (!isAdmin && currentUser) {
    updateCartCount();
  }
});



/* ================= LOAD ITEMS BY CATEGORY ================= */
document.addEventListener("DOMContentLoaded", () => {
  checkAdminStatus();
  toggleCategoryAdminUI();
  fetchCategories();
  loadFoodItems(); // 👈 default ALL items
});






/* ================= RENDER ITEMS ================= */
function renderFoodItems(items) {
  itemsContainer.innerHTML = "";

  if (items.length === 0) {
    itemsContainer.innerHTML = "<p>No items found</p>";
    return;
  }

  items.forEach(item => {
    itemsContainer.innerHTML += `
      <div class="food-card">
        <img src="${item.imageUrl}" />
        <h4>${item.foodName}</h4>
        <p>₹${item.price}</p>

        ${
          isAdmin
            ? `<button onclick="editItem(${item.foodId})">Edit</button>
               <button onclick="deleteItem(${item.foodId})">Delete</button>`
            : `<button onclick="addToCart(${item.foodId})">Add to Cart</button>`
        }
      </div>
    `;
  });
}



/* ================= ADD CATEGORY ================= */
function addCategory() {
  const input = document.getElementById("newCategoryName");
  const name = input.value.trim();
  if (!name) return;

  fetch(`${BASE_URL}/SaveCategory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryName: name })
  }).then(() => {
    input.value = "";
    fetchCategories();
  });
}

/* ================= EDIT CATEGORY ================= */
const CATEGORY_UPDATE_URL = `${BASE_URL}/CategoryUpdate`;

function editCategory(btn) {
  const li = btn.closest("li");
  const span = li.querySelector(".cat");
  const oldName = span.textContent.trim();

  const input = document.createElement("input");
  input.value = oldName;

  span.replaceWith(input);
  input.focus();

  input.onblur = () => updateCategory(li, input.value, oldName);

  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") fetchCategories();
  };
}

function updateCategory(li, newName, oldName) {
  newName = newName.trim();

  if (!newName || newName === oldName) {
    fetchCategories();
    return;
  }

  fetch(CATEGORY_UPDATE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoryId: Number(li.dataset.id),
      categoryName: newName
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  })
  .then(() => fetchCategories())
  .catch(() => fetchCategories());
}



/* ================= DELETE CATEGORY ================= */
function deleteCategory(id) {
  if (!confirm("Delete category")) {
    return;
  }

  fetch(`${BASE_URL}/deleteCategory?categoryId=${id}`, {
    method: "DELETE"
  })
  .then(async res => {
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }

    alert(data.message || "Category deleted");

   fetchCategories();
   loadFoodItems();



  })

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchFoodItems();   // ✅ correct
});


}
