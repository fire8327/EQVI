/* EQVI — новые блоки. Демонстрация анимации для верстальщика.
   Приёмы намеренно те же, что уже используются на сайте:
   Swiper 12 + IntersectionObserver + класс .is-visible          */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ?flat=1 — «плоский» режим для импорта в Figma:
     слайдеры разворачиваются в столбик, всё показано в финальном состоянии */
  if (new URLSearchParams(location.search).has('flat')) {
    document.body.classList.add('figma-flat');
  }
  var flat = document.body.classList.contains('figma-flat');
  var still = flat || reduceMotion;   // статичный финальный кадр

  /* ── 1. Reveal при скролле ─────────────────────────────────── */
  var revealTargets = document.querySelectorAll('[data-reveal]');
  if (still || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* В плоском режиме раскрыть все <details>, чтобы в макет попал весь текст */
  if (still) {
    document.querySelectorAll('details').forEach(function (d) { d.open = true; });
  }

  /* ── 2. Кольца прогресса (если есть) ─────────────────────── */
  document.querySelectorAll('.ring-progress').forEach(function (ring) {
    var len = ring.getTotalLength();
    var pct = parseFloat(ring.dataset.percent || '90') / 100;
    ring.style.strokeDasharray = len;
    if (still) {
      ring.style.transition = 'none';
      ring.style.strokeDashoffset = len * (1 - pct);
      return;
    }
    ring.style.strokeDashoffset = len;
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        ring.style.strokeDashoffset = len * (1 - pct);
      });
    }, { threshold: 0.4 }).observe(ring);
  });

  /* ── 2b. Досчёт крупных цифр — независимо от колец ─────────── */
  document.querySelectorAll('[data-countto]').forEach(function (el) {
    var to = parseFloat(el.dataset.countto);
    var suffix = el.dataset.suffix || '%';
    if (still) { el.textContent = to + suffix; return; }
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        // Отсчёт от момента появления, а не от первого кадра: если браузер
        // задерживает кадры (слабое устройство, тяжёлая страница), цифра
        // не залипает на нуле, а сразу догоняет реальное время.
        var t0 = performance.now();
        function step(ts) {
          var p = Math.min((ts - t0) / 1600, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        // Страховка: если кадров так и не будет, цифра всё равно встанет на место.
        setTimeout(function () { el.textContent = to + suffix; }, 1800);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── 3. Диалог: реплики проявляются по очереди, полоса едет
     до значения из data-target (у клиента в тексте — 20% complete) ── */
  // Чатов на странице несколько: диалог в блоке 03 и экраны в слайдере блока 02
  Array.prototype.forEach.call(document.querySelectorAll('[data-chat]'), function (chat) {
    var steps = Array.prototype.slice.call(chat.querySelectorAll('[data-chat-step]'));
    var bar = chat.querySelector('[data-chat-bar]');
    var target = bar ? (bar.dataset.target || '20') : '20';

    if (still) {
      steps.forEach(function (el) { el.classList.add('is-visible'); });
      if (bar) { bar.style.transition = 'none'; bar.style.width = target + '%'; }
    } else {
      steps.forEach(function (el) { el.classList.remove('is-visible'); });
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          obs.unobserve(e.target);
          if (bar) setTimeout(function () { bar.style.width = target + '%'; }, 300);
          steps.forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-visible'); }, 500 + i * 750);
          });
        });
      }, { threshold: 0.25 }).observe(chat);
    }
  });

  /* ── 4. Объединённый слайдер доменов (блок 02) ─────────────
     Один слайд = вопросы аудитории + сообщение банка.
     Раньше было два связанных слайдера — клиент попросил объединить. */
  if (flat || typeof Swiper === 'undefined') return;

  var sliderEl = document.querySelector('.domainSlider');

  var slider = sliderEl && new Swiper(sliderEl, {
    slidesPerView: 'auto',
    spaceBetween: 24,
    speed: 650,
    grabCursor: true,
    watchSlidesProgress: true,
    pagination: { el: '.domainPagination', clickable: true },
    navigation: { prevEl: '.domainPrev', nextEl: '.domainNext' }
  });

  /* ── 4b. Слайдер постов экспертов (блок 04) ────────────────── */
  var expertEl = document.querySelector('.expertSlider');
  if (expertEl) {
    new Swiper(expertEl, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      watchSlidesProgress: true,
      speed: 600,
      grabCursor: true,
      autoHeight: true,
      pagination: { el: '.expertPagination', clickable: true },
      navigation: { prevEl: '.expertPrev', nextEl: '.expertNext' }
    });
  }

  /* ── 5. Табы Fashion / Nutrition ───────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.domain-tab'));
  function syncTabs(index) {
    tabs.forEach(function (t, i) { t.classList.toggle('is-active', i === index); });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var i = parseInt(tab.dataset.goto, 10);
      if (slider) slider.slideTo(i);
      syncTabs(i);
    });
  });
  if (slider) slider.on('slideChange', function () { syncTabs(slider.activeIndex); });
})();
