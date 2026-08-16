(function () {
    const sliderEl = document.querySelector('[data-integration-reveal-slider]');
    if (!sliderEl || typeof Swiper === 'undefined') return;

    const slides = Array.from(sliderEl.querySelectorAll('.swiper-slide[data-integration-reveal]'));
    if (!slides.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ITEM_DELAY = 180;
    const AFTER_ITEMS_DELAY = 350;
    const SLIDE_PAUSE = 700;
    const REVEAL_DURATION = 550;

    const revealed = new Set();
    let started = false;
    let userInteracted = false;
    let programmaticSlide = false;

    function reveal(el) {
        if (el) el.classList.add('is-visible');
    }

    function runSequence(slide) {
        const heading = slide.querySelector('.integration-reveal-heading');
        const items = slide.querySelectorAll('.integration-reveal-item');
        const image = slide.querySelector('.integration-reveal-image');

        if (reduceMotion) {
            reveal(heading);
            items.forEach(reveal);
            reveal(image);
            return Promise.resolve();
        }

        return new Promise(function (resolve) {
            let delay = 0;

            setTimeout(function () {
                reveal(heading);
            }, delay);

            delay += 450;

            items.forEach(function (item, index) {
                setTimeout(function () {
                    reveal(item);
                }, delay + index * ITEM_DELAY);
            });

            delay += items.length * ITEM_DELAY + AFTER_ITEMS_DELAY;

            setTimeout(function () {
                reveal(image);
            }, delay);

            setTimeout(resolve, delay + REVEAL_DURATION);
        });
    }

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function activateSlide(index) {
        if (revealed.has(index)) return Promise.resolve();

        revealed.add(index);
        return runSequence(slides[index]);
    }

    function slideNextProgrammatically() {
        programmaticSlide = true;
        swiper.slideNext();
    }

    const swiper = new Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true,
        allowTouchMove: true,
        autoHeight: true,
        speed: 650,
        resistanceRatio: 0.72,
        pagination: {
            el: sliderEl.querySelector('.integrationRevealPagination'),
            clickable: true,
        },
        on: {
            slideChangeTransitionStart: function () {
                if (!programmaticSlide) {
                    userInteracted = true;
                }
                programmaticSlide = false;
            },
            slideChangeTransitionEnd: function () {
                activateSlide(this.activeIndex);
                this.updateAutoHeight();
            },
        },
    });

    async function startSequence() {
        if (started) return;
        started = true;

        await activateSlide(0);
        swiper.updateAutoHeight();

        if (reduceMotion || slides.length < 2) return;

        await wait(SLIDE_PAUSE);

        if (!userInteracted && swiper.activeIndex === 0) {
            slideNextProgrammatically();
        }
    }

    if (reduceMotion) {
        slides.forEach(function (_, index) {
            activateSlide(index);
        });
        swiper.updateAutoHeight();
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
                startSequence();
            });
        },
        {
            threshold: [0, 0.35, 0.5],
            rootMargin: '0px',
        }
    );

    observer.observe(sliderEl);

    window.addEventListener('resize', function () {
        swiper.updateAutoHeight();
    });
})();
