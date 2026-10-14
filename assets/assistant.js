/* ============================================================================
   PLAZA ANCONA — AI Assistant widget (top-tier package)
   ----------------------------------------------------------------------------
   PRODUCTION NOTE (README): this widget is the hero feature of the top tier.
   In production it connects to a REAL LLM backend (e.g. OpenAI / Anthropic /
   a self-hosted model) via a small server-side endpoint that holds the API key
   and grounds answers in the venue's data (hours, menu, bookings). This build runs a self-contained
   keyword-matched assistant: no network calls and no API key required. The UI, language handling and message flow are
   exactly what ships; only the brain is swapped for the live model.
   ========================================================================== */
(function () {
  'use strict';

  // Local alias to the shared icon set (assets/icons.js). Returns inline SVG
  // markup for a named icon, or '' if the icon set isn't present.
  function ICO(name) { return (window.ICONS && window.ICONS[name]) || ''; }

  var PHONE = '+393240838518';
  var TEL = '+39 324 083 8518';
  var ADDR = 'Corso Giuseppe Garibaldi, 54 — 60122 Ancona (AN)';
  var MAPS = 'https://www.google.com/maps/dir/?api=1&destination=Plaza+Ancona+Corso+Giuseppe+Garibaldi+54+Ancona';
  /* Staff paging topic — the reception Android subscribes here and rings. */
  var STAFF_TOPIC = 'https://ntfy.sh/PLAZA_staff';
  var staffAsked = false;

  /* ---------- current language (shared with i18n.js via localStorage) ------ */
  function lang() {
    try { return localStorage.getItem('plaza-lang') || 'it'; } catch (e) { return 'it'; }
  }

  /* ---------- copy --------------------------------------------------------- */
  var T = {
    it: {
      title: 'Assistente PLAZA',
      subtitle: 'Online · risponde subito',
      open: 'Apri assistente AI',
      close: 'Chiudi',
      ph: 'Scrivi un messaggio...',
      send: 'Invia',
      greet: 'Ciao! '+ICO('wave')+' Sono l\'assistente di PLAZA ANCONA. Posso aiutarti con orari, menu, prenotazioni e come raggiungerci. Cosa ti serve?',
      chips: [ICO('clock')+' Orari', ICO('map-pin')+' Dove siete?', ICO('pizza')+' Cosa consigliate?', ICO('calendar')+' Prenotare un tavolo', ICO('phone')+' Telefono'],
      fallback: 'Non sono sicuro di aver capito. '+ICO('think')+' Posso aiutarti su: orari, indirizzo, menu, prenotazioni e telefono. Se vuoi parlare con una persona dello staff, scrivi <b>“staff”</b>: avviso subito la reception. '+ICO('pager'),
      staffNotice: ICO('pager')+' Ho avvisato lo staff in reception: ti rispondono qui tra poco. Per urgenze puoi chiamarci al ' + TEL + '.',
      staffWhat: 'Lo <b>staff del PLAZA</b> è il nostro personale in sala e al banco: chi ti serve al tavolo, prende le ordinazioni, prepara caffè e pizze e gestisce le prenotazioni. '+ICO('users')+'<br>Se vuoi parlare con una persona dello staff, scrivi <b>“staff”</b> e ti metto in contatto con la reception qui in chat — ti rispondono loro a breve. '+ICO('pager'),
      disclaimer: 'Assistente virtuale · per informazioni immediate',
      answers: [
        { k: ['orari', 'orario', 'apert', 'aperto', 'chius', 'quando', 'hours', 'open', 'close', 'time', 'when'],
          a: 'Siamo aperti <b>tutti i giorni</b>:<br>• Lun–Ven <b>06:30–22:00</b><br>• Sab–Dom <b>07:00–22:00</b><br>Colazioni dal mattino presto fino all\'ultimo caffè della sera. '+ICO('coffee') },
        { k: ['indirizzo', 'dove', 'dove siete', 'raggiung', 'arriv', 'mappa', 'address', 'where', 'location', 'map', 'via', 'corso'],
          a: 'Ci trovi in <b>' + ADDR + '</b>, nel cuore di Ancona. <a href="' + MAPS + '" target="_blank" rel="noopener">Apri le indicazioni '+ICO('arrow-up-right')+'</a>' },
        { k: ['menu', 'mangi', 'pizza', 'pizze', 'caffè', 'caffe', 'colazione', 'aperitivo', 'spritz', 'consigl', 'cosa avete', 'cosa prendo', 'special', 'food', 'eat', 'recommend', 'coffee', 'breakfast', 'best'],
          a: 'Siamo famosi per la <b>pizzeria</b> (margherita €5,00, diavola €6,50), la <b>caffetteria</b> tutto il giorno e gli <b>aperitivi</b> con spritz a €3,50. '+ICO('pizza')+' Highlights: cornetti freschi al mattino, panini e piatti del giorno a pranzo, pizza al taglio. Dai un occhio al <a href="menu.html">menu completo '+ICO('arrow-up-right')+'</a>.' },
        { k: ['prenot', 'tavolo', 'prenotare', 'book', 'reserv', 'table', 'gruppo', 'gruppi', 'evento', 'eventi', 'compleanno', 'group', 'event', 'birthday'],
          a: 'Volentieri! Puoi prenotare in trenta secondi dal <a href="prenota.html">modulo prenotazioni '+ICO('arrow-up-right')+'</a> (data, ora, persone e contatto) e ti confermiamo a breve. Per gruppi numerosi o eventi chiamaci al <a href="tel:' + PHONE + '">' + TEL + '</a>. '+ICO('calendar') },
        { k: ['telefono', 'numero', 'chiam', 'contatt', 'phone', 'call', 'number', 'contact'],
          a: 'Il nostro numero è <a href="tel:' + PHONE + '">' + TEL + '</a>. Puoi anche scriverci dal <a href="contact.html">modulo contatti '+ICO('arrow-up-right')+'</a>. '+ICO('phone') },
        { k: ['plus code', 'pluscode', 'gps', 'coordinate'],
          a: 'Il Plus Code di PLAZA ANCONA è <b>JG96+6P Ancona</b>. '+ICO('compass') },
        { k: ['grazie', 'thanks', 'thank you', 'ciao', 'arrivederci', 'bye', 'hello', 'hi'],
          a: 'Grazie a te! Ci vediamo al PLAZA. Se ti serve altro, sono qui. '+ICO('smiley') },
      ]
    },
    en: {
      title: 'PLAZA Assistant',
      subtitle: 'Online · replies instantly',
      open: 'Open AI assistant',
      close: 'Close',
      ph: 'Type a message...',
      send: 'Send',
      greet: 'Hi! '+ICO('wave')+' I\'m the PLAZA ANCONA assistant. I can help with opening hours, the menu, bookings and how to find us. What do you need?',
      chips: [ICO('clock')+' Opening hours', ICO('map-pin')+' Where are you?', ICO('pizza')+' What do you recommend?', ICO('calendar')+' Book a table', ICO('phone')+' Phone'],
      fallback: 'I\'m not sure I got that. '+ICO('think')+' I can help with: hours, address, menu, bookings and phone. To talk to a member of staff, type <b>“staff”</b>: I\'ll page reception right away. '+ICO('pager'),
      staffNotice: ICO('pager')+' I\'ve alerted the staff at reception: they\'ll reply here shortly. For urgent matters you can call us on ' + TEL + '.',
      staffWhat: 'The <b>PLAZA staff</b> are our team on the floor and behind the bar: they serve your table, take orders, make coffee and pizza, and handle bookings. '+ICO('users')+'<br>If you\'d like to speak to a member of staff, type <b>“staff”</b> and I\'ll connect you with reception here in the chat — they\'ll reply shortly. '+ICO('pager'),
      disclaimer: 'Virtual assistant · for quick answers',
      answers: [
        { k: ['orari', 'orario', 'apert', 'aperto', 'chius', 'quando', 'hours', 'open', 'close', 'time', 'when'],
          a: 'We\'re open <b>every day</b>:<br>• Mon–Fri <b>06:30–22:00</b><br>• Sat–Sun <b>07:00–22:00</b><br>Breakfasts from early morning right through to the last coffee of the evening. '+ICO('coffee') },
        { k: ['indirizzo', 'dove', 'raggiung', 'arriv', 'mappa', 'address', 'where', 'location', 'map', 'via', 'corso', 'how to get'],
          a: 'You\'ll find us at <b>' + ADDR + '</b>, in the heart of Ancona. <a href="' + MAPS + '" target="_blank" rel="noopener">Open directions '+ICO('arrow-up-right')+'</a>' },
        { k: ['menu', 'mangi', 'pizza', 'pizze', 'caffè', 'caffe', 'colazione', 'aperitivo', 'spritz', 'consigl', 'special', 'food', 'eat', 'recommend', 'coffee', 'breakfast', 'best'],
          a: 'We\'re known for our <b>pizzeria</b> (margherita €5.00, diavola €6.50), all-day <b>coffee bar</b> and <b>aperitivo</b> with spritz at €3.50. '+ICO('pizza')+' Highlights: fresh croissants in the morning, sandwiches and dishes of the day at lunch, pizza by the slice. Take a look at the <a href="menu.html">full menu '+ICO('arrow-up-right')+'</a>.' },
        { k: ['prenot', 'tavolo', 'book', 'reserv', 'table', 'group', 'event', 'birthday', 'party'],
          a: 'Happy to help! Book in thirty seconds from our <a href="prenota.html">booking form '+ICO('arrow-up-right')+'</a> (date, time, party size and contact) and we\'ll confirm shortly. For larger groups or events, call us on <a href="tel:' + PHONE + '">' + TEL + '</a>. '+ICO('calendar') },
        { k: ['telefono', 'numero', 'chiam', 'contatt', 'phone', 'call', 'number', 'contact'],
          a: 'Our number is <a href="tel:' + PHONE + '">' + TEL + '</a>. You can also write to us via the <a href="contact.html">contact form '+ICO('arrow-up-right')+'</a>. '+ICO('phone') },
        { k: ['plus code', 'pluscode', 'gps', 'coordinate'],
          a: 'PLAZA ANCONA\'s Plus Code is <b>JG96+6P Ancona</b>. '+ICO('compass') },
        { k: ['grazie', 'thanks', 'thank you', 'ciao', 'bye', 'hello', 'hi'],
          a: 'Thank you! See you at PLAZA. If you need anything else, I\'m right here. '+ICO('smiley') },
      ]
    }
  };

  function t() { return T[lang()] || T.it; }

  /* ---------- build DOM ---------------------------------------------------- */
  var fab = document.createElement('button');
  fab.className = 'ai-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'AI assistant');
  fab.innerHTML =
    '<span class="ai-dot"></span>' +
    '<svg class="ai-fab-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/>' +
      '<circle cx="8.5" cy="11.5" r=".6" fill="currentColor"/><circle cx="12" cy="11.5" r=".6" fill="currentColor"/><circle cx="15.5" cy="11.5" r=".6" fill="currentColor"/>' +
    '</svg>' +
    '<svg class="ai-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18"/>' +
    '</svg>';

  var panel = document.createElement('section');
  panel.className = 'ai-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'AI assistant');
  panel.innerHTML =
    '<div class="ai-head">' +
      '<span class="av">P</span>' +
      '<span class="who"><b></b><small><span class="live"></span><span></span></small></span>' +
      '<button class="x" type="button" aria-label="Close">×</button>' +
    '</div>' +
    '<div class="ai-log" id="aiLog"></div>' +
    '<div class="ai-chips" id="aiChips"></div>' +
    '<form class="ai-foot" id="aiForm">' +
      '<input type="text" id="aiInput" autocomplete="off">' +
      '<button type="submit" aria-label="Send">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>' +
      '</button>' +
    '</form>' +
    '<p class="ai-disclaimer"></p>';

  var log, input, formEl, opened = false, greeted = false;

  function mount() {
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    log = document.getElementById('aiLog');
    input = document.getElementById('aiInput');
    formEl = document.getElementById('aiForm');
    refreshLang();
    buildChips();
    // panel stays CLOSED until the visitor clicks the launcher (no auto-open)
  }

  function refreshLang() {
    var c = t();
    panel.querySelector('.who b').textContent = c.title;
    panel.querySelector('.who small span:last-child').textContent = c.subtitle;
    input.placeholder = c.ph;
    panel.querySelector('.ai-disclaimer').textContent = c.disclaimer;
    fab.setAttribute('aria-label', c.open);
    panel.querySelector('.x').setAttribute('aria-label', c.close);
  }

  function buildChips() {
    var wrap = document.getElementById('aiChips');
    wrap.innerHTML = '';
    t().chips.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ai-chip';
      b.innerHTML = label;
      /* Send only the readable text, never the inline SVG markup: the chip
         label is like '<svg ...>Orari', so sending it raw put an <svg> tag in
         the user's bubble. Strip tags for the message. */
      var plain = String(label).replace(/<[^>]*>/g, '').trim();
      b.addEventListener('click', function () { send(plain); });
      wrap.appendChild(b);
    });
  }

  function bubble(who, html) {
    var row = document.createElement('div');
    row.className = 'ai-msg ' + who;
    var av = document.createElement('span');
    av.className = 'mini-av';
    av.innerHTML = who === 'me' ? ICO('person') : 'P';
    var bub = document.createElement('div');
    bub.className = 'bub';
    bub.innerHTML = html;
    row.appendChild(av); row.appendChild(bub);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function typing() {
    var row = document.createElement('div');
    row.className = 'ai-msg bot';
    row.innerHTML = '<span class="mini-av">P</span><div class="ai-typing"><span></span><span></span><span></span></div>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function answerFor(text) {
    var q = (text || '').toLowerCase();
    var list = t().answers;
    var best = null, bestScore = 0;
    list.forEach(function (entry) {
      var score = 0;
      entry.k.forEach(function (kw) { if (q.indexOf(kw) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    return best ? best.a : t().fallback;
  }

  /* Guest asks ABOUT the staff (who they are) -> the AI explains, no handoff. */
  function asksAboutStaff(text) {
    var q = ' ' + (text || '').toLowerCase() + ' ';
    var about = ['chi è lo staff', 'chi e lo staff', 'ch\u00e9 lo staff', 'cosa fa lo staff',
      'cosa \u00e8 lo staff', 'who is the staff', 'what is the staff', 'what does the staff',
      'chi sono', 'who are'];
    return about.some(function (k) { return q.indexOf(k) !== -1; });
  }

  /* Guest wants to speak to a human -> page the reception Android + open chat. */
  function needsStaff(text) {
    var q = (text || '').toLowerCase();
    /* an explicit "talk to" / "speak to" is always a handoff request */
    var explicitTalk = ['parlare con', 'parlare a', 'voglio parlare', 'speak to', 'talk to',
      'chiedere a', 'sentire', 'contattare un', 'contattare il'];
    if (explicitTalk.some(function (k) { return q.indexOf(k) !== -1; })) return true;
    var kw = ['staff', 'persona', 'personale', 'umano', 'operatore', 'aiuto', 'help',
      'human', 'reception', 'responsabile', 'manager', 'assistenza'];
    return kw.some(function (k) { return q.indexOf(k) !== -1; });
  }

  function pageStaff(reason) {
    if (staffAsked) return;
    staffAsked = true;
    fetch(STAFF_TOPIC, {
      method: 'POST',
      /* text goes in the JSON body, never an HTTP header */
      body: JSON.stringify({
        topic: 'PLAZA_staff',
        title: 'PLAZA — richiesta assistenza dal sito',
        tags: ['rotating_light', 'iphone', 'android'],
        priority: 5,
        click: 'tel:' + PHONE,
        message: 'Un cliente chiede aiuto.\n' + reason
      })
    }).catch(function () {});
  }

  /* ---------- LIVE CHAT (human help escalation, two-way) ------------------ */
  var chatToken = null;
  var chatSince = 0;
  var chatTimer = null;

  function startChat(firstMessage) {
    fetch('api/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ospite', message: firstMessage || '' })
    }).then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) throw 0;
        chatToken = j.token;
        chatSince = firstMessage ? 1 : 0;
        bubble('bot', t().staffNotice);
        startPolling();
      })
      .catch(function () { /* stay with the canned notice */ });
  }

  function startPolling() {
    if (chatTimer) return;
    chatTimer = setInterval(function () {
      if (!chatToken) return;
      fetch('api/chat/poll?token=' + encodeURIComponent(chatToken) + '&since=' + chatSince, { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j || !j.ok) return;
          j.msgs.forEach(function (m) {
            if (m.from === 'staff') bubble('bot', escapeHtml(m.text));
          });
          chatSince = j.next;
        })
        .catch(function () {});
    }, 3000);
  }

  function sendToChat(text) {
    if (!chatToken) return;
    fetch('api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: chatToken, text: text })
    }).catch(function () {});
  }

  function send(text) {
    text = (text || '').trim();
    if (!text) return;
    bubble('me', escapeHtml(text));

    /* Once the conversation has been handed to the staff, the AI stays out of
       it: no bot answers any more — only the staff reply. */
    if (chatToken || staffAsked) {
      sendToChat(text);
      return;
    }

    var row = typing();
    setTimeout(function () {
      row.remove();
      /* "Who is the staff?" -> the AI explains. No handoff: they only asked. */
      if (asksAboutStaff(text)) {
        bubble('bot', t().staffWhat);
        return;
      }
      bubble('bot', answerFor(text));
      if (needsStaff(text)) {
        pageStaff('Messaggio: ' + text);
        startChat(text);   // opens the live conversation; AI then rests
      }
    }, 620);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function openPanel() {
    panel.classList.add('open');
    fab.classList.add('open');
    if (!greeted) {
      greeted = true;
      bubble('bot', t().greet);
    }
    setTimeout(function () { input.focus(); }, 200);
  }
  function closePanel() {
    panel.classList.remove('open');
    fab.classList.remove('open');
  }

  // greet (in the current language) shortly after load, opened once
  function openOnce() {
    if (opened) return;
    opened = true;
    setTimeout(openPanel, 1200);
  }

  function init() {
    // mount first: the panel (and its inner nodes) must be in the DOM
    // before we look them up and bind listeners.
    mount();

    fab.addEventListener('click', function () {
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });
    panel.querySelector('.x').addEventListener('click', closePanel);
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      send(input.value);
      input.value = '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
    // live language switch -> refresh widget copy
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(function () { refreshLang(); buildChips(); }, 0); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
