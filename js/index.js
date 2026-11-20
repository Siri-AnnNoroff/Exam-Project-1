"use strict";

import { getProducts } from "./api.js";
import { addToCart } from "./cart-logic.js";
import { categories } from "./nav.js";

let currentPage = 1;
const limit = 8;
let allProducts = [];
const activeCategory = new URLSearchParams(window.location.search).get(
  "category",
);
const categoryTag = categories[activeCategory];

const currencySymbol = "$";

const grid = document.querySelector(".product-grid");
const pagination = document.querySelector(".pagination");
const prevPageBtn = document.querySelector(".prev-page");
const nextPageBtn = document.querySelector(".next-page");
const pageNumber = document.querySelector(".page-number");

function getPaginationNumbers(current, total) {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 2) return [1, 2, "…", total];
  if (current >= total - 1) return [1, "…", total - 1, total];
  return [1, "…", current, "…", total];
}

async function loadProducts() {
  try {
    const products = await getProducts();
    if (categoryTag) {
      grid.replaceChildren();
      products
        .filter((product) =>
          product.tags.some((tag) => categoryTag.includes(tag.toLowerCase())),
        )
        .forEach((product) => buildGrid(grid, product));
      pagination.hidden = true;
    } else {
      allProducts = products;
      showGrid(1);
    }
  } catch (error) {
    grid.textContent = "Could not load products";
    console.error("Could not load products", error);
  }
}

function showGrid(page) {
  const pageCounter = Math.ceil(allProducts.length / limit);
  const start = (page - 1) * limit;
  currentPage = page;
  grid.replaceChildren();
  allProducts
    .slice(start, start + limit)
    .forEach((product) => buildGrid(grid, product));

  pageNumber.replaceChildren();
  getPaginationNumbers(page, pageCounter).forEach((item) => {
    if (item === "…") {
      const dots = document.createElement("span");
      dots.classList.add("page-ellipsis");
      dots.textContent = item;
      pageNumber.appendChild(dots);
      return;
    }
    const btn = document.createElement("button");
    btn.classList.add("page-btn");
    btn.textContent = item;
    if (item === page) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "page");
    }
    btn.addEventListener("click", () => showGrid(item));
    pageNumber.appendChild(btn);
  });

  prevPageBtn.disabled = page <= 1;
  nextPageBtn.disabled = page >= pageCounter;
}

prevPageBtn.addEventListener("click", () => showGrid(currentPage - 1));
nextPageBtn.addEventListener("click", () => showGrid(currentPage + 1));

fetchCarousel();
loadProducts();

async function fetchCarousel() {
  const carousel = document.getElementById("carousel");

  try {
    const products = await getProducts();
    buildCarousel(carousel, products.slice(0, 3));
  } catch (error) {
    carousel.textContent = "Failed to load products";
    console.error("Failed to load products", error);
  }
}

function createSlide(product) {
  const slide = document.createElement("div");
  slide.classList.add("carousel-slide");

  const image = document.createElement("img");
  image.src = product.image.url;
  image.alt = product.image.alt;

  const imageLink = document.createElement("a");
  imageLink.href = `product/index.html?id=${product.id}`;
  imageLink.appendChild(image);

  const name = document.createElement("h3");
  name.textContent = product.title;

  const productDetails = document.createElement("p");
  productDetails.textContent = product.description;
  productDetails.classList.add("carousel-details");

  const priceArea = document.createElement("div");
  priceArea.classList.add("carousel-price");

  const price = document.createElement("p");
  price.textContent = currencySymbol + product.price;

  if (product.discountedPrice < product.price) {
    price.classList.add("fullPrice");
    const salePrice = document.createElement("p");
    salePrice.classList.add("onSale");
    salePrice.textContent = currencySymbol + product.discountedPrice;
    priceArea.append(price, salePrice);
  } else {
    priceArea.appendChild(price);
  }

  const cta = document.createElement("a");
  cta.classList.add("cta");
  cta.textContent = "View product";
  cta.href = `product/index.html?id=${product.id}`;

  const carouselInfo = document.createElement("div");
  carouselInfo.classList.add("carousel-info");
  carouselInfo.append(name, productDetails, priceArea, cta);
  slide.append(imageLink, carouselInfo);

  return slide;
}

function buildCarousel(carousel, products) {
  let currentIndex = 0;

  const viewport = document.createElement("div");
  viewport.classList.add("carousel-viewport");

  const track = document.createElement("div");
  track.classList.add("carousel-track");

  const slides = products.map(createSlide);
  track.append(...slides);

  const prevBtn = document.createElement("button");
  prevBtn.classList.add("carousel-arrow", "prev-btn");
  prevBtn.setAttribute("aria-label", "Previous product");

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("carousel-arrow", "next-btn");
  nextBtn.setAttribute("aria-label", "Next product");

  viewport.append(track, prevBtn, nextBtn);

  const dotsArea = document.createElement("div");
  dotsArea.classList.add("carousel-dots");

  const dots = products.map((product, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", `Show product ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsArea.appendChild(dot);
    return dot;
  });

  carousel.replaceChildren(viewport, dotsArea);

  function showSlide(index) {
    currentIndex = (index + products.length) % products.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.inert = i !== currentIndex;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

  showSlide(0);
}

function buildGrid(grid, product) {
  const productBox = document.createElement("div");
  productBox.classList.add("product-box");

  const productImage = document.createElement("img");
  productImage.classList.add("grid-image");
  productImage.src = product.image.url;
  productImage.alt = product.image.alt;

  const imageLink = document.createElement("a");
  imageLink.href = `product/index.html?id=${product.id}`;
  imageLink.appendChild(productImage);

  const name = document.createElement("h3");
  name.textContent = product.title;

  const priceArea = document.createElement("div");
  priceArea.classList.add("carousel-price");

  const price = document.createElement("p");
  price.textContent = currencySymbol + product.price;

  if (product.discountedPrice < product.price) {
    price.classList.add("fullPrice");
    const salePrice = document.createElement("p");
    salePrice.classList.add("onSale");
    salePrice.textContent = currencySymbol + product.discountedPrice;
    priceArea.append(price, salePrice);
  } else {
    priceArea.appendChild(price);
  }

  const cta = document.createElement("a");
  cta.classList.add("cta-homepage", "cta");
  cta.textContent = "View product";
  cta.href = `product/index.html?id=${product.id}`;

  productBox.append(imageLink, name, priceArea, cta);
  grid.append(productBox);
}
