/** @type {typeof window.SC_CONFIG} */
(function () {
  var origin = window.location.origin;
  var isFile = window.location.protocol === 'file:';
  var isLocalDev =
    isFile ||
    origin.indexOf('localhost') !== -1 ||
    origin.indexOf('127.0.0.1') !== -1 ||
    origin.indexOf('.test') !== -1;

  window.SC_CONFIG = {
    API_BASE: isLocalDev ? 'http://localhost:8000/api/v1' : origin + '/api/v1',
    TOKEN_KEY: 'sc_access_token',
    STUDENT_DEMO_KEY: 'sc_student_demo',
    DEMO_ADMIN_EMAIL: 'admin@smartcampus.local',
    DEMO_ADMIN_PASSWORD: 'demo1234',
    DEMO_STUDENT_PHONE: '+243810000001',
    AGENT_SERVICE_KEY: 'agent-demo-key',
  };
})();
