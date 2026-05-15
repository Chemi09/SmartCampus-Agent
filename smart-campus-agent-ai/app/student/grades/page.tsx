"use client"

import { useState } from "react"
import { 
  GraduationCap, 
  BookOpen, 
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const semesters = [
  { id: "s1-2024", name: "Semestre 1 - 2024-2025" },
  { id: "s2-2023", name: "Semestre 2 - 2023-2024" },
  { id: "s1-2023", name: "Semestre 1 - 2023-2024" },
]

const gradesData = [
  { 
    course: "Programmation Java", 
    code: "INFO201",
    credits: 4, 
    cc: 15, 
    tp: 17, 
    exam: 16, 
    final: 16,
    status: "validated",
    trend: "up"
  },
  { 
    course: "Base de Données", 
    code: "INFO202",
    credits: 3, 
    cc: 12, 
    tp: 15, 
    exam: 14, 
    final: 14,
    status: "validated",
    trend: "stable"
  },
  { 
    course: "Mathématiques Discrètes", 
    code: "MATH201",
    credits: 4, 
    cc: 10, 
    tp: null, 
    exam: 13, 
    final: 12,
    status: "validated",
    trend: "down"
  },
  { 
    course: "Réseaux Informatiques", 
    code: "INFO203",
    credits: 3, 
    cc: 14, 
    tp: 16, 
    exam: 15, 
    final: 15,
    status: "validated",
    trend: "up"
  },
  { 
    course: "Anglais Technique", 
    code: "LANG201",
    credits: 2, 
    cc: 16, 
    tp: null, 
    exam: 17, 
    final: 17,
    status: "validated",
    trend: "stable"
  },
  { 
    course: "Statistiques", 
    code: "MATH202",
    credits: 3, 
    cc: 8, 
    tp: 10, 
    exam: 9, 
    final: 9,
    status: "failed",
    trend: "down"
  },
]

export default function StudentGrades() {
  const [selectedSemester, setSelectedSemester] = useState("s1-2024")

  const validatedCredits = gradesData
    .filter(g => g.status === "validated")
    .reduce((sum, g) => sum + g.credits, 0)
  
  const totalCredits = gradesData.reduce((sum, g) => sum + g.credits, 0)
  
  const averageGrade = gradesData.reduce((sum, g) => sum + g.final * g.credits, 0) / totalCredits

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Notes</h1>
          <p className="text-muted-foreground">
            Consultez vos résultats académiques par semestre
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sélectionner un semestre" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem.id} value={sem.id}>
                  {sem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Relevé PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne Semestre</p>
                <p className="text-3xl font-bold text-foreground">{averageGrade.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">/ 20</p>
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
                <p className="text-sm text-muted-foreground">Crédits Validés</p>
                <p className="text-3xl font-bold text-foreground">{validatedCredits}</p>
                <p className="text-xs text-muted-foreground">/ {totalCredits} crédits</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <GraduationCap className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <Progress value={(validatedCredits / totalCredits) * 100} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">UE Validées</p>
                <p className="text-3xl font-bold text-foreground">
                  {gradesData.filter(g => g.status === "validated").length}
                </p>
                <p className="text-xs text-muted-foreground">/ {gradesData.length} UE</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <BookOpen className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Notes</CardTitle>
          <CardDescription>
            CC = Contrôle Continu | TP = Travaux Pratiques | Exam = Examen Final
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unité d&apos;Enseignement</TableHead>
                <TableHead className="text-center">Crédits</TableHead>
                <TableHead className="text-center">CC</TableHead>
                <TableHead className="text-center">TP</TableHead>
                <TableHead className="text-center">Exam</TableHead>
                <TableHead className="text-center">Note Finale</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Tendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradesData.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{grade.course}</p>
                      <p className="text-xs text-muted-foreground">{grade.code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{grade.credits}</TableCell>
                  <TableCell className="text-center">{grade.cc}/20</TableCell>
                  <TableCell className="text-center">
                    {grade.tp !== null ? `${grade.tp}/20` : "-"}
                  </TableCell>
                  <TableCell className="text-center">{grade.exam}/20</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-lg font-bold ${
                      grade.final >= 14 ? "text-chart-2" : 
                      grade.final >= 10 ? "text-foreground" : 
                      "text-destructive"
                    }`}>
                      {grade.final}/20
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={grade.status === "validated" ? "default" : "destructive"}
                    >
                      {grade.status === "validated" ? "Validé" : "Non validé"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {grade.trend === "up" ? (
                      <TrendingUp className="mx-auto h-5 w-5 text-chart-2" />
                    ) : grade.trend === "down" ? (
                      <TrendingDown className="mx-auto h-5 w-5 text-destructive" />
                    ) : (
                      <Minus className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Excellent (14+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Validé (10-13)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Non validé (&lt;10)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
