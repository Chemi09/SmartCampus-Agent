(function () {
  'use strict';

  var docs = SC_MOCK.studentDocuments;

  function render(p) {
    document.getElementById('pf-name').textContent = p.name;
    document.getElementById('pf-email').textContent = p.email;
    document.getElementById('pf-mat').textContent = p.matricule;
    document.getElementById('pf-nom').value = p.name;
    document.getElementById('pf-dob').value = p.dateOfBirth;
    document.getElementById('pf-pob').value = p.placeOfBirth;
    document.getElementById('pf-addr').value = p.address;
    document.getElementById('pf-mail').value = p.email;
    document.getElementById('pf-phone').value = p.phone;
    document.getElementById('pf-fac').textContent = p.faculty;
    document.getElementById('pf-dep').textContent = p.department;
    document.getElementById('pf-lev').textContent = p.level;
    document.getElementById('pf-year').textContent = p.academicYear;

    document.getElementById('pf-docs').innerHTML = docs
      .map(function (d) {
        return (
          '<div class="d-flex justify-content-between align-items-center border rounded p-3 mb-2">' +
          '<div class="d-flex gap-2"><div class="bg-primary bg-opacity-10 text-primary rounded p-2"><i class="bi bi-file-text"></i></div>' +
          '<div><div class="fw-medium">' +
          SC_Utils.escapeHtml(d.name) +
          '</div><div class="small text-muted">' +
          d.type +
          ' — ' +
          d.size +
          '</div></div></div>' +
          '<button type="button" class="btn btn-sm ' +
          (d.available ? 'btn-primary' : 'btn-secondary') +
          '" ' +
          (d.available ? '' : 'disabled') +
          '><i class="bi bi-download me-1"></i>' +
          (d.available ? 'Télécharger' : 'Non disponible') +
          '</button></div>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var p = SC_MOCK.studentProfile;
    var bundle = await SC_StudentAPI.loadPortalData();
    if (bundle && bundle.student) {
      p = SC_StudentAPI.profileFromApi(bundle.student);
    }
    render(p);
  });
})();
