import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-list');

const tentList = new ProductList('tents', dataSource, listElement);
tentList.init();

// Function to create HTML for a single product item
function productItemTemplate(product) {
  return `
    <li class="product-card">
      <img src="${product.Image}" alt="${product.Name}" />
      <h2>${product.Name}</h2>
      <p>${product.DescriptionHtmlSimple}</p>
      <p>Price: $${product.FinalPrice.toFixed(2)}</p>
    </li>
  `;
}

// Render product list to the DOM
function renderProducts(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(productItemTemplate).join("");
}

// Fetch data and render
async function init() {
  try {
    const products = await productData.getData();
    renderProducts(products);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

init();
