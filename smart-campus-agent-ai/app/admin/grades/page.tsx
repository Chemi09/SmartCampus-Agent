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
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
} from 'lucide-react'
import { grades, students } from '@/lib/mock-data'
import { StatCard, StatGrid } from '@/components/stat-card'

const gradeStatusConfig = {
  passed: { label: 'Validé', class: 'bg-accent/20 text-accent' },
  failed: { label: 'Non validé', class: 'bg-destructive/20 text-destructive' },
}

export default function GradesPage() {
  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('all')

  const enrichedGrades = useMemo(() => {
    return grades.map(grade => {
      const student = students.find(s => s.id === grade.studentId)
      return {
        ...grade,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Inconnu',
        studentMatricule: student?.matricule || 'N/A',
      }
    })
  }, [])

  const filteredGrades = useMemo(() => {
    return enrichedGrades.filter((grade) => {
      const matchesSearch = 
        grade.studentName.toLowerCase().includes(search.toLowerCase()) ||
        grade.courseName.toLowerCase().includes(search.toLowerCase()) ||
        grade.courseCode.toLowerCase().includes(search.toLowerCase())
      
      const matchesSemester = semesterFilter === 'all' || grade.semester === semesterFilter
      
      return matchesSearch && matchesSemester
    })
  }, [enrichedGrades, search, semesterFilter])

  const stats = useMemo(() => ({
    totalGrades: grades.length,
    averageGrade: (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1),
    passedCount: grades.filter(g => g.grade >= 10).length,
    passRate: ((grades.filter(g => g.grade >= 10).length / grades.length) * 100).toFixed(0),
  }), [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Notes</h1>
          <p className="text-muted-foreground mt-1">Consultez et gérez les résultats académiques</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Saisir Notes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          title="Total Notes"
          value={stats.totalGrades}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Moyenne Générale"
          value={`${stats.averageGrade}/20`}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          title="Notes Validées"
          value={stats.passedCount}
          icon={<Award className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Taux de Réussite"
          value={`${stats.passRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
      </StatGrid>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant, matière ou code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[160px]">
                  <Filter className="h-4 w-4" />
                  {semesterFilter === 'all' ? 'Tous les semestres' : semesterFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par semestre</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSemesterFilter('all')}>
                  Tous les semestres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSemesterFilter('S1')}>
                  Semestre 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSemesterFilter('S2')}>
                  Semestre 2
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Relevé des Notes</CardTitle>
          <CardDescription>{filteredGrades.length} résultats trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Étudiant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Matière</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Crédits</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Note</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Semestre</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => {
                  const status = grade.grade >= 10 ? gradeStatusConfig.passed : gradeStatusConfig.failed
                  return (
                    <tr key={grade.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{grade.studentName}</p>
                          <p className="text-xs text-muted-foreground">{grade.studentMatricule}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{grade.courseCode}</code>
                      </td>
                      <td className="py-4 px-4 text-sm">{grade.courseName}</td>
                      <td className="py-4 px-4 text-center text-sm">{grade.credits}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-lg font-bold ${grade.grade >= 10 ? 'text-accent' : 'text-destructive'}`}>
                          {grade.grade}/20
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        <Badge variant="outline">{grade.semester}</Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="secondary" className={status.class}>
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucune note trouvée</h3>
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
