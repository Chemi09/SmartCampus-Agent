(function () {
  'use strict';

  function formatDateFr(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('fr-FR');
  }

  function formatCDF(amount) {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatUsd(amount) {
    if (amount == null) return '—';
    return '$' + Number(amount).toLocaleString('fr-FR');
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }

  function showToast(message, variant) {
    variant = variant || 'info';
    let container = document.querySelector('.sc-toast-host');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3 sc-toast';
      document.body.appendChild(container);
    }
    const id = 'sc-toast-' + Date.now();
    const bg =
      variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : 'primary';
    const html =
      '<div id="' +
      id +
      '" class="toast align-items-center text-bg-' +
      bg +
      ' border-0" role="alert">' +
      '<div class="d-flex">' +
      '<div class="toast-body">' +
      escapeHtml(message) +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
      '</div></div>';
    container.insertAdjacentHTML('beforeend', html);
    const el = document.getElementById(id);
    if (window.bootstrap && bootstrap.Toast) {
      const t = new bootstrap.Toast(el, { delay: 4000 });
      t.show();
      el.addEventListener('hidden.bs.toast', function () {
        el.remove();
      });
    } else {
      el.classList.add('show');
      setTimeout(function () {
        el.remove();
      }, 4000);
    }
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  window.SC_Utils = {
    formatDateFr: formatDateFr,
    formatCDF: formatCDF,
    formatUsd: formatUsd,
    escapeHtml: escapeHtml,
    showToast: showToast,
    debounce: debounce,
  };
})();
