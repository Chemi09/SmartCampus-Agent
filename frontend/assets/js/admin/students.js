(function () {
  'use strict';

  function mapApiStudent(s) {
    var prog = s.program || {};
    return {
      id: String(s.id),
      matricule: s.matricule,
      firstName: s.first_name,
      lastName: s.last_name,
      email: s.email || '',
      phone: s.phone || '',
      faculty: prog.name ? prog.name : '—',
      program: prog.name ? prog.name : '—',
      level: prog.level || '—',
      status: s.status,
      enrollmentDate: '',
      _source: 'api',
    };
  }

  function statusClass(st) {
    if (st === 'active') return 'sc-badge-status-active';
    if (st === 'unpaid') return 'sc-badge-status-unpaid';
    if (st === 'suspended') return 'sc-badge-status-suspended';
    return 'sc-badge-status-graduated';
  }

  function statusLabel(st) {
    if (window.SC_I18n) {
      if (st === 'active') return SC_I18n.t('status.active');
      if (st === 'unpaid') return SC_I18n.t('status.unpaid');
      if (st === 'suspended') return SC_I18n.t('status.suspended');
      return SC_I18n.t('status.graduated');
    }
    if (st === 'active') return 'Actif';
    if (st === 'unpaid') return 'Impayé';
    if (st === 'suspended') return 'Suspendu';
    return 'Diplômé';
  }

  var all = [];

  async function load() {
    try {
      var raw = await SC_API.erpListStudents();
      all = raw.map(mapApiStudent);
    } catch (e) {
      all = SC_MOCK.students.slice();
    }
    renderStats();
    applyFilter();
  }

  function renderStats() {
    document.getElementById('stat-total').textContent = String(all.length);
    document.getElementById('stat-active').textContent = String(all.filter(function (s) {
      return s.status === 'active';
    }).length);
    document.getElementById('stat-unpaid').textContent = String(all.filter(function (s) {
      return s.status === 'unpaid';
    }).length);
    document.getElementById('stat-suspended').textContent = String(all.filter(function (s) {
      return s.status === 'suspended';
    }).length);
  }

  function applyFilter() {
    var q = (document.getElementById('search-students').value || '').toLowerCase();
    var st = document.getElementById('filter-status').value;
    var filtered = all.filter(function (s) {
      var ok =
        (s.firstName + ' ' + s.lastName).toLowerCase().indexOf(q) !== -1 ||
        (s.matricule || '').toLowerCase().indexOf(q) !== -1 ||
        (s.email || '').toLowerCase().indexOf(q) !== -1;
      var stOk = st === 'all' || s.status === st;
      return ok && stOk;
    });

    document.getElementById('students-count').textContent = String(filtered.length);

    var tb = document.getElementById('students-tbody');
    if (filtered.length === 0) {
      tb.innerHTML = '';
      document.getElementById('students-empty').classList.remove('d-none');
      return;
    }
    document.getElementById('students-empty').classList.add('d-none');

    tb.innerHTML = filtered
      .map(function (s) {
        var ini = (s.firstName[0] || '') + (s.lastName[0] || '');
        return (
          '<tr class="border-bottom sc-table">' +
          '<td class="py-3 px-2">' +
          '<div class="d-flex align-items-center gap-2">' +
          '<div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width:2.5rem;height:2.5rem;font-size:.8rem">' +
          SC_Utils.escapeHtml(ini) +
          '</div>' +
          '<div><div class="small fw-medium">' +
          SC_Utils.escapeHtml(s.firstName + ' ' + s.lastName) +
          '</div><div class="text-muted" style="font-size:.75rem">' +
          SC_Utils.escapeHtml(s.email) +
          '</div></div></div></td>' +
          '<td class="py-3 px-2 d-none d-md-table-cell"><code class="sc-code">' +
          SC_Utils.escapeHtml(s.matricule) +
          '</code></td>' +
          '<td class="py-3 px-2 d-none d-lg-table-cell"><div class="small">' +
          SC_Utils.escapeHtml(s.faculty) +
          '</div><div class="text-muted" style="font-size:.75rem">' +
          SC_Utils.escapeHtml(s.program) +
          '</div></td>' +
          '<td class="py-3 px-2"><span class="badge border font-monospace">' +
          SC_Utils.escapeHtml(s.level) +
          '</span></td>' +
          '<td class="py-3 px-2"><span class="badge border ' +
          statusClass(s.status) +
          '">' +
          statusLabel(s.status) +
          '</span></td>' +
          '<td class="py-3 px-2 text-end">' +
          '<div class="dropdown">' +
          '<button class="btn btn-sm btn-link text-muted" type="button" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>' +
          '<ul class="dropdown-menu dropdown-menu-end">' +
          '<li><a class="dropdown-item" href="student-detail.html?id=' +
          encodeURIComponent(s.id) +
          '"><i class="bi bi-eye me-2"></i>Voir le profil</a></li>' +
          '<li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Modifier</a></li>' +
          '<li><hr class="dropdown-divider"></li>' +
          '<li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Supprimer</a></li>' +
          '</ul></div></td>' +
          '</tr>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-students').addEventListener('input', SC_Utils.debounce(applyFilter, 200));
    document.getElementById('filter-status').addEventListener('change', applyFilter);
    window.addEventListener('sc-lang-change', applyFilter);
    load();
  });
})();
