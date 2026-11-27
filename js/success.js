"use strict";

const successPage = document.querySelector(".success-page");

function getEmail() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.email ?? "your email address";
  } catch (error) {
    return "your email address";
  }
}

function buildSuccessPage() {
  const h2 = document.createElement("h2");
  h2.textContent = "Success!";
  h2.classList.add("success-header");

  const successIcon = document.createElement("i");
  successIcon.classList.add("fa-regular", "fa-star");

  const confirmationText = document.createElement("p");

  const orderNumber = document.createElement("strong");
  orderNumber.textContent = "314159";

  const email = document.createElement("strong");
  email.textContent = getEmail();

  confirmationText.append(
    "Thank you for your purchase. Your order number is ",
    orderNumber,
    ". A confirmation e-mail will be sent to you shortly at ",
    email,
    ".",
  );

  const backBtn = document.createElement("a");
  backBtn.classList.add("cta");
  backBtn.href = "../index.html";
  backBtn.textContent = "Back to products";

  successPage.append(h2, successIcon, confirmationText, backBtn);
}

buildSuccessPage();
