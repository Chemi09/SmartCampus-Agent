'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Bot,
  Send,
  User,
  Loader2,
  ArrowLeft,
  Phone,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const mockResponses: Record<string, string> = {
  'moyenne': `Mbote! 📚 Voici vos notes pour ce semestre:

**Programmation (INFO201):** 16/20
**Base de Données (INFO202):** 14/20
**Algorithmes (INFO203):** 15/20
**Maths (MATH201):** 13/20

**Moyenne: 14.5/20** ✅

Bravo! Vous êtes sur la bonne voie!`,
  
  'frais': `Mbote! 💰 État de votre compte:

**Inscription:** Payé ✅
**Tranche 1:** Payé ✅
**Tranche 2:** En attente ⏳

Reste à payer: **300 USD**
Limite: 31 janvier 2025

Paiement possible via:
- Mobile Money (Orange, M-Pesa, Airtel)
- Virement bancaire
- Caisse du campus`,

  'inscription': `Mbote! 📝 Inscriptions Master:

**Dates:**
- Ouverture: 1er mars 2025
- Clôture: 30 avril 2025

**Documents:**
- Diplôme licence
- Relevés de notes
- Pièce d'identité
- Photo 4x4

**Frais:** 750 USD`,

  'bonjour': `Mbote! 👋 Je suis l'assistant SmartCampus.

Je parle **français** et **lingala**.

Je peux vous aider avec:
- 📚 Notes et résultats
- 💰 Paiements et frais
- 📝 Inscriptions
- 📅 Emplois du temps

Posez votre question!`,

  'default': `Nakoyoka! 🤔

Je peux vous aider avec:
- Vos **notes** (notes, moyenne, résultats)
- Vos **paiements** (frais, solde)
- Les **inscriptions** (master, réinscription)

Reformulez ou choisissez un sujet!`
}

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('mbote') || lowerMessage.includes('salut')) {
    return mockResponses.bonjour
  }
  if (lowerMessage.includes('moyenne') || lowerMessage.includes('note') || lowerMessage.includes('résultat')) {
    return mockResponses.moyenne
  }
  if (lowerMessage.includes('frais') || lowerMessage.includes('paiement') || lowerMessage.includes('soldé') || lowerMessage.includes('argent') || lowerMessage.includes('mbongo')) {
    return mockResponses.frais
  }
  if (lowerMessage.includes('inscription') || lowerMessage.includes('master') || lowerMessage.includes('réinscription')) {
    return mockResponses.inscription
  }
  
  return mockResponses.default
}

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Mbote! 👋 Je suis l'assistant SmartCampus AgentAI.

Je réponds en **français** et **lingala**, 24h/24.

Essayez:
- "Quelle est ma moyenne?"
- "Ai-je payé les frais?"
- "Comment s'inscrire en Master?"`,
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

  const handleSend = async () => {
    const messageText = input.trim()
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

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800))

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-3 p-4 max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">SmartCampus AgentAI</h1>
              <p className="text-xs text-accent flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                En ligne
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            WhatsApp
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'rounded-2xl px-4 py-2.5 max-w-[85%]',
                  message.role === 'assistant'
                    ? 'bg-card border border-border rounded-tl-sm'
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                )}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={cn(
                  'text-[10px] mt-1.5',
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
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 backdrop-blur-lg p-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1 rounded-full"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            Simulateur WhatsApp - SmartCampus AgentAI Demo
          </p>
        </div>
      </div>
    </div>
  )
}
