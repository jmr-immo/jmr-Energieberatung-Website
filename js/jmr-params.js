/* jmr-params.js — URL-Parameter über alle Seiten hinweg mitführen.
 *
 * Was das Skript macht:
 *  1) Beim Aufruf einer Seite werden ALLE Query-Parameter (z. B. ?parameter=mustertest,
 *     utm_source, gclid …) gelesen und in der sessionStorage gemerkt.
 *  2) Beim Klick auf einen internen Link werden die gemerkten Parameter automatisch
 *     wieder angehängt — dadurch bleiben sie über alle Unterseiten erhalten,
 *     auch bei Verzeichnis-URLs wie /energieausweis/.
 *  3) In jedem Formular werden sie als verstecktes Feld "URL-Parameter" mitgesendet,
 *     zusätzlich die "Einstiegsseite" — beides erscheint damit in der Formspree-Mail.
 *
 * Muss NACH nav.js / kontakt.js geladen werden (die markieren die aktive Seite
 * anhand des unveränderten href).
 */
(function () {
  'use strict';

  var KEY = 'jmr-url-params-v1';
  var LANDING_KEY = 'jmr-landing-v1';

  /* ---------- 1) Parameter einsammeln und merken ---------- */
  var store = {};
  try { store = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }

  try {
    new URLSearchParams(location.search).forEach(function (v, k) {
      if (k) { store[k] = v; }           // neue Parameter überschreiben gemerkte
    });
    sessionStorage.setItem(KEY, JSON.stringify(store));
  } catch (e) { /* sessionStorage nicht verfügbar – dann gilt nur die aktuelle URL */ }

  /* Einstiegsseite einmalig pro Sitzung festhalten */
  var landing = '';
  try {
    landing = sessionStorage.getItem(LANDING_KEY) || '';
    if (!landing) {
      landing = location.pathname + location.search;
      sessionStorage.setItem(LANDING_KEY, landing);
    }
  } catch (e) { landing = location.pathname + location.search; }

  var keys = Object.keys(store);

  function paramString() {
    var p = new URLSearchParams();
    keys.forEach(function (k) { p.set(k, store[k]); });
    return p.toString();
  }

  /* ---------- 2) Parameter an alle internen Links anhängen ---------- */
  function decorateLinks() {
    if (!keys.length) { return; }
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') { continue; }
      if (/^(tel:|mailto:|javascript:|data:)/i.test(href)) { continue; }
      if (a.hasAttribute('download')) { continue; }

      var u;
      try { u = new URL(href, location.href); } catch (e) { continue; }
      if (u.hostname !== location.hostname) { continue; }   // nur interne Links

      for (var j = 0; j < keys.length; j++) {
        if (!u.searchParams.has(keys[j])) { u.searchParams.set(keys[j], store[keys[j]]); }
      }
      a.setAttribute('href', u.pathname + u.search + u.hash);
    }
  }

  /* ---------- 3) Parameter in jedes Formular legen ---------- */
  function addHidden(form, name, value) {
    if (!value) { return; }
    if (form.querySelector('input[name="' + name + '"]')) { return; }
    var i = document.createElement('input');
    i.type = 'hidden';
    i.name = name;
    i.value = value;
    form.appendChild(i);
  }

  function decorateForms() {
    var ps = paramString();
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      addHidden(forms[i], 'URL-Parameter', ps);
      addHidden(forms[i], 'Einstiegsseite', landing);
    }
  }

  function run() { decorateLinks(); decorateForms(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  /* Für andere Skripte nutzbar */
  window.jmrUrlParams = paramString;
})();
