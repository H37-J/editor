import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { AiSchema } from '@/store/zustand/aiStore';


export async function POST(req: Request) {
  const { prompt, code, language = 'korean'} = await req.json();

  const system = `Generate a code snippet for ${prompt}. Write code in ${code}. Tell me the code in ${language}. No explanation, just show the code.`;

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system,
    prompt,
    schema: AiSchema,
  });

  return result.toJsonResponse();
}
