import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AiDiagnosis } from "@/types"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BKC_SYSTEM_PROMPT = `You are an expert Volkswagen diesel mechanic specializing in the 1.9 TDI PD engine,
specifically the BKC engine code found in the Golf 5 (2004–2008).
The user owns this exact car. Be specific, practical, and concise.
When diagnosing fault codes, always mention BKC-specific common causes first.
Assume the user has basic mechanical knowledge.
Respond in the same language the user writes in.`

export async function diagnoseFaultCode(
  code: string,
  mileageKm?: number,
  additionalCodes?: string[]
): Promise<AiDiagnosis> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" })

  const context = additionalCodes?.length
    ? `Additional active codes: ${additionalCodes.join(", ")}.`
    : ""

  const mileageContext = mileageKm ? `Current mileage: ${mileageKm} km.` : ""

  const prompt = `${BKC_SYSTEM_PROMPT}

Diagnose fault code ${code} for a VW Golf 5 1.9 TDI BKC engine.
${mileageContext}
${context}

Respond ONLY with valid JSON in this exact format:
{
  "summary": "brief plain-language explanation of what this code means",
  "likelyCauses": ["cause 1 (most likely for BKC)", "cause 2", "cause 3"],
  "suggestedSteps": ["step 1", "step 2", "step 3"],
  "urgency": "low" | "medium" | "high"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Failed to parse AI response")

  return JSON.parse(jsonMatch[0]) as AiDiagnosis
}

export async function askBkcQuestion(question: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

  const prompt = `${BKC_SYSTEM_PROMPT}

User question: ${question}`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
