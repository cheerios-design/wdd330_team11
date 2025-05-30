import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Recalculate order total when ZIP code field loses focus (only if valid ZIP)
document.querySelector("#zip").addEventListener("blur", (e) => {
  const zip = e.target.value.trim();
  if (zip.length >= 2 && zip.length <= 10) {
    order.calculateOrderTotal();
  }
});

// Helper function to show error messages below inputs
function showError(input, message) {
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
  const expiryDate = new Date(fullYear, month);

  return expiryDate > now;
}

// Validate CVV (3 or 4 digits)
function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Handle form submission
document.querySelector("form#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
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

  const cardValue = cardNumberInput.value.trim();
  const expValue = expirationInput.value.trim();
  const cvvValue = cvvInput.value.trim();

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

  // All good – proceed to submit order
  order.checkout();
});
