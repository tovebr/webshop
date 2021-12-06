let slideIndex = 0;

function slideShow() {
  const slides = Array.from(document.getElementsByClassName("carousel-item"));

  slides.forEach((slide) => (slide.style.display = "none"));

  slideIndex = slideIndex > slides.length - 1 ? 1 : slideIndex + 1;

  slides[slideIndex - 1].style.display = "block";
  setTimeout(slideShow, 5000);
}

slideShow();
