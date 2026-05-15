"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Bot, 
  User,
  Sparkles,
  BookOpen,
  CreditCard,
  Calendar,
  HelpCircle,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const suggestedQuestions = [
  { icon: BookOpen, text: "Quelles sont mes notes ce semestre ?" },
  { icon: CreditCard, text: "Quel est mon solde de paiement ?" },
  { icon: Calendar, text: "Quand est mon prochain examen ?" },
  { icon: HelpCircle, text: "Comment obtenir une attestation ?" },
]

const botResponses: Record<string, string> = {
  "notes": "📚 Voici le résumé de vos notes ce semestre:\n\n• Programmation Java: 16/20 ✓\n• Base de Données: 14/20 ✓\n• Mathématiques: 12/20 ✓\n• Réseaux: 15/20 ✓\n• Statistiques: 9/20 ✗\n\nVotre moyenne générale est de 13.2/20. Vous avez validé 16 crédits sur 19.",
  "paiement": "💳 Voici votre situation financière:\n\n• Total frais: 1 200$\n• Montant payé: 850$\n• Solde restant: 350$\n\n⚠️ Prochaine échéance: 28 Février 2025\n\nVoulez-vous effectuer un paiement maintenant ?",
  "examen": "📅 Vos prochains examens:\n\n1. Algorithmique - 15 Fév 2025 à 08:00\n   📍 Auditoire A, Bâtiment Central\n\n2. Base de Données - 18 Fév 2025 à 10:00\n   📍 Salle Informatique B\n\n3. Réseaux - 22 Fév 2025 à 14:00\n   📍 Auditoire C\n\nBonne préparation ! 📖",
  "attestation": "📄 Pour obtenir une attestation d'inscription:\n\n1. Rendez-vous au secrétariat académique\n2. Présentez votre carte d'étudiant\n3. Payez les frais (5$)\n4. Délai: 24-48 heures\n\n💡 Vous pouvez aussi faire la demande en ligne via l'onglet 'Mon Profil' > 'Documents'.",
  "default": "Je suis l'assistant SmartCampus ! 🎓\n\nJe peux vous aider avec:\n• Vos notes et résultats\n• Vos paiements et frais\n• Votre emploi du temps\n• Les procédures administratives\n\nQue souhaitez-vous savoir ?"
}

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes("note") || lowerMessage.includes("résultat") || lowerMessage.includes("moyenne")) {
    return botResponses.notes
  }
  if (lowerMessage.includes("paiement") || lowerMessage.includes("solde") || lowerMessage.includes("frais") || lowerMessage.includes("argent")) {
    return botResponses.paiement
  }
  if (lowerMessage.includes("examen") || lowerMessage.includes("calendrier") || lowerMessage.includes("prochain")) {
    return botResponses.examen
  }
  if (lowerMessage.includes("attestation") || lowerMessage.includes("document") || lowerMessage.includes("certificat")) {
    return botResponses.attestation
  }
  return botResponses.default
}

export default function StudentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour Jean ! 👋 Je suis votre assistant SmartCampus. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Assistant SmartCampus
          </h1>
          <p className="text-muted-foreground">
            Posez vos questions sur vos études, paiements et plus encore
          </p>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-4">
        {/* Chat Area */}
        <Card className="flex flex-col lg:col-span-3">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={
                        message.sender === "bot"
                          ? "bg-primary text-primary-foreground"
                          : "bg-chart-2 text-white"
                      }
                    >
                      {message.sender === "bot" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.sender === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Sidebar - Suggested Questions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Questions Suggérées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleSend(question.text)}
                >
                  <question.icon className="mr-2 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-xs">{question.text}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Besoin d&apos;aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                L&apos;assistant peut répondre à vos questions sur les notes, paiements, 
                emplois du temps et procédures administratives.
              </p>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link href="/student">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au tableau de bord
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
