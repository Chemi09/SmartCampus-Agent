"use client"

import { useState } from "react"
import { 
  CreditCard, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  Calendar,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const paymentSummary = {
  totalFees: 1200,
  amountPaid: 850,
  remaining: 350,
  nextDeadline: "28 Février 2025",
  academicYear: "2024-2025",
}

const paymentHistory = [
  { 
    id: "PAY-001",
    date: "15 Oct 2024", 
    amount: 500, 
    method: "Mobile Money",
    reference: "MM-2024-10-15-001",
    status: "completed",
    description: "1ère tranche - Frais académiques"
  },
  { 
    id: "PAY-002",
    date: "10 Jan 2025", 
    amount: 350, 
    method: "Virement Bancaire",
    reference: "VB-2025-01-10-002",
    status: "completed",
    description: "2ème tranche - Frais académiques"
  },
]

const paymentSchedule = [
  { tranche: "1ère Tranche", amount: 500, deadline: "15 Oct 2024", status: "paid" },
  { tranche: "2ème Tranche", amount: 350, deadline: "15 Jan 2025", status: "paid" },
  { tranche: "3ème Tranche", amount: 350, deadline: "28 Fév 2025", status: "pending" },
]

export default function StudentPayments() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const paymentProgress = (paymentSummary.amountPaid / paymentSummary.totalFees) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Paiements</h1>
          <p className="text-muted-foreground">
            Gérez vos frais académiques - Année {paymentSummary.academicYear}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Reçus
          </Button>
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Wallet className="mr-2 h-4 w-4" />
                Effectuer un paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Effectuer un paiement</DialogTitle>
                <DialogDescription>
                  Choisissez le montant et la méthode de paiement
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="350"
                    defaultValue={paymentSummary.remaining}
                  />
                  <p className="text-xs text-muted-foreground">
                    Solde restant: {paymentSummary.remaining}$
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Méthode de paiement</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <span className="text-xs">Mobile Money</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                      <Wallet className="h-6 w-6 text-chart-2" />
                      <span className="text-xs">Carte Bancaire</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+243 XXX XXX XXX"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setPaymentDialogOpen(false)}>
                  Confirmer le paiement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alert for pending payment */}
      {paymentSummary.remaining > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">Paiement en attente</p>
                <p className="text-sm text-muted-foreground">
                  Prochaine échéance: {paymentSummary.nextDeadline} - Montant: {paymentSummary.remaining}$
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => setPaymentDialogOpen(true)}>
              Payer maintenant
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Frais</p>
                <p className="text-3xl font-bold text-foreground">{paymentSummary.totalFees}$</p>
                <p className="text-xs text-muted-foreground">Année académique</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Montant Payé</p>
                <p className="text-3xl font-bold text-chart-2">{paymentSummary.amountPaid}$</p>
                <p className="text-xs text-muted-foreground">{paymentProgress.toFixed(0)}% du total</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <CheckCircle className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <Progress value={paymentProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solde Restant</p>
                <p className="text-3xl font-bold text-amber-500">{paymentSummary.remaining}$</p>
                <p className="text-xs text-muted-foreground">Échéance: {paymentSummary.nextDeadline}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Échéancier de Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSchedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    item.status === "paid" 
                      ? "border-chart-2/50 bg-chart-2/5" 
                      : "border-amber-500/50 bg-amber-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.status === "paid" ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{item.tranche}</p>
                      <p className="text-sm text-muted-foreground">
                        Échéance: {item.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{item.amount}$</p>
                    <Badge
                      variant={item.status === "paid" ? "default" : "secondary"}
                      className={item.status === "paid" ? "" : "bg-amber-500/20 text-amber-500"}
                    >
                      {item.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de Paiement</CardTitle>
            <CardDescription>
              Choisissez votre méthode préférée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Orange Money</p>
                    <p className="text-sm text-muted-foreground">Paiement instantané</p>
                  </div>
                </div>
                <Badge variant="outline">Recommandé</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">M-Pesa</p>
                    <p className="text-sm text-muted-foreground">Vodacom Mobile Money</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Carte Bancaire</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historique des Paiements</CardTitle>
            <CardDescription>
              Tous vos paiements effectués
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right font-medium">{payment.amount}$</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-chart-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Confirmé
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
