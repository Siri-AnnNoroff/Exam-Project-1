"use strict";

let cart = [];
const cartBadge = document.querySelector(".cart-badge");

export function getCart() {
  return cart;
}

export function setCart(newCart) {
  cart = newCart;
  saveCart();
}

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

export function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartBadge();
}

export function addToCart(product) {
  const alreadyInCart = cart.find((item) => item.id === product.id);
  if (alreadyInCart) {
    alreadyInCart.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
}
loadCart();
