let slideIndex = 0;

function slideShow() {
  const images = Array.from(document.getElementsByClassName("carousel-item"));
  images.forEach((item) => (item.style.display = "none"));
  slideIndex = slideIndex > images.length - 1 ? 1 : slideIndex + 1;
  images[slideIndex - 1].style.display = "block";
  setTimeout(slideShow, 3000);
}

slideShow();
