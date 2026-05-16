(function () {
  'use strict';

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function mapApiStudent(s) {
    var prog = s.program || {};
    return {
      id: String(s.id),
      matricule: s.matricule,
      firstName: s.first_name,
      lastName: s.last_name,
      email: s.email || '',
      phone: s.phone || '',
      faculty: prog.name || '—',
      program: prog.name || '—',
      level: prog.level || '—',
      status: s.status,
      enrollmentDate: '',
    };
  }

  function mapApiGrades(summary) {
    if (!summary || !summary.grades) return [];
    return summary.grades.map(function (g, i) {
      return {
        id: 'ag' + i,
        studentId: String(summary.student_id),
        courseCode: '',
        courseName: g.course,
        credits: g.credits,
        grade: g.score > 20 ? Math.round((g.score / 100) * 20 * 10) / 10 : g.score,
        semester: summary.semester || 'S1',
        year: '2024-2025',
      };
    });
  }

  function statusClass(st) {
    if (st === 'active') return 'sc-badge-status-active';
    if (st === 'unpaid') return 'sc-badge-status-unpaid';
    if (st === 'suspended') return 'sc-badge-status-suspended';
    return 'sc-badge-status-graduated';
  }

  function statusLabel(st) {
    if (st === 'active') return 'Actif';
    if (st === 'unpaid') return 'Impayé';
    if (st === 'suspended') return 'Suspendu';
    return 'Diplômé';
  }

  function paymentStatus(p) {
    var st = p.rawStatus || p.status;
    if (st === 'paid') return { cls: 'sc-badge-status-active', lbl: 'Payé' };
    if (st === 'partial' || st === 'pending' || st === 'unpaid') return { cls: 'sc-badge-status-suspended', lbl: 'Partiel / en attente' };
    return { cls: 'sc-badge-status-unpaid', lbl: 'En retard' };
  }

  function paymentType(t) {
    if (t === 'inscription') return 'Inscription';
    return String(t).replace('tranche', 'Tranche ');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var id = params().get('id') || '1';

    var student = SC_MOCK.students.find(function (s) {
      return s.id === id;
    });
    var grades = SC_MOCK.grades.filter(function (g) {
      return g.studentId === id;
    });
    var pays = SC_MOCK.payments.filter(function (p) {
      return p.studentId === id;
    });

    try {
      var sid = parseInt(id, 10);
      if (!Number.isNaN(sid)) {
        var apiS = await SC_API.erpGetStudent(sid);
        student = mapApiStudent(apiS);
        var apiG = await SC_API.erpGetStudentGrades(sid);
        grades = mapApiGrades(apiG);
        var rawPays = await SC_API.crmListStudentPayments(sid);
        pays = rawPays.map(SC_API.mapApiPayment);
      }
    } catch (e) {
      if (SC_Utils.showApiOfflineBanner) SC_Utils.showApiOfflineBanner();
    }

    if (!student) {
      document.getElementById('detail-root').innerHTML =
        '<div class="alert alert-warning">Étudiant introuvable.</div>';
      return;
    }

    document.getElementById('ph-matricule').textContent = student.matricule;
    document.getElementById('ph-name').textContent = student.firstName + ' ' + student.lastName;
    document.getElementById('ph-program').textContent = student.program;
    document.getElementById('ph-status').innerHTML =
      '<span class="badge border ' + statusClass(student.status) + '">' + statusLabel(student.status) + '</span>';
    document.getElementById('ph-email').textContent = student.email;
    document.getElementById('ph-phone').textContent = student.phone;
    document.getElementById('ph-faculty').textContent = student.faculty + ' - ' + student.level;
    document.getElementById('ph-enroll').textContent = student.enrollmentDate
      ? SC_Utils.formatDateFr(student.enrollmentDate)
      : '—';

    var ini = student.firstName[0] + student.lastName[0];
    document.getElementById('ph-avatar').textContent = ini;

    var avgPct = null;
    try {
      var sidNum = parseInt(id, 10);
      if (!Number.isNaN(sidNum)) {
        var gsum = await SC_API.erpGetStudentGrades(sidNum);
        if (gsum && gsum.average > 0) avgPct = gsum.average;
      }
    } catch (e2) {}
    var avg =
      avgPct != null
        ? String(avgPct)
        : grades.length > 0
          ? (grades.reduce(function (a, g) {
              return a + g.grade;
            }, 0) / grades.length).toFixed(1)
          : 'N/A';
    document.getElementById('ph-avg').textContent = avgPct != null ? avg + ' %' : avg === 'N/A' ? avg : avg + '/20';
    var creds = grades.reduce(function (a, g) {
      return a + g.credits;
    }, 0);
    document.getElementById('ph-credits').textContent = String(creds);
    var paid = pays.reduce(function (a, p) {
      return a + (p.paidAmount != null ? p.paidAmount : p.status === 'paid' ? p.amount : 0);
    }, 0);
    document.getElementById('ph-paid').textContent = SC_API.formatMoney(paid, 'CDF');

    var gt = document.getElementById('grades-body');
    if (grades.length === 0) {
      document.getElementById('grades-empty').classList.remove('d-none');
      gt.innerHTML = '';
    } else {
      document.getElementById('grades-empty').classList.add('d-none');
      gt.innerHTML = grades
        .map(function (g) {
          var ok = g.grade >= 10;
          return (
            '<tr class="border-bottom"><td><code class="sc-code">' +
            SC_Utils.escapeHtml(g.courseCode || '—') +
            '</code></td><td class="small fw-medium">' +
            SC_Utils.escapeHtml(g.courseName) +
            '</td><td class="text-center">' +
            g.credits +
            '</td><td class="text-center"><span class="fw-bold ' +
            (ok ? 'text-success' : 'text-danger') +
            '">' +
            g.grade +
            '/20</span></td><td class="text-center"><span class="badge border ' +
            (ok ? 'sc-badge-status-active' : 'sc-badge-status-unpaid') +
            '">' +
            (ok ? 'Validé' : 'Non validé') +
            '</span></td></tr>'
          );
        })
        .join('');
    }

    var pt = document.getElementById('payments-body');
    if (pays.length === 0) {
      document.getElementById('payments-empty').classList.remove('d-none');
      pt.innerHTML = '';
    } else {
      document.getElementById('payments-empty').classList.add('d-none');
      pt.innerHTML = pays
        .map(function (p) {
          var ps = paymentStatus(p.status);
          return (
            '<tr class="border-bottom"><td class="small fw-medium">' +
            SC_Utils.escapeHtml(p.type || paymentType(p.type)) +
            '</td><td class="fw-semibold">' +
            SC_API.formatMoney(p.amount, p.currency || 'CDF') +
            '</td><td class="small text-muted">' +
            SC_Utils.formatDateFr(p.dueDate) +
            '</td><td class="small">' +
            (p.paidDate ? SC_Utils.formatDateFr(p.paidDate) : '-') +
            '</td><td class="text-center"><span class="badge ' +
            ps.cls +
            '">' +
            ps.lbl +
            '</span></td></tr>'
          );
        })
        .join('');
    }
  });
})();
