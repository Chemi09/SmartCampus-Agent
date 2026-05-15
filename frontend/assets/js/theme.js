(function () {
  'use strict';

  var KEY = 'sc_theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-sc-theme') || 'dark';
  }

  function isDark() {
    return getTheme() === 'dark';
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    document.documentElement.setAttribute('data-sc-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    updateToggleButtons();
    window.dispatchEvent(new CustomEvent('sc-theme-change', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    setTheme(isDark() ? 'light' : 'dark');
  }

  function updateToggleButtons() {
    var dark = isDark();
    document.querySelectorAll('[data-sc-theme-toggle]').forEach(function (btn) {
      var moon = btn.querySelector('.sc-theme-icon-dark');
      var sun = btn.querySelector('.sc-theme-icon-light');
      if (moon) moon.classList.toggle('d-none', dark);
      if (sun) sun.classList.toggle('d-none', !dark);
      btn.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
      btn.setAttribute('title', dark ? 'Mode clair' : 'Mode sombre');
    });
  }

  /** Couleurs Chart.js selon le thème courant */
  function chartColors() {
    if (isDark()) {
      return {
        text: '#94a3b8',
        grid: 'rgba(148, 163, 184, 0.15)',
        mutedBar: 'rgba(148, 163, 184, 0.35)',
        primaryBar: 'rgba(91, 124, 255, 0.9)',
      };
    }
    return {
      text: '#64748b',
      grid: 'rgba(226, 232, 240, 0.8)',
      mutedBar: 'rgba(100, 116, 139, 0.5)',
      primaryBar: 'rgba(69, 105, 255, 0.85)',
    };
  }

  function wireToggles() {
    document.querySelectorAll('[data-sc-theme-toggle]').forEach(function (btn) {
      if (btn.dataset.scThemeWired) return;
      btn.dataset.scThemeWired = '1';
      btn.addEventListener('click', function () {
        toggleTheme();
      });
    });
    updateToggleButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggles);
  } else {
    wireToggles();
  }

  window.SC_Theme = {
    getTheme: getTheme,
    isDark: isDark,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    chartColors: chartColors,
    wireToggles: wireToggles,
  };
})();
