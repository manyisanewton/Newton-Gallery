let cart = []; // This is where we store all the stuff the user adds to their cart

// Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products'); // Getting products from the internet
        const data = await response.json(); // Turning the data into a usable object
        const products = data.products.slice(0, 6); // Get only the first 6 products
        displayProducts(products); // Show those products on the screen
    } catch (error) {
        console.error("Error fetching products:", error); // If something goes wrong, we'll see this in the console
    }
}

function displayProducts(products) {
    const productList = document.getElementById("product-list"); // Get the div where we’ll put the products
    productList.innerHTML = ""; // Clear any old products
    products.forEach(product => { // Loop through the products and make a card for each one
        const productCard = document.createElement("div");
        productCard.classList.add("product"); // Give the card a class so we can style it
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}"> <!-- Product image -->
            <h4>${product.title}</h4> <!-- Product title -->
            <p>$${product.price}</p> <!-- Product price -->
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add To Cart</button> <!-- Button to add the product to the cart -->
        `;
        productList.appendChild(productCard); // Add the product card to the list
    });
}

function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id); // Check if the item is already in the cart
    if (existingItem) {
        existingItem.quantity += 1; // If it is, just add one more
    } else {
        cart.push({ id, title, price, quantity: 1 }); // Otherwise, add it as a new item
    }
    updateCart(); // Update the cart display
}

function updateCart() {
    const cartItems = document.getElementById("cart-items"); // Get the place to show cart items
    const cartTotal = document.getElementById("cart-total"); // Get the place to show total price
    const cartCount = document.getElementById("cart-count"); // Get the place to show how many items in the cart
    cartItems.innerHTML = ""; // Clear the cart display

    let total = 0, itemCount = 0; // Set initial values for total price and item count
    cart.forEach(item => { // Loop through cart items
        total += item.price * item.quantity; // Add the price of each item * its quantity
        itemCount += item.quantity; // Add the quantity to the total item count

        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            <span>${item.title} (x${item.quantity})</span>
            <div class="quantity-buttons">
                <button onclick="addToCart(${item.id}, '${item.title}', ${item.price})">+</button> <!-- Add more of this item -->
                <button onclick="subtractFromCart(${item.id})">-</button> <!-- Remove one of this item -->
            </div>
            <span>$${(item.price * item.quantity).toFixed(2)}</span> <!-- Show the price for this item -->
        `;
        cartItems.appendChild(cartItem); // Add this item to the list in the cart
    });

    cartTotal.textContent = total.toFixed(2); // Set the total price in the cart
    cartCount.textContent = itemCount; // Set the total item count
}

function subtractFromCart(id) {
    const existingItem = cart.find(item => item.id === id); // Find the item in the cart
    if (existingItem) {
        existingItem.quantity -= 1; // If it's there, remove one
        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== id); // If there are no more of this item, remove it completely from the cart
        }
    }
    updateCart(); // Update the cart display
}

function closeCart() {
    document.querySelector('.cart').style.display = 'none'; // Hide the cart when done
}

function toggleCart() {
    const cart = document.querySelector('.cart'); // Get the cart
    cart.style.display = cart.style.display === "none" ? "block" : "none"; // Toggle the cart's visibility
}

function checkout() {
    alert(`Thank you for your purchase! Total: $${document.getElementById("cart-total").innerText}`); // Show a thank you message with the total price
    cart = []; // Clear the cart
    updateCart(); // Update the cart display to show it's empty
}

fetchProducts(); // Call the function to get and display products when the page loads
