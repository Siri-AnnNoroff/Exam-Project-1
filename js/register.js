"use strict";

import { addToCart } from "./cart-logic";

const API = "https://v2.api.noroff.dev";

const form = document.querySelector("#registration-form");
const message = document.querySelector("#form-message");
const submitBtn = form.querySelector("button[type='submit']");

function showMessage(text, type = "error") {
  message.textContent = text;
  message.style.color = type === "error" ? "crimson" : "green";
}

function validate({ name, email, password, confirmPassword }) {
  const errors = [];

  if (!/^[\w]+$/.test(name)) {
    errors.push("Name can only contain letters, numbers and underscores.");
  }

  if (!/^[\w\-.]+@stud\.noroff\.no$/i.test(email)) {
    errors.push("Email must be a valid @stud.noroff.no address.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }

  return errors;
}

async function registerUser({ name, email, password }) {
  const response = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    console.log(json);
    const apiMessage = "Registration failed. Please try again.";
    throw new Error(apiMessage);
  }

  return json.data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");

  const formData = new FormData(form);
  const values = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const errors = validate(values);
  if (errors.length) {
    showMessage(errors.join(" "));
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Registering...";

  try {
    await registerUser(values);
    showMessage("Account created! Redirecting to login...", "success");
    setTimeout(() => {
      window.location.href = "/account/login.html";
    }, 2000);
  } catch (error) {
    showMessage(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Register user";
  }
});
