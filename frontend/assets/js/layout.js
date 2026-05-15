(function () {
  'use strict';

  function pathTail() {
    var p = window.location.pathname || '';
    var parts = p.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '';
  }

  function wireAdminSidebar(root) {
    var aside = root.querySelector('.sc-admin-sidebar');
    if (!aside) return;

    var collapseBtn = aside.querySelector('[data-sc-sidebar-collapse]');
    var main = document.querySelector('.sc-main-admin');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', function () {
        aside.classList.toggle('sc-collapsed');
        if (main) main.classList.toggle('sc-sidebar-collapsed', aside.classList.contains('sc-collapsed'));
      });
    }

    var mobileBtn = document.querySelector('[data-sc-mobile-menu]');
    var backdrop = document.querySelector('[data-sc-backdrop]');
    function closeMobile() {
      aside.classList.remove('sc-mobile-open');
      if (backdrop) backdrop.classList.add('d-none');
    }
    function openMobile() {
      aside.classList.add('sc-mobile-open');
      if (backdrop) backdrop.classList.remove('d-none');
    }
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        if (aside.classList.contains('sc-mobile-open')) closeMobile();
        else openMobile();
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeMobile);
    }

    var logoutLinks = aside.querySelectorAll('[data-sc-logout]');
    logoutLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.SC_Auth) {
          SC_Auth.logout();
          window.location.href = '../login.html';
        }
      });
    });
  }

  function wireStudentSidebar(root) {
    var aside = root.querySelector('.sc-student-sidebar');
    if (!aside) return;
    var openBtn = document.querySelector('[data-sc-student-open]');
    var closeBtn = aside.querySelector('[data-sc-student-close]');
    var backdrop = document.querySelector('[data-sc-student-backdrop]');
    function close() {
      aside.classList.remove('sc-open');
      if (backdrop) backdrop.classList.add('d-none');
    }
    function open() {
      aside.classList.add('sc-open');
      if (backdrop) backdrop.classList.remove('d-none');
    }
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
  }

  function highlightActive(root) {
    var tail = pathTail().toLowerCase().split('?')[0];
    var links = root.querySelectorAll('a.sc-nav-link[data-sc-path]');
    links.forEach(function (a) {
      a.classList.remove('active');
      var href = (a.getAttribute('href') || '').split('?')[0].toLowerCase();
      var name = href.replace(/^.*\//, '');
      if (name === tail) a.classList.add('active');
    });
  }

  /**
   * @param {{ role: 'admin'|'student', partialSelector?: string }} options
   */
  async function init(options) {
    options = options || {};
    var role = options.role || 'admin';
    var sel = options.partialSelector || '#sc-sidebar-host';

    if (role === 'admin') SC_Auth.requireAdmin();
    else if (role === 'student') SC_Auth.requireStudent();

    var host = document.querySelector(sel);
    if (!host) return;

    var url = host.getAttribute('data-partial');
    if (!url) return;

    var res = await fetch(url);
    if (!res.ok) {
      host.innerHTML =
        '<div class="alert alert-warning m-3">Impossible de charger le menu. Ouvrez le site via HTTP (pas file://).</div>';
      return;
    }
    var html = await res.text();
    host.innerHTML = html;

    if (role === 'admin') wireAdminSidebar(host);
    else wireStudentSidebar(host);

    highlightActive(host);

    if (role === 'student') {
      document.querySelectorAll('[data-sc-logout]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          SC_Auth.logout();
          window.location.href = '../login.html';
        });
      });
    }

    if (window.SC_Theme) SC_Theme.wireToggles();

    if (window.SC_I18n) {
      SC_I18n.apply(host);
      SC_I18n.mountAll();
    }

    if (typeof options.onReady === 'function') options.onReady(host);
  }

  window.SC_Layout = {
    init: init,
    pathTail: pathTail,
  };
})();