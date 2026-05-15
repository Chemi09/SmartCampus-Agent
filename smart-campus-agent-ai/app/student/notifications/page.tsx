"use client"

import { 
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  CreditCard,
  GraduationCap,
  Megaphone,
  Check,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const notifications = [
  {
    id: 1,
    type: "grade",
    title: "Résultats publiés",
    message: "Les résultats de l'examen de Programmation Java ont été publiés. Vous avez obtenu 16/20.",
    time: "Il y a 2 heures",
    read: false,
    icon: GraduationCap,
    color: "text-chart-2"
  },
  {
    id: 2,
    type: "payment",
    title: "Rappel de paiement",
    message: "La 3ème tranche de frais académiques (350$) est due avant le 28 Février 2025.",
    time: "Il y a 1 jour",
    read: false,
    icon: CreditCard,
    color: "text-amber-500"
  },
  {
    id: 3,
    type: "announcement",
    title: "Nouveau cours disponible",
    message: "Le cours d'Intelligence Artificielle a été ajouté à votre programme pour le semestre prochain.",
    time: "Il y a 3 jours",
    read: false,
    icon: Megaphone,
    color: "text-primary"
  },
  {
    id: 4,
    type: "event",
    title: "Examen à venir",
    message: "Rappel: Votre examen d'Algorithmique est prévu le 15 Février 2025 à 08:00.",
    time: "Il y a 5 jours",
    read: true,
    icon: Calendar,
    color: "text-destructive"
  },
  {
    id: 5,
    type: "info",
    title: "Mise à jour du système",
    message: "Le portail étudiant sera en maintenance le 10 Février de 22h à 06h.",
    time: "Il y a 1 semaine",
    read: true,
    icon: Info,
    color: "text-muted-foreground"
  },
  {
    id: 6,
    type: "grade",
    title: "Note ajoutée",
    message: "Votre note de TP en Base de Données a été enregistrée: 15/20.",
    time: "Il y a 2 semaines",
    read: true,
    icon: GraduationCap,
    color: "text-chart-2"
  },
]

export default function StudentNotifications() {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Vous avez {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Check className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer les lues
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Non lues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/10">
              <GraduationCap className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.filter(n => n.type === "grade").length}</p>
              <p className="text-xs text-muted-foreground">Notes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <CreditCard className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.filter(n => n.type === "payment").length}</p>
              <p className="text-xs text-muted-foreground">Paiements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
          <TabsTrigger value="grades">Notes</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {notifications.filter(n => !n.read).map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {notifications.filter(n => n.type === "grade").map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {notifications.filter(n => n.type === "payment").map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationItem({ notification }: { notification: typeof notifications[0] }) {
  const Icon = notification.icon
  
  return (
    <div className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
      !notification.read ? "bg-primary/5" : ""
    }`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        notification.color.replace("text-", "bg-").replace("500", "500/10")
      }`}>
        <Icon className={`h-5 w-5 ${notification.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Check className="h-4 w-4" />
      </Button>
    </div>
  )
}
