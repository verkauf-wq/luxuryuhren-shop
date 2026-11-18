/*
 * luxuryuhren.ch – Zusatz-Code
 * Geladen aus Lightspeed › Web Extras › Custom JavaScript (eine Zeile mit jsDelivr).
 * Inhalt: Kategorie-Banner, «ab CHF»-Preise, aufgeloeste Zwischenebenen, Empfehlungen.
 * Stand: 18.11.2026
 */
(function () {
  'use strict';

  /* ===== 1. EINSTELLUNGEN ===== */

  // Empfehlung pro Kategorie: Kategorie-Pfad -> Produkt-URL (ohne Domain)
  var EMPFEHLUNG = {
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fuer-1-uhr/': 'modalo-affinity-uhrenbeweger-1-uhr-schwarz-1113.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-2-uhren/': 'lugano-fur-2-automatikuhren.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-3-uhren/': 'modalo-carat-uhrenbeweger-3-uhren-schwarz-3114.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-4-uhren/': 'modalo-affinity-uhrenbeweger-4-uhren-schwarz-4113.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-6-uhren/': 'chronoguard-premium-automatik-6-uhrenbeweger-mit-t.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-8-uhren/': 'windrose-uhrenbeweger-noblesse-8-uhren-petrol-13.html',
    '/uhrenbeweger/anzahl-uhren/uhrenbeweger-fur-12-uhren/': 'windrose-uhrenbeweger-tempora-12-uhren-schwarz-08.html'
  };
  var EMPFEHLUNG_TITEL = 'Unsere Empfehlung';

  // Seiten, auf denen die Auswahl oben als grosse Banner erscheint
  var BANNER_SEITEN = ['/uhrenbeweger/', '/uhrenaufbewahrung/', '/schmuckaufbewahrung/'];

  // Zwischenebenen, die in der Auswahl-Leiste aufgeloest werden
  var GRUPPE = /(anzahl-uhren|ausfuhrung)\/$/;

  // Keine «ab CHF»-Preise bei Marken
  var OHNE_PREIS = /\/(herren|damen)uhren\/|marken/;

  /* ===== 2. STIL ===== */

  var path = location.pathname;
  var banner = BANNER_SEITEN.indexOf(path) > -1;
  if (banner) document.documentElement.classList.add('lu-banner');

  var css = [
    // Kategorie-Seiten: Auswahl oben, Kurztext weg; Uebersichten: Text unter die Kacheln
    '.catalog,.container:has(>.pos-relative>#collection-category-carousel){display:flex;flex-direction:column}',
    '.catalog>p,.catalog>.content{order:5}',
    '.container:has(>.pos-relative>#collection-category-carousel)>p{display:none}',
    // «ab CHF»-Balken
    '.home-highlight picture{position:relative}',
    '.lu-ab{position:absolute;left:8%;right:8%;bottom:8%;background:#c8102e;color:#fff;font:600 13px Inter,sans-serif;text-align:center;padding:7px}',
    '.collection-category-carousel-block .lu-ab{position:static;background:none;color:#c8102e;font-size:11px;padding:0 0 0 8px;white-space:nowrap}',
    // Grosse Banner (nur BANNER_SEITEN)
    '.lu-banner #collection-category-carousel{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,200px));justify-content:center;gap:14px;overflow:visible!important;transform:none!important}',
    '.lu-banner .pos-relative:has(#collection-category-carousel)>i,.lu-banner #collection-category-carousel h5{display:none!important}',
    '.lu-banner #collection-category-carousel>a{display:block!important;position:relative;margin:0!important;padding:0!important;width:auto!important;background:none;border:0}',
    '.lu-banner #collection-category-carousel>a img.home-category-img{display:block;width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;aspect-ratio:1;margin:0!important}',
    '.lu-banner #collection-category-carousel .lu-ab{position:absolute;left:8%;right:8%;bottom:8%;background:#c8102e;color:#fff;padding:6px 4px;font-size:12px;text-align:center;white-space:normal}',
    '@media(max-width:575px){.lu-banner #collection-category-carousel{grid-template-columns:repeat(2,1fr)!important;gap:10px}}',
    // Empfehlungs-Kasten
    '.lu-td{display:flex;gap:18px;align-items:center;background:#fff;border:1px solid #e6dfd0;outline:1px solid #c9b88f;outline-offset:-7px;padding:18px;margin:18px 0;color:#111;text-decoration:none!important;position:relative}',
    '.lu-td img{width:150px;height:150px;object-fit:contain;flex:none}',
    '.lu-td .k{font:600 11px Inter,sans-serif;letter-spacing:.18em;color:#c8102e;text-transform:uppercase}',
    '.lu-td .n{font:600 22px/1.2 "Cormorant Garamond",Georgia,serif;margin:6px 0 8px}',
    '.lu-td .p b{font:600 26px "Cormorant Garamond",Georgia,serif;color:#c8102e}',
    '.lu-td .p s{color:#777;margin-left:8px}',
    '.lu-td .p i{font-style:normal;background:#c8102e;color:#fff;font:600 12px Inter,sans-serif;padding:3px 7px;margin-left:8px}',
    '.lu-td .c{display:inline-block;margin-top:10px;background:#111;color:#fff;font:600 13px Inter,sans-serif;padding:9px 16px}',
    '@media(max-width:575px){.lu-td{flex-direction:column;text-align:center;gap:8px}.lu-td img{width:180px;height:180px}}'
  ].join('\n');
  var st = document.createElement('style');
  st.id = 'lu-zusatz-css';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ===== 3. HILFEN ===== */

  function Q(s, e) { return [].slice.call((e || document).querySelectorAll(s)); }

  function chf(x) {
    return 'CHF ' + (x % 1
      ? x.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : x.toLocaleString('de-CH') + '.–');
  }

  /* ===== 4. «ab CHF»-PREISE ===== */

  function ab(a) {
    if (OHNE_PREIS.test(a.href) || a.querySelector('.lu-ab')) return;
    fetch(a.href + '?format=json&sort=lowest&limit=1')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var p = j.collection && j.collection.products;
        if (!p) return;
        p = p[Object.keys(p)[0]];
        if (!p || a.querySelector('.lu-ab')) return;
        var b = document.createElement('b');
        b.className = 'lu-ab';
        b.textContent = 'ab ' + chf(Math.floor(p.price.price));
        (a.querySelector('picture') || a).appendChild(b);
      })
      .catch(function () {});
  }

  /* ===== 5. AUSWAHL-LEISTE: ZWISCHENEBENEN AUFLOESEN ===== */

  function leiste() {
    var s = document.getElementById('collection-category-carousel');
    if (!s || s.getAttribute('data-lu')) return;
    s.setAttribute('data-lu', '1');
    Q('a', s).forEach(function (a) {
      if (!GRUPPE.test(a.href)) { ab(a); return; }
      fetch(a.href)
        .then(function (r) { return r.text(); })
        .then(function (t) {
          var d = new DOMParser().parseFromString(t, 'text/html');
          Q('a.home-highlight', d).forEach(function (x) {
            var i = x.querySelector('img');
            if (!i) return;
            var n = a.cloneNode(true);
            n.href = x.href;
            var im = n.querySelector('img');
            im.src = i.src.replace(/\d+x\d+x\d/, '400x400x2');
            im.alt = i.alt;
            var h = n.querySelector('h5');
            if (h) h.textContent = i.alt.replace('Uhrenbeweger ', '');
            a.parentNode.insertBefore(n, a);
            ab(n);
          });
          a.parentNode.removeChild(a);
          if (s.parentNode) s.parentNode.classList.remove('not-scrollable');
        })
        .catch(function () {});
    });
  }

  /* ===== 6. EMPFEHLUNG ===== */

  function empfehlung() {
    var u = EMPFEHLUNG[path];
    if (!u || document.querySelector('.lu-td')) return;
    fetch('/' + u + '?format=json')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var p = j.product;
        if (!p || (p.stock && p.stock.available === false) || document.querySelector('.lu-td')) return;
        var n = p.price.price_incl, o = p.price.price_old_incl;
        var a = document.createElement('a');
        a.className = 'lu-td';
        a.href = '/' + u;
        a.innerHTML =
          '<img alt="" src="https://cdn.webshopapp.com/shops/49299/files/' + p.image + '/300x300x2/image.jpg">' +
          '<div><div class="k"></div><div class="n"></div>' +
          '<div class="p"><b>' + chf(n) + '</b>' +
          (o > n ? '<s>' + chf(o) + '</s><i>−' + Math.round((1 - n / o) * 100) + ' %</i>' : '') +
          '</div><span class="c">Zum Angebot →</span></div>';
        a.querySelector('.k').textContent = EMPFEHLUNG_TITEL;
        a.querySelector('.n').textContent = p.fulltitle;
        a.querySelector('img').alt = p.fulltitle;
        var k = document.querySelector('.lu-kopf') || document.querySelector('h1');
        if (k) k.parentNode.insertBefore(a, k.nextSibling);
      })
      .catch(function () {});
  }

  /* ===== 7. START ===== */

  function go() {
    if (path === '/') return;
    Q('a.home-highlight').forEach(ab);
    leiste();
    // kurz warten, bis der Kopf («lu-kopf») aufgebaut ist
    setTimeout(empfehlung, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
