"use strict";

import { addToCart } from "./cart-logic.js";

const API = "https://v2.api.noroff.dev";

const loginPage = document.getElementById("login");
const loginForm = document.getElementById("login-form");
const message = document.querySelector("#form-message");
const submitBtn = document.getElementById("login-btn");
const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

let cta;

if (isLoggedIn) {
  loginPage.innerHTML = "";
  const loginMessage = document.createElement("p");
  loginMessage.classList.add("login-message");
  loginMessage.textContent = "You are already logged in";

  cta = document.createElement("a");
  cta.classList.add("cta");
  cta.textContent = "Back to products";
  cta.href = "../index.html";

  const logOutBtn = document.createElement("button");
  logOutBtn.classList.add("cta");
  logOutBtn.textContent = "Sign out";
  logOutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("user");
    window.location.reload();
  });

  loginPage.append(loginMessage, cta, logOutBtn);
}

function showMessage(text, type = "error") {
  message.textContent = text;
  message.style.color = type === "error" ? "crimson" : "green";
}

function loginValidation({ email, password }) {
  const errors = [];

  if (!/^[\w\-.]+@stud\.noroff\.no$/i.test(email)) {
    errors.push("Email must be a valid @stud.noroff.no address.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  return errors;
}

async function login({ email, password }) {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error("Login failed.");
  }
  return json.data;
}

async function buildApiKey(accessToken) {
  const response = await fetch(`${API}/auth/create-api-key`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name: "Online shop" }),
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error("Could not create access token.");
  }
  return json.data.key;
}

function storeSession({ accessToken, apiKey, user }) {
  try {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    throw new Error("Unable to store session");
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");

  const formInput = new FormData(loginForm);
  const input = {
    email: formInput.get("email"),
    password: formInput.get("password"),
  };

  const errors = loginValidation(input);
  if (errors.length) {
    showMessage(errors.join(" "));
    return;
  }

  try {
    const { accessToken, ...user } = await login(input);
    const apiKey = await buildApiKey(accessToken);

    storeSession({ accessToken, apiKey, user });
    showMessage("Logged in! Redirecting to products...", "success");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } catch (error) {
    showMessage("Unable to log in");
  }
});
