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

  async function erpListStudents() {
    return getJson('/erp/students');
  }

  async function erpGetStudent(id) {
    return getJson('/erp/students/' + encodeURIComponent(id));
  }

  async function erpGetStudentGrades(id, semesterId) {
    var q = semesterId != null ? '?semester_id=' + encodeURIComponent(semesterId) : '';
    return getJson('/erp/students/' + encodeURIComponent(id) + '/grades' + q);
  }

  /** @param {{ phone?: string, message: string }} payload */
  async function agentChat(payload) {
    const headers = {};
    if (window.SC_CONFIG && SC_CONFIG.AGENT_SERVICE_KEY) {
      headers['X-Agent-Key'] = SC_CONFIG.AGENT_SERVICE_KEY;
    }
    const res = await request('/agent/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: Object.assign({}, authHeader(), headers),
    });
    if (!res.ok) throw new Error('Agent HTTP ' + res.status);
    return res.json();
  }

  window.SC_API = {
    request: request,
    getJson: getJson,
    postJson: postJson,
    erpListStudents: erpListStudents,
    erpGetStudent: erpGetStudent,
    erpGetStudentGrades: erpGetStudentGrades,
    agentChat: agentChat,
  };
})();
