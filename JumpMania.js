const carousels = document.querySelectorAll('.carousel');

carousels.forEach((carousel) => {
  let slideIndex = 0;
  const slides = carousel.querySelectorAll('.slide');
  const totalSlides = slides.length;

  function showSlide(index) {
    if (index < 0) {
      slideIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      slideIndex = 0;
    } else {
      slideIndex = index;
    }

    const offset = -slideIndex * 300;
    carousel.querySelector('.slides').style.transform = `translateX(${offset}px)`;
  }

  setInterval(() => {
    showSlide(slideIndex + 1);
  }, 3000);
});