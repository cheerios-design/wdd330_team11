import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function displayProductDetails() {
  if (!productId) return;

  const product = await dataSource.findProductById(productId);
  if (!product) return;

  document.querySelector("h3").textContent = product.Brand?.Name || "";
  document.querySelector("h2.divider").textContent =
    product.NameWithoutBrand || product.Name;
  document.querySelector("img.divider").src = product.Image;
  document.querySelector("img.divider").alt = product.Name;
  document.querySelector(".product-card__price").textContent =
    `$${product.FinalPrice}`;
  document.querySelector(".product__color").textContent =
    product.Colors?.[0]?.ColorName || "";
  document.querySelector(".product__description").innerHTML =
    product.DescriptionHtmlSimple || "";
  document.querySelector("#addToCart").dataset.id = product.Id;
  document.querySelector("#addToCart").textContent = "Add to Cart";
}

displayProductDetails();
document.querySelector("#addToCart").addEventListener("click", (e) => {
  e.preventDefault();
  const productId = e.target.dataset.id;
  if (!productId) return;

  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const product = dataSource.findProductById(productId);
  if (!product) return;

  cartItems.push(product);
  localStorage.setItem("so-cart", JSON.stringify(cartItems));
});
