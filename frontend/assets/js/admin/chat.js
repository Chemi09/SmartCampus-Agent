(function () {
  'use strict';

  var suggested = [
    { icon: 'bi-mortarboard', text: 'Quelle est ma moyenne du semestre?', cat: 'Notes' },
    { icon: 'bi-credit-card', text: 'Ai-je soldé les frais du deuxième semestre?', cat: 'Paiements' },
    { icon: 'bi-calendar-event', text: "Quand ferme l'inscription en Master?", cat: 'Inscriptions' },
    { icon: 'bi-question-circle', text: 'Comment contacter le secrétariat?', cat: 'Contact' },
  ];

  var mockResponses = {
    moyenne:
      "Bonjour! 📚 Voici votre relevé de notes pour le semestre en cours:\n\n**Programmation Orientée Objet (INFO201):** 16/20\n**Base de Données (INFO202):** 14/20\n**Algorithmes Avancés (INFO203):** 15/20\n**Mathématiques Discrètes (MATH201):** 13/20\n\n**Moyenne générale: 14.5/20** ✅\n\nFélicitations, vous êtes sur la bonne voie! Continuez vos efforts.",
    frais:
      "Bonjour! 💰 Voici l'état de votre compte:\n\n**Frais d'inscription:** Payé ✅\n**Tranche 1:** Payé ✅\n**Tranche 2:** En attente ⏳\n\nLe montant restant à payer est de **300 USD**.\nDate limite: 31 janvier 2025\n\nVous pouvez effectuer le paiement via:\n- Mobile Money (Orange Money, M-Pesa, Airtel Money)\n- Virement bancaire\n- Caisse du campus",
    inscription:
      "Bonjour! 📝 Concernant les inscriptions en Master:\n\n**Dates importantes:**\n- Ouverture: 1er mars 2025\n- Clôture: 30 avril 2025\n\n**Documents requis:**\n- Diplôme de licence (copie certifiée)\n- Relevés de notes (L1 à L3)\n- Pièce d'identité\n- Photo d'identité (4x4)\n- Certificat de naissance\n\n**Frais:** 750 USD (inscription + 1ère tranche)",
    contact:
      "Bonjour! 📞 Voici les coordonnées du secrétariat:\n\n**Secrétariat Académique:**\n- Téléphone: +243 812 345 678\n- Email: secretariat@unikin.cd\n- Horaires: Lun-Ven, 8h-16h\n\n**Service Financier:**\n- Téléphone: +243 823 456 789\n- Email: finances@unikin.cd\n\n**Localisation:** Bâtiment A, Bureau 102\n\nVous pouvez aussi me poser vos questions ici, je suis disponible 24h/24! 🤖",
    default:
      "Je comprends votre question! 🤔\n\nJe suis l'assistant SmartCampus AgentAI. Je peux vous aider avec:\n- Vos **notes** et résultats académiques\n- L'état de vos **paiements** et frais\n- Les **inscriptions** et réinscriptions\n- Les **emplois du temps** et examens\n- Les **informations** générales sur le campus\n\nPourriez-vous reformuler votre question ou choisir l'un des sujets ci-dessus?",
  };

  function getMockResponse(message) {
    var lower = message.toLowerCase();
    if (lower.indexOf('moyenne') !== -1 || lower.indexOf('note') !== -1 || lower.indexOf('résultat') !== -1) return mockResponses.moyenne;
    if (lower.indexOf('frais') !== -1 || lower.indexOf('paiement') !== -1 || lower.indexOf('soldé') !== -1 || lower.indexOf('argent') !== -1) return mockResponses.frais;
    if (lower.indexOf('inscription') !== -1 || lower.indexOf('master') !== -1 || lower.indexOf('réinscription') !== -1) return mockResponses.inscription;
    if (lower.indexOf('contact') !== -1 || lower.indexOf('secrétariat') !== -1 || lower.indexOf('téléphone') !== -1 || lower.indexOf('email') !== -1) return mockResponses.contact;
    return mockResponses.default;
  }

  function appendMessage(role, text, scrollEl) {
    var box = document.getElementById('chat-messages');
    var time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    var wrap = document.createElement('div');
    wrap.className = 'd-flex gap-2 mb-3' + (role === 'user' ? ' flex-row-reverse' : '');
    var av = document.createElement('div');
    av.className = 'rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white';
    av.style.width = '2rem';
    av.style.height = '2rem';
    av.style.fontSize = '0.85rem';
    if (role === 'assistant') {
      av.className += ' bg-primary';
      av.innerHTML = '<i class="bi bi-robot"></i>';
    } else {
      av.className += ' bg-secondary';
      av.innerHTML = '<i class="bi bi-person-fill"></i>';
    }
    var bubble = document.createElement('div');
    bubble.className = 'px-3 py-2 small ' + (role === 'user' ? 'sc-msg-user' : 'sc-msg-bot');
    bubble.style.maxWidth = '80%';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.textContent = text;
    var t = document.createElement('div');
    t.className = 'text-muted mt-1';
    t.style.fontSize = '10px';
    t.textContent = time;
    bubble.appendChild(t);
    wrap.appendChild(av);
    wrap.appendChild(bubble);
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
  }

  function setLoading(on) {
    document.getElementById('chat-loading').classList.toggle('d-none', !on);
    document.getElementById('chat-input').disabled = on;
    document.getElementById('chat-send').disabled = on;
  }

  async function send(text) {
    text = (text || '').trim();
    if (!text) return;
    appendMessage('user', text);
    var input = document.getElementById('chat-input');
    input.value = '';
    setLoading(true);
    var answer = getMockResponse(text);
    try {
      var data = await SC_API.agentChat({ message: text, phone: '+243810000001' });
      if (data && (data.reply || data.response || data.message)) {
        answer = data.reply || data.response || data.message;
      }
    } catch (e) {
      /* mock */
    }
    setTimeout(function () {
      setLoading(false);
      appendMessage('assistant', answer);
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var suggestions = document.getElementById('suggested-questions');
    suggestions.innerHTML = suggested
      .map(function (q, i) {
        return (
          '<button type="button" class="btn btn-outline-light border w-100 text-start p-3 mb-2 sc-suggested" data-i="' +
          i +
          '" style="border-color: var(--sc-border) !important"><div class="d-flex gap-2"><i class="bi ' +
          q.icon +
          ' text-muted"></i><div><div class="small">' +
          SC_Utils.escapeHtml(q.text) +
          '</div><span class="badge bg-light text-secondary mt-1" style="font-size:10px">' +
          SC_Utils.escapeHtml(q.cat) +
          '</span></div></div></button>'
        );
      })
      .join('');

    suggestions.querySelectorAll('.sc-suggested').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-i'), 10);
        send(suggested[i].text);
      });
    });

    document.getElementById('chat-send').addEventListener('click', function () {
      send(document.getElementById('chat-input').value);
    });
    document.getElementById('chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(document.getElementById('chat-input').value);
      }
    });
  });
})();
