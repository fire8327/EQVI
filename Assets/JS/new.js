/* tabs */
$('#tabs').tabs();
$('#value-bank-tabs').tabs();

/* slideToggle */
$(".toggleMain").each((i,el) => {
    $(el).find(".toggleButton").click(()=> {
        $(el).find(".toggleList").slideToggle()
        $(el).find(".toggleButton").find("svg").toggleClass("rotate-180")
    })
})


/* slideToggle2 */
$(".toggleMobile").each((i, el) => {
    $(el).find(".toggleMobileButton").click(() => {
        $(el).find(".toggleMobileList").slideToggle()
        $(el).find(".toggleMobileCheck").find("span").toggleClass("hidden")
    })
})


/* видео */
/* видео */
$('.videoToggler').each(function() {
    const $toggler = $(this);
    const videoEl = $toggler.find('.video')[0];

    // Repeat (скрыта по умолчанию)
    const $repeatBtn = $(`
        <div class="videoRepeatBtn absolute inset-0 flex items-center justify-center cursor-pointer z-10 hidden">
            <div class="rounded-full bg-black/60 flex items-center gap-3 lg:gap-4 p-3 lg:py-4 lg:px-8 hover:bg-black/80 transition-colors">
                <svg class="w-7 h-7 lg:w-9 lg:h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#20A9FF"/>
                </svg>
                <p class="text-[13px] lg:text-[16px] leading-[100%] font-semibold text-white">Repeat</p>
            </div>
        </div>
    `);
    $toggler.append($repeatBtn);

    // Обработка клика по самому блоку (Play/Pause)
    $toggler.on('click', function(e) {
        // Если кликнули по кнопке Repeat, игнорируем этот обработчик
        if ($(e.target).closest('.videoRepeatBtn').length) return;

        if (videoEl.paused) {
            $toggler.find(".videoOverlay").addClass('opacity-0');
            $toggler.find(".videoPreview").addClass('hidden');
            $toggler.find(".videoBubble").addClass('hidden');
            $repeatBtn.addClass('hidden'); // Скрываем кнопку repeat при ручном запуске
            
            setTimeout(() => videoEl.play(), 350);
        } else {
            videoEl.pause();
            $toggler.find(".videoOverlay").removeClass('opacity-0');
        }
    });

    // Окончание видео
    videoEl.addEventListener('ended', function() {
        $repeatBtn.removeClass('hidden');
    });

    // Обработка клика по кнопке Repeat
    $repeatBtn.on('click', function(e) {
        e.stopPropagation(); // Чтобы не срабатывал клик по .videoToggler (пауза)
        videoEl.currentTime = 0;
        videoEl.play();
        $repeatBtn.addClass('hidden');
    });
});

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

function buildHistoryDesktopPagination(swiperInstance) {
    const paginationEl = document.querySelector('.historyDesktopPagination');
    if (!paginationEl || !swiperInstance) return;

    const years = Array.from(
        swiperInstance.el.querySelectorAll('.swiper-slide .history-slide-year')
    ).map((el) => el.textContent.trim());

    paginationEl.innerHTML = years.map((year, index) => `
        <button
            type="button"
            class="history-desktop-pagination-item${index === swiperInstance.activeIndex ? ' is-active' : ''}"
            data-index="${index}"
            aria-label="Go to slide ${year}"
        >
            <span class="history-desktop-pagination-year">${year}</span>
            <span class="history-desktop-pagination-line"></span>
        </button>
    `).join('');

    paginationEl.querySelectorAll('.history-desktop-pagination-item').forEach((btn) => {
        btn.addEventListener('click', () => {
            swiperInstance.slideTo(Number(btn.dataset.index));
        });
    });
}

function updateHistoryDesktopPagination(swiperInstance) {
    document.querySelectorAll('.history-desktop-pagination-item').forEach((item, index) => {
        item.classList.toggle('is-active', index === swiperInstance.activeIndex);
    });
}

const swiper3 = new Swiper('.historyDesktopSlider', {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 10,

    navigation: {
      nextEl: '.desktopNext',
      prevEl: '.desktopPrev',
    },

    on: {
        init: function () {
            buildHistoryDesktopPagination(this);
            updateHistoryDesktopCounter(this);
        },
        slideChange: function () {
            updateHistoryDesktopPagination(this);
            updateHistoryDesktopCounter(this);
        },
    },
});

const swiper5 = new Swiper('.integrationSlider', {
    grabCursor: true,
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,

    breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        }
    },

    pagination: {
      el: '.integrationPagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.integrationNext',
      prevEl: '.integrationPrev',
    },
});


/* form */
$("#contact, #contact2, #contact3, #formToggler, #overlay").click(() => {
  $("#form, #overlay").toggleClass("hidden")
})

$(function() {
  const $form = $("#form");
  const $submitBtn = $("#formSubmit");

  if ($form.length) {
      $form.on("submit", function(e) {
          e.preventDefault();

          if ($submitBtn.prop("disabled")) {
              return;
          }

          $("#formError").addClass("hidden");

          const payload = {
              fullName: $("input[name='full_name']").val().trim() || "",
              businessEmail: $("input[name='business_email']").val().trim() || "",
              position: $("input[name='position']").val().trim() || "",
              company: $("input[name='company']").val().trim() || "",
              numberOfEmployees: $("input[name='number']").val().trim() || ""
          };

          $submitBtn.prop("disabled", true).text("Sending...");

          $.ajax({
              url: "http://coordinator.eqvilibria.com/api/v1/site/feedback",
              method: "POST",
              contentType: "application/json",
              dataType: "json",
              data: JSON.stringify(payload)
          })
          .done(function(response) {
              if (response && response.success === true) {
                  $("#form").addClass("hidden");
                  $("#formToggler").addClass("hidden");
                  $("#formSuccess").removeClass("hidden");
                  $submitBtn.prop("disabled", false).text("Request Meeting");
              } else {
                  $("#formError").removeClass("hidden");
              }
          })
          .fail(function() {
              $("#formError").removeClass("hidden");
          })
          .always(function() {
              if (!$("#formSuccess").is(":visible")) {
                  $submitBtn.prop("disabled", false).text("Request Meeting");
              }
          });
      });
  }

  $("#formClose").click(function() {
      $("#form, #overlay, #formToggler, #formSuccess").addClass("hidden");
  });
});