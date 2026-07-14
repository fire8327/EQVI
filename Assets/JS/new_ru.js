/* slider */
const swiper1 = new Swiper('.integrationSlider', {
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

          $submitBtn.prop("disabled", true).text("Отправка...");

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
                  $submitBtn.prop("disabled", false).text("Запросить встречу");
              } else {
                  $("#formError").removeClass("hidden");
              }
          })
          .fail(function() {
              $("#formError").removeClass("hidden");
          })
          .always(function() {
              if (!$("#formSuccess").is(":visible")) {
                  $submitBtn.prop("disabled", false).text("Запросить встречу");
              }
          });
      });
  }

  $("#formClose").click(function() {
      $("#form, #overlay, #formToggler, #formSuccess").addClass("hidden");
  });
});