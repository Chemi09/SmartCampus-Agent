(function () {
  'use strict';

  var KEY = 'sc_lang';
  var LOCALES = ['fr', 'en', 'ln'];

  var STRINGS = {
    fr: {
      'lang.choose': 'Langue',
      'lang.fr': 'Français',
      'lang.en': 'Anglais',
      'lang.ln': 'Lingala',
      'common.theme': 'Thème',
      'common.language': 'Langue',
      'common.menu': 'Menu',
      'common.close': 'Fermer',
      'common.login': 'Connexion',
      'common.logout': 'Déconnexion',
      'common.dashboard': 'Dashboard',
      'common.notifications': 'Notifications',
      'common.export': 'Exporter',
      'common.search': 'Rechercher',
      'common.searchPlaceholder': 'Rechercher…',
      'common.newStudent': 'Nouvel Étudiant',
      'common.save': 'Enregistrer',
      'common.demo': 'Démo',
      'common.backHome': "Retour à l'accueil",
      'common.backDashboard': 'Retour au tableau de bord',
      'common.online': 'En ligne',
      'common.reduceMenu': 'Réduire le menu',
      'common.showPassword': 'Afficher',
      'common.vsLastMonth': 'vs mois dernier',
      'common.thisSemester': 'ce semestre',
      'common.needFollowUp': 'nécessitent relance',
      'common.enrolledYear': 'inscrits cette année',
      'common.inOrder': 'en règle',
      'common.students': 'étudiants',
      'common.unpaidShort': 'impayés',
      'common.found': 'trouvés',
      'common.results': 'résultats trouvés',
      'common.paymentsFound': 'paiements trouvés',
      'common.allStatuses': 'Tous les statuts',
      'common.viewAll': 'Voir tout',
      'common.whatsapp': 'WhatsApp',
      'nav.dashboard': 'Tableau de Bord',
      'nav.students': 'Étudiants',
      'nav.grades': 'Notes',
      'nav.payments': 'Paiements',
      'nav.communications': 'Communications',
      'nav.agent': 'Agent IA',
      'nav.settings': 'Paramètres',
      'nav.myGrades': 'Mes Notes',
      'nav.myPayments': 'Mes Paiements',
      'nav.assistant': 'Assistant IA',
      'nav.notifications': 'Notifications',
      'nav.profile': 'Mon Profil',
      'status.active': 'Actif',
      'status.unpaid': 'Impayé',
      'status.suspended': 'Suspendu',
      'status.graduated': 'Diplômé',
      'status.paid': 'Payé',
      'status.pending': 'En attente',
      'status.overdue': 'En retard',
      'landing.features': 'Fonctionnalités',
      'landing.demo': 'Démo',
      'landing.about': 'À propos',
      'landing.badge': 'Hackathon OpenClaw 2025',
      'landing.hero.title1': 'Gestion universitaire',
      'landing.hero.title2': "intelligente propulsée par l'IA",
      'landing.hero.lead':
        'Le premier mini-ERP de campus universitaire congolais avec un agent IA autonome accessible 24h/24 via WhatsApp/SMS, en français ou en lingala.',
      'landing.hero.ctaDashboard': 'Accéder au Dashboard',
      'landing.hero.ctaAgent': "Essayer l'Agent IA",
      'landing.stat.students': 'Étudiants gérés',
      'landing.stat.satisfaction': 'Satisfaction',
      'landing.stat.availability': 'Disponibilité IA',
      'landing.stat.admin': 'Réduction admin',
      'landing.features.title': 'Une plateforme complète',
      'landing.features.lead': 'Trois visions fusionnées en un seul produit : ERP, CRM et Agent IA autonome.',
      'landing.feat.erp': 'ERP Académique',
      'landing.feat.erp.desc': 'Gestion complète des inscriptions, notes, filières et emplois du temps universitaires.',
      'landing.feat.crm': 'CRM Étudiant',
      'landing.feat.crm.desc': 'Suivi relationnel des étudiants, historique des échanges et satisfaction.',
      'landing.feat.pay': 'Gestion des Paiements',
      'landing.feat.pay.desc': 'Suivi des frais, relances automatiques et intégration Mobile Money.',
      'landing.feat.agent': 'Agent IA Autonome',
      'landing.feat.agent.desc': 'Assistant WhatsApp/SMS disponible 24h/24 en français et lingala.',
      'landing.feat.cloud': 'Cloud Souverain',
      'landing.feat.cloud.desc': 'Données hébergées localement à Kinshasa pour une souveraineté totale.',
      'landing.feat.comm': 'Communications',
      'landing.feat.comm.desc': 'Notifications intelligentes et annonces personnalisées aux étudiants.',
      'landing.cta.title': 'Prêt à transformer votre campus?',
      'landing.cta.lead': 'Découvrez comment SmartCampus AgentAI peut révolutionner la gestion de votre établissement.',
      'landing.cta.start': 'Commencer maintenant',
      'landing.cta.demo': 'Voir la démo',
      'landing.about.badge': 'Cloud Souverain',
      'landing.about.title': 'Vos données restent à Kinshasa',
      'landing.about.lead':
        "SmartCampus AgentAI est hébergé sur l'infrastructure cloud souveraine Yamify à Kinshasa. Vos données académiques sensibles ne quittent jamais le territoire congolais.",
      'landing.about.li1': 'Hébergement local à Texaf/OADC Kinshasa',
      'landing.about.li2': 'Conformité aux réglementations locales',
      'landing.about.li3': 'Latence réduite pour les utilisateurs congolais',
      'landing.about.li4': 'Indépendance vis-à-vis des clouds étrangers',
      'landing.about.sec1': 'Sécurité maximale',
      'landing.about.sec1.desc': 'Chiffrement de bout en bout',
      'landing.about.sec2': 'Performance locale',
      'landing.about.sec2.desc': 'Temps de réponse < 100ms',
      'landing.about.sec3': 'Souveraineté totale',
      'landing.about.sec3.desc': '100% des données en RDC',
      'landing.footer': 'Hackathon OpenClaw 2025 — SmartCampus AgentAI · infra Yamify (Kinshasa)',
      'login.title': 'Connexion',
      'login.subtitle': 'Accédez à votre espace SmartCampus AgentAI',
      'login.email': 'Adresse email',
      'login.password': 'Mot de passe',
      'login.forgot': 'Mot de passe oublié?',
      'login.submit': 'Se connecter',
      'login.demo': 'Démo',
      'login.demoQuick': 'Accès Rapide (Démo)',
      'login.demoAdmin': 'Admin',
      'login.demoStudent': 'Étudiant',
      'page.dashboard.title': 'Tableau de Bord',
      'page.dashboard.sub': 'Vue d\'ensemble de votre campus universitaire',
      'page.students.title': 'Gestion des Étudiants',
      'page.students.sub': 'Consultez et gérez les dossiers étudiants',
      'page.students.list': 'Liste des Étudiants',
      'page.grades.title': 'Gestion des Notes',
      'page.grades.sub': 'Saisie et consultation des résultats académiques',
      'page.grades.list': 'Relevé des Notes',
      'page.payments.title': 'Gestion des Paiements',
      'page.payments.sub': 'Suivi des frais et encaissements',
      'page.payments.chart': 'Évolution des Paiements',
      'page.payments.list': 'Liste des Paiements',
      'page.comms.title': 'Communications',
      'page.comms.sub': 'Annonces et messages aux étudiants',
      'page.comms.new': 'Nouvelle Annonce',
      'page.comms.recent': 'Annonces Récentes',
      'page.comms.history': 'Historique des communications',
      'page.agent.title': 'Agent IA SmartCampus',
      'page.agent.suggested': 'Questions Suggérées',
      'page.settings.title': 'Paramètres',
      'page.settings.sub': 'Configuration du campus et de l\'agent IA',
      'page.studentDetail.title': 'Profil Étudiant',
      'page.st.dashboard.title': 'Tableau de Bord',
      'page.st.dashboard.welcome': 'Bonjour !',
      'page.st.grades.title': 'Mes Notes',
      'page.st.grades.sub': 'Consultez vos résultats académiques par semestre',
      'page.st.grades.detail': 'Détail des Notes',
      'page.st.payments.title': 'Mes Paiements',
      'page.st.payments.schedule': 'Échéancier de Paiement',
      'page.st.payments.methods': 'Méthodes de Paiement',
      'page.st.payments.history': 'Historique des Paiements',
      'page.st.payments.historySub': 'Tous vos paiements effectués',
      'page.st.chat.title': 'Assistant SmartCampus',
      'page.st.chat.help': "Besoin d'aide ?",
      'page.st.chat.helpDesc':
        "L'assistant peut répondre à vos questions sur les notes, paiements, emplois du temps et procédures administratives.",
      'page.st.profile.title': 'Mon Profil',
      'page.st.profile.sub': 'Gérez vos informations personnelles et documents',
      'page.demo.title': 'SmartCampus AgentAI',
      'stat.totalStudents': 'Total Étudiants',
      'stat.activeStudents': 'Étudiants Actifs',
      'stat.collected': 'Paiements Collectés',
      'stat.unpaid': 'Impayés',
      'stat.suspended': 'Suspendus',
      'chart.paymentTrends': 'Tendances des Paiements',
      'chart.studentSplit': 'Répartition Étudiants',
      'chart.collected': 'Collectés',
      'chart.pending': 'En attente',
      'dash.recentStudents': 'Étudiants Récents',
      'dash.pendingPayments': 'Paiements en Attente',
      'dash.announcements': 'Annonces',
      'dash.facultyStats': 'Statistiques par Faculté',
      'st.recentGrades': 'Notes Récentes',
      'st.recentGrades.sub': 'Vos derniers résultats académiques',
      'st.events': 'Prochains Événements',
      'st.quickActions': 'Actions Rapides',
    },
    en: {
      'lang.choose': 'Language',
      'lang.fr': 'French',
      'lang.en': 'English',
      'lang.ln': 'Lingala',
      'common.theme': 'Theme',
      'common.language': 'Language',
      'common.menu': 'Menu',
      'common.close': 'Close',
      'common.login': 'Sign in',
      'common.logout': 'Sign out',
      'common.dashboard': 'Dashboard',
      'common.notifications': 'Notifications',
      'common.export': 'Export',
      'common.search': 'Search',
      'common.searchPlaceholder': 'Search…',
      'common.newStudent': 'New Student',
      'common.save': 'Save',
      'common.demo': 'Demo',
      'common.backHome': 'Back to home',
      'common.backDashboard': 'Back to dashboard',
      'common.online': 'Online',
      'common.reduceMenu': 'Collapse menu',
      'common.showPassword': 'Show',
      'common.vsLastMonth': 'vs last month',
      'common.thisSemester': 'this semester',
      'common.needFollowUp': 'need follow-up',
      'common.enrolledYear': 'enrolled this year',
      'common.inOrder': 'in good standing',
      'common.students': 'students',
      'common.unpaidShort': 'unpaid',
      'common.found': 'found',
      'common.results': 'results found',
      'common.paymentsFound': 'payments found',
      'common.allStatuses': 'All statuses',
      'common.viewAll': 'View all',
      'common.whatsapp': 'WhatsApp',
      'nav.dashboard': 'Dashboard',
      'nav.students': 'Students',
      'nav.grades': 'Grades',
      'nav.payments': 'Payments',
      'nav.communications': 'Communications',
      'nav.agent': 'AI Agent',
      'nav.settings': 'Settings',
      'nav.myGrades': 'My Grades',
      'nav.myPayments': 'My Payments',
      'nav.assistant': 'AI Assistant',
      'nav.notifications': 'Notifications',
      'nav.profile': 'My Profile',
      'status.active': 'Active',
      'status.unpaid': 'Unpaid',
      'status.suspended': 'Suspended',
      'status.graduated': 'Graduated',
      'status.paid': 'Paid',
      'status.pending': 'Pending',
      'status.overdue': 'Overdue',
      'landing.features': 'Features',
      'landing.demo': 'Demo',
      'landing.about': 'About',
      'landing.badge': 'OpenClaw Hackathon 2025',
      'landing.hero.title1': 'University management',
      'landing.hero.title2': 'powered by intelligent AI',
      'landing.hero.lead':
        'The first Congolese university campus mini-ERP with an autonomous AI agent available 24/7 via WhatsApp/SMS, in French or Lingala.',
      'landing.hero.ctaDashboard': 'Open Dashboard',
      'landing.hero.ctaAgent': 'Try the AI Agent',
      'landing.stat.students': 'Students managed',
      'landing.stat.satisfaction': 'Satisfaction',
      'landing.stat.availability': 'AI availability',
      'landing.stat.admin': 'Admin reduction',
      'landing.features.title': 'A complete platform',
      'landing.features.lead': 'Three visions merged into one product: ERP, CRM and autonomous AI agent.',
      'landing.feat.erp': 'Academic ERP',
      'landing.feat.erp.desc': 'Full management of enrollments, grades, programs and university schedules.',
      'landing.feat.crm': 'Student CRM',
      'landing.feat.crm.desc': 'Student relationship tracking, exchange history and satisfaction.',
      'landing.feat.pay': 'Payment Management',
      'landing.feat.pay.desc': 'Fee tracking, automatic reminders and Mobile Money integration.',
      'landing.feat.agent': 'Autonomous AI Agent',
      'landing.feat.agent.desc': 'WhatsApp/SMS assistant available 24/7 in French and Lingala.',
      'landing.feat.cloud': 'Sovereign Cloud',
      'landing.feat.cloud.desc': 'Data hosted locally in Kinshasa for full sovereignty.',
      'landing.feat.comm': 'Communications',
      'landing.feat.comm.desc': 'Smart notifications and personalized announcements to students.',
      'landing.cta.title': 'Ready to transform your campus?',
      'landing.cta.lead': 'Discover how SmartCampus AgentAI can revolutionize your institution management.',
      'landing.cta.start': 'Get started',
      'landing.cta.demo': 'View demo',
      'landing.about.badge': 'Sovereign Cloud',
      'landing.about.title': 'Your data stays in Kinshasa',
      'landing.about.lead':
        'SmartCampus AgentAI is hosted on Yamify sovereign cloud infrastructure in Kinshasa. Your sensitive academic data never leaves Congolese territory.',
      'landing.about.li1': 'Local hosting at Texaf/OADC Kinshasa',
      'landing.about.li2': 'Compliance with local regulations',
      'landing.about.li3': 'Reduced latency for Congolese users',
      'landing.about.li4': 'Independence from foreign clouds',
      'landing.about.sec1': 'Maximum security',
      'landing.about.sec1.desc': 'End-to-end encryption',
      'landing.about.sec2': 'Local performance',
      'landing.about.sec2.desc': 'Response time < 100ms',
      'landing.about.sec3': 'Full sovereignty',
      'landing.about.sec3.desc': '100% of data in DRC',
      'landing.footer': 'OpenClaw Hackathon 2025 — SmartCampus AgentAI · Yamify infra (Kinshasa)',
      'login.title': 'Sign in',
      'login.subtitle': 'Access your SmartCampus AgentAI workspace',
      'login.email': 'Email address',
      'login.password': 'Password',
      'login.forgot': 'Forgot password?',
      'login.submit': 'Sign in',
      'login.demo': 'Demo',
      'login.demoQuick': 'Quick Access (Demo)',
      'login.demoAdmin': 'Admin',
      'login.demoStudent': 'Student',
      'page.dashboard.title': 'Dashboard',
      'page.dashboard.sub': 'Overview of your university campus',
      'page.students.title': 'Student Management',
      'page.students.sub': 'View and manage student records',
      'page.students.list': 'Student List',
      'page.grades.title': 'Grade Management',
      'page.grades.sub': 'Enter and view academic results',
      'page.grades.list': 'Grade Report',
      'page.payments.title': 'Payment Management',
      'page.payments.sub': 'Track fees and collections',
      'page.payments.chart': 'Payment Trends',
      'page.payments.list': 'Payment List',
      'page.comms.title': 'Communications',
      'page.comms.sub': 'Announcements and messages to students',
      'page.comms.new': 'New Announcement',
      'page.comms.recent': 'Recent Announcements',
      'page.comms.history': 'Communication history',
      'page.agent.title': 'SmartCampus AI Agent',
      'page.agent.suggested': 'Suggested Questions',
      'page.settings.title': 'Settings',
      'page.settings.sub': 'Campus and AI agent configuration',
      'page.studentDetail.title': 'Student Profile',
      'page.st.dashboard.title': 'Dashboard',
      'page.st.dashboard.welcome': 'Hello!',
      'page.st.grades.title': 'My Grades',
      'page.st.grades.sub': 'View your academic results by semester',
      'page.st.grades.detail': 'Grade Details',
      'page.st.payments.title': 'My Payments',
      'page.st.payments.schedule': 'Payment Schedule',
      'page.st.payments.methods': 'Payment Methods',
      'page.st.payments.history': 'Payment History',
      'page.st.payments.historySub': 'All your completed payments',
      'page.st.chat.title': 'SmartCampus Assistant',
      'page.st.chat.help': 'Need help?',
      'page.st.chat.helpDesc':
        'The assistant can answer questions about grades, payments, schedules and administrative procedures.',
      'page.st.profile.title': 'My Profile',
      'page.st.profile.sub': 'Manage your personal information and documents',
      'page.demo.title': 'SmartCampus AgentAI',
      'stat.totalStudents': 'Total Students',
      'stat.activeStudents': 'Active Students',
      'stat.collected': 'Collected Payments',
      'stat.unpaid': 'Unpaid',
      'stat.suspended': 'Suspended',
      'chart.paymentTrends': 'Payment Trends',
      'chart.studentSplit': 'Student Distribution',
      'chart.collected': 'Collected',
      'chart.pending': 'Pending',
      'dash.recentStudents': 'Recent Students',
      'dash.pendingPayments': 'Pending Payments',
      'dash.announcements': 'Announcements',
      'dash.facultyStats': 'Statistics by Faculty',
      'st.recentGrades': 'Recent Grades',
      'st.recentGrades.sub': 'Your latest academic results',
      'st.events': 'Upcoming Events',
      'st.quickActions': 'Quick Actions',
    },
    ln: {
      'lang.choose': 'Lokota',
      'lang.fr': 'Felansi',
      'lang.en': 'Lingelesa',
      'lang.ln': 'Lingala',
      'common.theme': 'Thème',
      'common.language': 'Lokota',
      'common.menu': 'Menu',
      'common.close': 'Kokanga',
      'common.login': 'Kokota',
      'common.logout': 'Kobima',
      'common.dashboard': 'Tableau de bord',
      'common.notifications': 'Ba sango',
      'common.export': 'Kobimisa',
      'common.search': 'Koluka',
      'common.searchPlaceholder': 'Koluka…',
      'common.newStudent': 'Moyekoli ya sika',
      'common.save': 'Kobomba',
      'common.demo': 'Démo',
      'common.backHome': 'Zonga na ebandeli',
      'common.backDashboard': 'Zonga na tableau de bord',
      'common.online': 'Azali na ligne',
      'common.reduceMenu': 'Kokanga menu',
      'common.showPassword': 'Komona',
      'common.vsLastMonth': 'na sanza eleki',
      'common.thisSemester': 'semestre oyo',
      'common.needFollowUp': 'basengeli kolandela',
      'common.enrolledYear': 'bakoti na mbula oyo',
      'common.inOrder': 'bazali malamu',
      'common.students': 'bayekoli',
      'common.unpaidShort': 'ba koboya',
      'common.found': 'bamoni',
      'common.results': 'bikakoli emonani',
      'common.paymentsFound': 'ba kobola emonani',
      'common.allStatuses': 'Statut nionso',
      'common.viewAll': 'Komona nionso',
      'common.whatsapp': 'WhatsApp',
      'nav.dashboard': 'Tableau de bord',
      'nav.students': 'Bayekoli',
      'nav.grades': 'Banoti',
      'nav.payments': 'Kobola',
      'nav.communications': 'Ba message',
      'nav.agent': 'Agent IA',
      'nav.settings': 'Ba paramètres',
      'nav.myGrades': 'Banoti na ngai',
      'nav.myPayments': 'Kobola na ngai',
      'nav.assistant': 'Mokambi IA',
      'nav.notifications': 'Ba sango',
      'nav.profile': 'Profil na ngai',
      'status.active': 'Actif',
      'status.unpaid': 'Afungoli te',
      'status.suspended': 'Esukisami',
      'status.graduated': 'Agradue',
      'status.paid': 'Afuti',
      'status.pending': 'Ezali kozela',
      'status.overdue': 'Elei',
      'landing.features': 'Misala',
      'landing.demo': 'Démo',
      'landing.about': 'Likambo',
      'landing.badge': 'Hackathon OpenClaw 2025',
      'landing.hero.title1': 'Bokambami ya université',
      'landing.hero.title2': 'ya mayele na AI',
      'landing.hero.lead':
        'ERP ya liboso ya campus na Congo na agent IA oyo ezali na service 24h/24 na WhatsApp/SMS, na felansi to lingala.',
      'landing.hero.ctaDashboard': 'Kokota na Dashboard',
      'landing.hero.ctaAgent': 'Komeka Agent IA',
      'landing.stat.students': 'Bayekoli bakambami',
      'landing.stat.satisfaction': 'Koyokela',
      'landing.stat.availability': 'AI 24/7',
      'landing.stat.admin': 'Kokitisa mosala',
      'landing.features.title': 'Plateforme mobimba',
      'landing.features.lead': 'Misala misato na produit moko: ERP, CRM na Agent IA.',
      'landing.feat.erp': 'ERP Académique',
      'landing.feat.erp.desc': 'Kokamba ba inscription, banoti, ba filière na emploi du temps.',
      'landing.feat.crm': 'CRM Étudiant',
      'landing.feat.crm.desc': 'Kolanda boyekoli, lisolo na koyokela.',
      'landing.feat.pay': 'Kobola',
      'landing.feat.pay.desc': 'Kolanda ba frais, ba rappel na Mobile Money.',
      'landing.feat.agent': 'Agent IA',
      'landing.feat.agent.desc': 'Mokambi WhatsApp/SMS 24h/24 na felansi na lingala.',
      'landing.feat.cloud': 'Cloud Souverain',
      'landing.feat.cloud.desc': 'Ba données na Kinshasa mpo na souveraineté.',
      'landing.feat.comm': 'Ba message',
      'landing.feat.comm.desc': 'Ba sango malamu mpe ba annonce na bayekoli.',
      'landing.cta.title': 'Campus na bino eko changer?',
      'landing.cta.lead': 'Yeba ndenge SmartCampus AgentAI ekoki kosalisa etablissement na bino.',
      'landing.cta.start': 'Bandela sikoyo',
      'landing.cta.demo': 'Komona démo',
      'landing.about.badge': 'Cloud Souverain',
      'landing.about.title': 'Ba données na bino ezali na Kinshasa',
      'landing.about.lead':
        'SmartCampus AgentAI ezali na cloud Yamify na Kinshasa. Ba données académiques ebimaka te na RDC.',
      'landing.about.li1': 'Hébergement na Texaf/OADC Kinshasa',
      'landing.about.li2': 'Koboya mibeko ya mboka',
      'landing.about.li3': 'Réponse ya mbangu mpo na bato ya Congo',
      'landing.about.li4': 'Botiki na cloud ya bato ya poto',
      'landing.about.sec1': 'Sécurité ya likolo',
      'landing.about.sec1.desc': 'Chiffrement ya bout en bout',
      'landing.about.sec2': 'Performance locale',
      'landing.about.sec2.desc': 'Réponse < 100ms',
      'landing.about.sec3': 'Souveraineté mobimba',
      'landing.about.sec3.desc': '100% ya ba données na RDC',
      'landing.footer': 'Hackathon OpenClaw 2025 — SmartCampus AgentAI · Yamify Kinshasa',
      'login.title': 'Kokota',
      'login.subtitle': 'Kota na espace SmartCampus AgentAI na bino',
      'login.email': 'Adresse email',
      'login.password': 'Mot de passe',
      'login.forgot': 'Obosani mot de passe?',
      'login.submit': 'Kokota',
      'login.demo': 'Démo',
      'login.demoQuick': 'Kokota ya mbangu (Démo)',
      'login.demoAdmin': 'Admin',
      'login.demoStudent': 'Moyekoli',
      'page.dashboard.title': 'Tableau de bord',
      'page.dashboard.sub': 'Vue ya campus universitaire na bino',
      'page.students.title': 'Kokamba bayekoli',
      'page.students.sub': 'Komona mpe kokamba ba dossier ya bayekoli',
      'page.students.list': 'Liste ya bayekoli',
      'page.grades.title': 'Kokamba banoti',
      'page.grades.sub': 'Kotia mpe komona ba résultats',
      'page.grades.list': 'Relevé ya banoti',
      'page.payments.title': 'Kokamba kobola',
      'page.payments.sub': 'Kolanda ba frais mpe ba paiements',
      'page.payments.chart': 'Evolution ya kobola',
      'page.payments.list': 'Liste ya kobola',
      'page.comms.title': 'Ba message',
      'page.comms.sub': 'Ba annonce na bayekoli',
      'page.comms.new': 'Annonce ya sika',
      'page.comms.recent': 'Ba annonce ya sika',
      'page.comms.history': 'Historique ya ba message',
      'page.agent.title': 'Agent IA SmartCampus',
      'page.agent.suggested': 'Mituna oyo basengeli',
      'page.settings.title': 'Ba paramètres',
      'page.settings.sub': 'Configuration ya campus na agent IA',
      'page.studentDetail.title': 'Profil ya moyekoli',
      'page.st.dashboard.title': 'Tableau de bord',
      'page.st.dashboard.welcome': 'Mbote !',
      'page.st.grades.title': 'Banoti na ngai',
      'page.st.grades.sub': 'Komona ba résultats na bino na semestre',
      'page.st.grades.detail': 'Détail ya banoti',
      'page.st.payments.title': 'Kobola na ngai',
      'page.st.payments.schedule': 'Échéancier ya kobola',
      'page.st.payments.methods': 'Ndenge ya kofuta',
      'page.st.payments.history': 'Historique ya kobola',
      'page.st.payments.historySub': 'Ba paiements nionso oyo osali',
      'page.st.chat.title': 'Mokambi SmartCampus',
      'page.st.chat.help': 'Osengeli lisalisi?',
      'page.st.chat.helpDesc':
        'Mokambi akoki koyanola mituna na banoti, kobola, emploi du temps mpe ba procédures.',
      'page.st.profile.title': 'Profil na ngai',
      'page.st.profile.sub': 'Kokamba ba informations na bino mpe ba documents',
      'page.demo.title': 'SmartCampus AgentAI',
      'stat.totalStudents': 'Bayekoli nionso',
      'stat.activeStudents': 'Bayekoli actifs',
      'stat.collected': 'Kobola ezuami',
      'stat.unpaid': 'Ba koboya',
      'stat.suspended': 'Basukisami',
      'chart.paymentTrends': 'Tendances ya kobola',
      'chart.studentSplit': 'Répartition bayekoli',
      'chart.collected': 'Ezuami',
      'chart.pending': 'Ezali kozela',
      'dash.recentStudents': 'Bayekoli ya sika',
      'dash.pendingPayments': 'Kobola ezali kozela',
      'dash.announcements': 'Ba annonce',
      'dash.facultyStats': 'Statistiques na faculté',
      'st.recentGrades': 'Banoti ya sika',
      'st.recentGrades.sub': 'Ba résultats na bino ya nsuka',
      'st.events': 'Ba événements ekoya',
      'st.quickActions': 'Misala ya mbangu',
    },
  };

  var LANG_LABELS = { fr: 'FR', en: 'EN', ln: 'LN' };

  function getLang() {
    var l = document.documentElement.getAttribute('data-sc-lang') || 'fr';
    return LOCALES.indexOf(l) !== -1 ? l : 'fr';
  }

  function setLang(lang) {
    if (LOCALES.indexOf(lang) === -1) return;
    document.documentElement.setAttribute('data-sc-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'ln' ? 'ln' : lang);
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
    apply();
    updateSwitcherUI();
    window.dispatchEvent(new CustomEvent('sc-lang-change', { detail: { lang: lang } }));
  }

  function t(key, vars) {
    var lang = getLang();
    var table = STRINGS[lang] || STRINGS.fr;
    var text = table[key];
    if (text == null) text = (STRINGS.fr[key] != null ? STRINGS.fr[key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return text;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    var pageTitle = document.querySelector('[data-i18n-page-title]');
    if (pageTitle) {
      document.title = t(pageTitle.getAttribute('data-i18n-page-title'));
    }
  }

  function switcherHTML(compact) {
    var lang = getLang();
    var items = LOCALES.map(function (code) {
      var active = code === lang ? ' active' : '';
      var flag = code === 'fr' ? '🇫🇷' : code === 'en' ? '🇬🇧' : '🇨🇩';
      return (
        '<li><button type="button" class="dropdown-item d-flex align-items-center gap-2 sc-lang-option' +
        active +
        '" data-sc-lang="' +
        code +
        '" role="option" aria-selected="' +
        (code === lang) +
        '"><span aria-hidden="true">' +
        flag +
        '</span><span data-i18n="lang.' +
        code +
        '">' +
        t('lang.' + code) +
        '</span></button></li>'
      );
    });
    var labelClass = compact ? 'd-none' : '';
    return (
      '<div class="dropdown sc-lang' +
      (compact ? ' sc-lang-compact' : '') +
      '">' +
      '<button type="button" class="btn btn-sm sc-lang-toggle border dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-i18n-aria="lang.choose">' +
      '<i class="bi bi-translate"></i>' +
      '<span class="sc-lang-current ms-1">' +
      (LANG_LABELS[lang] || 'FR') +
      '</span>' +
      '<span class="sc-lang-label-text ms-1 ' +
      labelClass +
      '" data-i18n="common.language">Langue</span>' +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-end sc-lang-panel shadow sc-card p-1">' +
      '<li class="dropdown-header small text-uppercase sc-text-muted px-2" data-i18n="lang.choose">Langue</li>' +
      items.join('') +
      '</ul></div>'
    );
  }

  function wireSwitcher(root) {
    if (!root) return;
    root.querySelectorAll('[data-sc-lang]').forEach(function (btn) {
      if (btn.dataset.scLangWired) return;
      btn.dataset.scLangWired = '1';
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-sc-lang'));
      });
    });
    var toggle = root.querySelector('.sc-lang-toggle');
    if (toggle && !toggle.dataset.scLangToggleWired) {
      toggle.dataset.scLangToggleWired = '1';
      toggle.addEventListener('show.bs.dropdown', function () {
        apply(root);
      });
    }
  }

  function mountSwitcher(host, compact) {
    if (!host) return;
    host.innerHTML = switcherHTML(!!compact);
    wireSwitcher(host);
    updateSwitcherUI(host);
  }

  function mountAll() {
    document.querySelectorAll('[data-sc-lang-mount]').forEach(function (host) {
      mountSwitcher(host, host.getAttribute('data-sc-lang-compact') === 'true');
    });
  }

  function updateSwitcherUI(root) {
    root = root || document;
    var lang = getLang();
    root.querySelectorAll('.sc-lang-current').forEach(function (el) {
      el.textContent = LANG_LABELS[lang] || 'FR';
    });
    root.querySelectorAll('.sc-lang-option').forEach(function (btn) {
      var code = btn.getAttribute('data-sc-lang');
      var on = code === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function init() {
    apply();
    mountAll();
    updateSwitcherUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SC_I18n = {
    getLang: getLang,
    setLang: setLang,
    t: t,
    apply: apply,
    mountSwitcher: mountSwitcher,
    mountAll: mountAll,
    init: init,
  };
})();
