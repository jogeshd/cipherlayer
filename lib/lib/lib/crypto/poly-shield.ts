import { encode, decode } from "./base91";
import { algorithms } from "./algorithms";

/**
 * PolyShield Engine
 * Orchestrates multi-algorithm encryption with zero-trust derivation.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encryptMessage(plaintext: string, sharedSecret: Uint8Array): Promise<string> {
  const data = encoder.encode(plaintext);
  
  // 1. Generate 3-byte random salt
  const salt = crypto.getRandomValues(new Uint8Array(3));
  
  // 2. Generate 2-byte random noise
  const noise = crypto.getRandomValues(new Uint8Array(2));

  // 3. Derive key and algorithm index via HMAC
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret as any,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", hmacKey, salt);
  const derivedBytes = new Uint8Array(signature);
  
  // Pick algorithm based on first byte of HMAC signature
  const algoIndex = derivedBytes[0] % algorithms.length;
  const algo = algorithms[algoIndex];
  
  // 4. Encrypt using selected algorithm
  const encrypted = algo.encrypt(data, derivedBytes);
  
  // 5. Build final payload: [salt (3b)] + [encrypted data] + [noise (2b)]
  const payload = new Uint8Array(salt.length + encrypted.length + noise.length);
  payload.set(salt, 0);
  payload.set(encrypted, salt.length);
  payload.set(noise, salt.length + encrypted.length);
  
  // 6. Base91 Encode
  return encode(payload);
}

export async function decryptMessage(cipherText: string, sharedSecret: Uint8Array): Promise<string> {
  // 1. Base91 Decode
  const payload = decode(cipherText);
  if (payload.length < 5) throw new Error("Invalid cipher text");
  
  // 2. Extract salt and encrypted data (strip 2-byte noise from end)
  const salt = payload.slice(0, 3);
  const encrypted = payload.slice(3, payload.length - 2);
  
  // 3. Re-derive HMAC key and algorithm index
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret as any,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", hmacKey, salt);
  const derivedBytes = new Uint8Array(signature);
  
  const algoIndex = derivedBytes[0] % algorithms.length;
  const algo = algorithms[algoIndex];
  
  // 4. Decrypt
  const decrypted = algo.decrypt(encrypted, derivedBytes);
  
  return decoder.decode(decrypted);
}
