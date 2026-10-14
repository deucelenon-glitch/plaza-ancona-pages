/* ============================================================================
   PLAZA ANCONA — inline SVG line icons (no colour emoji)
   ----------------------------------------------------------------------------
   window.ICONS : name -> '<svg class="ico" ...>…</svg>'
   window.ico(name)  : helper returning the SVG markup (or '').
   window.fillIcons(): fills every <span data-icon="name"></span>.
   Sizing lives in assets/style.css:  svg.ico{width:1em;height:1em;...}
   ========================================================================== */
(function () {
  'use strict';

  var ATTR = 'class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  function svg(inner) { return '<svg ' + ATTR + '>' + inner + '</svg>'; }

  var ICONS = {
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>'),

    'map-pin': svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),

    compass: svg('<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.3 6.1-6.1 2.3 2.3-6.1 6.1-2.3Z"/>'),

    building: svg('<rect x="4" y="3" width="16" height="18" rx="1.2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>'),

    camera: svg('<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.7l1.1-1.6A1 1 0 0 1 9.1 5h5.8a1 1 0 0 1 .8.4L16.8 7h1.7A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z"/><circle cx="12" cy="13" r="3.4"/>'),

    calendar: svg('<rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),

    users: svg('<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.5"/><path d="M22 20v-1.5a4 4 0 0 0-3-3.9M16.5 3.6a4 4 0 0 1 0 7.8"/>'),

    check: svg('<path d="M20 6 9 17l-5-5"/>'),

    party: svg('<path d="M4.5 20.5 8 10l6 6-5.5 3.5Z"/><path d="m13.5 8.5 2-2M17 12l2-2M11 5.5 12.5 4M16.5 6.5 18 5M9.5 12.5 8 14"/>'),

    coffee: svg('<path d="M5 8h11v5.5A4.5 4.5 0 0 1 11.5 18h-2A4.5 4.5 0 0 1 5 13.5Z"/><path d="M16 9h1.6a2.4 2.4 0 0 1 0 4.8H16"/><path d="M4 21h13"/><path d="M9 3c-.6.7-.6 1.3 0 2M12.5 3c-.6.7-.6 1.3 0 2"/>'),

    croissant: svg('<path d="M4.5 15.5C3 14 3 10.5 5.5 7.5A7.5 7.5 0 0 1 12 5a7.5 7.5 0 0 1 6.5 2.5C21 10.5 21 14 19.5 15.5c-2 .8-3.5-.5-4.5-1.8-.6-.8-1.3-1.2-3-1.2s-2.4.4-3 1.2c-1 1.3-2.5 2.6-4.5 1.8Z"/><path d="M12 5v9.5"/>'),

    sandwich: svg('<path d="M4 9.5 12 4l8 5.5v5L12 20l-8-5.5Z"/><path d="M4 9.5 12 14l8-4.5M12 14v6"/>'),

    pizza: svg('<path d="M12 3 4 20l8-2.5 8 2.5Z"/><path d="M12 6.5 8.2 15.4M14 11l.01.01M11 13l.01.01M12.5 16.5l.01.01"/>'),

    glass: svg('<path d="M4 4h16l-8 8v6"/><path d="M8 20h8"/><path d="M4 4l6 6.5M20 4l-6 6.5"/>'),

    trash: svg('<path d="M4 7h16"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6.5 7 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4A1.5 1.5 0 0 0 16.7 19L17.5 7"/><path d="M10.5 11v6M13.5 11v6"/>'),

    heart: svg('<path d="M12 20.3 4.9 13a4.5 4.5 0 0 1 6.4-6.3l.7.7.7-.7A4.5 4.5 0 0 1 19.1 13Z"/>'),

    pencil: svg('<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m15 6.5 3 3"/>'),

    warning: svg('<path d="M12 3.5 21 19.5H3Z"/><path d="M12 9.5v4M12 16.5h.01"/>'),

    'star-filled': svg('<path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17.4l-5.3 2.8 1.1-6.1L3.3 9.9l6.1-.8Z" fill="currentColor" stroke="none"/>'),

    'star-empty': svg('<path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17.4l-5.3 2.8 1.1-6.1L3.3 9.9l6.1-.8Z"/>'),

    'arrow-up': svg('<path d="M12 19V5M6 11l6-6 6 6"/>'),

    'arrow-down': svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),

    'arrow-right': svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),

    'arrow-up-right': svg('<path d="M7 17 17 7M8 7h9v9"/>'),

    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 1.9"/>'),

    think: svg('<path d="M12 3a6 6 0 0 0-3.7 10.7c.5.4.7.9.7 1.5v.8h6v-.8c0-.6.2-1.1.7-1.5A6 6 0 0 0 12 3Z"/><path d="M9.5 19h5M10 21.2h4"/>'),

    pager: svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10.5 6.5h3M10.5 10h3M10.5 13.5h3"/><path d="M10.5 18h3"/>'),

    wave: svg('<path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v5"/><path d="M10 11V5a1.5 1.5 0 0 1 3 0v6"/><path d="M13 11V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M16 12v-2a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-1.5"/><path d="M4 13v2"/>'),

    smiley: svg('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.2 4.2 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'),

    target: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>'),

    chat: svg('<path d="M20.5 11.5a8 8 0 0 1-8.5 8 8.6 8.6 0 0 1-3.6-.8L4 20.5l1.6-4.3A8 8 0 0 1 4 11.5 8 8 0 0 1 12 3.5a8 8 0 0 1 8.5 8Z"/><circle cx="8.7" cy="11.5" r=".7" fill="currentColor" stroke="none"/><circle cx="12" cy="11.5" r=".7" fill="currentColor" stroke="none"/><circle cx="15.3" cy="11.5" r=".7" fill="currentColor" stroke="none"/>'),

    hourglass: svg('<path d="M6.5 3h11"/><path d="M6.5 21h11"/><path d="M8 3v3.5c0 1.4 1.8 2.7 4 5.5 2.2-2.8 4-4.1 4-5.5V3"/><path d="M8 21v-3.5c0-1.4 1.8-2.7 4-5.5 2.2 2.8 4 4.1 4 5.5V21"/>'),

    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),

    person: svg('<circle cx="12" cy="8" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/>')
  };

  function ico(name) { return ICONS[name] || ''; }
  function fillIcons() {
    var nodes = document.querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('data-icon');
      if (ICONS[name]) el.innerHTML = ICONS[name];
    }
  }

  window.ICONS = ICONS;
  window.ico = ico;
  window.fillIcons = fillIcons;

  function boot() { fillIcons(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
