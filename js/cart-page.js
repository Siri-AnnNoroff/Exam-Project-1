"use strict";

import { getCart, setCart, addToCart } from "./cart-logic.js";
import { showToast } from "./toast.js";
import { categories } from "./nav.js";

const API = "https://v2.api.noroff.dev";
const currencySymbol = "$";
const cartSection = document.getElementById("cart-section");

const clearCartBtn = document.querySelector(".clear-cart");
clearCartBtn.classList.add("cta-homepage", "secondary-cta", "cta");

clearCartBtn.addEventListener("click", () => {
  setCart([]);
  displayCart();
  showToast("Cart cleared", "success");
});

function removeFromCart(product) {
  const cart = getCart();
  const item = cart.find((i) => i.id === product.id);
  if (item) item.quantity -= 1;
  setCart(cart.filter((i) => i.quantity > 0));
  displayCart();
}

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

function emptyCart() {
  return getCart().length === 0;
}

function productsInCart() {
  if (emptyCart()) {
    cartSection.innerHTML = "";
    const message = document.createElement("p");
    message.textContent = "Your cart is empty";
    cartSection.appendChild(message);
    message.classList.add("empty-cart");
    clearCartBtn.remove();
    return;
  }

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
    const itemPrice = product.discountedPrice || product.price;
    const rowTotal = document.createElement("p");
    rowTotal.textContent =
      currencySymbol + (itemPrice * product.quantity).toFixed(2);
    rowTotal.classList.add("row-total");
    if (product.discountedPrice < product.price)
      rowTotal.classList.add("onSale");

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.classList.add("remove-product");

    removeBtn.addEventListener("click", () => {
      deleteProduct(product);
      showToast(
        `You have removed ${product.title} from your cart!`,
        "success",
        { showCta: false },
      );
    });
    card.append(link, quantitySection, rowTotal, removeBtn);
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
  totalSection.innerHTML = "";
  totalSection.classList.toggle("is-empty", emptyCart());
  if (emptyCart()) {
    const homeLink = document.createElement("a");
    homeLink.href = `../index.html`;
    homeLink.classList.add("cta");
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
  placeOrderLink.classList.add("cta");
  placeOrderLink.href = `../checkout/index.html`;
  totalSection.appendChild(placeOrderLink);
}

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
displayCart();
