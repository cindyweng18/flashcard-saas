import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(req) {
    const data = await req.text()
  
      let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      let result = await model.generateContent({
        contents: [
          {
            role: 'model',
            parts: [{text: systemPrompt}],
          },
          {
            role: 'user',
            parts: [{text: data}],
          }
        ],
      })

      const flashcards = JSON.parse(result.response.text());
      return NextResponse.json(flashcards.flashcards)
  }