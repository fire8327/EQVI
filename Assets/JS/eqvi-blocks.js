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

  /* ── 6. Кольцо логотипа на canvas ───────────────────────────
     Тот же приём, что на первом экране их сайта (eqvi-ring-canvas):
     точки по радуге вращаются вокруг центра. Здесь кольцо мелкое
     и видно целиком, поэтому без сужения полосы по краям дуги. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-logo-ring]'), function (canvas) {
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var TAU = Math.PI * 2;

    function hueAt(phi) { return (220 + phi * 180 / Math.PI) % 360; }
    function hslToRgb(h, sat, l) {
      h = (((h % 360) + 360) % 360) / 360; sat /= 100; l /= 100;
      var r, g, bl;
      if (sat === 0) { r = g = bl = l; }
      else {
        var hue2rgb = function (p, q, t) {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        var q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
        var p2 = 2 * l - q;
        r = hue2rgb(p2, q, h + 1 / 3); g = hue2rgb(p2, q, h); bl = hue2rgb(p2, q, h - 1 / 3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(bl * 255)];
    }

    var W = 0, H = 0, cx = 0, cy = 0, R = 0, band = 0, scale = 1, dots = [];

    function makeDots() {
      dots = [];
      var n = Math.max(120, Math.min(420, Math.round((TAU * R) / 2.2)));
      for (var i = 0; i < n; i++) {
        var phi = (i / n) * TAU + (Math.random() - 0.5) * (TAU / n) * 2.2;
        var rnd = Math.random(), base;
        if (rnd < 0.60)      base = 1.6 + Math.random() * 2.2;
        else if (rnd < 0.88) base = 4.0 + Math.random() * 3.0;
        else if (rnd < 0.98) base = 7.0 + Math.random() * 3.5;
        else                 base = 11.0 + Math.random() * 4.0;
        var ro = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        if (Math.random() < 0.12) ro *= 2.2;
        dots.push({ phi: phi, ro: ro, size: base,
                    alpha: 0.5 + Math.random() * 0.5,
                    rgb: hslToRgb(hueAt(phi), 88, 56 + Math.random() * 8) });
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      R = Math.min(W, H) * 0.36;
      band = R * 0.2;
      scale = R / 62;      // кольцо мелкое: точки должны остаться точками
      makeDots();
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var phi = d.phi + rot;
        var rr = R + d.ro * band;
        var x = cx + Math.sin(phi) * rr;
        var y = cy - Math.cos(phi) * rr;
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.fillStyle = 'rgb(' + d.rgb[0] + ',' + d.rgb[1] + ',' + d.rgb[2] + ')';
        ctx.arc(x, y, d.size * scale, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    var rot = 100 * Math.PI / 180;
    var SPEED = 0.45;                 // рад/с — заметнее, чем у большого кольца на первом экране
    var last = 0;
    function frame(ts) {
      if (!last) last = ts;
      var dt = (ts - last) / 1000; last = ts;
      if (dt > 0.05) dt = 0.05;
      rot += SPEED * dt;
      if (rot > TAU) rot -= TAU;
      render();
      requestAnimationFrame(frame);
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); render(); }, 150);
    });

    resize();
    if (still) render();
    else requestAnimationFrame(frame);
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
