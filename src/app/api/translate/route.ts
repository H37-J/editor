import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { AiSchema } from '@/store/zustand/aiStore';


export async function POST(req: Request) {
  const { prompt, language } = await req.json();

  const system = `Translate the following sentence into ${language}.`;
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system,
    prompt,
    schema: AiSchema,
  });

  return result.toJsonResponse()
}