// PLAZA ANCONA — shared site behaviour
(function () {
  // The page-enter animation on <body> must not linger. A filled animation
  // leaves a transform on <body>, which becomes a containing block for
  // position:fixed children — under pinch-zoom that deforms the AI bubble /
  // panel. Clear the animation as soon as the intro finishes.
  (function clearIntroAnim() {
    var done = function () { document.body.classList.add('page-entered'); };
    document.addEventListener('animationend', function (e) {
      if (e.target === document.body) done();
    });
    window.addEventListener('pageshow', done);
    if (document.readyState === 'complete') setTimeout(done, 600);
    else window.addEventListener('load', function () { setTimeout(done, 600); });
  })();

  // mobile nav (right-side slide-in drawer)
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.nav ul');
  var backdrop = document.querySelector('.nav-backdrop');
  function setNav(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      setNav(!menu.classList.contains('open'));
    });
    if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
  }

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // open-now badge (Europe/Rome), hours modeled from the Google listing
  var HOURS = { 0: [7, 22], 1: [6.5, 22], 2: [6.5, 22], 3: [6.5, 22], 4: [6.5, 22], 5: [6.5, 22], 6: [7, 22] };
  function romeNow() {
    var p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit'
    }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[o.weekday], t: parseInt(o.hour, 10) + parseInt(o.minute, 10) / 60 };
  }
  function paint() {
    var n = romeNow();
    var range = HOURS[n.day];
    var open = range && n.t >= range[0] && n.t < range[1];
    document.querySelectorAll('[data-open-now]').forEach(function (el) {
      el.textContent = open ? 'Aperto ora' : 'Chiuso';
      el.classList.toggle('closed', !open);
      if (!open) el.style.background = '#8a4a3a';
      else el.style.background = '';
    });
  }
  paint(); setInterval(paint, 60000);

  // footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  // ---- page-to-page transition ----
  // fade the page out before navigating to another page of this site
  (function () {
    function isInternal(a) {
      if (!a || !a.href) return false;
      if (a.target && a.target !== '_self') return false;
      if (a.hasAttribute('download')) return false;
      if (a.getAttribute('href').charAt(0) === '#') return false;
      if (a.origin !== window.location.origin) return false;
      var path = a.pathname.split('/').pop();
      if (!path) return false;
      // animate away from the visitor's own lang anchors / same page
      if (a.pathname === window.location.pathname && a.search === window.location.search) return false;
      return /\.html$/.test(path) || path === '';
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!isInternal(a)) return;
      e.preventDefault();
      var go = a.href;
      document.body.classList.add('page-leaving');
      setTimeout(function () { window.location.href = go; }, 300);
    });
    // if the page is restored from bfcache, clear the leaving state
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) document.body.classList.remove('page-leaving');
    });
  })();

})();

