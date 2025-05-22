
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand?.Name || ''}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }
  

  productItemTemplate(product) {
    return `
      <li class="product-card">
        <img src="${product.Image}" alt="${product.Name}" />
        <h2>${product.Name}</h2>
        <p>${product.DescriptionHtmlSimple}</p>
        <p>Price: $${product.FinalPrice.toFixed(2)}</p>
      </li>
    `;
  }

  async init() {
    try {
      this.products = await this.dataSource.getData();
      this.render();
    } catch (error) {
      console.error("Error loading products:", error);
      this.listElement.innerHTML = `<li class="error">Failed to load products.</li>`;
    }
  }

  renderList(products) {
    const htmlItems = products.map(productCardTemplate).join("");
    this.listElement.innerHTML = htmlItems;
  }
}
