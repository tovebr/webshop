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

const searchOrientation = document.getElementById("orientation");
const searchSeries = document.getElementById("series");
const searchFree = document.getElementById("free-search");
const searchBtn = document.getElementById("btn-search");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const orientation = searchOrientation.value;
  const series = searchSeries.value;
  console.log(series);
  const searchWord = searchFree.value;

  const searchResult = articles
    .filter((article) =>
      orientation === "none" ? article : article.orientation === orientation
    )
    .filter((article) =>
      series === "none" ? article : article.series === series
    )
    .filter((article) =>
      searchWord === "" ? article : article.title.includes(searchWord)
    );

  console.log(searchResult);
});
