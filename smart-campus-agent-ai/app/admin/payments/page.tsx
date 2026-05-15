'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  Download,
  CreditCard,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  MoreHorizontal,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react'
import { payments, dashboardStats } from '@/lib/mock-data'
import { StatCard, StatGrid } from '@/components/stat-card'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const statusConfig = {
  paid: { label: 'Payé', class: 'bg-accent/20 text-accent border-accent/30', icon: CheckCircle },
  pending: { label: 'En attente', class: 'bg-warning/20 text-warning border-warning/30', icon: Clock },
  overdue: { label: 'En retard', class: 'bg-destructive/20 text-destructive border-destructive/30', icon: AlertTriangle },
}

const typeLabels = {
  inscription: 'Inscription',
  tranche1: 'Tranche 1',
  tranche2: 'Tranche 2',
  tranche3: 'Tranche 3',
  exam: 'Frais d\'examen',
}

const chartData = [
  { month: 'Sep', paid: 145000, pending: 32000, overdue: 8000 },
  { month: 'Oct', paid: 98000, pending: 28000, overdue: 12000 },
  { month: 'Nov', paid: 87000, pending: 35000, overdue: 18000 },
  { month: 'Dec', paid: 112000, pending: 42000, overdue: 22000 },
  { month: 'Jan', paid: 81400, pending: 45600, overdue: 25000 },
]

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = 
        payment.studentName.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    collected: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  }), [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Paiements</h1>
          <p className="text-muted-foreground mt-1">Suivi des frais académiques et relances</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            Relance Groupée
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          title="Total Attendu"
          value={`$${(stats.total / 1000).toFixed(1)}K`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Collecté"
          value={`$${(stats.collected / 1000).toFixed(1)}K`}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="En Attente"
          value={`$${(stats.pending / 1000).toFixed(1)}K`}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="En Retard"
          value={`$${(stats.overdue / 1000).toFixed(1)}K`}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />
      </StatGrid>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Paiements</CardTitle>
          <CardDescription>Montants par statut sur les 5 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
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
                <Bar dataKey="paid" name="Payé" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="En attente" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" name="En retard" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[160px]">
                  <Filter className="h-4 w-4" />
                  {statusFilter === 'all' ? 'Tous les statuts' : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Tous les statuts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                  Payés
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  En attente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                  En retard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Paiements</CardTitle>
          <CardDescription>{filteredPayments.length} paiements trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Étudiant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Échéance</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const status = statusConfig[payment.status]
                  const StatusIcon = status.icon
                  return (
                    <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{payment.id}</code>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-sm">{payment.studentName}</p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell text-sm">
                        {typeLabels[payment.type]}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold">${payment.amount}</span>
                        <span className="text-xs text-muted-foreground ml-1">{payment.currency}</span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={`gap-1 ${status.class}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Marquer comme payé
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Send className="h-4 w-4" />
                              Envoyer relance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Mail className="h-4 w-4" />
                              Envoyer email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Phone className="h-4 w-4" />
                              Envoyer SMS
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <RefreshCw className="h-4 w-4" />
                              Modifier échéance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucun paiement trouvé</h3>
              <p className="text-muted-foreground mt-1">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
