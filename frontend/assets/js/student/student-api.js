(function () {
  'use strict';

  function scoreToGrade20(score) {
    if (score > 20) return Math.round((score / 100) * 20 * 10) / 10;
    return score;
  }

  async function loadPortalData() {
    try {
      await SC_API.ensureDemoAuth();
      return await SC_API.loadDemoStudentBundle();
    } catch (e) {
      return null;
    }
  }

  window.SC_StudentAPI = {
    loadPortalData: loadPortalData,
    scoreToGrade20: scoreToGrade20,
  };
})();
