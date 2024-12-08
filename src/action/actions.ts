import postgres from 'postgres';
import { z } from "zod";

const sql = postgres(process.env.DATABASE_URL || process.env.PROCESS_URL! , {
  ssl: 'allow',
});

export const createTodo = async (
  formData: FormData,
) => {
  const schema = z.object({
    todo: z.string().min(1),
  });
  const parse = schema.safeParse({
    todo: formData.get('todo'),
  });

  if(!parse.success) {
    return { message: 'api fail'}
  }

  const data = parse.data;

}

