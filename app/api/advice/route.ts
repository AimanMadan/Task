import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30 // Set max duration to 30 seconds

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const prompt = `You are a professional bodybuilding coach and nutritionist. 
    Provide helpful, accurate, and detailed advice about bodybuilding, fitness, nutrition, 
    and workout routines. The user's question is: ${question}`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    })

    return NextResponse.json({ answer: text })
  } catch (error) {
    console.error("Error generating advice:", error)
    return NextResponse.json({ error: "Failed to generate advice" }, { status: 500 })
  }
}
