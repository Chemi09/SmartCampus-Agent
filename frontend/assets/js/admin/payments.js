(function () {
  'use strict';

  var payments = SC_MOCK.payments.slice();
  var chartData = SC_MOCK.paymentChartByMonth;
  var payChart = null;

  function chartPalette() {
    return window.SC_Theme
      ? SC_Theme.chartColors()
      : { text: '#64748b', grid: 'rgba(226,232,240,0.8)' };
  }

  var typeLabels = {
    inscription: 'Inscription',
    tranche1: 'Tranche 1',
    tranche2: 'Tranche 2',
    tranche3: 'Tranche 3',
    exam: "Frais d'examen",
  };

  function renderStats() {
    var total = payments.reduce(function (a, p) {
      return a + p.amount;
    }, 0);
    var col = payments
      .filter(function (p) {
        return p.status === 'paid';
      })
      .reduce(function (a, p) {
        return a + p.amount;
      }, 0);
    var pend = payments
      .filter(function (p) {
        return p.status === 'pending';
      })
      .reduce(function (a, p) {
        return a + p.amount;
      }, 0);
    var ov = payments
      .filter(function (p) {
        return p.status === 'overdue';
      })
      .reduce(function (a, p) {
        return a + p.amount;
      }, 0);
    document.getElementById('stat-total').textContent = '$' + (total / 1000).toFixed(1) + 'K';
    document.getElementById('stat-collected').textContent = '$' + (col / 1000).toFixed(1) + 'K';
    document.getElementById('stat-pending').textContent = '$' + (pend / 1000).toFixed(1) + 'K';
    document.getElementById('stat-overdue').textContent = '$' + (ov / 1000).toFixed(1) + 'K';
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
          SC_Utils.escapeHtml(typeLabels[p.type] || p.type) +
          '</td><td class="text-end fw-bold">$' +
          p.amount +
          '<span class="text-muted fw-normal small"> ' +
          SC_Utils.escapeHtml(p.currency) +
          '</span></td><td class="d-none d-lg-table-cell small text-muted">' +
          SC_Utils.formatDateFr(p.dueDate) +
          '</td><td class="text-center">' +
          badge(p.status) +
          '</td><td class="text-end"><button type="button" class="btn btn-sm btn-link text-muted"><i class="bi bi-three-dots"></i></button></td></tr>'
        );
      })
      .join('');
  }

  function renderChart() {
    var ctx = document.getElementById('chart-pay-evolution');
    if (!ctx || !window.Chart) return;
    var c = chartPalette();
    if (payChart) payChart.destroy();
    payChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.map(function (d) {
          return d.month;
        }),
        datasets: [
          { label: 'Payé', data: chartData.map(function (d) { return d.paid; }), backgroundColor: 'rgba(20, 184, 166, 0.85)', borderRadius: 4 },
          { label: 'En attente', data: chartData.map(function (d) { return d.pending; }), backgroundColor: 'rgba(245, 158, 11, 0.75)', borderRadius: 4 },
          { label: 'En retard', data: chartData.map(function (d) { return d.overdue; }), backgroundColor: 'rgba(225, 29, 72, 0.8)', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: false, grid: { display: false }, ticks: { color: c.text } },
          y: {
            ticks: {
              color: c.text,
              callback: function (v) {
                return '$' + v / 1000 + 'K';
              },
            },
            grid: { color: c.grid },
          },
        },
        plugins: { legend: { position: 'bottom', labels: { color: c.text } } },
      },
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderChart();
    window.addEventListener('sc-theme-change', renderChart);
    window.addEventListener('sc-lang-change', function () {
      applyFilter();
      renderChart();
    });

    renderStats();
    document.getElementById('search-pay').addEventListener('input', SC_Utils.debounce(applyFilter, 200));
    document.getElementById('filter-pay-status').addEventListener('change', applyFilter);
    applyFilter();
  });
})();
