import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Add product to cart function (you can enhance this to store multiple items)
function addProductToCart(product) {
  // Get current cart or initialize as empty array
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  // Ensure cart is always an array
  if (!Array.isArray(cart)) cart = [];
  // Add new product
  cart.push(product);
  // Save updated cart
  localStorage.setItem("so-cart", JSON.stringify(cart));
}

// Add to Cart button event handler
async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  const product = await dataSource.findProductById(id);
  if (product) {
    addProductToCart(product);
    alert(`Added "${product.Name}" to cart.`);
  }
}

// Render product list inside <ul class="product-list"></ul>
async function renderProducts() {
  try {
    const products = await dataSource.getData();
    const productList = document.querySelector(".product-list");
    productList.innerHTML = ""; // clear existing

    products.forEach(product => {
      const li = document.createElement("li");
      li.classList.add("product-item");

      li.innerHTML = `
        <h3>${product.Name}</h3>
        <img src="${product.Image}" alt="${product.Name}" />
        <p>${product.DescriptionHtmlSimple}</p>
        <p>Price: $${product.FinalPrice.toFixed(2)}</p>
        <button data-id="${product.Id}" class="add-to-cart">Add to Cart</button>
      `;

      productList.appendChild(li);
    });

    // Add event listeners to all Add to Cart buttons after rendering
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", addToCartHandler);
    });

  } catch (error) {
    console.error("Failed to load products:", error);
    const productList = document.querySelector(".product-list");
    productList.innerHTML = "<li>Failed to load products.</li>";
  }
}

// Initialize rendering on page load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
