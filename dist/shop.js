let prevScrollpos = window.pageYOffset;

const searchClear = document.querySelector(".clear");
const articlesContainer = document.querySelector(".articles-display");
const searchInputs = Array.from(document.querySelectorAll(".search-input"));

let searchResult = [];
let cart = { articles: [] };

/* Funktion that shows or hides navbar depending on scrolldirection */
window.onscroll = function () {
  let currentScrollpos = window.pageYOffset;
  if (prevScrollpos > currentScrollpos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-65px";
  }
  prevScrollpos = currentScrollpos;
};

// add article to cart/buy
function addToCart(id) {
  // get elements
  const finish = document.getElementById("paper");
  const size = document.getElementById("size");

  // copy article
  const boughtArticle = JSON.parse(
    JSON.stringify(articles.find((article) => Number(article.id) == id))
  );

  // set attributes that only bought articles should have
  boughtArticle.quantity = 1;

  // ifthere is a size-input and user has changed its value, set value to article
  // else defualt values
  size ? (boughtArticle.size = size.value) : (boughtArticle.size = "big");
  finish
    ? (boughtArticle.finish = finish.value)
    : (boughtArticle.finish = "matte");

  // give article uniqe cartId
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

  // save article in cart
  cart.articles.push(boughtArticle);

  // save cart in localstorage
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartCount();
}

// show count of articles in cart
function displayCartCount() {
  const counterHTML = document.querySelector(".cart-count");
  // if cart is not empty
  if (cart.articles.length > 0) {
    // if there is a counter
    if (counterHTML) {
      // update counter
      counterHTML.innerHTML = cart.articles.length;
    } else {
      // create counter
      const counter = `<p class="cart-count">${cart.articles.length}</p>`;
      document
        .querySelector(".cart-link")
        .insertAdjacentHTML("beforeend", counter);
    }
  } else {
    // if cart is empty and counter exist, remote counter
    counterHTML && counterHTML.parentNode.removeChild(counterHTML);
  }
}

// when any of the search/sort-fields has been changed
function search() {
  const searchOrientation = document.getElementById("orientation");
  const searchSeries = document.getElementById("series");
  const searchFree = document.getElementById("free-search");
  const sortPrice = document.querySelector(".sort-by-input");

  // search/sort-result are stored in array searchReault
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

  sortPrice.value === "none"
    ? printCards(searchResult)
    : sortByPrice(sortPrice.value);
}

// funtion that sorts current articles by price
function sortByPrice(choosen) {
  // determening if price-sorting should be done to array of searchresults or all articles
  // copying array
  const articlesArr =
    searchResult.length > 0 ? [...searchResult] : [...articles];

  if (choosen === "price-low" && articlesArr.length > 1)
    articlesArr.sort((a, b) => a.price - b.price);

  if (choosen === "price-high" && articlesArr.length > 1)
    articlesArr.sort((a, b) => b.price - a.price);

  // placing current array in searchResult
  searchResult = [...articlesArr];

  // printing result
  printCards(searchResult);
}

/* Function that formats titles and makes the first letter in a word uppercased */
function casedWords(string) {
  let casedString = "";

  /* If-statment determins wether the title has one word or more */
  if (string.includes(" ")) {
    string.split(" ").forEach((word) => {
      casedString += word.slice(0, 1).toUpperCase() + word.slice(1) + " ";
    });
  } else {
    casedString = string.slice(0, 1).toUpperCase() + string.slice(1);
  }
  return casedString;
}

/* Function that prints all current articles, it varies if there has been a selection */
function printCards(articlesArray) {
  /* determins wether arg-array is the array containing all articles */
  if (articlesArray.length === articles.length) {
    /* resets searchresult array */
    searchResult = [];
    // sorts articles based on id
    articles.sort((a, b) => a.id - b.id);
  }

  /* empty whats currently printed */
  articlesContainer.innerHTML = "";

  // loop through all articles
  articlesArray.forEach((article, i) => {
    // create div
    const cardDiv = document.createElement("div");
    cardDiv.classList = "card";

    // gives each article certain atributes after checking if its already been done
    if (!article.id) article.id = i;
    if (!article.size) article.size = "big";
    if (!article.finish) article.finish = "matte";

    cardDiv.id = article.id;

    // html for the article
    cardDiv.innerHTML = `<div class="img-container">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="info">
      <h3 class="title">${casedWords(article.title)}</h3>
      <p><span class="category">Price: </span>${formatPrice(
        String(article.price)
      )} kr</p>
      <p><span class="category">Series: </span>${casedWords(article.series)}</p>
      <div class="btn-group">

        <button class="btn btn-buy">Buy</button>
        <button class="btn btn-more">More</button>
      </div>
    </div>`;

    //insert element
    articlesContainer.insertAdjacentElement("beforeend", cardDiv);
  });

  // add eventlistener to all buttons that have been inserted to DOM
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
}

// creating html-elements for all articles in cart to view them
function cartList() {
  // sort them alphabetically
  cart.articles.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else {
      return 0;
    }
  });

  // intiate variable
  let html = "";

  // for all articles a element is created
  if (cart.articles.length > 0) {
    cart.articles.forEach((article) => {
      html += `<li id="${
        article.cartId
      }"><div class="header"><div class="img-container"><img src="${
        article.img
      }"></div><h3 class="article-title">${casedWords(
        article.title
      )}</h3></div><div><div><input type="number" min="1" class="number print-option" value="${
        article.quantity || 1
      }"></div></div><div class="print-select"><div>
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
    </select></div></div><p class="article-price">${formatPrice(
      String(article.price)
    )} kr</p><i class="bi bi-trash"></i></li>`;
    });
  } else {
    // if cart is empty
    html += emptyCartMessage();
  }
  return html;
}

// returns empty-cart message
function emptyCartMessage() {
  return `<li class="empty-message"><h2>Your cart is empty</h2></li>`;
}

// calculate total cost of articles in cart and returns a printable formated string
function calcTotal() {
  let sum = String(cart.articles.reduce((prev, cur) => prev + cur.price, 0));

  if (sum.length > 3) sum = formatPrice(sum);

  return sum;
}

// formats prices
function formatPrice(price) {
  return price.slice(0, -3) + " " + price.slice(-3);
}

// function that creates modal window
function createModal(e) {
  // where on the page the functino was called
  const position = window.scrollY;

  // what element to insert modal window into
  const fullPage = document.getElementById("articles");

  // create modal window
  let modalWindow = document.createElement("div");
  modalWindow.classList.add("modal");

  // create what should be in the modal window
  modalWindow.innerHTML = modalFilling(e, position);

  //insert modal window into page
  fullPage.appendChild(modalWindow);

  //initiate variable to keep track of what arguemnt should be passed to callback functions
  let stored = "";

  // eventlistener for buttons in modalwindow
  if (e.target.parentNode.parentNode.parentNode.classList.contains("card")) {
    stored = "articles";
    document
      .querySelector(".btn-more-buy")
      .addEventListener("click", () =>
        addToCart(e.target.parentNode.parentNode.parentNode.id)
      );
  }

  // eventlistener for select/option in modalwindow
  Array.from(document.querySelectorAll(".print-option")).forEach((select) =>
    select.addEventListener("change", () => {
      calcPrice({
        id:
          stored === "articles"
            ? e.target.parentNode.parentNode.parentNode.id
            : select.parentNode.parentNode.parentNode.id,
        choosen: select.value,
      });
    })
  );
}

// create filling for modal depending on what button brought you here
function modalFilling(e, position) {
  let html = "";

  // if button was pressed to see more info about article
  if (e.target.parentNode.parentNode.parentNode.classList.contains("card")) {
    const id = e.target.parentNode.parentNode.parentNode.id;

    // using position to place element in users view
    html = `<div class="more" style="top: ${position}px;">
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
      <p class="price">${formatPrice(String(articles[id].price))} kr</p>
      <button class="btn btn-more-buy">Add to cart</button>
    </div>
  </div>`;
    //if modal should show cart
  } else if (e.target.classList.contains("bi-bag")) {
    html = `<div id="cart" class="cart" style="top: ${position}px;"><i class="bi bi-x"></i>
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

// delete article from cart
function deleteFromCart(id) {
  // delete from cart-array
  cart.articles.splice(
    Number(cart.articles.findIndex((art) => art.cartId == id)),
    1
  );

  // delete from ui
  document
    .getElementById(id)
    .parentNode.removeChild(document.getElementById(id));

  // recalculate and display new total-price
  document.querySelector(".price-total").innerText = `${calcTotal()} kr`;

  // if cart is empty
  if (cart.articles.length === 0) {
    document.querySelector(".cart-holder").innerHTML = emptyCartMessage();
  }

  // update localstorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // show how many products are in the cart
  displayCartCount();
}

// calculate price for article if specs are changed
function calcPrice(arg) {
  // recive id of product and what new spec user choose
  const { id, choosen } = arg;

  // initiate variable to save article in
  let article;

  // determine wether the article is in cart or not
  // id over 100 ? article is in cart
  if (Number(id) >= 100) {
    article = cart.articles.find((article) => Number(article.cartId) == id);
  } else {
    article = articles.find((article) => Number(article.id) == id);
  }

  // pricechanges
  const sizePriceChange = 250;
  const finishPriceChange = 300;

  // determine what category has been changed
  if (choosen === "glossy" || choosen === "matte") {
    if (article.finish === "matte" && choosen === "glossy") {
      // recalculate price
      article.price += finishPriceChange;
    }
    if (article.finish === "glossy" && choosen === "matte") {
      article.price -= finishPriceChange;
    }
    // save new printoption to article
    article.finish = choosen;
  } else if (Number(choosen)) {
    // if quantity was changed
    let newQuantity = Number(choosen);

    if (newQuantity > article.quantity)
      article.price = (article.price / article.quantity) * newQuantity;
    if (newQuantity < article.quantity)
      article.price = (article.price / article.quantity) * newQuantity;

    article.quantity = newQuantity;
  } else {
    // recalculate prices depending on previous and current size
    if (article.size === "big" && choosen === "small") {
      article.price -= sizePriceChange * 2;
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

    // set new size on article
    article.size = choosen;
  }

  // display new price
  displayNewPrice(article);
}

// display new price
function displayNewPrice(article) {
  // determin wether the article is in cart or not, different selectors
  if (article.cartId) {
    document
      .getElementById(article.cartId)
      .querySelector(".article-price").innerText = `${formatPrice(
      String(article.price)
    )} kr`;
    document.querySelector(".price-total").innerText = `${calcTotal()} kr`;
  } else {
    document.querySelector(".price").innerText = `${formatPrice(
      String(article.price)
    )} kr`;
  }
}

//----------------EVENTLISTENERS----------------

// add eventlisteners to all search/sort-inputs
searchInputs.forEach((el) =>
  el.addEventListener(`${el.tagName === "SELECT" ? "change" : "keyup"}`, search)
);

// add eventlistener to sort articles by price
document
  .getElementById("sort-by")
  .addEventListener("change", (e) => sortByPrice(e.target.value));

// add eventlistener to clear-search-button
searchClear.addEventListener("click", (e) => {
  printCards(articles);
});

// eventlistener that hears user-clicks to view cart
document
  .querySelector(".bi-bag")
  .addEventListener("click", (e) => createModal(e));

// eventlistener that handles clicks while modal is open
document.querySelector("body").addEventListener("click", (e) => {
  const modal = document.querySelector(".modal");
  if (
    e.target.classList.contains("bi-x") ||
    e.target.classList.contains("modal") ||
    (e.target.classList.contains("btn-more-buy") && modal)
  ) {
    modal.parentNode.removeChild(modal);
  } else if (e.target.classList.contains("bi-trash")) {
    deleteFromCart(e.target.parentNode.id);
  }
});

// initial printing of all articles
printCards(articles);

// get cart from localstorage if there is one
document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("cart");
  if (ref) {
    cart = JSON.parse(ref);
    displayCartCount();
  }
});
