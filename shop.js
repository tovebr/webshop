let prevScrollpos = window.pageYOffset;

window.onscroll = function () {
  let currentScrollpos = window.pageYOffset;

  if (prevScrollpos > currentScrollpos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-65px";
  }

  prevScrollpos = currentScrollpos;
};

const articlesContainer = document.querySelector(".articles-display");

function printCards(articlesArray) {
  articlesContainer.innerHTML = "";
  articlesArray.forEach((article, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList = "card";
    cardDiv.id = article.id = i;
    let title;

    if (article.title.includes(" ")) {
      let titleWords = article.title.split(" ");
      let casedWords = "";
      titleWords.forEach((word) => {
        casedWords += word.slice(0, 1).toUpperCase() + word.slice(1) + " ";
      });
      title = casedWords;
    } else {
      title = article.title.slice(0, 1).toUpperCase() + article.title.slice(1);
    }

    cardDiv.innerHTML = `<div class="img-container">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="info">
      <h3 class="title">${title}</h3>
      <p><span class="category">Price: </span>${article.price} kr</p>
      <p><span class="category">Series: </span>${article.series}</p>
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

const searchClear = document.querySelector(".clear");
let searchResult;

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
        : article.title.includes(searchFree.value)
    );
  printCards(searchResult);
}

document.getElementById("sort-by").addEventListener("change", (e) => {
  const articlesArr = searchResult ? searchResult : articles;

  if (e.target.value === "price-low")
    searchResult = articlesArr.sort((a, b) => a.price - b.price);
  if (e.target.value === "price-high")
    searchResult = articlesArr.sort((a, b) => b.price - a.price);
  printCards(searchResult);
});

searchClear.addEventListener("click", () => {
  searchInputs.forEach((el) => {
    /* if (el.value !== "none" && el.tagName === "SELECT") {
      el.selectedIndex === Number("0");
      console.log(el.selectedIndex);
    }
    if (el.value !== "" && el.id === "free-search") {
      console.log(el.value);
      el.value === "";
    } */
    if (el.tagName === "SELECT") {
      console.log(el.value);
      el.defaultSelected;
    } else {
      console.log(el.value);
      el.value === "";
    }
  });
  searchResult = [];
  printCards(articles);
});

document
  .querySelectorAll(".btn-more")
  .forEach((el) => el.addEventListener("click", (e) => showMore(e)));

function showMore(e) {
  const id = e.target.parentNode.parentNode.parentNode.id;
  const html = `<div class="modal">
  <div class=" more">
    <i class="bi bi-x"></i>
    <div class="img-container">

      <img src="${articles[id].img}" alt="">
    </div>
    <div class="more-info">
      <h3>${
        articles[id].title.slice(0, 1).toUpperCase() +
        articles[id].title.slice(1)
      }</h3>
      <label for="size">Size</label>
      <select name="size" id="size">
        <option value="big">70x90</option>
        <option value="medium">50x70</option>
        <option value="small">30x20</option>
      </select>
      <label for="finisch">Finisch</label>
      <select name="paper" id="paper">
        <option value="matt">Matt</option>
        <option value="glossy">Glossy</option>
      </select>
      <small>Price</small>
      <p class="price">${articles[id].price} kr</p>
      <button class="btn btn-buy">Add to cart</button>
    </div>
  </div>
</div>`;

  document.querySelector("body").insertAdjacentHTML("beforeend", html);
}

document.querySelector("body").addEventListener("click", (e) => {
  const modal = document.querySelector(".modal");
  if (e.target.classList.contains("bi-x") && modal) {
    modal.parentNode.removeChild(modal);
  } else if (e.target.classList.contains("modal") && modal) {
    modal.parentNode.removeChild(modal);
  }
});
