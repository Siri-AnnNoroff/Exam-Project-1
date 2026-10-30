"use strict";

import { getProducts } from "./api.js";

const currencySymbol = "$";

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

  const name = document.createElement("h2");
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
  cta.classList.add("carousel-cta");
  cta.textContent = "View product";
  cta.href = `product/index.html?id=${product.id}`;

  slide.append(image, name, priceArea, cta);
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

fetchCarousel();
