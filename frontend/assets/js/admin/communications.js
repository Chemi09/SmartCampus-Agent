(function () {
  'use strict';

  function typeBadge(t) {
    if (t === 'urgent') return { cls: 'sc-badge-status-unpaid', icon: 'bi-bell', lbl: 'Urgent' };
    if (t === 'warning') return { cls: 'sc-badge-status-suspended', icon: 'bi-exclamation-triangle', lbl: 'Relance' };
    return { cls: 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25', icon: 'bi-info-circle', lbl: 'Information' };
  }

  async function load() {
    var announcements = [];
    try {
      var raw = await SC_API.crmListCommunications();
      announcements = raw.map(SC_API.mapApiCommunication);
    } catch (e) {
      announcements = SC_MOCK.announcements.slice();
    }

    document.getElementById('ann-list').innerHTML = announcements
      .map(function (a) {
        var b = typeBadge(a.type);
        return (
          '<div class="sc-card p-3 mb-3">' +
          '<div class="d-flex flex-column flex-sm-row justify-content-between gap-3">' +
          '<div class="flex-grow-1">' +
          '<div class="d-flex flex-wrap align-items-center gap-2 mb-2">' +
          '<span class="badge border ' + b.cls + ' d-inline-flex align-items-center gap-1"><i class="bi ' + b.icon + '"></i>' + b.lbl + '</span>' +
          '<span class="small text-muted"><i class="bi bi-calendar3 me-1"></i>' + SC_Utils.formatDateFr(a.date) + '</span></div>' +
          '<h3 class="h6 fw-semibold">' + SC_Utils.escapeHtml(a.title) + '</h3>' +
          '<p class="small text-muted mb-2">' + SC_Utils.escapeHtml(a.content) + '</p>' +
          '<p class="small text-muted mb-0">Par ' + SC_Utils.escapeHtml(a.author) + '</p></div>' +
          '<div class="d-flex gap-2"><button type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-envelope"></i></button>' +
          '<button type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-phone"></i></button></div></div></div>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', load);
})();
