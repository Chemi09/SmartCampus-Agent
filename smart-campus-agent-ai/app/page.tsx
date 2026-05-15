import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GraduationCap, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Bot,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Check,
  ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: GraduationCap,
    title: 'ERP Académique',
    description: 'Gestion complète des inscriptions, notes, filières et emplois du temps universitaires.',
  },
  {
    icon: Users,
    title: 'CRM Étudiant',
    description: 'Suivi relationnel des étudiants, historique des échanges et satisfaction.',
  },
  {
    icon: CreditCard,
    title: 'Gestion des Paiements',
    description: 'Suivi des frais, relances automatiques et intégration Mobile Money.',
  },
  {
    icon: Bot,
    title: 'Agent IA Autonome',
    description: 'Assistant WhatsApp/SMS disponible 24h/24 en français et lingala.',
  },
  {
    icon: Shield,
    title: 'Cloud Souverain',
    description: 'Données hébergées localement à Kinshasa pour une souveraineté totale.',
  },
  {
    icon: MessageSquare,
    title: 'Communications',
    description: 'Notifications intelligentes et annonces personnalisées aux étudiants.',
  },
]

const stats = [
  { value: '1,200+', label: 'Étudiants gérés' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Disponibilité IA' },
  { value: '50%', label: 'Réduction admin' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">SmartCampus</span>
              <span className="text-[10px] text-muted-foreground -mt-1">AgentAI</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Démo
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" className="gap-2">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-muted-foreground">Hackathon OpenClaw 2025</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              <span className="gradient-text">Gestion universitaire</span>
              <br />
              <span>intelligente propulsée par l&apos;IA</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Le premier mini-ERP de campus universitaire congolais avec un agent IA autonome 
              accessible 24h/24 via WhatsApp/SMS, en français ou en lingala.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/admin">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  Accéder au Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo/chat">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-8 text-base">
                  <Bot className="h-5 w-5" />
                  Essayer l&apos;Agent IA
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Une plateforme complète</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Trois visions fusionnées en un seul produit : ERP, CRM et Agent IA autonome.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <CardContent className="relative p-8 sm:p-12 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Prêt à transformer votre campus?
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Découvrez comment SmartCampus AgentAI peut révolutionner la gestion de votre établissement.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/admin">
                  <Button size="lg" className="gap-2">
                    Commencer maintenant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo/chat">
                  <Button variant="outline" size="lg">
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sovereignty Section */}
      <section id="about" className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
                <Globe className="h-4 w-4" />
                Cloud Souverain
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Vos données restent à Kinshasa
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                SmartCampus AgentAI est hébergé sur l&apos;infrastructure cloud souveraine Yamify à Kinshasa. 
                Vos données académiques sensibles ne quittent jamais le territoire congolais.
              </p>
              <ul className="space-y-4">
                {[
                  'Hébergement local à Texaf/OADC Kinshasa',
                  'Conformité aux réglementations locales',
                  'Latence réduite pour les utilisateurs congolais',
                  'Indépendance vis-à-vis des clouds étrangers',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-card to-card/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Sécurité maximale</h4>
                      <p className="text-sm text-muted-foreground">Chiffrement de bout en bout</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Performance locale</h4>
                      <p className="text-sm text-muted-foreground">Temps de réponse {"<"} 100ms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Souveraineté totale</h4>
                      <p className="text-sm text-muted-foreground">100% des données en RDC</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">SmartCampus AgentAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hackathon OpenClaw 2025 - Équipe Yamify
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
