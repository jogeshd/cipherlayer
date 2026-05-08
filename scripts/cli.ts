import { algorithms } from "../lib/crypto/algorithms";
import { encode, decode } from "../lib/crypto/base91";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
\x1b[1m\x1b[36mCipherLayer CLI — Enterprise Encryption Protocol\x1b[0m
Usage:
  npm run cli -- encrypt <message> [key]
  npm run cli -- decrypt <ciphertext> [key]

Options:
  message     The text you want to protect
  ciphertext  The base91 encoded shielded text
  key         (Optional) The elite key for the PolyShield engine
`);
  process.exit(1);
}

const action = args[0];
const text = args[1];
const keyText = args[2] || "DEFAULT_ELITE_KEY";
const key = new TextEncoder().encode(keyText);

function runPolyShield(input: Uint8Array, key: Uint8Array, isEncrypt: boolean): Uint8Array {
  let data = input;
  const activeAlgorithms = isEncrypt ? algorithms : [...algorithms].reverse();

  activeAlgorithms.forEach((cipher) => {
    data = isEncrypt ? cipher.encrypt(data, key) : cipher.decrypt(data, key);
  });

  return data;
}

if (action === "encrypt") {
  const data = new TextEncoder().encode(text);
  const encrypted = runPolyShield(data, key, true);
  const encoded = encode(encrypted);
  console.log("\x1b[32m%s\x1b[0m", "ENCRYPTION SUCCESSFUL:");
  console.log(encoded);
} else if (action === "decrypt") {
  try {
    const encrypted = decode(text);
    const decrypted = runPolyShield(encrypted, key, false);
    const decoded = new TextDecoder().decode(decrypted);
    console.log("\x1b[34m%s\x1b[0m", "DECRYPTION SUCCESSFUL:");
    console.log(decoded);
  } catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "DECRYPTION FAILED: Protocol mismatch or invalid key.");
  }
} else {
  console.error("Unknown action. Use 'encrypt' or 'decrypt'.");
}
