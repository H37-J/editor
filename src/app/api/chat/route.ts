import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt,
  });

  return result.toDataStreamResponse();
}

