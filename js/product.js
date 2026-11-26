"use strict";

import { addToCart } from "./cart-logic.js";
import { showToast } from "./toast.js";

const API = "https://v2.api.noroff.dev/online-shop";
const currencySymbol = "$";
const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

async function fetchProduct() {
  const singleProduct = document.getElementById("single-product");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    singleProduct.textContent = "No product to show";
    return;
  }

  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const { data } = await response.json();
    buildSingleProduct(data);
  } catch (error) {
    const message = "Failed to load product";
    singleProduct.textContent = message;
    console.error(message, error);
  }
}

function shareButton(product) {
  const shareBtn = document.createElement("button");
  shareBtn.classList.add("share-btn");

  const label = document.createElement("span");
  label.textContent = "SHARE";

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-share-nodes");
  shareBtn.append(icon, label);

  shareBtn.addEventListener("click", async () => {
    const shareProduct = {
      title: product.title,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareProduct);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        label.textContent = "LINK COPIED";
        setTimeout(() => (label.textContent = "SHARE"), 3000);
      }
    } catch (error) {
      console.error("Share failed", error);
    }
  });
  return shareBtn;
}

function buildSingleProduct(product) {
  const singleProduct = document.getElementById("single-product");
  singleProduct.textContent = "";

  const productDetails = document.createElement("div");
  productDetails.classList.add("product-details");

  const top = document.createElement("div");
  top.classList.add("product-top");

  const productImage = document.createElement("img");
  productImage.classList.add("product-image");
  productImage.src = product.image.url;
  productImage.alt = product.image.alt || product.title;

  const info = document.createElement("div");
  info.classList.add("product-info");

  const name = document.createElement("h2");
  name.classList.add("product-title");
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

  const description = document.createElement("p");
  description.classList.add("product-description");
  description.textContent = product.description;

  const tags = document.createElement("p");
  tags.classList.add("product-tags");
  tags.textContent = "Tags: " + product.tags.join(" / ");

  const cartBtn = document.createElement("a");
  cartBtn.textContent = "Go to cart";
  cartBtn.href = "../cart/index.html";
  cartBtn.classList.add("secondary-cta", "cta");

  let cta;
  if (isLoggedIn) {
    cta = document.createElement("button");
    cta.classList.add("cta");
    cta.textContent = "Add to cart";
    cta.addEventListener("click", () => {
      addToCart(product);
      showToast(`${product.title} added to your cart`);
    });
  } else {
    cta = document.createElement("a");
    cta.classList.add("cta");
    cta.textContent = "Log in to add to cart";
    cta.href = "../account/login.html";
  }

  const ctaArea = document.createElement("div");
  ctaArea.classList.add("cta-area");
  ctaArea.appendChild(cartBtn);
  ctaArea.appendChild(cta);

  info.append(
    name,
    priceArea,
    description,
    tags,
    shareButton(product),
    ctaArea,
  );
  top.append(productImage, info);

  const rated = document.createElement("div");
  rated.classList.add("product-rating");

  const ratedLabel = document.createElement("span");
  ratedLabel.classList.add("rated-label");
  ratedLabel.textContent = "RATED";

  const ratedStars = document.createElement("span");
  ratedStars.classList.add("stars");
  const ratedFilled = Math.max(0, Math.min(5, Math.round(product.rating || 0)));
  ratedStars.textContent =
    "★".repeat(ratedFilled) + "☆".repeat(5 - ratedFilled);
  ratedStars.setAttribute("aria-label", `${ratedFilled} out of 5 stars`);

  const ratedNumber = document.createElement("span");
  ratedNumber.classList.add("rated-number");
  ratedNumber.textContent = `(${product.rating})`;

  rated.append(ratedLabel, " ", ratedNumber, " ", ratedStars);

  const reviewsSection = document.createElement("section");
  reviewsSection.classList.add("reviews-section");

  const reviewsHeading = document.createElement("h2");
  reviewsHeading.classList.add("reviews-heading");
  reviewsHeading.textContent = "REVIEWS";
  reviewsSection.appendChild(reviewsHeading);

  if (!product.reviews || product.reviews.length === 0) {
    const noReviews = document.createElement("p");
    noReviews.classList.add("no-reviews");
    noReviews.textContent = "No reviews yet";
    reviewsSection.appendChild(noReviews);
  } else {
    const reviewCards = product.reviews.map((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.classList.add("single-review");

      const reviewStars = document.createElement("span");
      reviewStars.classList.add("stars");
      const reviewFilled = Math.max(
        0,
        Math.min(5, Math.round(review.rating || 0)),
      );
      reviewStars.textContent =
        "★".repeat(reviewFilled) + "☆".repeat(5 - reviewFilled);
      reviewStars.setAttribute("aria-label", `${reviewFilled} out of 5 stars`);

      const reviewText = document.createElement("p");
      reviewText.classList.add("review-text");
      reviewText.textContent = review.description;

      const reviewAuthor = document.createElement("p");
      reviewAuthor.classList.add("review-author");
      reviewAuthor.textContent = `-${review.username}`;

      reviewCard.append(reviewStars, reviewText, reviewAuthor);
      return reviewCard;
    });

    reviewsSection.append(...reviewCards);
  }

  productDetails.append(top, rated, reviewsSection);
  singleProduct.append(productDetails);
}

fetchProduct();
