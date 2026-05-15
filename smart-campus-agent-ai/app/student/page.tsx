"use client"

import { 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Données simulées pour l'étudiant
const studentData = {
  name: "Jean Mukendi",
  matricule: "STU-2024-001",
  faculty: "Sciences Informatiques",
  level: "Licence 2",
  academicYear: "2024-2025",
  gpa: 3.42,
  totalCredits: 45,
  requiredCredits: 60,
  paymentStatus: "partial",
  amountPaid: 850,
  totalFees: 1200,
}

const upcomingEvents = [
  { id: 1, title: "Examen Algorithmique", date: "15 Fév 2025", time: "08:00", type: "exam" },
  { id: 2, title: "TD Base de Données", date: "12 Fév 2025", time: "10:00", type: "class" },
  { id: 3, title: "Remise Projet Java", date: "18 Fév 2025", time: "23:59", type: "deadline" },
]

const recentGrades = [
  { course: "Programmation Java", grade: 16, maxGrade: 20, credits: 4 },
  { course: "Base de Données", grade: 14, maxGrade: 20, credits: 3 },
  { course: "Mathématiques Discrètes", grade: 12, maxGrade: 20, credits: 4 },
  { course: "Réseaux Informatiques", grade: 15, maxGrade: 20, credits: 3 },
]

const notifications = [
  { id: 1, message: "Résultats de l'examen de Programmation publiés", time: "Il y a 2h", read: false },
  { id: 2, message: "Rappel: Paiement de la 2ème tranche avant le 28 Fév", time: "Il y a 1j", read: false },
  { id: 3, message: "Nouveau cours ajouté: Intelligence Artificielle", time: "Il y a 3j", read: true },
]

export default function StudentDashboard() {
  const paymentProgress = (studentData.amountPaid / studentData.totalFees) * 100
  const creditsProgress = (studentData.totalCredits / studentData.requiredCredits) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bonjour, {studentData.name.split(" ")[0]} !
          </h1>
          <p className="text-muted-foreground">
            {studentData.faculty} - {studentData.level} | Année {studentData.academicYear}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/student/chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Assistant IA
            </Link>
          </Button>
          <Button asChild>
            <Link href="/student/grades">
              <FileText className="mr-2 h-4 w-4" />
              Voir mes notes
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {studentData.paymentStatus === "partial" && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">Paiement en attente</p>
                <p className="text-sm text-muted-foreground">
                  Il vous reste {studentData.totalFees - studentData.amountPaid}$ à payer avant le 28 Février
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/student/payments">
                Voir détails
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                <p className="text-3xl font-bold text-foreground">{studentData.gpa}</p>
                <p className="text-xs text-muted-foreground">/ 4.00 GPA</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Crédits Obtenus</p>
                <p className="text-3xl font-bold text-foreground">{studentData.totalCredits}</p>
                <p className="text-xs text-muted-foreground">/ {studentData.requiredCredits} requis</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <GraduationCap className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <Progress value={creditsProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paiement</p>
                <p className="text-3xl font-bold text-foreground">{studentData.amountPaid}$</p>
                <p className="text-xs text-muted-foreground">/ {studentData.totalFees}$ total</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <CreditCard className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <Progress value={paymentProgress} className="mt-3 h-2 [&>div]:bg-amber-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cours Inscrits</p>
                <p className="text-3xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">ce semestre</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <BookOpen className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Grades */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notes Récentes</CardTitle>
              <CardDescription>Vos derniers résultats académiques</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/grades">
                Tout voir
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.course}</p>
                      <p className="text-sm text-muted-foreground">{item.credits} crédits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">
                      {item.grade}/{item.maxGrade}
                    </p>
                    <Badge
                      variant={item.grade >= 14 ? "default" : item.grade >= 10 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {item.grade >= 14 ? "Excellent" : item.grade >= 10 ? "Validé" : "À reprendre"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prochains Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                      event.type === "exam"
                        ? "bg-destructive/10 text-destructive"
                        : event.type === "deadline"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {event.type === "exam" ? (
                      <FileText className="h-4 w-4" />
                    ) : event.type === "deadline" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} à {event.time}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.type === "exam"
                        ? "border-destructive/50 text-destructive"
                        : event.type === "deadline"
                        ? "border-amber-500/50 text-amber-500"
                        : ""
                    }`}
                  >
                    {event.type === "exam" ? "Examen" : event.type === "deadline" ? "Échéance" : "Cours"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Restez informé des dernières actualités</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/notifications">
              Tout voir
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  notif.read ? "border-border" : "border-primary/50 bg-primary/5"
                }`}
              >
                <div
                  className={`flex h-2 w-2 rounded-full ${
                    notif.read ? "bg-muted-foreground" : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {notif.message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/student/grades">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>Consulter mes notes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/student/payments">
                <CreditCard className="h-6 w-6 text-amber-500" />
                <span>Payer mes frais</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/student/chat">
                <MessageSquare className="h-6 w-6 text-chart-2" />
                <span>Poser une question</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/student/profile">
                <FileText className="h-6 w-6 text-chart-4" />
                <span>Télécharger attestation</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
