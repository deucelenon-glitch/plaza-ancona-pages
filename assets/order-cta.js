/* order-cta.js — the floating "Go to the menu to order" button.
 *
 * Shown on every page EXCEPT the menu itself (you're already there) and the
 * admin. Self-contained: it injects the button, handles the IT/EN text, and
 * cycles between two phrases. Pages just include this one script.
 *
 * Opt out with <body data-no-order-cta> or by simply not including the script.
 */
(function () {
  if (document.body && document.body.hasAttribute('data-no-order-cta')) return;
  // On the menu page itself the order button is pointless (you're here), but
  // the saved-ticket pill must still show. So skip only the order button.
  var path = (location.pathname || '').split('/').pop();
  var onMenu = (path === 'menu.html');
  if (path === 'admin.html' || path === 'login') return;

  var CTA = {
    it: ['Vai al menu per ordinare', 'Ordina subito dal menu →'],
    en: ['Go to the menu to order', 'Order now from the menu →']
  };
  var KEY = { it: ['home.order.cta', 'home.order.cta2'], en: ['home.order.cta', 'home.order.cta2'] };

  function lang() {
    var l = document.documentElement.lang || 'it';
    return (l === 'en') ? 'en' : 'it';
  }

  function homePage() {
    var p = (location.pathname || '').split('/').pop();
    return p === '' || p === 'index.html';
  }

  function topRow() {
    var row = document.getElementById('topFloatRow');
    if (!row) {
      row = document.createElement('div');
      row.className = 'top-float-row';
      row.id = 'topFloatRow';
      document.body.appendChild(row);
    }
    return row;
  }

  function build() {
    if (document.getElementById('orderFloat')) return;
    var a = document.createElement('a');
    a.className = 'order-float';
    a.id = 'orderFloat';
    a.href = 'menu.html';
    a.setAttribute('aria-label', 'Vai al menu per ordinare');
    var s = document.createElement('span');
    s.className = 'order-float-txt';
    s.id = 'orderFloatTxt';
    s.setAttribute('data-i18n', 'home.order.cta');
    s.textContent = CTA[lang()][0];
    a.appendChild(s);
    // Home: the order CTA shares a horizontal top row with the ticket pill.
    if (homePage()) topRow().appendChild(a);
    else document.body.appendChild(a);
  }

  function start() {
    if (!onMenu) build();
    buildTicketPill();
    addScrollHide();
    var el = document.getElementById('orderFloatTxt');
    if (!el) return;
    // Respect reduced motion: keep the button, skip the cycling.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0;
    setInterval(function () {
      var list = CTA[lang()];
      i = (i + 1) % list.length;
      el.style.transition = 'opacity .2s';
      el.style.opacity = '0';
      setTimeout(function () {
        el.textContent = list[i];
        el.style.opacity = '1';
        el.setAttribute('data-i18n', KEY[lang()][i]);
      }, 200);
    }, 2000);
  }

  /* Hide the floating CTA(s) once the guest scrolls past the hero, and show them
     again near the top - so they never cover content while reading. */
  function addScrollHide() {
    var THRESHOLD = 140;   // px scrolled before they tuck away
    var raf = 0;
    function update() {
      raf = 0;
      var top = window.pageYOffset || document.documentElement.scrollTop || 0;
      var hidden = top > THRESHOLD;
      var els = [
        document.getElementById('orderFloat'),
        document.getElementById('ticketPill'),
        document.getElementById('topFloatRow')
      ];
      els.forEach(function (el) {
        if (!el) return;
        el.style.transition = 'opacity .22s ease';
        el.style.opacity = hidden ? '0' : '1';
        el.style.pointerEvents = hidden ? 'none' : '';
      });
    }
    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame ? window.requestAnimationFrame(update) : setTimeout(update, 50);
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    update();
  }

  /* If the guest has a saved ticket (< 3h old), show a small pill so they can
     always find their order number from any page. Mirrors the checkout's
     'plaza-ticket' localStorage contract. */
  function savedTicket() {
    try {
      var raw = localStorage.getItem('plaza-ticket');
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || !d.at || (Date.now() - d.at) > 3 * 60 * 60 * 1000) {
        localStorage.removeItem('plaza-ticket');
        return null;
      }
      return d;
    } catch (e) { return null; }
  }

  function buildTicketPill() {
    if (document.getElementById('ticketPill')) return;
    var t = savedTicket();
    if (!t || t.number === undefined || t.number === null) return;
    var a = document.createElement('a');
    a.className = 'ticket-pill';
    a.id = 'ticketPill';
    a.href = 'checkout.html';
    a.setAttribute('aria-label', 'Il mio ordine');
    var num = String(t.number).padStart ? String(t.number).padStart(4, '0') : String(t.number);
    a.textContent = (lang() === 'en' ? 'My order #' : 'Il mio ordine #') + num;
    // On the home page put it in the horizontal top row, beside the order CTA.
    if (homePage()) {
      a.classList.add('ticket-pill-top');
      topRow().appendChild(a);
    } else {
      document.body.appendChild(a);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
