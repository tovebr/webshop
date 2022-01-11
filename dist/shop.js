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
    if (!article.size) article.size = "big";
    if (!article.finish) article.finish = "matte";

    cardDiv.id = article.id;

    cardDiv.innerHTML = `<div class="img-container">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="info">
      <h3 class="title">${casedWords(article.title)}</h3>
      <p><span class="category">Price: </span>${article.price} kr</p>
      <p><span class="category">Series: </span>${casedWords(article.series)}</p>
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
  .forEach((el) => el.addEventListener("click", (e) => createModal(e)));
document
  .querySelectorAll(".btn-buy")
  .forEach((el) =>
    el.addEventListener("click", (e) =>
      addToCart(e.target.parentNode.parentNode.parentNode.id)
    )
  );

function cartList() {
  cart.articles.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else {
      return 0;
    }
  });

  let html = "";

  if (cart.articles.length > 0) {
    cart.articles.forEach((article) => {
      html += `<li id="${
        article.cartId
      }"><div class="header"><div class="img-container"><img src="${
        article.img
      }"></div><h3 class="article-title">${casedWords(
        article.title
      )}</h3></div><div class="print-select"><div>
      <label for="size">Size</label><select name="size" id="size" class="print-option">
      <option value="big">70x90</option>
      <option value="medium" ${
        article.size === "medium" ? "selected" : ""
      }>50x70</option>
      <option value="small" ${
        article.size === "small" ? "selected" : ""
      }>30x20</option>
    </select></div>
    <div>
    <label for="finish">Finish</label>
    <select name="paper" id="paper" class="print-option">
      <option value="matte" >Matte</option>
      <option value="glossy" ${
        article.finish === "glossy" ? "selected" : ""
      }>Glossy</option>
    </select></div></div><p class="article-price">${
      article.price
    } kr</p><i class="bi bi-trash"></i></li>`;
    });
  } else {
    html += emptyCartMessage();
  }
  return html;
}

function emptyCartMessage() {
  return `<li class="empty-message"><h2>Your cart is empty</h2></li>`;
}

function calcTotal() {
  let sum = 0;
  if (cart.articles.length > 0)
    cart.articles.forEach((article) => (sum += article.price));
  return sum;
}

function createModal(e) {
  const position = window.scrollY;

  let modalWindow = document.createElement("div");
  modalWindow.classList.add("modal");

  modalWindow.innerHTML = modalFilling(e);

  /* articlesContainer.body.style.top = `${position}px`; */
  document.body.style.position = "fixed";
  document.body.appendChild(modalWindow);

  let stored = "";

  if (e.target.parentNode.parentNode.parentNode.classList.contains("card")) {
    stored = "articles";
    document
      .querySelector(".btn-more-buy")
      .addEventListener("click", () =>
        addToCart(e.target.parentNode.parentNode.parentNode.id)
      );
  }

  /* stored === "" && stored === "cart.articles"; */
  Array.from(document.querySelectorAll(".print-option")).forEach((select) =>
    select.addEventListener("change", () => {
      calcPrice({
        id:
          stored === "articles"
            ? e.target.parentNode.parentNode.parentNode.id
            : select.parentNode.parentNode.id,

        choosen: select.value,
        /* arrayStored: stored, */
      });
    })
  );
}

function modalFilling(e) {
  let html = "";

  if (e.target.parentNode.parentNode.parentNode.classList.contains("card")) {
    const id = e.target.parentNode.parentNode.parentNode.id;

    html = `<div class="more">
    <i class="bi bi-x"></i>
    <div class="img-container">

      <img src="${articles[id].img}" alt="">
    </div>
    <div class="more-info">
      <h3>${casedWords(articles[id].title)}</h3>
      <label for="size">Size</label>
      <select name="size" id="size" class="print-option">
      <option value="big">70x90</option>
      <option value="medium" ${
        articles[id].size === "medium" ? "selected" : ""
      }>50x70</option>
      <option value="small" ${
        articles[id].size === "small" ? "selected" : ""
      }>30x20</option>
      </select>
      <label for="finish">Finish</label>
      <select name="paper" id="paper" class="print-option">
      <option value="matte" >Matte</option>
      <option value="glossy" ${
        articles[id].finish === "glossy" ? "selected" : ""
      }>Glossy</option>
      </select>
      <small>Price</small>
      <p class="price">${articles[id].price} kr</p>
      <button class="btn btn-more-buy">Add to cart</button>
    </div>
  </div>`;
  } else if (e.target.classList.contains("bi-bag")) {
    html = `<div class="cart"><i class="bi bi-x"></i>
    <div class="cart-holder">
      <ul class="cart-list">
      ${cartList()}
      </ul>
      </div>
      <div class="summary">
        <h3>Total</h3><p class="price-total">${calcTotal()} kr</p>
      </div>
      <button class="toCheckout" >Proceed to Checkout</button>
  </div>`;
  }

  return html;
}

document
  .querySelector(".bi-bag")
  .addEventListener("click", (e) => createModal(e));

document.querySelector("body").addEventListener("click", (e) => {
  const modal = document.querySelector(".modal");
  if (
    e.target.classList.contains("bi-x") ||
    e.target.classList.contains("modal") ||
    (e.target.classList.contains("btn-more-buy") && modal)
  ) {
    modal.parentNode.removeChild(modal);
    document.body.style.position = "";
    /*  document.body.style.top = ""; */
  } else if (e.target.classList.contains("bi-trash")) {
    deleteFromCart(e.target);
  }
});

function deleteFromCart(el) {
  cart.articles.splice(
    Number(cart.articles.findIndex((art) => art.cartId == el.parentNode.id)),
    1
  );

  el.parentNode.parentNode.removeChild(el.parentNode);
  document.querySelector(".price-total").innerText = `${calcTotal()} kr`;
  if (cart.articles.length === 0) {
    document.querySelector(".cart-holder").innerHTML = emptyCartMessage();
  }
  displayCartCount();
}

function calcPrice(arg) {
  const { id, choosen } = arg;

  let article;

  if (Number(id) >= 100) {
    article = cart.articles.find((article) => Number(article.cartId) == id);
  } else {
    article = articles.find((article) => Number(article.id) == id);
  }

  const printConfig = {
    finish: {
      matte: 0,
      glossy: 300,
    },
    size: {
      big: 0,
      medium: -250,
      small: -500,
    },
  };

  const sizePriceChange = 250;
  const finishPriceChange = 300;

  if (choosen === "glossy" || choosen === "matte") {
    if (article.finish === "matte" && choosen === "glossy") {
      article.price += finishPriceChange;
      console.log(choosen);
    }
    if (article.finish === "glossy" && choosen === "matte") {
      article.price -= finishPriceChange;
    }
    article.finish = choosen;
  } else {
    if (article.size === "big" && choosen === "small") {
      console.log(choosen);
      article.price -= sizePriceChange * 2;
      console.log(sizePriceChange * 2);
    }
    if (article.size === "big" && choosen === "medium") {
      article.price -= sizePriceChange;
    }
    if (article.size === "medium" && choosen === "big") {
      article.price += sizePriceChange;
    }
    if (article.size === "medium" && choosen === "small") {
      article.price -= sizePriceChange;
    }
    if (article.size === "small" && choosen === "big") {
      article.price += sizePriceChange * 2;
    }
    if (article.size === "small" && choosen === "medium") {
      article.price += sizePriceChange;
    }
    article.size = choosen;
  }
  console.log(article.price);
  displayNewPrice(article);
}

function displayNewPrice(article) {
  console.log(article.cartId);
  if (article.cartId) {
    document
      .getElementById(article.cartId)
      .querySelector(".article-price").innerText = `${article.price} kr`;
  } else {
    document.querySelector(".price").innerText = `${article.price} kr`;
  }

  document.querySelector(".price-total").innerText = `${calcTotal()} kr`;
}

function addToCart(id) {
  const finish = document.getElementById("paper");
  const size = document.getElementById("size");

  const boughtArticle = JSON.parse(
    JSON.stringify(articles.find((article) => Number(article.id) == id))
  );

  size ? (boughtArticle.size = size.value) : (boughtArticle.size = "big");
  finish
    ? (boughtArticle.finish = finish.value)
    : (boughtArticle.finish = "matte");

  if (cart.articles.length === 0) {
    boughtArticle.cartId = 100;
  } else if (cart.articles.length === 1) {
    boughtArticle.cartId = cart.articles[0].cartId + 1;
  } else if (cart.articles.length > 1) {
    boughtArticle.cartId =
      cart.articles.reduce(
        (curr, prev) => (curr > prev.cartId ? curr : prev.cartId),
        0
      ) + 1;
  }

  cart.articles.push(boughtArticle);

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartCount();
}

function displayCartCount() {
  const counterHTML = document.querySelector(".cart-count");
  if (cart.articles.length > 0) {
    if (counterHTML) {
      counterHTML.innerHTML = cart.articles.length;
    } else {
      const counter = `<p class="cart-count">${cart.articles.length}</p>`;
      document
        .querySelector(".cart-link")
        .insertAdjacentHTML("beforeend", counter);
    }
  } else {
    counterHTML.parentNode.removeChild(counterHTML);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("cart");

  if (ref) {
    cart = JSON.parse(ref);
    displayCartCount();
  }
});
