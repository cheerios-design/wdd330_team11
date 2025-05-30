import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Use a container selector that wraps the whole checkout page, not just the summary
const order = new CheckoutProcess("so-cart", "main.checkout");
order.init();

// Recalculate order total when ZIP code field loses focus (only if valid ZIP)
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", (e) => {
    const zip = e.target.value.trim();
    if (zip.length >= 2 && zip.length <= 10) {
      order.calculateOrderTotal();
    }
  });
}

// Helper function to show error messages below inputs
function showError(input, message) {
  if (!input) return;
  let errorElem = input.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains("error-message")) {
    errorElem = document.createElement("div");
    errorElem.classList.add("error-message");
    input.parentNode.insertBefore(errorElem, input.nextSibling);
  }
  errorElem.textContent = message;
}

// Helper function to clear error messages
function clearError(input) {
  if (!input) return;
  const errorElem = input.nextElementSibling;
  if (errorElem && errorElem.classList.contains("error-message")) {
    errorElem.textContent = "";
  }
}

// Validate credit card number format (13–19 digits)
function validateCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  const regex = /^\d{13,19}$/;
  return regex.test(cleaned);
}

// Validate expiration date in MM/YY format and check if not expired
function validateExpiration(expiration) {
  if (!/^\d{2}\/\d{2}$/.test(expiration)) return false;

  const [monthStr, yearStr] = expiration.split("/");
  const month = parseInt(monthStr, 10);
  let year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) return false;

  // Convert YY to 20YY
  const fullYear = 2000 + year;
  const now = new Date();
  // Set expiryDate to end of the month
  const expiryDate = new Date(fullYear, month, 0, 23, 59, 59);

  return expiryDate > now;
}

// Validate CVV (3 or 4 digits)
function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Handle form submission
const form = document.querySelector("form#checkout-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Clear all previous error messages
    [...form.elements].forEach((el) => clearError(el));

    // Native HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      valid = false;
    }

    // Custom validations
    const cardNumberInput = form.querySelector("#cardnumber");
    const expirationInput = form.querySelector("#expiration");
    const cvvInput = form.querySelector("#cvv");

    const cardValue = cardNumberInput ? cardNumberInput.value.trim() : "";
    const expValue = expirationInput ? expirationInput.value.trim() : "";
    const cvvValue = cvvInput ? cvvInput.value.trim() : "";

    if (!validateCardNumber(cardValue)) {
      showError(cardNumberInput, "Please enter a valid credit card number (13–19 digits).");
      valid = false;
    }

    if (!validateExpiration(expValue)) {
      showError(expirationInput, "Please enter a valid, unexpired MM/YY date.");
      valid = false;
    }

    if (!validateCVV(cvvValue)) {
      showError(cvvInput, "Please enter a valid 3 or 4 digit CVV.");
      valid = false;
    }

    if (!valid) {
      // Focus the first invalid input field
      const firstErrorField = form.querySelector(".error-message:not(:empty)");
      if (firstErrorField) firstErrorField.previousElementSibling.focus();
      return;
    }

    // All good – proceed to submit order with form data
    const formData = {
      fname: form.fname ? form.fname.value.trim() : "",
      lname: form.lname ? form.lname.value.trim() : "",
      address: form.address ? form.address.value.trim() : "",
      city: form.city ? form.city.value.trim() : "",
      state: form.state ? form.state.value.trim() : "",
      zip: form.zip ? form.zip.value.trim() : "",
      country: form.country ? form.country.value.trim() : "",
      cardnumber: cardValue,
      expiration: expValue,
      cvv: cvvValue,
    };

    order.checkout(formData);
  });
}
