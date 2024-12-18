
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai'
import { AiSchema } from '@/store/zustand/aiStore';



export async function POST(req: Request) {
  const { prompt } = await req.json();
  const system = `Correct any typos or grammatical errors in the following text, but keep the meaning intact. If there are no errors, return the original text:${prompt}`
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system,
    prompt,
    schema: AiSchema,
  })

  return result.toJsonResponse();
}

