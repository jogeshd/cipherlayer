/**
 * Base91 encoding and decoding utility.
 * Base91 is more compact than Base64 and produces less recognizable patterns.
 */

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[]^_`{|}~\"";

export function encode(data: Uint8Array): string {
  let output = "";
  let n = 0;
  let b = 0;

  for (let i = 0; i < data.length; i++) {
    b |= data[i] << n;
    n += 8;
    if (n > 13) {
      let v = b & 8191;
      if (v > 88) {
        b >>= 13;
        n -= 13;
      } else {
        v = b & 16383;
        b >>= 14;
        n -= 14;
      }
      output += alphabet[v % 91] + alphabet[Math.floor(v / 91)];
    }
  }

  if (n > 0) {
    output += alphabet[b % 91];
    if (n > 7 || b > 90) {
      output += alphabet[Math.floor(b / 91)];
    }
  }

  return output;
}

export function decode(input: string): Uint8Array {
  const v = new Uint8Array(256);
  for (let i = 0; i < 91; i++) v[alphabet.charCodeAt(i)] = i;

  let output = new Uint8Array(Math.ceil(input.length * 14 / 8));
  let n = 0;
  let b = 0;
  let c = -1;
  let pos = 0;

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (v[code] === undefined) continue;

    if (c === -1) {
      c = v[code];
    } else {
      c += v[code] * 91;
      b |= c << n;
      n += (c & 8191) > 88 ? 13 : 14;
      do {
        output[pos++] = b & 255;
        b >>= 8;
        n -= 8;
      } while (n > 7);
      c = -1;
    }
  }

  if (c !== -1) {
    output[pos++] = (b | (c << n)) & 255;
  }

  return output.slice(0, pos);
}
