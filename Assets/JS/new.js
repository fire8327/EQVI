/* slider */
const swiper = new Swiper('.daySlider', {
    loop: true,
    loopedSlides: 6,
    grabCursor: true,
    slidesPerView: 1.9,
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
      clickable: true,
    },
});

const swiper2 = new Swiper('.historyMobileSlider', {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 10,
  
    // If we need pagination
    pagination: {
      el: '.historyMobilePagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.mobileNext',
      prevEl: '.mobilePrev',
    },
});

function updateHistoryDesktopCounter(swiperInstance) {
    const currentEl = document.querySelector('.historyDesktopCurrent');
    const totalEl = document.querySelector('.historyDesktopTotal');

    if (!currentEl || !totalEl || !swiperInstance) return;

    currentEl.textContent = swiperInstance.activeIndex + 1;
    totalEl.textContent = swiperInstance.slides.length;
}

const swiper3 = new Swiper('.historyDesktopSlider', {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 10,
  
    pagination: {
      el: '.historyDesktopPagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.desktopNext',
      prevEl: '.desktopPrev',
    },

    on: {
        init: function () {
            updateHistoryDesktopCounter(this);
        },
        slideChange: function () {
            updateHistoryDesktopCounter(this);
        },
    },
});