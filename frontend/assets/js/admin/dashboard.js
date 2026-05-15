(function () {
  'use strict';

  var paymentTrends = SC_MOCK.paymentTrends;
  var ds = SC_MOCK.dashboardStats;
  var barChart = null;
  var pieChart = null;

  function chartPalette() {
    return window.SC_Theme ? SC_Theme.chartColors() : { text: '#64748b', grid: 'rgba(226,232,240,0.8)', mutedBar: 'rgba(100,116,139,0.5)', primaryBar: 'rgba(69,105,255,0.85)' };
  }

  function scaleOptions(c) {
    return {
      x: { grid: { display: false }, ticks: { color: c.text } },
      y: {
        grid: { color: c.grid },
        ticks: {
          color: c.text,
          callback: function (v) {
            return '$' + v / 1000 + 'K';
          },
        },
      },
    };
  }

  function renderCharts() {
    var c = chartPalette();
    var barCtx = document.getElementById('chart-payments');
    var pieCtx = document.getElementById('chart-status');

    if (barCtx && window.Chart) {
      if (barChart) barChart.destroy();
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: paymentTrends.map(function (r) {
            return r.month;
          }),
          datasets: [
            {
              label: window.SC_I18n ? SC_I18n.t('chart.collected') : 'Collectés',
              data: paymentTrends.map(function (r) {
                return r.collected;
              }),
              backgroundColor: c.primaryBar,
              borderRadius: 4,
            },
            {
              label: window.SC_I18n ? SC_I18n.t('chart.pending') : 'En attente',
              data: paymentTrends.map(function (r) {
                return r.pending;
              }),
              backgroundColor: c.mutedBar,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: c.text } } },
          scales: scaleOptions(c),
        },
      });
    }

    if (pieCtx && window.Chart) {
      if (pieChart) pieChart.destroy();
      pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: window.SC_I18n
            ? [SC_I18n.t('status.active'), SC_I18n.t('status.unpaid'), SC_I18n.t('status.suspended')]
            : ['Actifs', 'Impayés', 'Suspendus'],
          datasets: [
            {
              data: [ds.activeStudents, ds.unpaidStudents, ds.suspendedStudents],
              backgroundColor: ['#14b8a6', '#e11d48', '#f59e0b'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: { legend: { position: 'bottom', labels: { color: c.text, boxWidth: 10 } } },
        },
      });
    }
  }

  renderCharts();
  window.addEventListener('sc-theme-change', renderCharts);
  window.addEventListener('sc-lang-change', renderCharts);
})();
