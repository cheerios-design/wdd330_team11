import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
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
    this.calculateOrderTotal(); // Also calculate totals on init
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(
      `${this.outputSelector} #cartTotal`
    );
    const itemNumElement = document.querySelector(
      `${this.outputSelector} #num-items`
    );

    itemNumElement.innerText = this.list.length;

    if (this.list.length === 0) {
      this.itemTotal = 0;
      summaryElement.innerText = "$0.00";
      return;
    }

    const amounts = this.list.map((item) => Number(item.FinalPrice) || 0);
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
    summaryElement.innerText = "$" + this.itemTotal.toFixed(2);
  }

  // Fix typo: calculateOrderTotal (not calculateOrdertotal)
  calculateOrderTotal() {
    if (this.list.length === 0) {
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
      this.displayOrderTotals();
      return;
    }

    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = parseFloat((this.itemTotal * 0.06).toFixed(2));
    this.orderTotal = parseFloat(
      (this.itemTotal + this.shipping + this.tax).toFixed(2)
    );

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    shipping.innerText = "$" + this.shipping.toFixed(2);
    tax.innerText = "$" + this.tax.toFixed(2);
    orderTotal.innerText = "$" + this.orderTotal.toFixed(2);
  }

  async checkout(formData) {
    // formData is passed from checkout.js submit handler

    // Append additional data
    formData.orderDate = new Date().toISOString();
    formData.orderTotal = this.orderTotal;
    formData.tax = this.tax;
    formData.shipping = this.shipping;
    formData.items = packageItems(this.list);

    try {
      const res = await services.checkout(formData);
      console.log("Order response:", res);

      // Clear cart on successful checkout
      setLocalStorage(this.key, []);
      location.assign("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      if (err.message && typeof err.message === "object") {
        for (let msg in err.message) {
          alertMessage(err.message[msg]);
        }
      } else {
        alertMessage(err.message || "An error occurred during checkout.");
      }
      console.error(err);
    }
  }
}
