'use client'

import { StatCard, StatGrid } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  GraduationCap,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Bell,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import { dashboardStats, students, payments, announcements, facultyStats, paymentTrends } from '@/lib/mock-data'
import Link from 'next/link'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

const statusColors = {
  active: 'bg-accent/20 text-accent',
  unpaid: 'bg-destructive/20 text-destructive',
  suspended: 'bg-warning/20 text-warning',
  graduated: 'bg-primary/20 text-primary',
}

const paymentStatusColors = {
  paid: 'bg-accent/20 text-accent',
  pending: 'bg-warning/20 text-warning',
  overdue: 'bg-destructive/20 text-destructive',
}

const pieData = [
  { name: 'Actifs', value: dashboardStats.activeStudents, color: 'var(--accent)' },
  { name: 'Impayés', value: dashboardStats.unpaidStudents, color: 'var(--destructive)' },
  { name: 'Suspendus', value: dashboardStats.suspendedStudents, color: 'var(--warning)' },
]

export default function AdminDashboard() {
  const recentStudents = students.slice(0, 5)
  const recentPayments = payments.filter(p => p.status !== 'paid').slice(0, 5)
  const unpaidCount = payments.filter(p => p.status === 'overdue').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de votre campus universitaire</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Janvier 2025
          </Button>
          <Button size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">3</Badge>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatGrid>
        <StatCard
          title="Total Étudiants"
          value={dashboardStats.totalStudents.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12.5, label: 'vs mois dernier' }}
          description="inscrits cette année"
        />
        <StatCard
          title="Étudiants Actifs"
          value={dashboardStats.activeStudents.toLocaleString()}
          icon={<GraduationCap className="h-5 w-5" />}
          trend={{ value: 8.2, label: 'vs mois dernier' }}
          description="en règle"
          variant="success"
        />
        <StatCard
          title="Paiements Collectés"
          value={`$${(dashboardStats.totalPayments / 1000).toFixed(0)}K`}
          icon={<CreditCard className="h-5 w-5" />}
          trend={{ value: 15.3, label: 'vs mois dernier' }}
          description="ce semestre"
        />
        <StatCard
          title="Impayés"
          value={dashboardStats.unpaidStudents}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -5.2, label: 'vs mois dernier' }}
          description="nécessitent relance"
          variant="danger"
        />
      </StatGrid>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Trends */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Tendances des Paiements</CardTitle>
              <CardDescription>Collectes vs en attente par mois</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Voir détails
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentTrends} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000}K`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="collected" name="Collectés" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="En attente" fill="var(--muted)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition Étudiants</CardTitle>
            <CardDescription>Par statut académique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Étudiants Récents</CardTitle>
              <CardDescription>Dernières inscriptions</CardDescription>
            </div>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {student.firstName[0]}{student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {student.program} - {student.level}
                  </p>
                </div>
                <Badge variant="secondary" className={statusColors[student.status]}>
                  {student.status === 'active' ? 'Actif' : 
                   student.status === 'unpaid' ? 'Impayé' : 
                   student.status === 'suspended' ? 'Suspendu' : 'Diplômé'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Paiements en Attente</CardTitle>
              <CardDescription>{unpaidCount} paiements en retard</CardDescription>
            </div>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{payment.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.type === 'inscription' ? 'Inscription' : 
                     payment.type.replace('tranche', 'Tranche ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${payment.amount}</p>
                  <Badge variant="secondary" className={paymentStatusColors[payment.status]}>
                    {payment.status === 'pending' ? 'En attente' : 'En retard'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Annonces</CardTitle>
              <CardDescription>Communications récentes</CardDescription>
            </div>
            <Link href="/admin/communications">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={
                      announcement.type === 'urgent' ? 'bg-destructive/20 text-destructive' :
                      announcement.type === 'warning' ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }
                  >
                    {announcement.type === 'urgent' ? 'Urgent' : 
                     announcement.type === 'warning' ? 'Important' : 'Info'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-sm font-medium line-clamp-1">{announcement.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Faculty Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Statistiques par Faculté</CardTitle>
            <CardDescription>Répartition des étudiants et impayés</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-accent">
            <TrendingUp className="h-4 w-4" />
            <span>+12% cette année</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyStats.map((faculty) => (
              <div 
                key={faculty.name} 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{faculty.name}</p>
                  <p className="text-xs text-muted-foreground">{faculty.students} étudiants</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-destructive">{faculty.unpaid}</p>
                  <p className="text-xs text-muted-foreground">impayés</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
