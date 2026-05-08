#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { algorithms } = require('../lib/crypto/algorithms');
const { base91 } = require('../lib/crypto/base91');

// Mocking required parts of the library if necessary
// Since we are running in Node, we might need to adapt some browser-specific stuff
// But algorithms.ts seems pure TS/JS using Uint8Array which Node supports.

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log(`
CipherLayer CLI — Enterprise Encryption Protocol
Usage:
  cipher encrypt <message> <key>
  cipher decrypt <ciphertext> <key>
`);
    process.exit(1);
}

const action = args[0];
const text = args[1];
const keyText = args[2] || "DEFAULT_ELITE_KEY";
const key = new TextEncoder().encode(keyText);

function runPolyShield(input, key, isEncrypt) {
    let data = input;
    const activeAlgorithms = isEncrypt ? algorithms : [...algorithms].reverse();
    
    activeAlgorithms.forEach(cipher => {
        data = isEncrypt ? cipher.encrypt(data, key) : cipher.decrypt(data, key);
    });
    
    return data;
}

if (action === "encrypt") {
    const data = new TextEncoder().encode(text);
    const encrypted = runPolyShield(data, key, true);
    // Use base91 for clean string output as seen in the web app
    // Wait, let's check base91 implementation to be sure
    try {
        const encoded = base91.encode(encrypted);
        console.log("\x1b[32m%s\x1b[0m", "ENCRYPTION SUCCESSFUL:");
        console.log(encoded);
    } catch (e) {
        console.error("Encoding failed:", e);
    }
} else if (action === "decrypt") {
    try {
        const encrypted = base91.decode(text);
        const decrypted = runPolyShield(encrypted, key, false);
        const decoded = new TextDecoder().decode(decrypted);
        console.log("\x1b[34m%s\x1b[0m", "DECRYPTION SUCCESSFUL:");
        console.log(decoded);
    } catch (e) {
        console.error("Decryption failed. Check your key or ciphertext.");
    }
} else {
    console.error("Unknown action. Use 'encrypt' or 'decrypt'.");
}
