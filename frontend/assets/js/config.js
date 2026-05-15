/** @type {typeof window.SC_CONFIG} */
window.SC_CONFIG = {
  API_BASE:
    window.location.protocol === 'file:'
      ? 'http://localhost:8000/api/v1'
      : window.location.origin + '/api/v1',
  TOKEN_KEY: 'sc_access_token',
  STUDENT_DEMO_KEY: 'sc_student_demo',
  DEMO_ADMIN_EMAIL: 'admin@smartcampus.local',
  DEMO_ADMIN_PASSWORD: 'demo1234',
  /** Clé optionnelle si l'API agent exige X-Agent-Key */
  AGENT_SERVICE_KEY: 'agent-demo-key',
};
