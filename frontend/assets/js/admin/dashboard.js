(function () {
  'use strict';

  var paymentTrends = [];
  var ds = { activeStudents: 0, unpaidStudents: 0, suspendedStudents: 0, totalPayments: 0 };
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
            return (v / 1000).toFixed(0) + 'K';
          },
        },
      },
    };
  }

  function statusBadge(sta) {
    if (sta === 'active') return '<span class="badge sc-badge-status-active">Actif</span>';
    if (sta === 'unpaid') return '<span class="badge sc-badge-status-unpaid">Impayé</span>';
    if (sta === 'suspended') return '<span class="badge sc-badge-status-suspended">Suspendu</span>';
    return '<span class="badge sc-badge-status-graduated">Diplômé</span>';
  }

  function mapStudent(s) {
    var prog = s.program || {};
    return {
      id: String(s.id),
      firstName: s.first_name,
      lastName: s.last_name,
      program: prog.name || '—',
      level: prog.level || '—',
      status: s.status,
    };
  }

  async function loadDashboardPanels() {
    var students = [];
    var payments = [];
    try {
      students = (await SC_API.erpListStudents()).map(mapStudent);
      payments = (await SC_API.crmListPayments()).map(SC_API.mapApiPayment);
    } catch (e) {
      students = SC_MOCK.students.slice();
      payments = SC_MOCK.payments.slice();
    }

    var active = students.filter(function (s) {
      return s.status === 'active';
    }).length;
    var unpaidCount = payments.filter(function (p) {
      return p.rawStatus && p.rawStatus !== 'paid';
    }).length;
    var collected = payments.reduce(function (a, p) {
      return a + (p.paidAmount || 0);
    }, 0);

    document.getElementById('stat-total-students').textContent = String(students.length);
    document.getElementById('stat-active').textContent = String(active);
    document.getElementById('stat-payments').textContent = SC_API.formatMoney(collected, 'CDF');
    document.getElementById('stat-unpaid').textContent = String(unpaidCount);

    ds.activeStudents = active;
    ds.unpaidStudents = unpaidCount;
    ds.suspendedStudents = students.filter(function (s) {
      return s.status === 'suspended';
    }).length;
    ds.totalPayments = collected;

    document.getElementById('list-recent-students').innerHTML = students
      .slice(0, 5)
      .map(function (s) {
        var ini = (s.firstName[0] || '') + (s.lastName[0] || '');
        return (
          '<div class="d-flex align-items-center gap-2">' +
          '<div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-semibold" style="width:2.5rem;height:2.5rem;font-size:.8rem">' +
          SC_Utils.escapeHtml(ini) +
          '</div><div class="flex-grow-1 min-w-0"><div class="small fw-medium text-truncate">' +
          SC_Utils.escapeHtml(s.firstName + ' ' + s.lastName) +
          '</div><div class="text-muted text-truncate" style="font-size:.75rem">' +
          SC_Utils.escapeHtml(s.program + ' - ' + s.level) +
          '</div></div>' +
          statusBadge(s.status) +
          '</div>'
        );
      })
      .join('')
      .replace(/<\/?motion[^>]*>/g, '');

    var overdue = payments.filter(function (p) {
      return p.rawStatus === 'overdue';
    }).length;
    document.getElementById('pending-payments-caption').textContent = overdue + ' paiements en retard';

    var rp = payments
      .filter(function (p) {
        return p.rawStatus !== 'paid';
      })
      .slice(0, 5);
    document.getElementById('list-pending-payments').innerHTML = rp
      .map(function (p) {
        var stLabel = p.rawStatus === 'overdue' ? 'En retard' : 'En attente';
        var cls = p.rawStatus === 'overdue' ? 'sc-badge-status-unpaid' : 'sc-badge-status-suspended';
        return (
          '<div class="d-flex justify-content-between gap-2"><div class="min-w-0"><div class="small fw-medium text-truncate">' +
          SC_Utils.escapeHtml(p.studentName) +
          '</div><div class="text-muted" style="font-size:.75rem">' +
          SC_Utils.escapeHtml(p.type) +
          '</div></div><div class="text-end"><div class="small fw-semibold">' +
          SC_API.formatMoney(p.amount - p.paidAmount, 'CDF') +
          '</div><span class="badge ' +
          cls +
          '">' +
          stLabel +
          '</span></div></div>'
        );
      })
      .join('')
      .replace(/<\/?motion[^>]*>/g, '');

    var comms = [];
    try {
      comms = (await SC_API.crmListCommunications()).map(SC_API.mapApiCommunication).slice(0, 3);
    } catch (e2) {
      comms = SC_MOCK.announcements.slice(0, 3);
    }
    document.getElementById('list-announcements').innerHTML = comms
      .map(function (a) {
        var badge = 'bg-primary bg-opacity-10 text-primary';
        var lbl = 'Info';
        return (
          '<div class="border-bottom pb-3"><div class="d-flex align-items-center gap-2 mb-1">' +
          '<span class="badge ' + badge + '">' + lbl + '</span>' +
          '<span class="text-muted" style="font-size:.7rem">' + SC_Utils.escapeHtml(a.date) + '</span></div>' +
          '<div class="small fw-medium text-truncate">' + SC_Utils.escapeHtml(a.title) + '</div>' +
          '<div class="text-muted small" style="font-size:.75rem;line-height:1.3">' + SC_Utils.escapeHtml(a.content) + '</div></div>'
        );
      })
      .join('')
      .replace(/<\/?motion[^>]*>/g, '');

    var programCounts = {};
    students.forEach(function (s) {
      var key = s.program;
      if (!programCounts[key]) programCounts[key] = { name: key, students: 0, unpaid: 0 };
      programCounts[key].students += 1;
    });
    payments.forEach(function (p) {
      Object.keys(programCounts).forEach(function (k) {
        if (p.rawStatus !== 'paid') programCounts[k].unpaid += 0;
      });
    });
    var facultyStats = Object.keys(programCounts).map(function (k) {
      return programCounts[k];
    });
    if (!facultyStats.length) facultyStats = SC_MOCK.facultyStats;

    document.getElementById('faculty-stats-grid').innerHTML = facultyStats
      .map(function (f) {
        return (
          '<div class="col-sm-6 col-lg-4"><div class="rounded-3 p-3 h-100 bg-light bg-opacity-50 border border-light-subtle">' +
          '<div class="small fw-medium">' + SC_Utils.escapeHtml(f.name) + '</div>' +
          '<div class="text-muted small">' + f.students + ' étudiants</div>' +
          '<div class="text-end mt-2"><span class="fs-5 fw-bold text-danger">' + (f.unpaid || 0) + '</span>' +
          '<div class="small text-muted">impayés</div></div></div></div>'
        );
      })
      .join('')
      .replace(/<\/?motion[^>]*>/g, '');

    paymentTrends = [
      {
        month: 'Collectés',
        collected: collected,
        pending: payments
          .filter(function (p) {
            return p.rawStatus !== 'paid';
          })
          .reduce(function (a, p) {
            return a + (p.amount - p.paidAmount);
          }, 0),
      },
    ];
    renderCharts();
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

  document.addEventListener('DOMContentLoaded', function () {
    loadDashboardPanels();
    window.addEventListener('sc-theme-change', renderCharts);
    window.addEventListener('sc-lang-change', function () {
      loadDashboardPanels();
    });
  });
})();

