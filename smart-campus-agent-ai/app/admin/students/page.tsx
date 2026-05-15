'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Download,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
} from 'lucide-react'
import { students, type Student } from '@/lib/mock-data'
import Link from 'next/link'
import { StatCard, StatGrid } from '@/components/stat-card'

const statusConfig = {
  active: { label: 'Actif', class: 'bg-accent/20 text-accent border-accent/30' },
  unpaid: { label: 'Impayé', class: 'bg-destructive/20 text-destructive border-destructive/30' },
  suspended: { label: 'Suspendu', class: 'bg-warning/20 text-warning border-warning/30' },
  graduated: { label: 'Diplômé', class: 'bg-primary/20 text-primary border-primary/30' },
}

const filterOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actifs' },
  { value: 'unpaid', label: 'Impayés' },
  { value: 'suspended', label: 'Suspendus' },
  { value: 'graduated', label: 'Diplômés' },
]

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        student.matricule.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    unpaid: students.filter(s => s.status === 'unpaid').length,
    suspended: students.filter(s => s.status === 'suspended').length,
  }), [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Étudiants</h1>
          <p className="text-muted-foreground mt-1">Consultez et gérez les dossiers étudiants</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel Étudiant
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          title="Total Étudiants"
          value={stats.total}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Étudiants Actifs"
          value={stats.active}
          icon={<UserCheck className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Impayés"
          value={stats.unpaid}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />
        <StatCard
          title="Suspendus"
          value={stats.suspended}
          icon={<UserX className="h-5 w-5" />}
          variant="warning"
        />
      </StatGrid>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, matricule ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[160px]">
                  <Filter className="h-4 w-4" />
                  {filterOptions.find(f => f.value === statusFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? 'bg-accent/10' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
          <CardDescription>{filteredStudents.length} étudiants trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Étudiant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Matricule</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Faculté / Filière</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Niveau</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <StudentRow key={student.id} student={student} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucun étudiant trouvé</h3>
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

function StudentRow({ student }: { student: Student }) {
  const status = statusConfig[student.status]

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 hidden md:table-cell">
        <code className="text-xs bg-muted px-2 py-1 rounded">{student.matricule}</code>
      </td>
      <td className="py-4 px-4 hidden lg:table-cell">
        <div>
          <p className="text-sm">{student.faculty}</p>
          <p className="text-xs text-muted-foreground">{student.program}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge variant="outline" className="font-mono">{student.level}</Badge>
      </td>
      <td className="py-4 px-4">
        <Badge variant="outline" className={status.class}>
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/students/${student.id}`} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Voir le profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Mail className="h-4 w-4" />
              Envoyer un email
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Phone className="h-4 w-4" />
              Appeler
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}
