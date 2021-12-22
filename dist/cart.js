let cart = { articles: [] };

/* localStorage.setItem("cart", JSON.stringify(cart)); */

function displayCartCount() {
  const counterHTML = document.querySelector(".cart-count");
  if (counterHTML) {
    counterHTML.innerHTML = cart.articles.length;
    console.log(cart.articles.length);
  } else {
    console.log(cart.articles.length);
    const counter = `<p class="cart-count">${cart.articles.length}</p>`;
    document
      .querySelector(".cart-link")
      .insertAdjacentHTML("beforeend", counter);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("cart");
  if (ref) {
    cart = JSON.parse(ref);
    displayCartCount();
  }
});

console.log(cart);
