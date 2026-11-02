"use strict";

const API = "https://v2.api.noroff.dev/online-shop";

const currencySymbol = "$";

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
    buildSinglePeroduct(data);
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

function buildSinglePeroduct(product) {
  const singleProduct = document.getElementById("single-product");
  const productDetails = document.createElement("div");
  productDetails.classList.add("product-details");

  const productImage = document.createElement("img");
  productImage.classList.add("product-image");
  productImage.src = product.image.url;
  productImage.alt = product.image.alt;

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

  const description = document.createElement("p");
  description.textContent = product.description;

  const tags = document.createElement("p");
  tags.textContent = "Tags: " + product.tags;

  const cta = document.createElement("a");
  cta.classList.add("carousel-cta");
  cta.textContent = "Log in to add to cart";
  cta.addEventListener("click", function () {
    window.location.href = "../account/login.html";
  });

  productDetails.append(
    productImage,
    name,
    priceArea,
    description,
    tags,
    shareButton(product),
    cta,
  );
  singleProduct.append(productDetails);
}

fetchProduct();
