'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Bot,
  Send,
  User,
  Loader2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  CreditCard,
  Calendar,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  { icon: GraduationCap, text: 'Quelle est ma moyenne du semestre?', category: 'Notes' },
  { icon: CreditCard, text: 'Ai-je soldé les frais du deuxième semestre?', category: 'Paiements' },
  { icon: Calendar, text: 'Quand ferme l\'inscription en Master?', category: 'Inscriptions' },
  { icon: HelpCircle, text: 'Comment contacter le secrétariat?', category: 'Contact' },
]

const mockResponses: Record<string, string> = {
  'moyenne': `Bonjour! 📚 Voici votre relevé de notes pour le semestre en cours:

**Programmation Orientée Objet (INFO201):** 16/20
**Base de Données (INFO202):** 14/20
**Algorithmes Avancés (INFO203):** 15/20
**Mathématiques Discrètes (MATH201):** 13/20

**Moyenne générale: 14.5/20** ✅

Félicitations, vous êtes sur la bonne voie! Continuez vos efforts.`,
  
  'frais': `Bonjour! 💰 Voici l'état de votre compte:

**Frais d'inscription:** Payé ✅
**Tranche 1:** Payé ✅
**Tranche 2:** En attente ⏳

Le montant restant à payer est de **300 USD**.
Date limite: 31 janvier 2025

Vous pouvez effectuer le paiement via:
- Mobile Money (Orange Money, M-Pesa, Airtel Money)
- Virement bancaire
- Caisse du campus`,

  'inscription': `Bonjour! 📝 Concernant les inscriptions en Master:

**Dates importantes:**
- Ouverture: 1er mars 2025
- Clôture: 30 avril 2025

**Documents requis:**
- Diplôme de licence (copie certifiée)
- Relevés de notes (L1 à L3)
- Pièce d'identité
- Photo d'identité (4x4)
- Certificat de naissance

**Frais:** 750 USD (inscription + 1ère tranche)

Souhaitez-vous plus d'informations sur un programme spécifique?`,

  'contact': `Bonjour! 📞 Voici les coordonnées du secrétariat:

**Secrétariat Académique:**
- Téléphone: +243 812 345 678
- Email: secretariat@unikin.cd
- Horaires: Lun-Ven, 8h-16h

**Service Financier:**
- Téléphone: +243 823 456 789
- Email: finances@unikin.cd

**Localisation:** Bâtiment A, Bureau 102

Vous pouvez aussi me poser vos questions ici, je suis disponible 24h/24! 🤖`,

  'default': `Je comprends votre question! 🤔

Je suis l'assistant SmartCampus AgentAI. Je peux vous aider avec:
- Vos **notes** et résultats académiques
- L'état de vos **paiements** et frais
- Les **inscriptions** et réinscriptions
- Les **emplois du temps** et examens
- Les **informations** générales sur le campus

Pourriez-vous reformuler votre question ou choisir l'un des sujets ci-dessus?`
}

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('moyenne') || lowerMessage.includes('note') || lowerMessage.includes('résultat')) {
    return mockResponses.moyenne
  }
  if (lowerMessage.includes('frais') || lowerMessage.includes('paiement') || lowerMessage.includes('soldé') || lowerMessage.includes('argent')) {
    return mockResponses.frais
  }
  if (lowerMessage.includes('inscription') || lowerMessage.includes('master') || lowerMessage.includes('réinscription')) {
    return mockResponses.inscription
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('secrétariat') || lowerMessage.includes('téléphone') || lowerMessage.includes('email')) {
    return mockResponses.contact
  }
  
  return mockResponses.default
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Bonjour! 👋 Je suis l'assistant SmartCampus AgentAI.

Je suis disponible 24h/24 pour répondre à vos questions en **français** ou en **lingala**.

Comment puis-je vous aider aujourd'hui?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(messageText),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            Agent IA SmartCampus
          </h1>
          <p className="text-muted-foreground mt-1">Assistant intelligent disponible 24h/24</p>
        </div>
        <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 gap-1">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          En ligne
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col h-full">
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(
                      message.role === 'assistant' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    )}>
                      {message.role === 'assistant' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 max-w-[80%]',
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={cn(
                      'text-[10px] mt-2',
                      message.role === 'assistant' 
                        ? 'text-muted-foreground' 
                        : 'text-primary-foreground/70'
                    )}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">En train de réfléchir...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Posez votre question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || isLoading}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4 hidden lg:block">
          {/* Suggested Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Questions Suggérées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.text)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <q.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">{q.text}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {q.category}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Simulateur WhatsApp</p>
                  <p className="text-xs text-muted-foreground">
                    Cette interface simule l&apos;expérience de l&apos;agent IA accessible via WhatsApp/SMS pour les étudiants.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages aujourd&apos;hui</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temps de réponse moyen</span>
                <span className="font-semibold">{"<"} 2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction</span>
                <span className="font-semibold text-accent">94%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
