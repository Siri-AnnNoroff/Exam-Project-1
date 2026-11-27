"use strict";

import { getCart, setCart, addToCart } from "./cart-logic.js";

const API = "https://v2.api.noroff.dev";
const currencySymbol = "$";
const cartSection = document.getElementById("cart-section");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setCart([]);
  window.location.href = "../success/index.html";
});

function listTop() {
  const productTop = document.createElement("span");
  productTop.textContent = "Product";

  const quantityTop = document.createElement("span");
  quantityTop.textContent = "Quantity";

  const totalTop = document.createElement("span");
  totalTop.textContent = "Total";
  const header = document.createElement("div");
  header.classList.add("cart-header");
  header.append(productTop, quantityTop, totalTop);
  cartSection.appendChild(header);
}

function productsInCart() {
  getCart().forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("cart-row");

    const link = document.createElement("a");
    link.href = `../product/index.html?id=${product.id}`;

    const image = document.createElement("img");
    image.src = product.image.url;
    image.alt = product.image.alt;

    const title = document.createElement("h3");
    title.textContent = product.title;
    link.append(image, title);

    const quantitySection = document.createElement("div");
    quantitySection.classList.add("quantity-section");

    const quantityText = document.createElement("span");
    quantityText.textContent = product.quantity;

    quantitySection.append(quantityText);
    const itemPrice = product.discountedPrice || product.price;
    const rowTotal = document.createElement("p");
    rowTotal.textContent =
      currencySymbol + (itemPrice * product.quantity).toFixed(2);
    rowTotal.classList.add("row-total");
    if (product.discountedPrice < product.price)
      rowTotal.classList.add("onSale");

    card.append(link, quantitySection, rowTotal);
    cartSection.appendChild(card);
  });
}

const totalSection = document.getElementById("total-section");

function calculateTotal() {
  let totalCost = 0;
  getCart().forEach((product) => {
    const itemPrice =
      product.discountedPrice < product.price
        ? product.discountedPrice
        : product.price;
    totalCost += itemPrice * product.quantity;
  });
  return totalCost;
}

function displayTotal() {
  const totalSum = document.createElement("p");
  const shipping = document.createElement("p");
  shipping.textContent = "Shipping: Free";
  totalSum.textContent =
    "Subtotal: " + currencySymbol + calculateTotal().toFixed(2);
  totalSum.classList.add("total-sum");
  totalSection.appendChild(shipping);
  totalSection.appendChild(totalSum);
}

const form = document.querySelector(".checkout-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "../success/index.html";
});

function displayCart() {
  listTop();
  productsInCart();
  displayTotal();
}
displayCart();
