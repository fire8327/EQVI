/* tabs */
$('#tabs').tabs();

/* swiper */
const swiper = new Swiper('.swiper', {
    slidesPerView: 1.1,
    spaceBetween: 15,
    grabCursor: true,

    breakpoints: {
      640: {
        slidesPerView: 1.1,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 1.5,
        spaceBetween: 20,    
        centeredSlides: true,
      },
      1280: {
        slidesPerView: 1.7,
        spaceBetween: 20,
        centeredSlides: true,
      }
    },
});