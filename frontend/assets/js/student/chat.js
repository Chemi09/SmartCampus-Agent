(function () {
  'use strict';

  var responses = {
    notes: "📚 Voici le résumé de vos notes ce semestre:\n\n• Programmation Java: 16/20 ✓\n• Base de Données: 14/20 ✓\n• Mathématiques: 12/20 ✓\n• Réseaux: 15/20 ✓\n• Statistiques: 9/20 ✗\n\nVotre moyenne générale est de 13.2/20. Vous avez validé 16 crédits sur 19.",
    paiement: "💳 Voici votre situation financière:\n\n• Total frais: 1 200$\n• Montant payé: 850$\n• Solde restant: 350$\n\n⚠️ Prochaine échéance: 28 Février 2025\n\nVoulez-vous effectuer un paiement maintenant ?",
    examen: "📅 Vos prochains examens:\n\n1. Algorithmique - 15 Fév 2025 à 08:00\n   📍 Auditoire A, Bâtiment Central\n\n2. Base de Données - 18 Fév 2025 à 10:00\n   📍 Salle Informatique B\n\n3. Réseaux - 22 Fév 2025 à 14:00\n   📍 Auditoire C\n\nBonne préparation ! 📖",
    attestation: "📄 Pour obtenir une attestation d'inscription:\n\n1. Rendez-vous au secrétariat académique\n2. Présentez votre carte d'étudiant\n3. Payez les frais (5$)\n4. Délai: 24-48 heures\n\n💡 Vous pouvez aussi faire la demande en ligne via l'onglet 'Mon Profil' > 'Documents'.",
    default: "Je suis l'assistant SmartCampus ! 🎓\n\nJe peux vous aider avec:\n• Vos notes et résultats\n• Vos paiements et frais\n• Votre emploi du temps\n• Les procédures administratives\n\nQue souhaitez-vous savoir ?",
  };

  function reply(msg) {
    var l = msg.toLowerCase();
    if (l.indexOf('note') !== -1 || l.indexOf('résultat') !== -1 || l.indexOf('moyenne') !== -1) return responses.notes;
    if (l.indexOf('paiement') !== -1 || l.indexOf('solde') !== -1 || l.indexOf('frais') !== -1 || l.indexOf('argent') !== -1) return responses.paiement;
    if (l.indexOf('examen') !== -1 || l.indexOf('calendrier') !== -1 || l.indexOf('prochain') !== -1) return responses.examen;
    if (l.indexOf('attestation') !== -1 || l.indexOf('document') !== -1 || l.indexOf('certificat') !== -1) return responses.attestation;
    return responses.default;
  }

  function addRow(role, text, box) {
    var time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    var row = document.createElement('div');
    row.className = 'd-flex gap-2 mb-3' + (role === 'user' ? ' flex-row-reverse' : '');
    var av = document.createElement('div');
    av.className = 'rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0';
    av.style.width = '2rem';
    av.style.height = '2rem';
    av.innerHTML = role === 'bot' ? '<i class="bi bi-robot small"></i>' : '<i class="bi bi-person-fill small"></i>';
    av.className += role === 'bot' ? ' bg-primary' : ' bg-success';
    var b = document.createElement('div');
    b.className = 'px-3 py-2 small rounded-4 ' + (role === 'user' ? 'sc-msg-user' : 'bg-light border');
    b.style.maxWidth = '80%';
    b.style.whiteSpace = 'pre-wrap';
    b.textContent = text;
    var t = document.createElement('div');
    t.className = 'text-muted mt-1';
    t.style.fontSize = '10px';
    t.textContent = time;
    b.appendChild(t);
    row.appendChild(av);
    row.appendChild(b);
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('st-chat-box');
    var typing = document.getElementById('st-chat-typing');
    function send(text) {
      text = (text || '').trim();
      if (!text) return;
      addRow('user', text, box);
      typing.classList.remove('d-none');
      setTimeout(function () {
        typing.classList.add('d-none');
        addRow('bot', reply(text), box);
      }, 800);
    }
    document.querySelectorAll('[data-st-suggest]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        send(btn.getAttribute('data-st-suggest'));
      });
    });
    document.getElementById('st-chat-send').addEventListener('click', function () {
      var inp = document.getElementById('st-chat-input');
      send(inp.value);
      inp.value = '';
    });
  });
})();
