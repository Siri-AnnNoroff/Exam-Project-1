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

  const successIcon = document.createElement("i");
  successIcon.classList.add("fa-regular", "fa-star");

  const confirmationText = document.createElement("p");

  const orderNumber = document.createElement("strong");
  orderNumber.textContent = "12345";

  const email = document.createElement("strong");
  email.textContent = getEmail();

  confirmationText.append(
    "Thank you for your purchase. Your order number is ",
    orderNumber,
    ". A confirmation e-mail will be sent to you shortly at ",
    email,
    ".",
  );

  successPage.append(h2, successIcon, confirmationText);
}

buildSuccessPage();
