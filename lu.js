/*
 * luxuryuhren.ch – Zusatz-Code
 * Geladen aus Lightspeed › Web Extras › Custom JavaScript (eine Zeile mit jsDelivr).
 * Inhalt: Kategorie-Banner, «ab CHF»-Preise, aufgeloeste Zwischenebenen, Empfehlungen, Zusatzverkauf.
 * Stand: 18.11.2026 (Empfehlung per Schlagwort)
 */
(function () {
  'use strict';

  /* ===== 1. EINSTELLUNGEN ===== */

  // Empfehlung: Produkt im Lightspeed-Admin mit dem Schlagwort (Tag) «Empfehlung» versehen.
  // Der Kasten erscheint in der untersten Kategorie des Produkts (nicht auf «Marken»-Seiten).
  // Pro Kategorie nur ein Produkt markieren. Aenderungen erscheinen spaetestens nach 15 Minuten.
  var EMPFEHLUNG_TAG = 'empfehlung';
  var OHNE_EMPFEHLUNG = /\/marken\//;
  var EMPFEHLUNG_TITEL = 'Unsere Empfehlung';

  // Zusatzverkauf auf Produktseiten (max. 3 je Gruppe, guenstigstes zuerst):
  //  Schlagwort «Zusatz Uhrenbeweger» -> erscheint bei Automatikuhren
  //  Schlagwort «Zusatz Uhrenbox»     -> erscheint bei allen Uhren und allen Uhrenbewegern
  var ZUSATZ_BEWEGER = 'zusatz-uhrenbeweger';
  var ZUSATZ_BOX = 'zusatz-uhrenbox';

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
    '.lu-emp{display:flex;gap:18px;align-items:center;background:#fff;border:1px solid #e6dfd0;outline:1px solid #c9b88f;outline-offset:-7px;padding:18px;margin:18px 0;color:#111;text-decoration:none!important;position:relative}',
    '.lu-emp img{width:150px;height:150px;object-fit:contain;flex:none}',
    '.lu-emp .k{font:600 11px Inter,sans-serif;letter-spacing:.18em;color:#c8102e;text-transform:uppercase}',
    '.lu-emp .n{font:600 22px/1.2 "Cormorant Garamond",Georgia,serif;margin:6px 0 8px}',
    '.lu-emp .p b{font:600 26px "Cormorant Garamond",Georgia,serif;color:#c8102e}',
    '.lu-emp .p s{color:#777;margin-left:8px}',
    '.lu-emp .p i{font-style:normal;background:#c8102e;color:#fff;font:600 12px Inter,sans-serif;padding:3px 7px;margin-left:8px}',
    '.lu-emp .c{display:inline-block;margin-top:10px;background:#111;color:#fff;font:600 13px Inter,sans-serif;padding:9px 16px}',
    '@media(max-width:575px){.lu-emp{flex-direction:column;text-align:center;gap:8px}.lu-emp img{width:180px;height:180px}}',
    // Zusatzverkauf (ersetzt den alten Block .lu-zb)
    '.lu-zs-on .lu-zb{display:none!important}',
    '.lu-zs{margin-top:18px;border-top:1px solid #e3e0da;padding-top:14px}',
    '.lu-zs h4{font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 10px;font-weight:700}',
    '.lu-zs .r{display:flex;gap:10px}',
    '.lu-zs .i{flex:1 1 0;border:1px solid #e3e0da;border-radius:6px;padding:8px;text-align:center;font-size:11.5px;line-height:1.3;display:flex;flex-direction:column;color:#111!important;text-decoration:none!important}',
    '.lu-zs img{width:100%;aspect-ratio:1/1;object-fit:contain}',
    '.lu-zs .p{font-weight:700;font-size:13px;margin:4px 0}',
    '.lu-zs .p s{font-weight:400;color:#888;margin-left:5px}',
    '.lu-zs .b{margin-top:auto;border:1px solid #111;font-size:11px;font-weight:700;padding:6px 0;border-radius:4px}'
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

  function empfehlungsListe(cb) {
    var key = 'lu-empf-v1', d = null;
    try { d = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) {}
    if (d && Date.now() - d.t < 15 * 60 * 1000) { cb(d.m); return; }
    fetch('/tags/' + EMPFEHLUNG_TAG + '/?format=json&limit=100')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var ps = j && j.collection && j.collection.products ? Object.keys(j.collection.products).map(function (k) { return j.collection.products[k]; }) : [];
        return Promise.all(ps.slice(0, 60).map(function (p) {
          return fetch('/' + p.url + '?format=json')
            .then(function (r) { return r.json(); })
            .then(function (x) {
              var c = x.product && x.product.categories ? Object.keys(x.product.categories).map(function (k) { return '/' + x.product.categories[k].url + '/'; }) : [];
              // nur die untersten Kategorien des Produkts
              var leaf = c.filter(function (a) { return !c.some(function (b) { return b !== a && b.indexOf(a) === 0; }); });
              return { u: p.url, c: leaf };
            })
            .catch(function () { return null; });
        }));
      })
      .then(function (list) {
        var m = {};
        (list || []).forEach(function (e) {
          if (!e) return;
          e.c.forEach(function (c) { if (!m[c] && !OHNE_EMPFEHLUNG.test(c)) m[c] = e.u; });
        });
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), m: m })); } catch (e) {}
        cb(m);
      })
      .catch(function () { cb({}); });
  }

  function empfehlung() {
    if (OHNE_EMPFEHLUNG.test(path) || document.querySelector('.lu-emp')) return;
    empfehlungsListe(function (m) {
      var u = m[path];
      if (!u || document.querySelector('.lu-emp')) return;
      zeigeEmpfehlung(u);
    });
  }

  function zeigeEmpfehlung(u) {
    fetch('/' + u + '?format=json')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var p = j.product;
        if (!p || (p.stock && p.stock.available === false) || document.querySelector('.lu-emp')) return;
        var n = p.price.price_incl, o = p.price.price_old_incl;
        var a = document.createElement('a');
        a.className = 'lu-emp';
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

  /* ===== 7. ZUSATZVERKAUF AUF PRODUKTSEITEN ===== */

  function tagProdukte(tag, cb) {
    var key = 'lu-tag-' + tag, d = null;
    try { d = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) {}
    if (d && Date.now() - d.t < 15 * 60 * 1000) { cb(d.p); return; }
    fetch('/tags/' + tag + '/?format=json&limit=100')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var o = j && j.collection && j.collection.products ? j.collection.products : {};
        var p = Object.keys(o).map(function (k) { return o[k]; })
          .filter(function (x) { return x.available !== false; })
          .map(function (x) { return { u: x.url, t: x.title, i: x.image, n: x.price.price, o: x.price.price_old }; })
          .sort(function (a, b) { return a.n - b.n; })
          .slice(0, 3);
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), p: p })); } catch (e) {}
        cb(p);
      })
      .catch(function () { cb([]); });
  }

  function zusatzBlock(titel, ps) {
    var z = document.createElement('div');
    z.className = 'lu-zs col-12';
    z.innerHTML = '<h4></h4><div class="r">' + ps.map(function (p) {
      return '<a class="i" href="/' + p.u + '"><img alt="" src="https://cdn.webshopapp.com/shops/49299/files/' + p.i + '/200x200x2/image.jpg">' +
        '<span class="t"></span><span class="p">' + chf(p.n) + (p.o > p.n ? '<s>' + chf(p.o) + '</s>' : '') + '</span><span class="b">Ansehen</span></a>';
    }).join('') + '</div>';
    z.querySelector('h4').textContent = titel;
    Q('.i', z).forEach(function (a, k) {
      a.querySelector('.t').textContent = String(ps[k].t).split(',')[0];
      a.querySelector('img').alt = ps[k].t;
    });
    return z;
  }

  function zusatz() {
    var pp = document.querySelector('.productpage');
    var ah = pp && pp.querySelector('.addtocart-holder');
    if (!ah || document.querySelector('.lu-zs')) return;
    var versuch = 0;
    (function warte() {
      var sb = document.querySelector('.lu-sb'); // Steckbrief gibt es nur bei Uhren
      if (!sb && versuch++ < 20) { setTimeout(warte, 150); return; }
      if (sb) { zeige(/automatik|automatic/i.test(sb.textContent)); return; }
      // keine Uhr: nur bei Uhrenbewegern
      fetch(location.pathname + '?format=json')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var c = j.product && j.product.categories ? j.product.categories : {};
          var beweger = Object.keys(c).some(function (k) { return /^uhrenbeweger(\/|$)/.test(c[k].url); });
          if (beweger) zeige(false);
        })
        .catch(function () {});
    })();

    function zeige(auto) {
      var gruppen = [];
      if (auto) gruppen.push(['Passend dazu: Uhrenbeweger', ZUSATZ_BEWEGER]);
      gruppen.push(['Passend dazu: Uhrenbox', ZUSATZ_BOX]);
      var bloecke = [], offen = gruppen.length;
      gruppen.forEach(function (g, k) {
        tagProdukte(g[1], function (ps) {
          ps = ps.filter(function (p) { return '/' + p.u !== location.pathname; });
          if (ps.length) bloecke[k] = zusatzBlock(g[0], ps);
          if (--offen) return;
          var ref = ah;
          bloecke.forEach(function (b) { if (b) { ref.parentNode.insertBefore(b, ref.nextSibling); ref = b; } });
          if (bloecke.some(Boolean)) document.documentElement.classList.add('lu-zs-on');
        });
      });
    }
  }

  /* ===== 8. START ===== */

  function go() {
    if (path === '/') return;
    if (document.querySelector('.productpage')) return;
    Q('a.home-highlight').forEach(ab);
    leiste();
    // kurz warten, bis der Kopf («lu-kopf») aufgebaut ist
    setTimeout(empfehlung, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
