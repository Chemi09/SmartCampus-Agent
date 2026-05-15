/**
 * Langue avant le premier rendu (évite le flash FR sur préférence EN/LN).
 */
(function () {
  var KEY = 'sc_lang';
  var stored;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {
    stored = null;
  }
  var lang = stored || 'fr';
  if (lang !== 'fr' && lang !== 'en' && lang !== 'ln') lang = 'fr';
  document.documentElement.setAttribute('data-sc-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'ln' ? 'ln' : lang);
})();
