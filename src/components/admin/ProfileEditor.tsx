"use client";

import { Field, ListEditor, Section } from "./fields";
import type { Profile, TimelineEntry } from "@/lib/types";

type Props = { value: Profile; onChange: (value: Profile) => void };

const BASIC_FIELDS: { key: keyof Profile; label: string; type?: string }[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Job title / position" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "email", label: "Email", type: "email" },
  { key: "photo", label: "Photo path or URL (e.g. /images/profile.jpg)" },
  { key: "linkedin", label: "LinkedIn URL", type: "url" },
  { key: "github", label: "GitHub URL", type: "url" },
];

const EMPTY_ENTRY: TimelineEntry = { role: "", organization: "", period: "", details: "" };

function TimelineFields({ entry, update }: { entry: TimelineEntry; update: (e: TimelineEntry) => void }) {
  return (
    <>
      <Field label="Role / degree" value={entry.role} onChange={(role) => update({ ...entry, role })} />
      <Field label="Organization / school" value={entry.organization} onChange={(organization) => update({ ...entry, organization })} />
      <Field label="Period" value={entry.period} placeholder="2020 – Present" onChange={(period) => update({ ...entry, period })} />
      <Field label="Details" value={entry.details} onChange={(details) => update({ ...entry, details })} />
    </>
  );
}

export default function ProfileEditor({ value, onChange }: Props) {
  const set = <K extends keyof Profile>(key: K, v: Profile[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          {BASIC_FIELDS.map(({ key, label, type }) => (
            <Field key={key} label={label} type={type} value={value[key] as string} onChange={(v) => set(key, v)} />
          ))}
        </div>
        <Field label="Short bio" rows={4} value={value.bio} onChange={(v) => set("bio", v)} />
      </Section>

      {(["work", "education"] as const).map((key) => (
        <Section
          key={key}
          title={key === "work" ? "Work history" : "Education"}
          addLabel="Add entry"
          onAdd={() => set(key, [...value[key], { ...EMPTY_ENTRY }])}
        >
          <ListEditor
            items={value[key]}
            onChange={(items) => set(key, items)}
            render={(entry, update) => <TimelineFields entry={entry} update={update} />}
          />
        </Section>
      ))}
    </div>
  );
}
