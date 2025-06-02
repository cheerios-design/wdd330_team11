import { setLocalStorage, getParam, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function displayProductDetails() {
  try {
    const product = await dataSource.findProductById(productId);
    if (product) {
      // Fix product details display
      document.querySelector("h2").textContent = product.Brand.Name;
      document.querySelector("h3.divider").textContent =
        product.NameWithoutBrand;
      document.querySelector("#productImage").src = product.Images.PrimaryLarge;
      document.querySelector("#productImage").alt = product.Name;
      document.querySelector("#productPrice").textContent =
        `$${product.FinalPrice}`;
      document.querySelector("#productColor").textContent =
        product.Colors[0].ColorName;
      document.querySelector("#productDesc").innerHTML =
        product.DescriptionHtmlSimple;
      document.querySelector("#addToCart").dataset.id = product.Id;
      document.title = product.Name;
    }
  } catch (err) {
    // Optionally, display error to the user or log elsewhere
    // alert("Error loading product. Please try again later.");
  }
}

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cart)) {
    cart = [];
  }
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  e.preventDefault();
  const product = await dataSource.findProductById(productId);
  addProductToCart(product);

  // Add visual feedback
  const button = document.getElementById("addToCart");
  button.textContent = "✓ Added to Cart";
  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 2000);
}

// Initialize page
displayProductDetails();
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
