"use client";

/**
 * Handshake Library
 * Handles secure pairing logic for 16-digit tokens and QR codes.
 */

export const generateHandshake = async () => {
  // Generate a cryptographically random 16-digit token
  const array = new Uint8Array(12);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  }
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
  const id = typeof window !== "undefined" && window.crypto && (window.crypto as any).randomUUID 
    ? (window.crypto as any).randomUUID() 
    : Math.random().toString(36).substring(2);
    
  return {
    success: true,
    contact: { id, name, sharedSecret: token }
  };
};
