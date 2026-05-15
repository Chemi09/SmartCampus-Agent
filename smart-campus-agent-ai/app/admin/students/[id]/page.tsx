'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  CreditCard,
  FileText,
  Edit,
  MessageSquare,
  Download,
} from 'lucide-react'
import { students, grades, payments } from '@/lib/mock-data'

const statusConfig = {
  active: { label: 'Actif', class: 'bg-accent/20 text-accent border-accent/30' },
  unpaid: { label: 'Impayé', class: 'bg-destructive/20 text-destructive border-destructive/30' },
  suspended: { label: 'Suspendu', class: 'bg-warning/20 text-warning border-warning/30' },
  graduated: { label: 'Diplômé', class: 'bg-primary/20 text-primary border-primary/30' },
}

const paymentStatusConfig = {
  paid: { label: 'Payé', class: 'bg-accent/20 text-accent' },
  pending: { label: 'En attente', class: 'bg-warning/20 text-warning' },
  overdue: { label: 'En retard', class: 'bg-destructive/20 text-destructive' },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StudentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const student = students.find(s => s.id === id)
  
  if (!student) {
    notFound()
  }

  const studentGrades = grades.filter(g => g.studentId === id)
  const studentPayments = payments.filter(p => p.studentId === id)
  const status = statusConfig[student.status]

  // Calculate average grade
  const averageGrade = studentGrades.length > 0
    ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length).toFixed(1)
    : 'N/A'

  // Calculate total credits
  const totalCredits = studentGrades.reduce((sum, g) => sum + g.credits, 0)

  // Calculate total paid
  const totalPaid = studentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Profil Étudiant</h1>
            <p className="text-muted-foreground mt-1">{student.matricule}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
          <Button size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {student.firstName[0]}{student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{student.firstName} {student.lastName}</h2>
                  <p className="text-muted-foreground">{student.program}</p>
                </div>
                <Badge variant="outline" className={`${status.class} ml-0 sm:ml-auto`}>
                  {status.label}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{student.faculty} - {student.level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Inscrit le {new Date(student.enrollmentDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                <p className="text-2xl font-bold">{averageGrade}/20</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crédits Validés</p>
                <p className="text-2xl font-bold">{totalCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payé</p>
                <p className="text-2xl font-bold">${totalPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Année</p>
                <p className="text-2xl font-bold">2024-25</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="grades" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="communications" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Communications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Relevé de Notes</CardTitle>
              <CardDescription>Année académique 2024-2025</CardDescription>
            </CardHeader>
            <CardContent>
              {studentGrades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Matière</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Crédits</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Note</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades.map((grade) => (
                        <tr key={grade.id} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <code className="text-xs bg-muted px-2 py-1 rounded">{grade.courseCode}</code>
                          </td>
                          <td className="py-3 px-4 font-medium text-sm">{grade.courseName}</td>
                          <td className="py-3 px-4 text-center text-sm">{grade.credits}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${grade.grade >= 10 ? 'text-accent' : 'text-destructive'}`}>
                              {grade.grade}/20
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge 
                              variant="outline" 
                              className={grade.grade >= 10 ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}
                            >
                              {grade.grade >= 10 ? 'Validé' : 'Non validé'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Aucune note disponible</h3>
                  <p className="text-muted-foreground mt-1">
                    Les notes seront affichées une fois saisies
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Frais académiques et transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {studentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Montant</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Échéance</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date Paiement</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentPayments.map((payment) => {
                        const statusConf = paymentStatusConfig[payment.status]
                        return (
                          <tr key={payment.id} className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium text-sm">
                              {payment.type === 'inscription' ? 'Inscription' : 
                               payment.type.replace('tranche', 'Tranche ')}
                            </td>
                            <td className="py-3 px-4 font-bold text-sm">
                              ${payment.amount} {payment.currency}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {payment.paidDate 
                                ? new Date(payment.paidDate).toLocaleDateString('fr-FR')
                                : '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant="secondary" className={statusConf.class}>
                                {statusConf.label}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Aucun paiement enregistré</h3>
                  <p className="text-muted-foreground mt-1">
                    Les paiements apparaîtront ici une fois effectués
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communications</CardTitle>
              <CardDescription>Historique des échanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Aucune communication</h3>
                <p className="text-muted-foreground mt-1">
                  L&apos;historique des échanges apparaîtra ici
                </p>
                <Button className="mt-4 gap-2">
                  <Mail className="h-4 w-4" />
                  Envoyer un message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
