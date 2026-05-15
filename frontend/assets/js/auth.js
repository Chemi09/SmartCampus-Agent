(function () {
  'use strict';

  var TOKEN_KEY = function () {
    return (window.SC_CONFIG && SC_CONFIG.TOKEN_KEY) || 'sc_access_token';
  };
  var STUDENT_DEMO_KEY = function () {
    return (window.SC_CONFIG && SC_CONFIG.STUDENT_DEMO_KEY) || 'sc_student_demo';
  };

  function parseJwtPayload(token) {
    if (!token || typeof token !== 'string') return null;
    try {
      var part = token.split('.')[1];
      if (!part) return null;
      var base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      var json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY()) || '';
    } catch (e) {
      return '';
    }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY(), token);
      else localStorage.removeItem(TOKEN_KEY());
    } catch (e) {}
  }

  function clearStudentDemo() {
    try {
      sessionStorage.removeItem(STUDENT_DEMO_KEY());
    } catch (e) {}
  }

  function setStudentDemo() {
    try {
      sessionStorage.setItem(STUDENT_DEMO_KEY(), '1');
    } catch (e) {}
  }

  function isStudentDemo() {
    try {
      return sessionStorage.getItem(STUDENT_DEMO_KEY()) === '1';
    } catch (e) {
      return false;
    }
  }

  function getRole() {
    var p = parseJwtPayload(getToken());
    return (p && p.role) || null;
  }

  function isAdmin() {
    return getRole() === 'admin';
  }

  function isStudent() {
    return getRole() === 'student';
  }

  async function login(email, password) {
    var cfg = window.SC_CONFIG || {};
    var body = { email: email, password: password };
    var data = await SC_API.postJson('/auth/login', body);
    if (!data.access_token) throw new Error('Réponse login invalide');
    setToken(data.access_token);
    clearStudentDemo();
    return data;
  }

  function logout() {
    setToken(null);
    clearStudentDemo();
  }

  /** Redirige vers login si pas admin. */
  function requireAdmin() {
    if (isAdmin()) return;
    var q = encodeURIComponent(window.location.pathname.split('/').pop() || '');
    window.location.href = '../login.html?redirect=admin&q=' + q;
  }

  /** Étudiant JWT ou session démo hackathon. */
  function requireStudent() {
    if (isStudent()) return;
    if (isStudentDemo()) return;
    window.location.href = '../login.html?redirect=student';
  }

  window.SC_Auth = {
    getToken: getToken,
    setToken: setToken,
    parseJwtPayload: parseJwtPayload,
    getRole: getRole,
    isAdmin: isAdmin,
    isStudent: isStudent,
    login: login,
    logout: logout,
    requireAdmin: requireAdmin,
    requireStudent: requireStudent,
    setStudentDemo: setStudentDemo,
    isStudentDemo: isStudentDemo,
    clearStudentDemo: clearStudentDemo,
  };
})();
