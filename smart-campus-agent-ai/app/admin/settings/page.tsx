'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Database,
  Bot,
  Save,
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Settings className="h-7 w-7" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">Configurez votre plateforme SmartCampus</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Administrateur
              </CardTitle>
              <CardDescription>Informations de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue="Admin Campus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@smartcampus.cd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+243 812 345 678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" defaultValue="Administrateur" disabled />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications Email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes Impayés</Label>
                  <p className="text-sm text-muted-foreground">Notification pour chaque impayé</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouvelles Inscriptions</Label>
                  <p className="text-sm text-muted-foreground">Alertes pour les nouvelles inscriptions</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports Hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">Résumé chaque lundi</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Agent IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configuration Agent IA
              </CardTitle>
              <CardDescription>Paramètres de l&apos;assistant intelligent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Agent Actif</Label>
                  <p className="text-sm text-muted-foreground">Répondre aux requêtes WhatsApp/SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Support Lingala</Label>
                  <p className="text-sm text-muted-foreground">Réponses en lingala activées</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relances Automatiques</Label>
                  <p className="text-sm text-muted-foreground">Envoyer des rappels de paiement</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Numéro WhatsApp Business</Label>
                <Input id="whatsapp" defaultValue="+243 900 000 000" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version</span>
                <Badge variant="outline">v1.0.0-beta</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Base de données</span>
                <Badge variant="outline" className="bg-accent/20 text-accent">Connectée</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Agent IA</span>
                <Badge variant="outline" className="bg-accent/20 text-accent">Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <Badge variant="outline" className="bg-warning/20 text-warning">Sandbox</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                Changer le mot de passe
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                Activer 2FA
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                Gérer les sessions
              </Button>
            </CardContent>
          </Card>

          {/* Sovereignty */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Cloud Souverain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Vos données sont hébergées sur l&apos;infrastructure Yamify à Kinshasa.
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-xs font-medium">Souveraineté garantie</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
