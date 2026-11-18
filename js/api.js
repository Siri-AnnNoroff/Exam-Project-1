"use strict";

const API = "https://v2.api.noroff.dev/online-shop";

export async function getProducts() {
  const response = await fetch(API);
  if (!response.ok) {
    throw new Error(`Error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result.data;
}

export async function buildPagination(page, limit) {
  const response = await fetch(
    `https://v2.api.noroff.dev/online-shop?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error(`Error! Status: ${response.status}`);
  }
  return await response.json();
}
