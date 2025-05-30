export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// function to take an optional object and a template and insert the objects as HTML into the DOM
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if (callback) {
    callback(data);
  }
}

// async to load HTML template from a file
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  const template = await res.text();
  return template;
}

// Updated: Correcting relative path to partials from /src/checkout/
export function loadHeaderFooter() {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  fetch("../public/partials/header.html")
    .then((res) => res.text())
    .then((data) => {
      header.innerHTML = data;
    })
    .catch((err) => console.error("Error loading header:", err));

  fetch("../public/partials/footer.html")
    .then((res) => res.text())
    .then((data) => {
      footer.innerHTML = data;
    })
    .catch((err) => console.error("Error loading footer:", err));
}

// setting listener
export function setClick(selector, callback) {
  const el = qs(selector);
  if (!el) return;

  el.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });
  el.addEventListener("click", callback);
}

// utility to notify
export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span role="button" tabindex="0" aria-label="Close alert">X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      this.remove();
    }
  });

  const main = document.querySelector("main");
  if (!main) return;
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);

}

// util remove alerts
export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());
}
