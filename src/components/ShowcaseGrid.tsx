"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import type { ShowcaseEntry } from "@/lib/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "project", label: "Projects" },
  { value: "award", label: "Awards" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

export default function ShowcaseGrid({ entries }: { entries: ShowcaseEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter entries">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={filter === value ? "btn-primary" : "btn-outline"}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProjectCard entry={entry} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && <p className="text-cat-gray">Nothing here yet.</p>}
    </>
  );
}
