"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Save } from "lucide-react";
import { resetSection, saveSection, type ActionResult } from "@/app/admin/actions";
import ProfileEditor from "./ProfileEditor";
import ShowcaseEditor from "./ShowcaseEditor";
import SkillsEditor from "./SkillsEditor";
import type { ContentKey, ContentMap } from "@/lib/types";

type Props = {
  initial: ContentMap;
  overridden: Partial<Record<ContentKey, boolean>>;
  canSave: boolean;
};

const TABS: { key: ContentKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "projects", label: "Showcase" },
  { key: "skills", label: "Skills" },
];

export default function AdminEditor({ initial, overridden: initialOverridden, canSave }: Props) {
  const [tab, setTab] = useState<ContentKey>("profile");
  const [data, setData] = useState(initial);
  const [overridden, setOverridden] = useState(initialOverridden);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const update = <K extends ContentKey>(key: K, value: ContentMap[K]) => setData((d) => ({ ...d, [key]: value }));

  const run = (action: () => Promise<ActionResult>, nowOverridden: boolean) =>
    startTransition(async () => {
      setResult(null);
      const res = await action();
      setResult(res);
      if (res.ok && res.data) {
        update(tab, res.data as ContentMap[typeof tab]); // show the cleaned-up saved version
        setOverridden((o) => ({ ...o, [tab]: nowOverridden }));
      }
    });

  const save = () => run(() => saveSection(tab, data[tab]), true);

  const reset = () => {
    if (confirm("Discard in-app edits for this section and use the repository JSON file?")) {
      run(() => resetSection(tab), false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              setResult(null);
            }}
            className={tab === key ? "btn-primary" : "btn-outline"}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileEditor value={data.profile} onChange={(v) => update("profile", v)} />}
      {tab === "projects" && <ShowcaseEditor value={data.projects} onChange={(v) => update("projects", v)} />}
      {tab === "skills" && <SkillsEditor value={data.skills} onChange={(v) => update("skills", v)} />}

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-cat-line bg-cat-black/95 py-4">
        <button type="button" className="btn-primary" disabled={!canSave || pending} onClick={save}>
          <Save className="h-4 w-4" /> {pending ? "Working..." : "Save"}
        </button>
        {overridden[tab] && (
          <button type="button" className="btn-ghost" disabled={pending} onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset to repo JSON
          </button>
        )}
        {result && (
          <p role="status" className={result.ok ? "text-cat-yellow" : "text-red-300"}>
            {result.message}
          </p>
        )}
      </div>
    </div>
  );
}
