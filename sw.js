/* PLAZA Admin — service worker.
 *
 * Scope: just enough to make the admin installable ("Add to Home Screen") and
 * keep the app shell available if the connection blips. It is deliberately
 * conservative:
 *   - never caches the login page or any /api/ response,
 *   - network-first for everything, so the admin always shows fresh data,
 *   - falls back to a cached copy only when the network is truly unavailable.
 */
var CACHE = 'plaza-admin-v1';
var SHELL = [
  'admin.html',
  'assets/style.css',
  'assets/icons.js',
  'assets/i18n.js',
  'assets/img/icon-192.png',
  'assets/img/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll fails the whole install if one file 404s; add individually.
      return Promise.all(SHELL.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;            // leave CDNs alone
  var p = url.pathname;

  // Never cache auth or API traffic.
  if (p.indexOf('/api/') === 0 || p === '/login' || p.indexOf('/logout') === 0) return;

  e.respondWith(
    fetch(req).then(function (res) {
      // Only stash clean, cacheable shell responses.
      if (res && res.ok && p.indexOf('/api/') !== 0) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || Response.error();
      });
    })
  );
});
