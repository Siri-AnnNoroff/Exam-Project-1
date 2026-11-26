/**
@param {string} message
@param {"success" | "error"} type
 */

export function showToast(message, type = "success", { showCta = true } = {}) {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    document.body.appendChild(toastContainer);
  }
  let toastElement = document.createElement("div");
  toastElement.classList.add("toast", type);
  toastElement.textContent = message;

  if (showCta) {
    const toastBtn = document.createElement("a");
    toastBtn.href = "../cart/index.html";
    toastBtn.classList.add("cta");
    toastBtn.textContent = "Go to cart";
    toastElement.appendChild(toastBtn);
  }

  toastContainer.appendChild(toastElement);

  setTimeout(() => toastElement.remove(), 4000);
}
