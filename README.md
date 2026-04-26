# 🔒 CipherLayer: Zero-Trust Stealth Messaging

<p align="center">
  <img src="/public/manifest.json" width="128" height="128" alt="CipherLayer Logo" style="display:none" />
</p>

```text
   ______ _       _                 _                                 
  / _____)_)     | |               | |                                
 | /      _ ____ | |__  _____  ____| |      ____ _   _ _____  ____ 
 | |     | |  _ \|  _ \| ___ |/ ___) |     / _  | | | | ___ |/ ___)
 | \_____| | |_| | | | | ____| |   | |____( ( | | |_| | ____| |    
  \______)_|  __/|_| |_|_____)_|   |_______)_||_|\__  |_____)_|    
           |_|                                  (____/             

  "Your words. Their encryption. Zero trust."
```

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Stack: Next.js 15](https://img.shields.io/badge/Stack-Next.js%2015-blue.svg)](https://nextjs.org/)
[![PWA: Ready](https://img.shields.io/badge/PWA-Ready-00F0FF.svg)](https://web.dev/progressive-web-apps/)

**CipherLayer** is a high-security, zero-trust messaging wrapper built for the modern surveillance age. It ensures that no third party—not WhatsApp, not Telegram, not even us—can ever read your plaintext.

---

## ✨ Features

### 🛡️ PolyShield™ Multi-Algo Engine
Unlike standard apps that use one algorithm (like AES), CipherLayer uses a **HMAC-derived selection** of 12 custom ciphers. Every message is sealed differently, making statistical analysis nearly impossible.

### 🧩 Stealth Patterns (Base91)
We don't use Base64 (which is easily flagged by surveillance). We use **Base91**, a compact encoding that produces high-entropy output that looks like random noise or custom camouflage.

### 🔑 P2P Handshake (Zero Cloud Keys)
Keys are exchanged directly between devices via **ECDH QR Code scans**. No private keys ever touch a server.

### 🫧 Cyberpunk Aesthetic
A "Military Terminal" design built with **Next.js 15, Framer Motion, and Tailwind CSS**. Features typewriter encryption reveals and scanline decryption effects.

### 🤖 AI-Powered Deniability
Powered by **Google Gemini 1.5 Flash**, generate mundane "Decoy Messages" to send alongside your ciphers to confuse automated surveillance filters.

---

## 🛠️ Technical Architecture

### The Encryption Flow
1.  **Salt Generation**: A random 3-byte salt is generated.
2.  **HMAC Derivation**: `HMAC(sharedSecret, salt)` produces a 32-byte derived key.
3.  **Algo Selection**: The first byte of the HMAC determines which of the 12 ciphers is used.
4.  **Transformation**: The message is encrypted using the selected cipher and the derived key.
5.  **Noise injection**: Random 2-byte noise is appended to hide the exact message length.

---

## 🧪 Manual Verification Guide (Step-by-Step)

Follow these steps to verify the end-to-end security of CipherLayer:

### 1. Initial Setup
1.  Run `npm install` and `npm run dev`.
2.  Open **two separate browser windows** (or one incognito) at `http://localhost:3000`.
    *   Window A = **Alice**
    *   Window B = **Bob**

### 2. The Handshake (Key Exchange)
1.  **In Alice's Window**: Go to `Vault` -> `Establish New Link`. Enter "Alice". Proceed to Step 2. Click **Show My QR Code**.
2.  **In Bob's Window**: Go to `Vault` -> `Establish New Link`. Enter "Bob". Proceed to Step 2. Click **Scan Theirs**.
3.  (In local dev, you may need to grant camera permissions). Bob scans Alice's QR code.
4.  Once success shows: **Channel Established**. Alice and Bob now share a secret that only exists in their browser's IndexedDB.

### 3. Secure Messaging
1.  **Alice**: Go to `Encrypt`. Select "Bob" as recipient.
2.  Type: `This is a ghost protocol message.`
3.  Click **Encrypt & Generate**. Watch the typewriter animation seal the data.
4.  Click **Copy Ciphertext**.

### 4. Decryption & Auto-Wipe
1.  **Bob**: Go to `Decrypt`. Select "Alice" as the sender.
2.  Paste the ciphertext and click **Decrypt Now**.
3.  Watch the **scanline animation** reveal the original text.
4.  Notice the **Red Countdown Timer**. In 15 minutes, the plaintext will be wiped from existence. Click **Delete Now** to trigger it manually.

---

## ⚙️ Installation

```bash
# Clone and enter
git clone https://github.com/jogeshd/cipherlayer
cd cipherlayer

# Install with required dependencies
npm install

# Setup environment (See .env.local.example)
cp .env.local.example .env.local

# Launch the terminal
npm run dev
```

---
**LICENSE**: MIT. Built with zero-trust at its core.
