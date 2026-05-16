(function () {
  'use strict';

  function render(p) {
    var pct = p.summary.totalFees > 0 ? (p.summary.amountPaid / p.summary.totalFees) * 100 : 0;
    document.getElementById('sp-total').textContent = SC_API.formatMoney(p.summary.totalFees, 'CDF');
    document.getElementById('sp-paid').textContent = SC_API.formatMoney(p.summary.amountPaid, 'CDF');
    document.getElementById('sp-bar').style.width = pct + '%';
    document.getElementById('sp-pct-line').textContent = pct.toFixed(0) + '% du total';
    document.getElementById('sp-rem').textContent = SC_API.formatMoney(p.summary.remaining, 'CDF');
    if (document.getElementById('sp-year-line')) {
      document.getElementById('sp-year-line').textContent =
        'Gérez vos frais académiques — ' + p.summary.academicYear;
    }
    if (document.getElementById('sp-alert-line')) {
      document.getElementById('sp-alert-line').textContent =
        'Prochaine échéance: ' +
        SC_Utils.formatDateFr(p.summary.nextDeadline) +
        ' — Reste: ' +
        SC_API.formatMoney(p.summary.remaining, 'CDF');
    }
    if (document.getElementById('sp-deadline')) {
      document.getElementById('sp-deadline').textContent =
        'Échéance: ' + SC_Utils.formatDateFr(p.summary.nextDeadline);
    }
    if (document.getElementById('modal-solde')) {
      document.getElementById('modal-solde').textContent =
        'Solde restant: ' + SC_API.formatMoney(p.summary.remaining, 'CDF');
    }
    if (document.getElementById('modal-amount')) {
      document.getElementById('modal-amount').value = String(Math.round(p.summary.remaining));
    }

    document.getElementById('sp-schedule').innerHTML = p.schedule
      .map(function (s) {
        return (
          '<div class="d-flex justify-content-between rounded border p-3 mb-2 ' +
          (s.status === 'paid' ? 'border-success border-opacity-50' : 'border-warning border-opacity-50') +
          '">' +
          '<div class="d-flex gap-2"><i class="bi bi-' +
          (s.status === 'paid' ? 'check-circle text-success' : 'clock text-warning') +
          ' fs-5"></i>' +
          '<div><div class="fw-medium">' +
          SC_Utils.escapeHtml(s.tranche) +
          '</div><div class="small text-muted">Échéance: ' +
          SC_Utils.escapeHtml(SC_Utils.formatDateFr(s.deadline)) +
          '</div></div></div>' +
          '<div class="text-end"><div class="fw-bold">' +
          s.amount +
          '</div><span class="badge ' +
          (s.status === 'paid' ? 'bg-success' : 'bg-warning-subtle text-warning-emphasis') +
          '">' +
          (s.status === 'paid' ? 'Payé' : 'En attente') +
          '</span></div></div>'
        );
      })
      .join('');

    document.getElementById('sp-history').innerHTML = p.history
      .map(function (h) {
        return (
          '<tr><td class="font-monospace small">' +
          SC_Utils.escapeHtml(h.id) +
          '</td><td>' +
          SC_Utils.escapeHtml(SC_Utils.formatDateFr(h.date)) +
          '</td><td>' +
          SC_Utils.escapeHtml(h.description) +
          '</td><td>' +
          SC_Utils.escapeHtml(h.method) +
          '</td><td class="text-end fw-medium">' +
          h.amount +
          '</td><td class="text-center"><span class="badge bg-success">Confirmé</span></td><td><button type="button" class="btn btn-sm btn-link"><i class="bi bi-download"></i></button></td></tr>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var p = SC_MOCK.studentPaymentsPortal;
    var bundle = await SC_StudentAPI.loadPortalData();
    if (bundle) {
      p = SC_StudentAPI.paymentsPortalFromApi(bundle.balance, bundle.payments);
    }
    render(p);
  });
})();
