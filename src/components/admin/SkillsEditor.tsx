"use client";

import { useId } from "react";
import { Field, LinesField, ListEditor, Section } from "./fields";
import { MAX_SKILL_LEVEL, type Skill, type Skills } from "@/lib/types";

type Props = { value: Skills; onChange: (value: Skills) => void };

const LEVELS = Array.from({ length: MAX_SKILL_LEVEL }, (_, i) => i + 1);

function SkillFields({ skill, update }: { skill: Skill; update: (s: Skill) => void }) {
  const levelId = useId();
  return (
    <>
      <Field label="Skill" value={skill.name} onChange={(name) => update({ ...skill, name })} />
      <Field label="Category" value={skill.category} placeholder="Languages" onChange={(category) => update({ ...skill, category })} />
      <div>
        <label className="label" htmlFor={levelId}>
          Proficiency (1–{MAX_SKILL_LEVEL})
        </label>
        <select
          id={levelId}
          value={skill.level}
          onChange={(e) => update({ ...skill, level: Number(e.target.value) })}
          className="input"
        >
          {LEVELS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default function SkillsEditor({ value, onChange }: Props) {
  const setTools = (key: keyof Skills["tools"], items: string[]) =>
    onChange({ ...value, tools: { ...value.tools, [key]: items } });

  return (
    <div className="space-y-6">
      <Section
        title="Technical skills"
        addLabel="Add skill"
        onAdd={() => onChange({ ...value, technical: [...value.technical, { name: "", category: "", level: 1 }] })}
      >
        <ListEditor
          items={value.technical}
          onChange={(technical) => onChange({ ...value, technical })}
          render={(skill, update) => <SkillFields skill={skill} update={update} />}
        />
      </Section>

      <Section title="Tools & technologies">
        <div className="grid gap-4 sm:grid-cols-2">
          <LinesField label="Tools I know" values={value.tools.known} onChange={(items) => setTools("known", items)} />
          <LinesField label="Currently learning" values={value.tools.learning} onChange={(items) => setTools("learning", items)} />
        </div>
      </Section>
    </div>
  );
}
