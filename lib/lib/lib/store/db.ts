import { openDB, IDBPDatabase } from "idb";

/**
 * Secure Local Storage (IndexedDB)
 * Stores keys and contact info locally.
 */

const DB_NAME = "cipherlayer_db";
const DB_VERSION = 1;

export interface Contact {
  id: string;
  name: string;
  sharedSecret: Uint8Array;
  addedAt: number;
  expiresAt: number;
}

export interface AppState {
  publicKey: string;
  privateKey: any; // Stored as JWK or similar
}

let db: IDBPDatabase | null = null;

export async function getDB() {
  if (db) return db;
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("contacts", { keyPath: "id" });
      db.createObjectStore("settings");
    },
  });
  return db;
}

export async function saveContact(contact: Contact) {
  const db = await getDB();
  await db.put("contacts", contact);
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDB();
  return await db.getAll("contacts");
}

export async function deleteContact(id: string) {
  const db = await getDB();
  await db.delete("contacts", id);
}

export async function wipeAllData() {
  const db = await getDB();
  await db.clear("contacts");
  await db.clear("settings");
}
