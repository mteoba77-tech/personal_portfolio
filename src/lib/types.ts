export type TimelineEntry = {
  role: string;
  organization: string;
  period: string;
  details: string;
};

export type Profile = {
  name: string;
  title: string;
  company: string;
  location: string;
  photo: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  work: TimelineEntry[];
  education: TimelineEntry[];
};

export type Link = { label: string; url: string };

export type ShowcaseEntry = {
  id: string;
  type: "project" | "award";
  title: string;
  description: string;
  tech: string[];
  links: Link[];
  images: string[];
};

export type Skill = { name: string; level: number; category: string };

export type Skills = {
  technical: Skill[];
  tools: { known: string[]; learning: string[] };
};

export type ContentMap = {
  profile: Profile;
  projects: ShowcaseEntry[];
  skills: Skills;
};

export type ContentKey = keyof ContentMap;

export const CONTENT_KEYS: ContentKey[] = ["profile", "projects", "skills"];

export const MAX_SKILL_LEVEL = 5;
