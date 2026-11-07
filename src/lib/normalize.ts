// Cleans up data coming from the admin editor before it is saved,
// so stored content always matches the types in ./types.

import { MAX_SKILL_LEVEL, type ContentKey, type ContentMap, type Link, type Profile, type ShowcaseEntry, type Skills, type TimelineEntry } from "./types";

type Loose = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): Loose => (v && typeof v === "object" ? (v as Loose) : {});
const strList = (v: unknown): string[] => arr(v).map(str).filter(Boolean);

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "entry";
}

function timeline(v: unknown): TimelineEntry[] {
  return arr(v)
    .map(obj)
    .map((e) => ({ role: str(e.role), organization: str(e.organization), period: str(e.period), details: str(e.details) }))
    .filter((e) => e.role || e.organization);
}

function links(v: unknown): Link[] {
  return arr(v)
    .map(obj)
    .map((l) => ({ label: str(l.label) || "Link", url: str(l.url) }))
    .filter((l) => l.url);
}

function profile(v: unknown): Profile {
  const p = obj(v);
  return {
    name: str(p.name),
    title: str(p.title),
    company: str(p.company),
    location: str(p.location),
    photo: str(p.photo),
    bio: str(p.bio),
    email: str(p.email),
    linkedin: str(p.linkedin),
    github: str(p.github),
    work: timeline(p.work),
    education: timeline(p.education),
  };
}

function projects(v: unknown): ShowcaseEntry[] {
  const seen = new Set<string>();
  return arr(v)
    .map(obj)
    .filter((e) => str(e.title))
    .map((e) => {
      let id = slug(str(e.id) || str(e.title));
      while (seen.has(id)) id += "_";
      seen.add(id);
      return {
        id,
        type: e.type === "award" ? "award" : "project",
        title: str(e.title),
        description: str(e.description),
        tech: strList(e.tech),
        links: links(e.links),
        images: strList(e.images),
      };
    });
}

function skills(v: unknown): Skills {
  const s = obj(v);
  const tools = obj(s.tools);
  return {
    technical: arr(s.technical)
      .map(obj)
      .filter((k) => str(k.name))
      .map((k) => ({
        name: str(k.name),
        category: str(k.category) || "Other",
        level: Math.min(Math.max(Math.round(Number(k.level) || 1), 1), MAX_SKILL_LEVEL),
      })),
    tools: { known: strList(tools.known), learning: strList(tools.learning) },
  };
}

const normalizers: { [K in ContentKey]: (v: unknown) => ContentMap[K] } = { profile, projects, skills };

export function normalize<K extends ContentKey>(key: K, value: unknown): ContentMap[K] {
  return normalizers[key](value);
}
