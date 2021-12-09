function Article(title, price, orientation, img, series = false) {
  (this.title = title),
    (this.price = price),
    (this.orientation = orientation),
    (this.img = img),
    (this.series = series);
}

const articles = [
  new Article("bathing", 2000, "laying", "assets/anna-badar.jpg", "Anna"),
  new Article("sunset", 1500, "standing", "assets/anna-sunset.jpg", "Anna"),
  new Article("wading", 2500, "standing", "assets/anna-vattenbryn.jpg", "Anna"),
  new Article(
    "by the shore",
    2500,
    "laying",
    "assets/anna-vid-bryn-sitter.jpg",
    "Anna"
  ),
  new Article("bassbaby", 3000, "standing", "assets/basbaby.jpg", "Kontra"),
  new Article(
    "similarities",
    3000,
    "laying",
    "assets/cello-tove-kontra.jpg",
    "Kontra"
  ),
  new Article("glamour", 3000, "standing", "assets/glamourbass.jpg", "Kontra"),
  new Article("outdoors", 2500, "laying", "assets/kattmotage-2.jpg"),
  new Article(
    "the animal",
    3500,
    "laying",
    "assets/kontradjuret.jpg",
    "Kontra"
  ),
  new Article("pressure", 3000, "laying", "assets/kontrakross.jpg", "Kontra"),
  new Article(
    "intergrated",
    2500,
    "standing",
    "assets/kontraperson.jpg",
    "Kontra"
  ),
  new Article("walking", 3000, "laying", "assets/kontravandring.jpg", "Kontra"),
  new Article("shelter", 2500, "standing", "assets/kotra-tipi.jpg", "Kontra"),
  new Article("the thinker", 3700, "standing", "assets/thinker.jpg", "Kontra"),
  new Article("the skirt", 2500, "laying", "assets/tyllkjolsfixare.jpg"),
  new Article("winter", 3500, "laying", "assets/vinter.jpg"),
];
