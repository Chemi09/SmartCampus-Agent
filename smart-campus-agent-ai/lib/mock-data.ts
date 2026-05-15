// Mock data for SmartCampus AgentAI

export interface Student {
  id: string
  matricule: string
  firstName: string
  lastName: string
  email: string
  phone: string
  faculty: string
  program: string
  level: string
  status: 'active' | 'unpaid' | 'suspended' | 'graduated'
  enrollmentDate: string
  avatar?: string
}

export interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  currency: string
  type: 'inscription' | 'tranche1' | 'tranche2' | 'tranche3' | 'exam'
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
}

export interface Grade {
  id: string
  studentId: string
  courseCode: string
  courseName: string
  credits: number
  grade: number
  semester: string
  year: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: 'info' | 'warning' | 'urgent'
  author: string
}

export const students: Student[] = [
  {
    id: '1',
    matricule: 'UKA-2024-0001',
    firstName: 'Jean',
    lastName: 'Mbala',
    email: 'jean.mbala@unikin.cd',
    phone: '+243 812 345 678',
    faculty: 'Sciences Informatiques',
    program: 'Génie Logiciel',
    level: 'L2',
    status: 'active',
    enrollmentDate: '2023-09-15',
  },
  {
    id: '2',
    matricule: 'UKA-2024-0002',
    firstName: 'Marie',
    lastName: 'Kabongo',
    email: 'marie.kabongo@unikin.cd',
    phone: '+243 823 456 789',
    faculty: 'Sciences Économiques',
    program: 'Économie',
    level: 'L3',
    status: 'unpaid',
    enrollmentDate: '2022-09-10',
  },
  {
    id: '3',
    matricule: 'UKA-2024-0003',
    firstName: 'Patrick',
    lastName: 'Lukusa',
    email: 'patrick.lukusa@unikin.cd',
    phone: '+243 834 567 890',
    faculty: 'Sciences Informatiques',
    program: 'Réseaux et Télécoms',
    level: 'M1',
    status: 'active',
    enrollmentDate: '2021-09-01',
  },
  {
    id: '4',
    matricule: 'UKA-2024-0004',
    firstName: 'Claire',
    lastName: 'Mutombo',
    email: 'claire.mutombo@unikin.cd',
    phone: '+243 845 678 901',
    faculty: 'Droit',
    program: 'Droit Public',
    level: 'L1',
    status: 'active',
    enrollmentDate: '2024-09-05',
  },
  {
    id: '5',
    matricule: 'UKA-2024-0005',
    firstName: 'David',
    lastName: 'Nkongolo',
    email: 'david.nkongolo@unikin.cd',
    phone: '+243 856 789 012',
    faculty: 'Médecine',
    program: 'Médecine Générale',
    level: 'D2',
    status: 'unpaid',
    enrollmentDate: '2020-09-01',
  },
  {
    id: '6',
    matricule: 'UKA-2024-0006',
    firstName: 'Sarah',
    lastName: 'Tshilombo',
    email: 'sarah.tshilombo@unikin.cd',
    phone: '+243 867 890 123',
    faculty: 'Sciences Informatiques',
    program: 'Génie Logiciel',
    level: 'L3',
    status: 'active',
    enrollmentDate: '2022-09-15',
  },
  {
    id: '7',
    matricule: 'UKA-2024-0007',
    firstName: 'Emmanuel',
    lastName: 'Kasongo',
    email: 'emmanuel.kasongo@unikin.cd',
    phone: '+243 878 901 234',
    faculty: 'Sciences Économiques',
    program: 'Gestion',
    level: 'L2',
    status: 'suspended',
    enrollmentDate: '2023-09-01',
  },
  {
    id: '8',
    matricule: 'UKA-2024-0008',
    firstName: 'Anne',
    lastName: 'Ilunga',
    email: 'anne.ilunga@unikin.cd',
    phone: '+243 889 012 345',
    faculty: 'Lettres',
    program: 'Langues Africaines',
    level: 'M2',
    status: 'active',
    enrollmentDate: '2020-09-10',
  },
]

export const payments: Payment[] = [
  {
    id: 'p1',
    studentId: '1',
    studentName: 'Jean Mbala',
    amount: 500,
    currency: 'USD',
    type: 'inscription',
    status: 'paid',
    dueDate: '2024-10-01',
    paidDate: '2024-09-28',
  },
  {
    id: 'p2',
    studentId: '1',
    studentName: 'Jean Mbala',
    amount: 300,
    currency: 'USD',
    type: 'tranche1',
    status: 'paid',
    dueDate: '2024-11-15',
    paidDate: '2024-11-10',
  },
  {
    id: 'p3',
    studentId: '2',
    studentName: 'Marie Kabongo',
    amount: 500,
    currency: 'USD',
    type: 'inscription',
    status: 'paid',
    dueDate: '2024-10-01',
    paidDate: '2024-10-05',
  },
  {
    id: 'p4',
    studentId: '2',
    studentName: 'Marie Kabongo',
    amount: 300,
    currency: 'USD',
    type: 'tranche1',
    status: 'overdue',
    dueDate: '2024-11-15',
  },
  {
    id: 'p5',
    studentId: '3',
    studentName: 'Patrick Lukusa',
    amount: 750,
    currency: 'USD',
    type: 'inscription',
    status: 'paid',
    dueDate: '2024-10-01',
    paidDate: '2024-09-20',
  },
  {
    id: 'p6',
    studentId: '5',
    studentName: 'David Nkongolo',
    amount: 1200,
    currency: 'USD',
    type: 'tranche2',
    status: 'overdue',
    dueDate: '2024-12-01',
  },
  {
    id: 'p7',
    studentId: '6',
    studentName: 'Sarah Tshilombo',
    amount: 300,
    currency: 'USD',
    type: 'tranche1',
    status: 'pending',
    dueDate: '2025-01-15',
  },
  {
    id: 'p8',
    studentId: '7',
    studentName: 'Emmanuel Kasongo',
    amount: 500,
    currency: 'USD',
    type: 'inscription',
    status: 'overdue',
    dueDate: '2024-10-01',
  },
]

export const grades: Grade[] = [
  { id: 'g1', studentId: '1', courseCode: 'INFO201', courseName: 'Programmation Orientée Objet', credits: 4, grade: 16, semester: 'S1', year: '2024-2025' },
  { id: 'g2', studentId: '1', courseCode: 'INFO202', courseName: 'Base de Données', credits: 3, grade: 14, semester: 'S1', year: '2024-2025' },
  { id: 'g3', studentId: '1', courseCode: 'INFO203', courseName: 'Algorithmes Avancés', credits: 4, grade: 15, semester: 'S1', year: '2024-2025' },
  { id: 'g4', studentId: '1', courseCode: 'MATH201', courseName: 'Mathématiques Discrètes', credits: 3, grade: 13, semester: 'S1', year: '2024-2025' },
  { id: 'g5', studentId: '2', courseCode: 'ECO301', courseName: 'Macroéconomie', credits: 4, grade: 12, semester: 'S1', year: '2024-2025' },
  { id: 'g6', studentId: '2', courseCode: 'ECO302', courseName: 'Économétrie', credits: 3, grade: 14, semester: 'S1', year: '2024-2025' },
  { id: 'g7', studentId: '3', courseCode: 'INFO401', courseName: 'Intelligence Artificielle', credits: 4, grade: 17, semester: 'S1', year: '2024-2025' },
  { id: 'g8', studentId: '3', courseCode: 'INFO402', courseName: 'Sécurité Informatique', credits: 3, grade: 18, semester: 'S1', year: '2024-2025' },
]

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Début des examens du premier semestre',
    content: 'Les examens du premier semestre débuteront le 15 janvier 2025. Veuillez consulter vos horaires sur le portail étudiant.',
    date: '2025-01-02',
    type: 'info',
    author: 'Secrétariat Académique',
  },
  {
    id: 'a2',
    title: 'Rappel: Paiement des frais',
    content: 'Nous rappelons aux étudiants que le paiement de la 2ème tranche est dû avant le 31 décembre. Les retardataires ne pourront pas passer les examens.',
    date: '2024-12-20',
    type: 'warning',
    author: 'Service Financier',
  },
  {
    id: 'a3',
    title: 'Interruption du service WhatsApp',
    content: "Le service d'assistance WhatsApp sera interrompu le 5 janvier de 10h à 14h pour maintenance.",
    date: '2025-01-03',
    type: 'urgent',
    author: 'Direction IT',
  },
]

export const chatHistory: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'Bonjour! Je suis votre assistant SmartCampus. Comment puis-je vous aider aujourd\'hui?',
    timestamp: '2025-01-15T08:00:00',
  },
]

// Dashboard statistics
export const dashboardStats = {
  totalStudents: 1247,
  activeStudents: 1089,
  unpaidStudents: 142,
  suspendedStudents: 16,
  totalPayments: 523400,
  pendingPayments: 87600,
  overduePayments: 45200,
  averageGrade: 13.8,
  successRate: 78.5,
  newEnrollments: 312,
}

// Faculty statistics
export const facultyStats = [
  { name: 'Sciences Informatiques', students: 342, unpaid: 28 },
  { name: 'Sciences Économiques', students: 287, unpaid: 35 },
  { name: 'Droit', students: 198, unpaid: 22 },
  { name: 'Médecine', students: 156, unpaid: 31 },
  { name: 'Lettres', students: 134, unpaid: 12 },
  { name: 'Polytechnique', students: 130, unpaid: 14 },
]

// Payment trends (monthly)
export const paymentTrends = [
  { month: 'Sep', collected: 145000, pending: 32000 },
  { month: 'Oct', collected: 98000, pending: 28000 },
  { month: 'Nov', collected: 87000, pending: 35000 },
  { month: 'Dec', collected: 112000, pending: 42000 },
  { month: 'Jan', collected: 81400, pending: 45600 },
]
