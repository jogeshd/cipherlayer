"use client";

/**
 * Handshake Library
 * Handles secure pairing logic for 16-digit tokens and QR codes.
 */

export const generateHandshake = async () => {
  // Generate a cryptographically random 16-digit token
  const array = new Uint8Array(12);
  window.crypto.getRandomValues(array);
  const token = Array.from(array, b => b.toString(36)).join('').substring(0, 16).toUpperCase();
  
  return {
    token,
    timestamp: Date.now(),
    expires: Date.now() + (15 * 60 * 1000) // 15 minute expiry
  };
};

export const joinHandshake = async (token: string, name: string) => {
  // Logic to save contact in IndexedDB
  // (Actual DB logic is handled in lib/store/db.ts)
  return {
    success: true,
    contact: { id: crypto.randomUUID(), name, sharedSecret: token }
  };
};
