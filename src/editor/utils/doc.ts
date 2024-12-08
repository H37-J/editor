
import {SerializedDocument} from '@lexical/file';

async function* generateReader<T = any>(
  reader: ReadableStreamDefaultReader<T>,
) {
  let done = false;
  while (!done) {
    const res = await reader.read();
    const {value} = res;
    if (value !== undefined) {
      yield value;
    }
    done = res.done;
  }
}

const readBytesToString = async (reader: ReadableStreamDefaultReader): Promise<string> => {
  const output = [];
  const chunkSize = 0x8000;
  for await (const value of generateReader(reader)) {
    for (let i = 0; i < value.length; i += chunkSize) {
      // @ts-ignore
      output.push(String.fromCharCode(...value.subarray(i, i + chunkSize)));
    }
  }
  return output.join('');
}

export const docToHash = async (doc: SerializedDocument): Promise<string> => {
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  const [, output] = await Promise.all([
    writer
      .write(new TextEncoder().encode(JSON.stringify(doc)))
      .then(() => writer.close()),
    readBytesToString(cs.readable.getReader()),
  ])
  return `#doc=${btoa(output)
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=+$/, '')}`;
}

export const docFromHash = async (hash: string): Promise<SerializedDocument | null> => {
  const m = /^#doc=(.*)$/.exec(hash);
  if (!m) {
    return null;
  }
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  // @ts-ignore
  const b64 = atob(m[1].replace(/_/g, '/').replace(/-/g, '+'));
  const array = new Uint8Array(b64.length);
  for (let i = 0; i < b64.length; i++) {
    array[i] = b64.charCodeAt(i);
  }
  const closed = writer.write(array).then(() => writer.close());
  const output = [];
  for await (const chunk of generateReader(
    ds.readable.pipeThrough(new TextDecoderStream()).getReader(),
  )) {
    // @ts-ignore
    output.push(chunk);
  }
  await closed;
  return JSON.parse(output.join(''))
}

export const shareDoc = async (doc: SerializedDocument): Promise<void> => {
  const url = new URL(window.location.toString());
  url.hash = await docToHash(doc);
  const newUrl = url.toString();
  window.history.replaceState({}, '', newUrl);
  await window.navigator.clipboard.writeText(newUrl);
}