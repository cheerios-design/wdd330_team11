import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// Convert form data to JSON
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value.trim(); // Trim whitespace for inputs
  });
  return convertedJSON;
}

// Package cart items for API payload
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1, // Update if quantity is implemented in future
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(
      `${this.outputSelector} #cartTotal`
    );
    const itemNumElement = document.querySelector(
      `${this.outputSelector} #num-items`
    );

    const prices = this.list.map((item) => item.FinalPrice);
    this.itemTotal = prices.reduce((sum, price) => sum + price, 0);

    itemNumElement.innerText = this.list.length;
    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Shipping: $10 base + $2 per additional item
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
    const totalElem = document.querySelector(`${this.outputSelector} #orderTotal`);

    taxElem.innerText = `$${this.tax.toFixed(2)}`;
    shippingElem.innerText = `$${this.shipping.toFixed(2)}`;
    totalElem.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];

    // Revalidate before proceeding
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    if (this.list.length === 0) {
      import("./utils.mjs").then(({ alertMessage }) => {
        alertMessage("Your cart is empty. Add items before checking out.");
      });
      return;
    }

    const order = formDataToJSON(formElement);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping.toFixed(2);
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);
      console.log("Order Success:", response);

      // Clear cart and redirect
      localStorage.removeItem(this.key);
      window.location.href = "/checkout/success.html";
    } catch (err) {
      console.error("Checkout error:", err);

      const message =
        typeof err.message === "object"
          ? JSON.stringify(err.message)
          : err.message;

      import("./utils.mjs").then(({ alertMessage }) => {
        alertMessage(message || "An unexpected error occurred during checkout.");
      });
    }
  }
}
