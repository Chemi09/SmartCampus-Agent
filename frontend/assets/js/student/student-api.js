(function () {
  'use strict';

  function scoreToGrade20(score) {
    return window.SC_API ? SC_API.scoreToGrade20(score) : Number(score) || 0;
  }

  async function loadPortalData() {
    try {
      await SC_API.ensureDemoAuth();
      var bundle = await SC_API.loadDemoStudentBundle();
      var comms = await SC_API.crmListCommunications(bundle.student.id);
      bundle.communications = comms;
      if (window.SC_Utils && SC_Utils.clearApiOfflineBanner) SC_Utils.clearApiOfflineBanner();
      return bundle;
    } catch (e) {
      if (window.SC_Utils && SC_Utils.showApiOfflineBanner) SC_Utils.showApiOfflineBanner();
      return null;
    }
  }

  function gradesDetailFromApi(gradesSummary) {
    return (gradesSummary.grades || []).map(function (g, i) {
      var final = scoreToGrade20(g.score);
      return {
        course: g.course,
        code: 'UE-' + String(i + 1).padStart(2, '0'),
        credits: g.credits,
        cc: final,
        tp: null,
        exam: final,
        final: final,
        status: final >= 10 ? 'validated' : 'failed',
        trend: final >= 14 ? 'up' : final < 10 ? 'down' : 'flat',
      };
    });
  }

  function paymentsPortalFromApi(balance, payments) {
    var total = Number(balance.total_due) || 0;
    var paid = Number(balance.paid) || 0;
    var remaining = Number(balance.remaining) || 0;
    var schedule = payments.map(function (p) {
      var rest = Number(p.amount) - Number(p.paid_amount);
      return {
        tranche: p.fee_label || 'Frais académiques',
        deadline: p.due_date,
        amount: SC_API.formatMoney(rest > 0 ? rest : p.amount, 'CDF'),
        status: p.status === 'paid' ? 'paid' : 'pending',
      };
    });
    var history = payments
      .filter(function (p) {
        return Number(p.paid_amount) > 0;
      })
      .map(function (p) {
        return {
          id: 'TX-' + p.id,
          date: p.due_date,
          description: p.fee_label || 'Paiement',
          method: 'Mobile Money',
          amount: SC_API.formatMoney(p.paid_amount, 'CDF'),
        };
      });
    var next = payments.find(function (p) {
      return p.status !== 'paid';
    });
    return {
      summary: {
        academicYear: balance.semester || '2025-2026',
        totalFees: total,
        amountPaid: paid,
        remaining: remaining,
        nextDeadline: next ? next.due_date : '—',
      },
      schedule: schedule,
      history: history,
    };
  }

  function profileFromApi(student) {
    var prog = student.program || {};
    return {
      name: student.first_name + ' ' + student.last_name,
      email: student.email || '—',
      matricule: student.matricule,
      dateOfBirth: student.date_of_birth || '',
      placeOfBirth: student.place_of_birth || 'Kinshasa',
      address: student.address || '—',
      phone: student.phone || '—',
      faculty: prog.faculty_name || prog.name || '—',
      department: prog.name || '—',
      level: prog.level || '—',
      academicYear: '2025-2026',
    };
  }

  function notificationsFromCommunications(comms) {
    return (comms || []).map(function (c, i) {
      var mapped = SC_API.mapApiCommunication(c);
      var type = 'info';
      if ((c.body || '').toLowerCase().indexOf('paiement') !== -1 || (c.body || '').toLowerCase().indexOf('frais') !== -1) {
        type = 'payment';
      }
      if ((c.body || '').toLowerCase().indexOf('note') !== -1 || (c.body || '').toLowerCase().indexOf('moyenne') !== -1) {
        type = 'grade';
      }
      return {
        type: type,
        title: mapped.title,
        message: mapped.content,
        time: mapped.date,
        read: i > 2,
      };
    });
  }

  window.SC_StudentAPI = {
    loadPortalData: loadPortalData,
    scoreToGrade20: scoreToGrade20,
    gradesDetailFromApi: gradesDetailFromApi,
    paymentsPortalFromApi: paymentsPortalFromApi,
    profileFromApi: profileFromApi,
    notificationsFromCommunications: notificationsFromCommunications,
  };
})();
