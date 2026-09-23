import type { SaveData } from './Progress';
import { parseSave } from './Progress';

/**
 * 진행 상황을 복사해 둘 수 있는 저장 코드.
 * JSON을 압축(deflate)해서 base64로 바꾸고 앞에 표시를 붙인다. 압축을 못 쓰는 브라우저는 압축 없이.
 */
const PREFIX_Z = 'YG1Z:';
const PREFIX_RAW = 'YG1:';

function toB64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeSave(data: SaveData): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  if (typeof CompressionStream !== 'undefined') {
    try {
      return PREFIX_Z + toB64(await pipe(bytes, new CompressionStream('deflate-raw')));
    } catch {
      /* 압축 실패 시 그대로 */
    }
  }
  return PREFIX_RAW + toB64(bytes);
}

export async function decodeSave(code: string): Promise<SaveData | null> {
  const c = code.trim().replace(/\s+/g, '');
  try {
    let bytes: Uint8Array;
    if (c.startsWith(PREFIX_Z)) {
      if (typeof DecompressionStream === 'undefined') return null;
      bytes = await pipe(fromB64(c.slice(PREFIX_Z.length)), new DecompressionStream('deflate-raw'));
    } else if (c.startsWith(PREFIX_RAW)) bytes = fromB64(c.slice(PREFIX_RAW.length));
    else return null;
    return parseSave(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
