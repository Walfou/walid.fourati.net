(function () {
  'use strict';

  // ── Helpers ──────────────────────────────────────────────────────────────

  function getNestedValue(obj, path) {
    return path.split('.').reduce(function (curr, key) {
      return curr && curr[key] !== undefined ? curr[key] : undefined;
    }, obj);
  }

  // ── Language switching ───────────────────────────────────────────────────

  var currentLang = 'en';

  var pageTitles = {
    en: 'Walid Fourati — Traffic & Mobility Consultant',
    de: 'Walid Fourati — Berater für Verkehr & Mobilität',
    fr: 'Walid Fourati — Consultant en Trafic & Mobilité',
    ar: 'وليد الفراتي — مستشار في هندسة المرور والتنقل'
  };

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;

    var t = translations[lang];
    var isRTL = lang === 'ar';

    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(t, key);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.title = pageTitles[lang] || pageTitles.en;
    localStorage.setItem('lang', lang);
  }

  // ── Navbar scroll shadow ─────────────────────────────────────────────────

  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // ── Mobile menu ──────────────────────────────────────────────────────────

  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks   = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ── Language buttons ─────────────────────────────────────────────────────

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.dataset.lang);
    });
  });

  // ── Init ─────────────────────────────────────────────────────────────────

  var saved = localStorage.getItem('lang');
  setLanguage(saved && translations[saved] ? saved : 'en');

})();
