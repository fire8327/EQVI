/* tabs */
$('#tabs').tabs();

/* swiper */
// Для loop с 4 слайдами и slidesPerView > 1 на десктопе Swiper часто не успевает
// “заполнить” правую сторону клонами — визуально выглядит как пустота до первого клика.
// Самый стабильный способ без переписывания разметки: один раз продублировать слайды.
const swiperWrapper = document.querySelector('.swiper .swiper-wrapper');
if (swiperWrapper && !swiperWrapper.dataset.clonedForLoop) {
    const slides = Array.from(swiperWrapper.children).filter(el => el.classList && el.classList.contains('swiper-slide'));

    // Если слайдов мало — удваиваем (4 -> 8). Этого достаточно для бесшовного loop.
    if (slides.length > 0 && slides.length < 6) {
        slides.forEach(slide => {
            swiperWrapper.appendChild(slide.cloneNode(true));
        });
    }

    swiperWrapper.dataset.clonedForLoop = '1';
}

const swiper = new Swiper('.swiper', {
    loop: true,
    // У тебя всего 4 слайда и на десктопе slidesPerView ~ 1.7 (≈2).
    // Если Swiper пытается клонировать слишком много слайдов, loop начинает “полуработать”
    // и появляется warning про недостаточное число слайдов.
    // Поэтому фиксируем число клонируемых слайдов под текущую сетку (≈2).
    loopedSlides: 4,
    loopAdditionalSlides: 2,
    slidesPerView: 1.1,
    spaceBetween: 15,
    grabCursor: true,

    breakpoints: {
      640: {
        slidesPerView: 1.1,
        spaceBetween: 15,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 1.5,
        spaceBetween: 0,    
        centeredSlides: true,
      },
      1280: {
        slidesPerView: 1.7,
        spaceBetween: 0,
        centeredSlides: true,
      }
    },

    navigation: {
      nextEl: '.swiperNext',
      prevEl: '.swiperPrev',
    },

    on: {
        init: function () {
          updateNavButtons(this);
        },
        slideChange: function () {
          updateNavButtons(this);
        }
    }
});

// Обновляем кнопки при изменении слайда
function updateNavButtons(swiperInstance) {
    if (!swiperInstance) return;
    // В loop режиме ориентируемся на realIndex (индекс “настоящих” слайдов)
    const buttons = document.querySelectorAll('.nav-btn');
    if (!buttons.length) return;

    const rawIndex = Number.isFinite(swiperInstance.realIndex) ? swiperInstance.realIndex : swiperInstance.activeIndex;
    // После дублирования DOM-слайдов индекс может быть больше, чем число кнопок (4) — нормализуем.
    const activeIndex = ((rawIndex % buttons.length) + buttons.length) % buttons.length;
  
    buttons.forEach((btn, index) => {
      if (index === activeIndex) {
        btn.classList.remove('grayscale','w-6'); // активная кнопка — цветная
        btn.classList.add('w-8')
      } else {
        btn.classList.remove('w-8')
        btn.classList.add('grayscale', 'w-6'); // неактивные — серые
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

// Инициализация при старте (после создания инстанса)
updateNavButtons(swiper);


/* видео */
$('#videoToggler').on('click', function() {
  const video = $('#video')[0];
  if (video.paused) {
    $("#videoOverlay").addClass('opacity-0');
    $("#videoPreview").addClass('hidden');
    setTimeout(() => {
      video.play();
    }, 350);
  } else {
      video.pause();
      $("#videoOverlay").removeClass('opacity-0');
  }
});


/* скролл к слайдеру с отступом */
document.querySelectorAll('.scroll-to-slider').forEach(button => {
    button.addEventListener('click', function() {
        const slider = document.getElementById('slider');
        if (slider) {
            const sliderPosition = slider.getBoundingClientRect().top + window.pageYOffset;
            const offset = 60; // отступ 60px от верха блока
            window.scrollTo({
                top: sliderPosition - offset,
                behavior: 'smooth'
            });
        }
    });
});