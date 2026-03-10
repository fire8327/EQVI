$(document).ready(function() {
    function handleScroll() {
        var scrollPosition = $(window).scrollTop();
        
        if (scrollPosition > 500) {
            $('header').addClass('fixed top-0 left-0 z-5 bg-[#1F2326] py-4');
            $('header').removeClass('relative py-6 lg:py-8');
            $('#nav').addClass('hidden');
            $('#contact').removeClass('hidden');
            // Для предотвращения скачка контента
            if (!$('body').hasClass('header-fixed')) {
                const headerHeight = $('header').outerHeight();
                $('body').css('padding-top', headerHeight + 'px');
                $('body').addClass('header-fixed');
            }
        } else {
            $('header').removeClass('fixed top-0 left-0 z-5 bg-[#1F2326] py-4');
            $('header').addClass('relative py-6 lg:py-8');
            $('#nav').removeClass('hidden');
            $('#contact').addClass('hidden');
            $('body').css('padding-top', '0');
            $('body').removeClass('header-fixed');
        }
    }

    $(window).scroll(function() {
        handleScroll();
    });
    
    handleScroll(); // Проверяем сразу
});

$("#contact, #contact2, #formToggler, #overlay").click(() => {
    $("#form, #overlay, #formToggler").toggleClass("hidden")
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
                    $("#overlay").addClass("hidden");
                    $("#formToggler").addClass("hidden");
                    $("#formSuccess").removeClass("hidden");
                } else {
                    $("#formError").removeClass("hidden");
                }
            })
            .fail(function() {
                $("#formError").removeClass("hidden");
            })
            .always(function() {
                if (!$("#formSuccess").is(":visible")) {
                    $submitBtn.prop("disabled", false).text("Submit");
                }
            });
        });
    }

    $("#formClose").click(function() {
        $("#form, #overlay, #formToggler").addClass("hidden");
    });
});