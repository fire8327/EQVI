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

    on: {
        slideChange: function () {
          updateNavButtons();
        }
    }
});

// Обновляем кнопки при изменении слайда
function updateNavButtons() {
    const activeIndex = swiper.realIndex;
    const buttons = document.querySelectorAll('.nav-btn');
  
    buttons.forEach((btn, index) => {
      if (index === activeIndex) {
        btn.classList.remove('grayscale','lg:w-6'); // активная кнопка — цветная
        btn.classList.add('lg:w-8')
      } else {
        btn.classList.remove('lg:w-8')
        btn.classList.add('grayscale', 'lg:w-6'); // неактивные — серые
      }
    });
}
  
// Обработчики кликов по кнопкам
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.slideIndex);
        swiper.slideToLoop(index);
    });
});

// Инициализация при старте
updateNavButtons();