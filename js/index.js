window.addEventListener("DOMContentLoaded", () => {

  // =========================
  // スライドショー（表紙用）
  // =========================

  const images = [
    "images/img1.png",
    "images/img2.png",
    "images/img3.png",
    "images/img4.png",
    "images/img5.png",
    "images/img6.png",
    "images/img7.png",
    "images/img8.png",
    "images/img9.png",
    "images/img10.png",
    "images/img11.png",
    "images/img12.png",
  ];

  const slide = document.getElementById("slideImage");

  if (!slide) return;

  slide.src = images[0];
  slide.style.opacity = 1;

  let index = 0;

  function changeImage() {
    index = Math.floor(Math.random() * images.length);

    slide.style.opacity = 0;

    setTimeout(() => {
      slide.src = images[index];
      slide.style.opacity = 1;
    }, 300);
  }

  setInterval(changeImage, 3000);

});