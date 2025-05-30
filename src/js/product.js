import { getParam } from "./utils.mjs";
import ExternalServices from './ExternalServices.mjs';

const dataSource = new ExternalServices("tents");
const productId = getParam("product");

async function displayProductDetails() {
  if (!productId) return;

  const product = await dataSource.findProductById(productId);
  if (!product) return;

  document.querySelector("h2").textContent =
    product.NameWithoutBrand || product.Name;
  document.querySelector("h3.divider").textContent = product.Brand?.Name || "";
  document.querySelector("#productImage").src = product.Image;
  document.querySelector("#productImage").alt = product.Name;
  document.querySelector("#productPrice").textContent =
    `$${product.FinalPrice}`;
  document.querySelector("#productColor").textContent =
    product.Colors?.[0]?.ColorName || "";
  document.querySelector("#productDesc").innerHTML =
    product.DescriptionHtmlSimple || "";
  document.querySelector("#addToCart").dataset.id = product.Id;
  document.querySelector("#addToCart").textContent = "Add to Cart";
}

displayProductDetails();
document
  .querySelector("#addToCart")
  .addEventListener("click", function (event) {
    const clickedProductId = event.target.dataset.id;
    // You can implement your add-to-cart logic here.
    // For example, dispatch a custom event or call a cart API.
    alert(`Product ${clickedProductId} added to cart!`);
  });
