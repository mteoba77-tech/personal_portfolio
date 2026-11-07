import { Firestore } from "@google-cloud/firestore";

let client: Firestore | null = null;

export function firestoreEnabled(): boolean {
  return process.env.USE_FIRESTORE === "true";
}

/** Returns a shared Firestore client, or null when Firestore is turned off. */
export function getFirestore(): Firestore | null {
  if (!firestoreEnabled()) return null;
  client ??= new Firestore({ ignoreUndefinedProperties: true });
  return client;
}
