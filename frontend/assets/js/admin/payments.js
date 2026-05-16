(function () {
  'use strict';

  var payments = [];
  var chartData = [];
  var payChart = null;
  var usedMock = false;

  function chartPalette() {
    return window.SC_Theme
      ? SC_Theme.chartColors()
      : { text: '#64748b', grid: 'rgba(226,232,240,0.8)' };
  }

  function formatAmt(n) {
    return SC_API.formatMoney(n, 'CDF');
  }

  function outstandingPayments() {
    return payments.filter(function (p) {
      return p.rawStatus === 'partial' || p.rawStatus === 'unpaid' || p.rawStatus === 'overdue';
    });
  }

  function renderStats() {
    var total = payments.reduce(function (a, p) {
      return a + p.amount;
    }, 0);
    var col = payments
      .filter(function (p) {
        return p.rawStatus === 'paid';
      })
      .reduce(function (a, p) {
        return a + p.paidAmount;
      }, 0);
    var pend = payments
      .filter(function (p) {
        return p.rawStatus === 'partial' || p.rawStatus === 'unpaid';
      })
      .reduce(function (a, p) {
        return a + (p.amount - p.paidAmount);
      }, 0);
    var ov = payments
      .filter(function (p) {
        return p.rawStatus === 'overdue';
      })
      .reduce(function (a, p) {
        return a + (p.amount - p.paidAmount);
      }, 0);
    document.getElementById('stat-total').textContent = formatAmt(total);
    document.getElementById('stat-collected').textContent = formatAmt(col);
    document.getElementById('stat-pending').textContent = formatAmt(pend);
    document.getElementById('stat-overdue').textContent = formatAmt(ov);
  }

  function badge(st) {
    var paid = window.SC_I18n ? SC_I18n.t('status.paid') : 'Payé';
    var pending = window.SC_I18n ? SC_I18n.t('status.pending') : 'En attente';
    var overdue = window.SC_I18n ? SC_I18n.t('status.overdue') : 'En retard';
    if (st === 'paid')
      return '<span class="badge sc-badge-status-active d-inline-flex align-items-center gap-1"><i class="bi bi-check-circle"></i>' + paid + '</span>';
    if (st === 'pending')
      return '<span class="badge sc-badge-status-suspended d-inline-flex align-items-center gap-1"><i class="bi bi-clock"></i>' + pending + '</span>';
    return '<span class="badge sc-badge-status-unpaid d-inline-flex align-items-center gap-1"><i class="bi bi-exclamation-triangle"></i>' + overdue + '</span>';
  }

  function actionButtons(p) {
    var view =
      '<a class="btn btn-sm btn-link" href="student-detail.html?id=' +
      encodeURIComponent(p.studentId) +
      '" title="Voir fiche"><i class="bi bi-eye"></i></a>';
    if (usedMock || p.rawStatus === 'paid') return view;
    var rest = p.amount - p.paidAmount;
    return (
      view +
      '<button type="button" class="btn btn-sm btn-link text-success" data-record-pay="' +
      p.paymentId +
      '" data-record-amt="' +
      rest +
      '" title="Enregistrer paiement"><i class="bi bi-cash-coin"></i></button>'
    );
  }

  function applyFilter() {
    var q = (document.getElementById('search-pay').value || '').toLowerCase();
    var st = document.getElementById('filter-pay-status').value;
    var rows = payments.filter(function (p) {
      var ok = p.studentName.toLowerCase().indexOf(q) !== -1 || p.id.toLowerCase().indexOf(q) !== -1;
      var sok = st === 'all' || p.status === st;
      return ok && sok;
    });
    document.getElementById('pay-count').textContent = String(rows.length);
    var tb = document.getElementById('payments-tbody');
    if (rows.length === 0) {
      tb.innerHTML = '';
      document.getElementById('payments-empty').classList.remove('d-none');
      return;
    }
    document.getElementById('payments-empty').classList.add('d-none');
    tb.innerHTML = rows
      .map(function (p) {
        return (
          '<tr class="border-bottom"><td><code class="sc-code">' +
          SC_Utils.escapeHtml(p.id) +
          '</code></td><td><span class="small fw-medium">' +
          SC_Utils.escapeHtml(p.studentName) +
          '</span></td><td class="d-none d-md-table-cell small">' +
          SC_Utils.escapeHtml(p.type) +
          '</td><td class="text-end fw-bold">' +
          formatAmt(p.amount) +
          '</td><td class="d-none d-lg-table-cell small text-muted">' +
          SC_Utils.formatDateFr(p.dueDate) +
          '</td><td class="text-center">' +
          badge(p.status) +
          '</td><td class="text-end text-nowrap">' +
          actionButtons(p) +
          '</td></tr>'
        );
      })
      .join('');

    tb.querySelectorAll('[data-record-pay]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        recordPayment(
          Number(btn.getAttribute('data-record-pay')),
          Number(btn.getAttribute('data-record-amt'))
        );
      });
    });
  }

  async function recordPayment(paymentId, amount) {
    if (usedMock) {
      SC_Utils.showToast('Connectez l’API pour enregistrer un paiement.', 'warning');
      return;
    }
    try {
      var res = await SC_API.crmRecordPayment(paymentId, {
        amount: amount,
        method: 'mobile_money',
        reference: 'DEMO-' + Date.now(),
      });
      SC_Utils.showToast(res.message || 'Paiement enregistré.', 'success');
      await load();
    } catch (e) {
      SC_Utils.showToast(e.message || 'Erreur enregistrement', 'danger');
    }
  }

  async function sendGroupRelance() {
    if (usedMock) {
      SC_Utils.showToast('Connectez l’API pour envoyer des relances.', 'warning');
      return;
    }
    var targets = outstandingPayments();
    if (!targets.length) {
      SC_Utils.showToast('Aucun paiement impayé à relancer.', 'info');
      return;
    }
    var btn = document.getElementById('btn-relance-group');
    if (btn) btn.disabled = true;
    try {
      var res = await SC_API.crmSendRelances({
        payment_ids: targets.map(function (p) {
          return p.paymentId;
        }),
        channel: 'whatsapp',
      });
      SC_Utils.showToast(
        res.sent + ' relance(s) envoyée(s) — voir Communications.',
        'success'
      );
    } catch (e) {
      SC_Utils.showToast(e.message || 'Erreur relance', 'danger');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function buildChartData() {
    chartData = [
      {
        month: 'Collectés',
        paid: payments
          .filter(function (p) {
            return p.rawStatus === 'paid';
          })
          .reduce(function (a, p) {
            return a + p.paidAmount;
          }, 0),
        pending: payments
          .filter(function (p) {
            return p.rawStatus === 'partial' || p.rawStatus === 'unpaid';
          })
          .reduce(function (a, p) {
            return a + (p.amount - p.paidAmount);
          }, 0),
        overdue: payments
          .filter(function (p) {
            return p.rawStatus === 'overdue';
          })
          .reduce(function (a, p) {
            return a + (p.amount - p.paidAmount);
          }, 0),
      },
    ];
  }

  function renderChart() {
    var ctx = document.getElementById('chart-pay-evolution');
    if (!ctx || !window.Chart) return;
    var c = chartPalette();
    if (payChart) payChart.destroy();
    payChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Semestre actif'],
        datasets: [
          {
            label: 'Payé',
            data: [chartData[0] ? chartData[0].paid : 0],
            backgroundColor: 'rgba(20, 184, 166, 0.85)',
            borderRadius: 4,
          },
          {
            label: 'En attente',
            data: [chartData[0] ? chartData[0].pending : 0],
            backgroundColor: 'rgba(245, 158, 11, 0.75)',
            borderRadius: 4,
          },
          {
            label: 'En retard',
            data: [chartData[0] ? chartData[0].overdue : 0],
            backgroundColor: 'rgba(225, 29, 72, 0.8)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text } },
          y: {
            ticks: {
              color: c.text,
              callback: function (v) {
                return (v / 1000).toFixed(0) + 'K';
              },
            },
            grid: { color: c.grid },
          },
        },
        plugins: { legend: { position: 'bottom', labels: { color: c.text } } },
      },
    });
  }

  async function load() {
    usedMock = false;
    try {
      var raw = await SC_API.crmListPayments();
      payments = raw.map(SC_API.mapApiPayment);
      if (SC_Utils.clearApiOfflineBanner) SC_Utils.clearApiOfflineBanner();
    } catch (e) {
      usedMock = true;
      payments = SC_MOCK.payments.slice();
      if (SC_Utils.showApiOfflineBanner) SC_Utils.showApiOfflineBanner();
    }
    buildChartData();
    renderStats();
    renderChart();
    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-pay').addEventListener('input', SC_Utils.debounce(applyFilter, 200));
    document.getElementById('filter-pay-status').addEventListener('change', applyFilter);
    var relBtn = document.getElementById('btn-relance-group');
    if (relBtn) relBtn.addEventListener('click', sendGroupRelance);
    window.addEventListener('sc-theme-change', renderChart);
    window.addEventListener('sc-lang-change', function () {
      applyFilter();
      renderChart();
    });
    load();
  });
})();
