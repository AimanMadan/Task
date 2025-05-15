"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Loader2, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"

type ThinkingPhase = "idle" | "analyzing" | "evaluating" | "done"

export default function AdvicePage() {
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [thinkingPhase, setThinkingPhase] = useState<ThinkingPhase>("idle")
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setIsLoading(true)
    setError("")
    setThinkingPhase("analyzing")

    // Add user message immediately
    const userMessage = { role: "user", content: question }
    setChatHistory(prev => [...prev, userMessage])
    setQuestion("")

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    try {
      const formData = new FormData()
      formData.append("question", question)
      formData.append("chatHistory", JSON.stringify(chatHistory))

      const response = await fetch("/api/advice", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal
      })

      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let lines = buffer.split("\n")
        buffer = lines.pop()!
        for (const line of lines) {
          if (line.trim() === "") continue
          const data = JSON.parse(line)
          if (data.phase) {
            setThinkingPhase(data.phase)
          }
          if (data.answer) {
            setChatHistory(prev => [...prev, { role: "assistant", content: data.answer }])
          }
          if (data.error) {
            setError(data.error)
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError("Response cancelled")
      } else {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setIsLoading(false)
      setThinkingPhase("idle")
      abortControllerRef.current = null
    }
  }

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const getPhaseMessage = (phase: ThinkingPhase) => {
    switch (phase) {
      case "analyzing":
        return "Analyzing your question..."
      case "evaluating":
        return "Evaluating the response..."
      case "done":
        return "Finalizing the answer..."
      default:
        return ""
    }
  }

  const exampleQuestions = [
    "What's the best workout for building chest muscle fast?",
    "Give me a high-protein diet plan for muscle growth.",
    "How do I recover faster after an intense leg day?",
    "What supplements should I take for muscle gain?",
    "How often should I train each muscle group?",
    "What's the best form for deadlifts?",
  ]

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Brain className="h-12 w-12 mb-4 text-primary/50" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to Bodybuilding Coach</h2>
            <p className="max-w-md mb-6">
              I'm your AI bodybuilding coach. Ask me anything about workouts, nutrition, or recovery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full px-4">
              {exampleQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto py-3 px-4 text-left justify-start whitespace-normal break-words"
                  onClick={() => setQuestion(q)}
                >
                  <span className="line-clamp-2">{q}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start gap-3`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {msg.role === "user" ? (
                    <span className="text-sm font-medium">U</span>
                  ) : (
                    <Brain className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  <div className={`prose prose-sm dark:prose-invert max-w-none ${msg.role === "user" ? "!text-white" : ""}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            {isLoading && (
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{getPhaseMessage(thinkingPhase)}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStopResponse}
                  className="h-7 px-2"
                >
                  Stop Response
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question about bodybuilding..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="pr-12 min-h-[60px] max-h-[200px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 h-[60px] w-[60px] rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
