/**
 * Appliquer le thème avant le premier rendu (évite le flash clair/sombre).
 * Charger en premier dans <head>, sans defer.
 */
(function () {
  var KEY = 'sc_theme';
  var stored;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {
    stored = null;
  }
  var theme = stored || 'dark';
  if (theme === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-sc-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
})();
