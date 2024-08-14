import { NextResponse } from 'next/server'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. 
Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
Create a clear and concise questions for the front of the flashcard.
Provide accurate and informative answers to the back of the flashcard.
Ensure that each flashcard focuses on a single concept or piece of information. 
Use simple language to make the flashcards accessible to a wide range of learners.
Include a variety of question types, such as definitions, examples, comparisons, and applications.
Avoid overly comples or ambiguous phrasing in both questions and answers. 
When appropriate, use mnemonics or memory aids to help reinforce the information.
Aim to create a balanced set of flashcards that covers the topic comprehensively.
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