"use client";

import { useId } from "react";
import { Field, LinesField, ListEditor, Section } from "./fields";
import type { Link, ShowcaseEntry } from "@/lib/types";

type Props = { value: ShowcaseEntry[]; onChange: (value: ShowcaseEntry[]) => void };

const newEntry = (): ShowcaseEntry => ({
  id: `entry_${Date.now()}`,
  type: "project",
  title: "",
  description: "",
  tech: [],
  links: [],
  images: [],
});

// Links are edited as "Label | URL" lines to keep the form compact.
const linksToLines = (links: Link[]) => links.map((l) => (l.label ? `${l.label} | ${l.url}` : l.url));
const linesToLinks = (lines: string[]): Link[] =>
  lines.map((line) => {
    const [label, ...rest] = line.split("|");
    return rest.length ? { label: label.trim(), url: rest.join("|").trim() } : { label: "", url: line };
  });

function EntryFields({ entry, update }: { entry: ShowcaseEntry; update: (e: ShowcaseEntry) => void }) {
  const typeId = useId();
  return (
    <>
      <Field label="Title" value={entry.title} onChange={(title) => update({ ...entry, title })} />
      <div>
        <label className="label" htmlFor={typeId}>
          Type
        </label>
        <select
          id={typeId}
          value={entry.type}
          onChange={(e) => update({ ...entry, type: e.target.value as ShowcaseEntry["type"] })}
          className="input"
        >
          <option value="project">Project</option>
          <option value="award">Award</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" rows={3} value={entry.description} onChange={(description) => update({ ...entry, description })} />
      </div>
      <LinesField label="Technologies / tools" values={entry.tech} onChange={(tech) => update({ ...entry, tech })} />
      <LinesField
        label="Links"
        hint="One per line: Label | URL"
        values={linksToLines(entry.links)}
        onChange={(lines) => update({ ...entry, links: linesToLinks(lines) })}
      />
      <div className="sm:col-span-2">
        <LinesField
          label="Screenshots"
          hint="One path or URL per line, e.g. /images/my_project.png"
          values={entry.images}
          onChange={(images) => update({ ...entry, images })}
        />
      </div>
    </>
  );
}

export default function ShowcaseEditor({ value, onChange }: Props) {
  return (
    <Section title="Showcase entries" addLabel="Add entry" onAdd={() => onChange([...value, newEntry()])}>
      <ListEditor items={value} onChange={onChange} render={(entry, update) => <EntryFields entry={entry} update={update} />} />
    </Section>
  );
}
