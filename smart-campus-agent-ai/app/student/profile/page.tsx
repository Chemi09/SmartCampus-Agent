"use client"

import { useState } from "react"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Download,
  Edit,
  Camera,
  FileText,
  Shield,
  Bell,
  Save
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

const studentProfile = {
  name: "Jean Mukendi",
  matricule: "STU-2024-001",
  email: "jean.mukendi@student.unikin.cd",
  phone: "+243 812 345 678",
  dateOfBirth: "15 Mars 1999",
  placeOfBirth: "Kinshasa, RDC",
  address: "123 Avenue de la Paix, Kinshasa",
  faculty: "Sciences Informatiques",
  department: "Informatique de Gestion",
  level: "Licence 2",
  academicYear: "2024-2025",
  enrollmentDate: "Octobre 2023",
  status: "Actif",
}

const documents = [
  { name: "Attestation d'inscription", type: "PDF", size: "124 KB", available: true },
  { name: "Relevé de notes S1", type: "PDF", size: "256 KB", available: true },
  { name: "Carte d'étudiant", type: "PDF", size: "89 KB", available: true },
  { name: "Certificat de scolarité", type: "PDF", size: "145 KB", available: false },
]

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et documents
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  JM
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground">{studentProfile.name}</h2>
              <p className="text-muted-foreground">{studentProfile.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge variant="default">{studentProfile.level}</Badge>
                <Badge variant="secondary">{studentProfile.faculty}</Badge>
                <Badge variant="outline" className="border-chart-2 text-chart-2">
                  {studentProfile.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Matricule: <span className="font-mono font-medium text-foreground">{studentProfile.matricule}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="info" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input
                      value={studentProfile.name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <Input
                      value={studentProfile.dateOfBirth}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lieu de naissance</Label>
                  <Input
                    value={studentProfile.placeOfBirth}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={studentProfile.address}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email universitaire</Label>
                  <Input
                    value={studentProfile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    L&apos;email universitaire ne peut pas être modifié
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={studentProfile.phone}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5" />
                  Informations Académiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Faculté</p>
                    <p className="font-medium text-foreground">{studentProfile.faculty}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Département</p>
                    <p className="font-medium text-foreground">{studentProfile.department}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Niveau</p>
                    <p className="font-medium text-foreground">{studentProfile.level}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Année Académique</p>
                    <p className="font-medium text-foreground">{studentProfile.academicYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mes Documents
              </CardTitle>
              <CardDescription>
                Téléchargez vos documents administratifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} - {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={doc.available ? "default" : "secondary"}
                      size="sm"
                      disabled={!doc.available}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {doc.available ? "Télécharger" : "Non disponible"}
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-3 font-medium text-foreground">Demander un document</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vous pouvez demander d&apos;autres documents administratifs
                </p>
                <Button variant="outline" className="mt-4">
                  Faire une demande
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du Compte
              </CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" placeholder="••••••••" className="mt-2" />
                </div>
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" placeholder="••••••••" className="mt-2" />
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" placeholder="••••••••" className="mt-2" />
                </div>
                <Button>Changer le mot de passe</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de Notification
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications importantes par email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les alertes urgentes par SMS
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Rappels de paiement</p>
                  <p className="text-sm text-muted-foreground">
                    Être notifié avant les échéances de paiement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Résultats académiques</p>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand de nouvelles notes sont publiées
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Annonces générales</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les annonces de l&apos;université
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
