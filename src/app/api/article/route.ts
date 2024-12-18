
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai'
import { AiSchema } from '@/store/zustand/aiStore';



export async function POST(req: Request) {
  const { prompt, system } = await req.json();
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system,
    prompt,
    schema: AiSchema,
  })

  return result.toJsonResponse();
}

