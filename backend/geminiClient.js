import { GoogleGenerativeAI } from '@google/generative-ai'
export const client = new GoogleGenerativeAI(process.env.GEMINI_KEY)
