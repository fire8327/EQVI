/* slider */
const swiper = new Swiper('.daySlider', {
    loop: true,
    loopedSlides: 6,
    grabCursor: true,
    slidesPerView: 1.8,
    spaceBetween: 27,

    breakpoints: {
        640: {
          slidesPerView: 3.3,
        },
        1024: {
          slidesPerView: 4, 
        },
        1280: {
          slidesPerView: 6,
        }
      },
  
    // If we need pagination
    pagination: {
      el: '.dayPagination',
    },
});