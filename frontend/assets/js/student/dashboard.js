(function () {
  'use strict';

  var d = SC_MOCK.studentPortal;

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('st-welcome').textContent = "Bonjour, " + d.name.split(" ")[0] + " !";
    document.getElementById('st-sub').textContent = d.faculty + ' - ' + d.level + ' | Année ' + d.academicYear;

    var payPct = (d.amountPaid / d.totalFees) * 100;
    var credPct = (d.totalCredits / d.requiredCredits) * 100;

    document.getElementById('st-gpa').textContent = String(d.gpa);
    document.getElementById('st-cred').textContent = String(d.totalCredits);
    document.getElementById('st-cred-bar').style.width = Math.min(credPct, 100) + '%';
    document.getElementById('st-pay').textContent = d.amountPaid + '$';
    document.getElementById('st-pay-bar').style.width = Math.min(payPct, 100) + '%';
    document.getElementById('st-courses').textContent = String(d.coursesThisSemester);

    document.getElementById('st-recent-grades').innerHTML = d.recentGrades
      .map(function (g) {
        var lb = g.grade >= 14 ? 'Excellent' : g.grade >= 10 ? 'Validé' : 'À reprendre';
        var cls = g.grade >= 14 ? 'primary' : g.grade >= 10 ? 'secondary' : 'danger';
        return (
          '<div class="d-flex justify-content-between align-items-center rounded border p-3 mb-2 bg-light bg-opacity-50">' +
          '<div class="d-flex gap-3"><div class="rounded-2 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width:2.5rem;height:2.5rem"><i class="bi bi-book"></i></div>' +
          '<div><div class="fw-medium">' + SC_Utils.escapeHtml(g.course) + '</div><div class="small text-muted">' + g.credits + ' crédits</div></div></div>' +
          '<div class="text-end"><div class="fs-5 fw-bold">' + g.grade + '/' + g.maxGrade + '</div><span class="badge bg-' + cls + '">' + lb + '</span></div></div>'
        );
      })
      .join('');

    document.getElementById('st-events').innerHTML = d.upcomingEvents
      .map(function (ev) {
        var ic = ev.type === 'exam' ? 'file-text' : ev.type === 'deadline' ? 'clock' : 'book';
        var c = ev.type === 'exam' ? 'danger' : ev.type === 'deadline' ? 'warning' : 'primary';
        var lb = ev.type === 'exam' ? 'Examen' : ev.type === 'deadline' ? 'Échéance' : 'Cours';
        return (
          '<div class="d-flex gap-2 rounded border p-3 mb-2">' +
          '<div class="rounded-2 bg-' + c + ' bg-opacity-10 text-' + c + ' d-flex align-items-center justify-content-center flex-shrink-0" style="width:2rem;height:2rem"><i class="bi bi-' + ic + ' small"></i></div>' +
          '<div class="flex-grow-1 min-w-0"><div class="small fw-medium">' + SC_Utils.escapeHtml(ev.title) + '</div><div class="text-muted" style="font-size:.75rem">' + SC_Utils.escapeHtml(ev.date) + ' à ' + SC_Utils.escapeHtml(ev.time) + '</div></div>' +
          '<span class="badge border align-self-start">' + lb + '</span></div>'
        );
      })
      .join('');

    document.getElementById('st-notifs').innerHTML = d.notificationsPreview
      .map(function (n) {
        return (
          '<div class="d-flex gap-2 rounded border p-3 mb-2 ' + (n.read ? '' : 'border-primary border-opacity-50 bg-primary bg-opacity-5') + '">' +
          '<span class="rounded-circle flex-shrink-0 mt-2" style="width:8px;height:8px;background:' + (n.read ? 'var(--sc-muted-foreground)' : 'var(--sc-primary)') + '"></span>' +
          '<div class="flex-grow-1 small ' + (n.read ? 'text-muted' : 'fw-medium') + '">' + SC_Utils.escapeHtml(n.message) + '</div>' +
          '<span class="small text-muted flex-shrink-0">' + SC_Utils.escapeHtml(n.time) + '</span></div>'
        );
      })
      .join('');
  });
})();
