(function () {
  'use strict';

  var mockResponses = {
    moyenne:
      "Mbote! 📚 Voici vos notes pour ce semestre:\n\n**Programmation (INFO201):** 16/20\n**Base de Données (INFO202):** 14/20\n**Algorithmes (INFO203):** 15/20\n**Maths (MATH201):** 13/20\n\n**Moyenne: 14.5/20** ✅\n\nBravo! Vous êtes sur la bonne voie!",
    frais:
      "Mbote! 💰 État de votre compte:\n\n**Inscription:** Payé ✅\n**Tranche 1:** Payé ✅\n**Tranche 2:** En attente ⏳\n\nReste à payer: **300 USD**\nLimite: 31 janvier 2025\n\nPaiement possible via:\n- Mobile Money (Orange, M-Pesa, Airtel)\n- Virement bancaire\n- Caisse du campus",
    inscription:
      "Mbote! 📝 Inscriptions Master:\n\n**Dates:**\n- Ouverture: 1er mars 2025\n- Clôture: 30 avril 2025\n\n**Documents:**\n- Diplôme licence\n- Relevés de notes\n- Pièce d'identité\n- Photo 4x4\n\n**Frais:** 750 USD",
    bonjour:
      "Mbote! 👋 Je suis l'assistant SmartCampus.\n\nJe parle **français** et **lingala**.\n\nJe peux vous aider avec:\n- 📚 Notes et résultats\n- 💰 Paiements et frais\n- 📝 Inscriptions\n- 📅 Emplois du temps\n\nPosez votre question!",
    default:
      "Nakoyoka! 🤔\n\nJe peux vous aider avec:\n- Vos **notes** (notes, moyenne, résultats)\n- Vos **paiements** (frais, solde)\n- Les **inscriptions** (master, réinscription)\n\nReformulez ou choisissez un sujet!",
  };

  function getMock(text) {
    var l = text.toLowerCase();
    if (l.indexOf('bonjour') !== -1 || l.indexOf('mbote') !== -1 || l.indexOf('salut') !== -1) return mockResponses.bonjour;
    if (l.indexOf('moyenne') !== -1 || l.indexOf('note') !== -1 || l.indexOf('résultat') !== -1) return mockResponses.moyenne;
    if (l.indexOf('frais') !== -1 || l.indexOf('paiement') !== -1 || l.indexOf('soldé') !== -1 || l.indexOf('argent') !== -1 || l.indexOf('mbongo') !== -1) return mockResponses.frais;
    if (l.indexOf('inscription') !== -1 || l.indexOf('master') !== -1 || l.indexOf('réinscription') !== -1) return mockResponses.inscription;
    return mockResponses.default;
  }

  function bubble(role, text) {
    var area = document.getElementById('demo-msgs');
    var row = document.createElement('div');
    row.className = 'd-flex gap-2 mb-3' + (role === 'user' ? ' flex-row-reverse' : '');
    var av = document.createElement('div');
    av.className = 'rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white';
    av.style.width = '2rem';
    av.style.height = '2rem';
    av.style.fontSize = '0.85rem';
    if (role === 'assistant') {
      av.className += ' bg-primary';
      av.innerHTML = '<i class="bi bi-robot small"></i>';
    } else {
      av.className += ' bg-secondary';
      av.innerHTML = '<i class="bi bi-person-fill small"></i>';
    }
    var b = document.createElement('div');
    b.className =
      'px-3 py-2 small rounded-4 mw-85 ' + (role === 'user' ? 'sc-msg-user rounded-tr-0' : 'bg-white border rounded-tl-0');
    b.style.maxWidth = '85%';
    b.style.whiteSpace = 'pre-wrap';
    b.textContent = text;
    var t = document.createElement('div');
    t.className = 'text-muted mt-1';
    t.style.fontSize = '10px';
    t.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    b.appendChild(t);
    row.appendChild(av);
    row.appendChild(b);
    area.appendChild(row);
    area.scrollTop = area.scrollHeight;
  }

  async function send() {
    var inp = document.getElementById('demo-input');
    var text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    bubble('user', text);
    var typing = document.getElementById('demo-typing');
    typing.classList.remove('d-none');
    var out = '';
    var phone = (window.SC_CONFIG && SC_CONFIG.DEMO_STUDENT_PHONE) || '+243810000001';
    try {
      var data = await SC_API.agentChat({ message: text, phone: phone });
      out = (data && (data.reply || data.response || data.message)) || getMock(text);
    } catch (e) {
      out = getMock(text) + '\n\n_(hors ligne — démarrez le backend sur :8000)_';
    }
    setTimeout(function () {
      typing.classList.add('d-none');
      bubble('assistant', out);
    }, 500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('demo-send').addEventListener('click', send);
    document.getElementById('demo-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  });
})();
