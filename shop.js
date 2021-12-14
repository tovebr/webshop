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
console.log(searchInputs);

const searchClear = document.querySelector(".clear");

function search() {
  const searchOrientation = document.getElementById("orientation");
  const searchSeries = document.getElementById("series");
  const searchFree = document.getElementById("free-search");

  const searchResult = articles
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

searchClear.addEventListener("click", () => {
  console.log("clr");
  searchInputs.forEach((el) => {
    console.log(el.value);
    if (el.value !== "none" || el.value !== "") {
      console.log(el);
      el.tagName === "SELECT" ? el.selectedIndex === -1 : el.value === "";
    }
  });
});
