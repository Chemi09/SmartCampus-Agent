(function () {
  'use strict';

  function base() {
    return (window.SC_CONFIG && window.SC_CONFIG.API_BASE) || '/api/v1';
  }

  function authHeader() {
    const token = window.SC_Auth && SC_Auth.getToken();
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
  }

  /**
   * @param {string} path — ex. /erp/students (sans base)
   * @param {RequestInit} opts
   */
  async function request(path, opts) {
    opts = opts || {};
    const url = base() + (path.startsWith('/') ? path : '/' + path);
    const headers = Object.assign({}, authHeader(), opts.headers || {});
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    return res;
  }

  async function getJson(path) {
    const res = await request(path, { method: 'GET' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function postJson(path, body, extraHeaders) {
    const headers = Object.assign({}, extraHeaders);
    const res = await request(path, {
      method: 'POST',
      body: JSON.stringify(body || {}),
      headers: headers,
    });
    if (!res.ok) {
      let msg = 'HTTP ' + res.status;
      try {
        const j = await res.json();
        if (j.detail) msg = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail);
      } catch (e) {}
      throw new Error(msg);
    }
    return res.json();
  }

  /** Connexion admin silencieuse pour le portail étudiant démo (lecture API). */
  async function ensureDemoAuth() {
    if (window.SC_Auth && SC_Auth.getToken()) return;
    if (!window.SC_Auth || !SC_Auth.isStudentDemo()) return;
    var cfg = window.SC_CONFIG || {};
    var data = await postJson('/auth/login', {
      email: cfg.DEMO_ADMIN_EMAIL || 'admin@smartcampus.local',
      password: cfg.DEMO_ADMIN_PASSWORD || 'demo1234',
    });
    if (data.access_token) SC_Auth.setToken(data.access_token);
  }

  function formatMoney(amount, currency) {
    currency = currency || 'CDF';
    var n = Number(amount) || 0;
    return n.toLocaleString('fr-FR') + ' ' + currency;
  }

  function mapApiPayment(p) {
    var st = p.status;
    var uiStatus = st;
    if (st === 'partial' || st === 'unpaid') uiStatus = 'pending';
    var name = p.student ? p.student.first_name + ' ' + p.student.last_name : '—';
    return {
      id: 'PAY-' + p.id,
      paymentId: p.id,
      studentId: String(p.student_id),
      studentName: name,
      amount: Number(p.amount),
      paidAmount: Number(p.paid_amount),
      currency: 'CDF',
      type: p.fee_label || 'Frais de scolarité',
      status: uiStatus,
      rawStatus: st,
      dueDate: p.due_date,
      paidDate: st === 'paid' ? p.due_date : null,
    };
  }

  function mapApiCommunication(c) {
    var dateStr = c.created_at;
    if (dateStr && dateStr.indexOf('T') !== -1) dateStr = dateStr.split('T')[0];
    var studentName = c.student
      ? c.student.first_name + ' ' + c.student.last_name
      : 'Étudiant';
    return {
      type: c.direction === 'out' ? 'warning' : 'info',
      date: dateStr,
      title: (c.channel === 'whatsapp' ? 'WhatsApp' : c.channel.toUpperCase()) + ' — ' + studentName,
      content: c.body,
      author: 'SmartCampus CRM',
    };
  }

  async function erpListStudents() {
    return getJson('/erp/students');
  }

  async function erpGetStudent(id) {
    return getJson('/erp/students/' + encodeURIComponent(id));
  }

  async function erpGetStudentByPhone(phone) {
    return getJson('/erp/students/by-phone/' + encodeURIComponent(phone));
  }

  async function erpGetStudentGrades(id, semesterId) {
    var q = semesterId != null ? '?semester_id=' + encodeURIComponent(semesterId) : '';
    return getJson('/erp/students/' + encodeURIComponent(id) + '/grades' + q);
  }

  async function erpGetActiveSemester() {
    return getJson('/erp/semesters/active');
  }

  async function crmListPayments(status, studentId) {
    var q = [];
    if (status) q.push('status=' + encodeURIComponent(status));
    if (studentId != null) q.push('student_id=' + encodeURIComponent(studentId));
    var suffix = q.length ? '?' + q.join('&') : '';
    return getJson('/crm/payments' + suffix);
  }

  async function crmListOutstanding() {
    return getJson('/crm/payments?status=outstanding');
  }

  async function crmGetStudentBalance(studentId) {
    return getJson('/crm/students/' + encodeURIComponent(studentId) + '/balance');
  }

  async function crmListStudentPayments(studentId) {
    return getJson('/crm/students/' + encodeURIComponent(studentId) + '/payments');
  }

  async function crmListCommunications(studentId) {
    var q = studentId != null ? '?student_id=' + encodeURIComponent(studentId) : '';
    return getJson('/crm/communications' + q);
  }

  /** Charge Jean Mukendi (démo) : ERP + CRM */
  async function loadDemoStudentBundle() {
    await ensureDemoAuth();
    var phone = (window.SC_CONFIG && SC_CONFIG.DEMO_STUDENT_PHONE) || '+243810000001';
    var student = await erpGetStudentByPhone(phone);
    var grades = await erpGetStudentGrades(student.id);
    var balance = await crmGetStudentBalance(student.id);
    var payments = await crmListStudentPayments(student.id);
    return { student: student, grades: grades, balance: balance, payments: payments };
  }

  /** @param {{ phone?: string, message: string }} payload */
  async function agentChat(payload) {
    const res = await request('/agent/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Agent HTTP ' + res.status);
    return res.json();
  }

  window.SC_API = {
    request: request,
    getJson: getJson,
    postJson: postJson,
    ensureDemoAuth: ensureDemoAuth,
    formatMoney: formatMoney,
    mapApiPayment: mapApiPayment,
    mapApiCommunication: mapApiCommunication,
    erpListStudents: erpListStudents,
    erpGetStudent: erpGetStudent,
    erpGetStudentByPhone: erpGetStudentByPhone,
    erpGetStudentGrades: erpGetStudentGrades,
    erpGetActiveSemester: erpGetActiveSemester,
    crmListPayments: crmListPayments,
    crmListOutstanding: crmListOutstanding,
    crmGetStudentBalance: crmGetStudentBalance,
    crmListStudentPayments: crmListStudentPayments,
    crmListCommunications: crmListCommunications,
    loadDemoStudentBundle: loadDemoStudentBundle,
    agentChat: agentChat,
  };
})();
