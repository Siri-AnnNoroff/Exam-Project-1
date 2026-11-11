"use strict";

import { getCart, setCart, addToCart } from "./cart-logic.js";

const API = "https://v2.api.noroff.dev";
const currencySymbol = "$";
const cartSection = document.getElementById("cart-section");
const clearCartBtn = document.querySelector(".clear-cart");

clearCartBtn.addEventListener("click", () => {
  setCart([]);
  displayCart();
  showToast("Cart cleared", "success");
});

function removeFromCart(product) {
  const productInCart = getCart().find((item) => item.id === product.id);
  if (productInCart) {
    productInCart.quantity -= 1;
    setCart(getCart().filter((item) => item.quantity > 0));
  }
  displayCart();
}

//Toast

/**
@param {string} message
@param {string} type
 */

function showToast(message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");
  const toastElement = document.createElement("div");
  toastElement.classList.add("toast", type);
  toastElement.textContent = message;
  toastContainer.appendChild(toastElement);
  setTimeout(() => {
    toastElement.remove();
  }, 5000);
}

function listTop() {
  const productTop = document.createElement("span");
  productTop.textContent = "Product";

  const quantityTop = document.createElement("span");
  quantityTop.textContent = "Quantity";

  const totalTop = document.createElement("span");
  totalTop.textContent = "Total";

  cartSection.append(productTop, quantityTop, totalTop);
  return cartSection;
}

function emptyCart() {
  return getCart().length === 0;
}

function productsInCart() {
  if (emptyCart()) {
    const message = document.createElement("p");
    message.textContent = "Your cart is empty";
    cartSection.appendChild(message);
    cartSection.classList.add("empty-cart");
    return;
  }

  getCart().forEach((product) => {
    const card = document.createElement("div");
    cartSection.appendChild(card);

    const link = document.createElement("a");
    link.href = `../product/index.html?id=${product.id}`;
    card.appendChild(link);

    const image = document.createElement("img");
    image.src = product.image.url;
    image.alt = product.image.alt;
    link.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = product.title;
    link.appendChild(title);

    const originalPrice = document.createElement("p");
    if (product.onSale === true) {
      originalPrice.classList.add("fullPrice");
      originalPrice.textContent = currencySymbol + product.price;
      card.appendChild(originalPrice);

      const salePrice = document.createElement("p");
      salePrice.textContent = currencySymbol + product.discountedPrice;
      card.appendChild(salePrice);
      salePrice.classList.add("onSale");
    } else {
      originalPrice.textContent = currencySymbol + product.price;
      card.appendChild(originalPrice);
    }

    const quantitySection = document.createElement("div");
    quantitySection.classList.add("quantity-section");

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", () => removeFromCart(product));

    const quantityText = document.createElement("span");
    quantityText.textContent = product.quantity;

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
      addToCart(product);
      displayCart();
    });

    quantitySection.append(minusBtn, quantityText, plusBtn);
    card.appendChild(quantitySection);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.classList.add("remove-product");
    card.appendChild(removeBtn);

    removeBtn.addEventListener("click", () => {
      deleteProduct(product);
      showToast("You have removed: " + product.title + " from your cart!");
    });
  });
}

const totalSection = document.getElementById("total-section");

function calculateTotal() {
  let totalCost = 0;
  getCart().forEach((product) => {
    let itemPrice = product.price;
    if (product.onSale === true) {
      itemPrice = product.discountedPrice;
    }
    totalCost += itemPrice * product.quantity;
  });
  return totalCost;
}

function displayTotal() {
  totalSection.innerHTML = "";
  if (emptyCart()) {
    const homeLink = document.createElement("a");
    homeLink.href = `../index.html`;
    homeLink.classList.add("home-link");
    homeLink.textContent = "Back to products";
    totalSection.appendChild(homeLink);
    return;
  }

  const totalSum = document.createElement("p");
  const shipping = document.createElement("p");
  shipping.textContent = "Shipping: Free";
  totalSum.textContent =
    "Subtotal: " + currencySymbol + calculateTotal().toFixed(2);
  totalSum.classList.add("total-sum");
  totalSection.appendChild(shipping);
  totalSection.appendChild(totalSum);

  const placeOrderLink = document.createElement("a");
  placeOrderLink.textContent = "Proceed to checkout";
  placeOrderLink.classList.add("carousel-cta");
  placeOrderLink.href = `../checkout/index.html`;
  totalSection.appendChild(placeOrderLink);
}
displayCart();

function deleteProduct(product) {
  setCart(getCart().filter((item) => item.id !== product.id));
  displayCart();
}

function displayCart() {
  cartSection.innerHTML = "";
  cartSection.classList.remove("empty-cart");
  listTop();
  productsInCart();
  displayTotal();
}
