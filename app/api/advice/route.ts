import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30 // terminate request after 30 sec

export async function POST(request: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const formData = await request.formData()
        const question = formData.get("question") as string
        const chatHistory = JSON.parse(formData.get("chatHistory") as string) || []

        // 1. Send phase: analyzing
        controller.enqueue(encoder.encode(JSON.stringify({ phase: "analyzing" }) + "\n"))

        // Analyze
        const chatContext = chatHistory
          .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
          .join("\n")
        const thinkingPrompt = `You are a professional bodybuilding coach and nutritionist. \nFirst, carefully analyze the following question and think about:\n1. What specific information is being requested?\n2. What key areas of expertise are needed to answer this?\n3. What potential misconceptions should be addressed?\n4. What additional context might be helpful?\n\nPrevious conversation:\n${chatContext}\n\nCurrent question: ${question}\n\nThink step by step about how to approach this question.`
        const { text: thinkingResponse } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: thinkingPrompt,
        })

        // 2. Send phase: evaluating
        controller.enqueue(encoder.encode(JSON.stringify({ phase: "evaluating" }) + "\n"))

        // Evaluate
        const evaluationPrompt = `Based on your initial analysis, provide a comprehensive response that:\n1. Is clear and concise\n2. Provides actionable advice\n3. Includes safety considerations where relevant\n4. Makes the advice practical and personalized\n5. Addresses any potential misconceptions\n\nInitial analysis: ${thinkingResponse}\n\nProvide your final response to the user's question: ${question}`
        const { text: finalResponse } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: evaluationPrompt,
        })

        // 3. Send phase: done, with answer
        const updatedChatHistory = [
          ...chatHistory,
          { role: "user", content: question },
          { role: "assistant", content: finalResponse }
        ]
        controller.enqueue(encoder.encode(JSON.stringify({
          phase: "done",
          answer: finalResponse,
          chatHistory: updatedChatHistory
        }) + "\n"))
        controller.close()
      } catch (error) {
        controller.enqueue(encoder.encode(JSON.stringify({ error: "Failed to generate advice" }) + "\n"))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })
}
