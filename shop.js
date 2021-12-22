let prevScrollpos = window.pageYOffset;
const searchClear = document.querySelector(".clear");

const articlesContainer = document.querySelector(".articles-display");
let searchResult;
let cart = { articles: [] };

window.onscroll = function () {
  let currentScrollpos = window.pageYOffset;

  if (prevScrollpos > currentScrollpos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-65px";
  }

  prevScrollpos = currentScrollpos;
};

function casedWords(string) {
  let casedString = "";
  if (string.includes(" ")) {
    string.split(" ").forEach((word) => {
      casedString += word.slice(0, 1).toUpperCase() + word.slice(1) + " ";
    });
  } else {
    casedString = string.slice(0, 1).toUpperCase() + string.slice(1);
  }
  return casedString;
}

function printCards(articlesArray) {
  if (articlesArray.length === articles.length) {
    searchResult = [];
    articles.sort((a, b) => a.id - b.id);
  }
  articlesContainer.innerHTML = "";
  articlesArray.forEach((article, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList = "card";
    if (!article.id) article.id = i;
    cardDiv.id = article.id;

    const title = casedWords(article.title);
    const series = casedWords(article.series);

    cardDiv.innerHTML = `<div class="img-container">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="info">
      <h3 class="title">${title}</h3>
      <p><span class="category">Price: </span>${article.price} kr</p>
      <p><span class="category">Series: </span>${series}</p>
      <div class="btn-group">

        <button class="btn btn-buy">Buy</button>
        <button class="btn btn-more">More</button>
      </div>
    </div>`;

    articlesContainer.insertAdjacentElement("beforeend", cardDiv);
  });
}

printCards(articles);

const searchInputs = Array.from(document.querySelectorAll(".search-input"));

searchInputs.forEach((el) =>
  el.addEventListener(`${el.tagName === "SELECT" ? "change" : "keyup"}`, search)
);

function search() {
  const searchOrientation = document.getElementById("orientation");
  const searchSeries = document.getElementById("series");
  const searchFree = document.getElementById("free-search");

  searchResult = articles
    .filter((article) =>
      searchOrientation.value === "none"
        ? article
        : article.orientation === searchOrientation.value
    )
    .filter((article) =>
      searchSeries.value === "none"
        ? article
        : article.series === searchSeries.value
    )
    .filter((article) =>
      searchFree.value === ""
        ? article
        : article.title.includes(searchFree.value) ||
          article.series.includes(searchFree.value)
    );
  printCards(searchResult);
}

document.getElementById("sort-by").addEventListener("change", (e) => {
  const articlesArr = searchResult ? searchResult : articles;

  if (e.target.value === "price-low" && articlesArr.length > 1)
    searchResult = articlesArr.sort((a, b) => a.price - b.price);
  if (e.target.value === "price-high" && articlesArr.length > 1)
    searchResult = articlesArr.sort((a, b) => b.price - a.price);
  printCards(searchResult);
});

searchClear.addEventListener("click", (e) => {
  printCards(articles);
});

document
  .querySelectorAll(".btn-more")
  .forEach((el) => el.addEventListener("click", (e) => showMore(e)));
document
  .querySelectorAll(".btn-buy")
  .forEach((el) => el.addEventListener("click", (e) => addToCart(e)));

function showMore(e) {
  const position = window.scrollY;
  const id = e.target.parentNode.parentNode.parentNode.id;
  const html = `<div class="modal">
  <div class=" more">
    <i class="bi bi-x"></i>
    <div class="img-container">

      <img src="${articles[id].img}" alt="">
    </div>
    <div class="more-info">
      <h3>${casedWords(articles[id].title)}</h3>
      <label for="size">Size</label>
      <select name="size" id="size">
        <option value="big">70x90</option>
        <option value="medium">50x70</option>
        <option value="small">30x20</option>
      </select>
      <label for="finish">Finish</label>
      <select name="paper" id="paper">
        <option value="matte">Matte</option>
        <option value="glossy">Glossy</option>
      </select>
      <small>Price</small>
      <p class="price">${articles[id].price} kr</p>
      <button class="btn btn-more-buy">Add to cart</button>
    </div>
  </div>
</div>`;

  /* articlesContainer.body.style.top = `${position}px`; */
  document.body.style.position = "fixed";
  document.body.insertAdjacentHTML("beforeend", html);

  document
    .querySelector(".btn-more-buy")
    .addEventListener("click", (e) => addToCart(e));
}

document.querySelector("body").addEventListener("click", (e) => closeModal(e));

function closeModal(e) {
  const modal = document.querySelector(".modal");
  if (
    e.target.classList.contains("bi-x") ||
    e.target.classList.contains("modal") ||
    (e.target.classList.contains("btn-more-buy") && modal)
  ) {
    modal.parentNode.removeChild(modal);
    document.body.style.position = "";
    /*  document.body.style.top = ""; */
  }
}

function addToCart(e) {
  const id = e.target.parentNode.parentNode.parentNode.id;
  cart.articles.push(articles.find((article) => Number(article.id) == id));
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartCount();
}

function displayCartCount() {
  const counterHTML = document.querySelector(".cart-count");
  if (counterHTML) {
    counterHTML.innerHTML = cart.articles.length;
  } else {
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
