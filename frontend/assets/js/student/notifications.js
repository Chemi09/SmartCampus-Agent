(function () {
  'use strict';

  function row(n) {
    var col = 'primary';
    if (n.type === 'payment') col = 'warning';
    if (n.type === 'grade') col = 'success';
    if (n.type === 'event') col = 'danger';
    return (
      '<div class="d-flex gap-3 p-3 border-bottom ' +
      (!n.read ? 'bg-primary bg-opacity-5' : '') +
      '">' +
      '<div class="rounded-circle bg-' +
      col +
      ' bg-opacity-10 p-2 align-self-start"><i class="bi bi-bell text-' +
      col +
      '"></i></div>' +
      '<div class="flex-grow-1 min-w-0">' +
      '<div class="d-flex align-items-center gap-2"><span class="fw-medium ' +
      (!n.read ? '' : 'text-muted') +
      '">' +
      SC_Utils.escapeHtml(n.title) +
      '</span>' +
      (!n.read ? '<span class="rounded-circle bg-primary" style="width:6px;height:6px"></span>' : '') +
      '</div>' +
      '<p class="small text-muted mb-1">' +
      SC_Utils.escapeHtml(n.message) +
      '</p>' +
      '<span class="small text-muted">' +
      SC_Utils.escapeHtml(n.time) +
      '</span></div>' +
      '<button type="button" class="btn btn-sm btn-link"><i class="bi bi-check2"></i></button></div>'
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var list = SC_MOCK.studentNotifications;
    var bundle = await SC_StudentAPI.loadPortalData();
    if (bundle && bundle.communications && bundle.communications.length) {
      list = SC_StudentAPI.notificationsFromCommunications(bundle.communications);
    }

    var unread = list.filter(function (n) {
      return !n.read;
    }).length;
    document.getElementById('sn-sub').textContent =
      'Vous avez ' + unread + ' notification' + (unread > 1 ? 's' : '') + ' non lue' + (unread > 1 ? 's' : '');
    var badge = document.getElementById('sn-unread-b');
    if (badge) badge.textContent = String(unread);

    var current = 'all';
    function render() {
      var rows = list.filter(function (n) {
        if (current === 'unread') return !n.read;
        if (current === 'grades') return n.type === 'grade';
        if (current === 'payments') return n.type === 'payment';
        return true;
      });
      document.getElementById('sn-list').innerHTML = rows.map(row).join('');
    }

    document.querySelectorAll('[data-sn-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-sn-filter]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        current = btn.getAttribute('data-sn-filter');
        render();
      });
    });
    render();
  });
})();
