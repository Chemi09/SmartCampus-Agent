'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageSquare,
  Send,
  Bell,
  Mail,
  Phone,
  Plus,
  Users,
  AlertTriangle,
  Info,
  Calendar,
} from 'lucide-react'
import { announcements } from '@/lib/mock-data'
import { StatCard, StatGrid } from '@/components/stat-card'

const typeConfig = {
  info: { label: 'Information', class: 'bg-primary/20 text-primary border-primary/30', icon: Info },
  warning: { label: 'Important', class: 'bg-warning/20 text-warning border-warning/30', icon: AlertTriangle },
  urgent: { label: 'Urgent', class: 'bg-destructive/20 text-destructive border-destructive/30', icon: Bell },
}

export default function CommunicationsPage() {
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<'info' | 'warning' | 'urgent'>('info')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground mt-1">Gérez les annonces et notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Email en masse
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Phone className="h-4 w-4" />
            SMS en masse
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          title="Annonces Actives"
          value={announcements.length}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          title="Destinataires"
          value="1,247"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Taux d'ouverture"
          value="78%"
          icon={<Mail className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="SMS envoyés"
          value="342"
          icon={<Phone className="h-5 w-5" />}
        />
      </StatGrid>

      {/* Create Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle Annonce
          </CardTitle>
          <CardDescription>Créez une annonce pour les étudiants et le personnel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type d&apos;annonce</label>
            <div className="flex gap-2">
              {(['info', 'warning', 'urgent'] as const).map((type) => {
                const config = typeConfig[type]
                return (
                  <Button
                    key={type}
                    variant={newType === type ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                    onClick={() => setNewType(type)}
                  >
                    <config.icon className="h-4 w-4" />
                    {config.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input
              placeholder="Titre de l'annonce..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenu</label>
            <Textarea
              placeholder="Contenu de l'annonce..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="gap-2 flex-1 sm:flex-none">
              <Send className="h-4 w-4" />
              Publier l&apos;annonce
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Mail className="h-4 w-4" />
              Envoyer par email
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Phone className="h-4 w-4" />
              Envoyer par SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>Annonces Récentes</CardTitle>
          <CardDescription>Historique des communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement) => {
            const config = typeConfig[announcement.type]
            const TypeIcon = config.icon
            return (
              <div 
                key={announcement.id} 
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`gap-1 ${config.class}`}>
                        <TypeIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Par {announcement.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">Email</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">SMS</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Relance Impayés</h3>
                <p className="text-sm text-muted-foreground">142 étudiants concernés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Rappel Examens</h3>
                <p className="text-sm text-muted-foreground">Session de janvier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Notification Urgente</h3>
                <p className="text-sm text-muted-foreground">Tous les étudiants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
