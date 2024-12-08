import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export const maxDuration = 30;



export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  console.log(result.toDataStreamResponse())

  return result.toDataStreamResponse();
}

