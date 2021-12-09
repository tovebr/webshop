let prevScrollpos = window.pageYOffset;
console.log(prevScrollpos);
window.onscroll = function () {
  let currentScrollpos = window.pageYOffset;
  console.log(currentScrollpos);

  if (prevScrollpos > currentScrollpos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-65px";
  }

  prevScrollpos = currentScrollpos;
};

const articlesContainer = document.querySelector(".articles-display");
function printCards(articles) {
  articles.forEach((article, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList = "card";
    cardDiv.id = article.id = i;
    cardDiv.innerHTML = `<div class="img-container">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="info">
      <h3 class="title">${article.title}</h3>
      <p><span class="category">Price: </span>${article.price} kr</p>
      <p><span class="category">Series: </span>${
        article.series ? article.series : "Freestanding"
      }</p>
      <div class="btn-group">

        <button class="btn btn-buy">Buy</button>
        <button class="btn btn-more">More</button>
      </div>
    </div>`;

    articlesContainer.insertAdjacentElement("beforeend", cardDiv);
  });
}

printCards(articles);
