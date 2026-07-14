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
$("#contact, #contact2, #formToggler, #overlay").click(() => {
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