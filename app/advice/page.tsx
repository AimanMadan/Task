"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function AdvicePage() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error("Failed to get advice")
      }

      const data = await response.json()
      setAnswer(data.answer)
    } catch (err) {
      setError("Failed to get advice. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQuestions = [
    "What's the best workout for building chest muscle fast?",
    "Give me a high-protein diet plan for muscle growth.",
    "How do I recover faster after an intense leg day?",
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Bodybuilding Advice</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ask for Bodybuilding Advice</CardTitle>
            <CardDescription>Get expert bodybuilding advice powered by GPT-4o-mini</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Ask a question about bodybuilding..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-gray-500 w-full mb-1">Example questions:</p>
                {exampleQuestions.map((q, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuestion(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
              <Button type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting advice...
                  </>
                ) : (
                  "Get Advice"
                )}
              </Button>
            </form>
          </CardContent>
          {error && (
            <CardFooter className="border-t pt-6">
              <p className="text-red-500">{error}</p>
            </CardFooter>
          )}
          {answer && (
            <CardFooter className="border-t pt-6 flex-col items-start">
              <h3 className="font-semibold text-lg mb-2">Advice:</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
