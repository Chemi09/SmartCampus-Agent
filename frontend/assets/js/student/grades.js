(function () {
  'use strict';

  function render(data) {
    var totalCred = data.reduce(function (a, g) {
      return a + g.credits;
    }, 0);
    var valCred = data
      .filter(function (g) {
        return g.status === 'validated';
      })
      .reduce(function (a, g) {
        return a + g.credits;
      }, 0);
    var avg = totalCred
      ? data.reduce(function (a, g) {
          return a + g.final * g.credits;
        }, 0) / totalCred
      : 0;
    document.getElementById('sg-avg').textContent = avg.toFixed(2);
    document.getElementById('sg-val-cred').textContent = String(valCred);
    document.getElementById('sg-cred-bar').style.width = (totalCred ? (valCred / totalCred) * 100 : 0) + '%';
    document.getElementById('sg-total-cred').textContent = String(totalCred);
    var ueVal = data.filter(function (g) {
      return g.status === 'validated';
    }).length;
    document.getElementById('sg-ue-count').textContent = String(ueVal);
    document.getElementById('sg-ue-foot').textContent = '/ ' + data.length + ' UE';

    document.getElementById('sg-body').innerHTML = data
      .map(function (g) {
        return (
          '<tr><td><div class="fw-medium">' +
          SC_Utils.escapeHtml(g.course) +
          '</div><div class="small text-muted">' +
          SC_Utils.escapeHtml(g.code) +
          '</div></td>' +
          '<td class="text-center">' +
          g.credits +
          '</td><td class="text-center">' +
          g.cc +
          '/20</td><td class="text-center">' +
          (g.tp != null ? g.tp + '/20' : '-') +
          '</td><td class="text-center">' +
          g.exam +
          '/20</td>' +
          '<td class="text-center"><span class="fw-bold ' +
          (g.final >= 14 ? 'text-success' : g.final >= 10 ? '' : 'text-danger') +
          '">' +
          g.final +
          '/20</span></td>' +
          '<td class="text-center"><span class="badge bg-' +
          (g.status === 'validated' ? 'primary' : 'danger') +
          '">' +
          (g.status === 'validated' ? 'Validé' : 'Non validé') +
          '</span></td>' +
          '<td class="text-center"><i class="bi bi-' +
          (g.trend === 'up' ? 'graph-up-arrow text-success' : g.trend === 'down' ? 'graph-down-arrow text-danger' : 'dash text-muted') +
          '"></i></td></tr>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var data = SC_MOCK.studentGradesDetail;
    var bundle = await SC_StudentAPI.loadPortalData();
    if (bundle && bundle.grades) {
      data = SC_StudentAPI.gradesDetailFromApi(bundle.grades);
    }
    render(data);
  });
})();
