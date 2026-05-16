(function () {
  'use strict';

  var enriched = [];

  function renderStats(rows) {
    var n = rows.length;
    var avg = n ? (rows.reduce(function (a, g) {
      return a + g.grade;
    }, 0) / n).toFixed(1) : '0';
    var passed = rows.filter(function (g) {
      return g.grade >= 10;
    }).length;
    var rate = n ? ((passed / n) * 100).toFixed(0) : '0';
    document.getElementById('stat-total-grades').textContent = String(n);
    document.getElementById('stat-avg').textContent = avg + '/20';
    document.getElementById('stat-passed').textContent = String(passed);
    document.getElementById('stat-rate').textContent = rate + '%';
  }

  function applyFilter() {
    var q = (document.getElementById('search-grades').value || '').toLowerCase();
    var sem = document.getElementById('filter-semester').value;
    var rows = enriched.filter(function (g) {
      var ok =
        g.studentName.toLowerCase().indexOf(q) !== -1 ||
        g.courseName.toLowerCase().indexOf(q) !== -1 ||
        g.courseCode.toLowerCase().indexOf(q) !== -1;
      var sok = sem === 'all' || g.semester === sem;
      return ok && sok;
    });
    document.getElementById('grades-found').textContent = String(rows.length);
    renderStats(rows);

    var tb = document.getElementById('grades-tbody');
    if (rows.length === 0) {
      tb.innerHTML = '';
      document.getElementById('grades-empty').classList.remove('d-none');
      return;
    }
    document.getElementById('grades-empty').classList.add('d-none');
    tb.innerHTML = rows
      .map(function (g) {
        var ok = g.grade >= 10;
        return (
          '<tr class="border-bottom"><td><div class="small fw-medium">' +
          SC_Utils.escapeHtml(g.studentName) +
          '</div><div class="text-muted" style="font-size:.75rem">' +
          SC_Utils.escapeHtml(g.studentMatricule) +
          '</div></td><td class="d-none d-md-table-cell"><code class="sc-code">' +
          SC_Utils.escapeHtml(g.courseCode) +
          '</code></td><td class="small">' +
          SC_Utils.escapeHtml(g.courseName) +
          '</td><td class="text-center">' +
          g.credits +
          '</td><td class="text-center"><span class="fs-6 fw-bold ' +
          (ok ? 'text-success' : 'text-danger') +
          '">' +
          g.grade +
          '/20</span></td><td class="text-center d-none d-sm-table-cell"><span class="badge border">' +
          SC_Utils.escapeHtml(g.semester) +
          '</span></td><td class="text-center"><span class="badge border ' +
          (ok ? 'sc-badge-status-active' : 'sc-badge-status-unpaid') +
          '">' +
          (ok ? 'Validé' : 'Non validé') +
          '</span></td></tr>'
        );
      })
      .join('');
  }

  function enrichFromMock() {
    enriched = SC_MOCK.grades.map(function (grade) {
      var st = SC_MOCK.students.find(function (s) {
        return s.id === grade.studentId;
      });
      return Object.assign({}, grade, {
        studentName: st ? st.firstName + ' ' + st.lastName : 'Inconnu',
        studentMatricule: st ? st.matricule : 'N/A',
        courseName: grade.courseName,
        courseCode: grade.courseCode,
      });
    });
  }

  async function load() {
    try {
      enriched = await SC_API.erpListAllGradesFlat();
      if (SC_Utils.clearApiOfflineBanner) SC_Utils.clearApiOfflineBanner();
    } catch (e) {
      enrichFromMock();
      if (SC_Utils.showApiOfflineBanner) SC_Utils.showApiOfflineBanner();
    }
    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-grades').addEventListener('input', SC_Utils.debounce(applyFilter, 200));
    document.getElementById('filter-semester').addEventListener('change', applyFilter);
    load();
  });
})();
