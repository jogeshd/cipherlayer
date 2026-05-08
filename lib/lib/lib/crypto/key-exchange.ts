/**
 * ECDH Key Exchange
 * Uses Web Crypto API for secure key generation and derivation.
 */

export type KeyPair = {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
};

export async function generateKeyPair(): Promise<KeyPair> {
  const keys = await crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  return keys as KeyPair;
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function importPublicKey(keyData: string): Promise<CryptoKey> {
  const binary = atob(keyData);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  
  return await crypto.subtle.importKey(
    "raw",
    bytes,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

export async function deriveSharedSecret(
  privateKey: CryptoKey,
  theirPublicKey: CryptoKey
): Promise<Uint8Array> {
  const bits = await crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: theirPublicKey,
    },
    privateKey,
    256
  );
  return new Uint8Array(bits);
}
