import { readFile } from "fs/promises";
import path from "path";
import { getFirestore } from "./firestore";
import type { ContentKey, ContentMap, Profile, ShowcaseEntry, Skills } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const COLLECTION = "content";

async function readJsonFile<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const raw = await readFile(path.join(CONTENT_DIR, `${key}.json`), "utf8");
  return JSON.parse(raw) as ContentMap[K];
}

/**
 * Content saved from the admin page lives in Firestore and takes priority.
 * Otherwise the JSON files in /content (edited in VS Code) are used.
 */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const db = getFirestore();
  if (db) {
    try {
      const snap = await db.collection(COLLECTION).doc(key).get();
      if (snap.exists) return snap.get("data") as ContentMap[K];
    } catch (error) {
      console.error(`Firestore read failed for "${key}", using JSON file.`, error);
    }
  }
  return readJsonFile(key);
}

export async function hasOverride(key: ContentKey): Promise<boolean> {
  const db = getFirestore();
  if (!db) return false;
  const snap = await db.collection(COLLECTION).doc(key).get();
  return snap.exists;
}

export async function saveContent<K extends ContentKey>(key: K, data: ContentMap[K]): Promise<void> {
  const db = getFirestore();
  if (!db) throw new Error("Firestore is not enabled (set USE_FIRESTORE=true).");
  await db.collection(COLLECTION).doc(key).set({ data, updatedAt: new Date() });
}

/** Removes the Firestore copy so the repo's JSON file is used again. */
export async function resetContent(key: ContentKey): Promise<void> {
  const db = getFirestore();
  if (!db) throw new Error("Firestore is not enabled (set USE_FIRESTORE=true).");
  await db.collection(COLLECTION).doc(key).delete();
}

export const getProfile = (): Promise<Profile> => getContent("profile");
export const getProjects = (): Promise<ShowcaseEntry[]> => getContent("projects");
export const getSkills = (): Promise<Skills> => getContent("skills");
