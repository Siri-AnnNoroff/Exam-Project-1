/**
@param {string} message
@param {"success" | "error"} type
 */

export function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    document.body.appendChild(toastContainer);
  }
  let toastElement = document.createElement("div");
  toastElement.classList.add("toast", type);
  toastElement.textContent = message;
  toastContainer.appendChild(toastElement);

  setTimeout(() => toastElement.remove(), 4000);
}
