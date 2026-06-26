window.addEventListener("DOMContentLoaded", () => {

  // =========================
  // スライドショー（表紙用）
  // =========================

  const images = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
    "img7.png",
    "img8.png",
    "img9.png",
    "img10.png",
    "img11.png",
    "img12.png",
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