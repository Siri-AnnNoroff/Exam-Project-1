"use strict";

const filterPage = "../index.html";
const API = "https://v2.api.noroff.dev/online-shop";

export const categories = {
  Electronics: [
    "audio",
    "computers",
    "electronics",
    "headphones",
    "peripherals",
    "storage",
    "wearables",
  ],
  "gaming & toys": ["gaming", "toy"],
  fashion: ["fashion", "accessories ", "bags", "glasses", "shoes"],
  "jewelry & watches": ["jewelry", "watch", "watches"],
  beauty: ["beauty", "perfume", "shampoo", "skin care"],
};

async function buildNav() {
  const header = document.querySelector("header");
  if (!header) return;

  const nav = document.createElement("nav");
  nav.classList.add("nav-bar");
  header.after(nav);

  const activeCategory = new URLSearchParams(window.location.search).get(
    "category",
  );

  const endLink = document.createElement("a");
  endLink.href = filterPage;
  endLink.textContent = "All";
  if (!activeCategory && window.location.pathname.endsWith("index.html")) {
    endLink.classList.add("active");
  }
  nav.appendChild(endLink);

  Object.keys(categories).forEach((category) => {
    const link = document.createElement("a");
    link.href = `${filterPage}?category=${encodeURIComponent(category)}`;
    link.textContent = category;
    if (category === activeCategory) link.classList.add("active");
    nav.appendChild(link);
  });
}

buildNav();
