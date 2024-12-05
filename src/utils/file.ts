import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const saveData = async (formData: FormData) => {
  const file = formData.get('file') as File;
  const fileBuffer = await file.arrayBuffer();
  const filePath = path.join(`/tmp/${file.name}`);
  await writeFile(filePath, Buffer.from(fileBuffer));

  return {
    email: formData.get('email'),
  };
};

export default saveData;