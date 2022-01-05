function Article(
  title,
  price,
  orientation,
  img,
  series = "freestanding"
  /* size = "big",
  finish = "matte" */
) {
  (this.title = title),
    (this.price = price),
    (this.orientation = orientation),
    (this.img = img),
    (this.series = series);
  /* (this.size = size),
    (this.finish = finish) */
}

const articles = [
  new Article("bathing", 2000, "laying", "assets/anna-badar.jpg", "anna"),
  new Article("sunset", 1500, "standing", "assets/anna-sunset.jpg", "anna"),
  new Article("wading", 2500, "standing", "assets/anna-vattenbryn.jpg", "anna"),
  new Article(
    "by the shore",
    2500,
    "laying",
    "assets/anna-vid-bryn-sitter.jpg",
    "anna"
  ),
  new Article("bassbaby", 3000, "standing", "assets/basbaby.jpg", "kontra"),
  new Article(
    "similarities",
    3000,
    "laying",
    "assets/cello-tove-kontra.jpg",
    "kontra"
  ),
  new Article("glamour", 3000, "standing", "assets/glamourbass.jpg", "kontra"),
  new Article("outdoors", 2500, "laying", "assets/kattmotage-2.jpg"),
  new Article(
    "the animal",
    3500,
    "laying",
    "assets/kontradjuret.jpg",
    "kontra"
  ),
  new Article("pressure", 3000, "laying", "assets/kontrakross.jpg", "kontra"),
  new Article(
    "intergrated",
    2500,
    "standing",
    "assets/kontraperson.jpg",
    "kontra"
  ),
  new Article("walking", 3000, "laying", "assets/kontravandring.jpg", "kontra"),
  new Article("shelter", 2500, "standing", "assets/kotra-tipi.jpg", "kontra"),
  new Article("the thinker", 3700, "standing", "assets/thinker.jpg", "kontra"),
  new Article("the skirt", 2500, "laying", "assets/tyllkjolsfixare.jpg"),
  new Article("winter", 3500, "laying", "assets/vinter.jpg"),
];
