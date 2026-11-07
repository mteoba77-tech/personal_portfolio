import type { LucideIcon } from "lucide-react";
import type { TimelineEntry } from "@/lib/types";

type Props = { title: string; icon: LucideIcon; entries: TimelineEntry[] };

export default function Timeline({ title, icon: Icon, entries }: Props) {
  return (
    <div className="card p-6">
      <h2 className="mb-6 flex items-center gap-3 text-2xl">
        <Icon className="h-6 w-6 text-cat-yellow" aria-hidden />
        {title}
      </h2>
      <ol className="space-y-6 border-l-2 border-cat-yellow/60 pl-6">
        {entries.map((entry) => (
          <li key={`${entry.role}-${entry.period}`} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rotate-45 bg-cat-yellow" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-cat-yellow">{entry.period}</p>
            <h3 className="mt-1 font-sans text-lg font-semibold normal-case tracking-normal">{entry.role}</h3>
            <p className="text-sm text-cat-gray">{entry.organization}</p>
            {entry.details && <p className="mt-2 text-sm text-neutral-300">{entry.details}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
