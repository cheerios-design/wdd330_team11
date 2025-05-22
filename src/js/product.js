import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

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
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
