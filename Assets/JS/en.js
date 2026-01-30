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