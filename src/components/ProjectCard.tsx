import { Award, ExternalLink, FolderCode } from "lucide-react";
import ImageGallery from "./ImageGallery";
import { GithubIcon } from "./BrandIcons";
import type { ShowcaseEntry } from "@/lib/types";

export default function ProjectCard({ entry }: { entry: ShowcaseEntry }) {
  const isAward = entry.type === "award";
  const TypeIcon = isAward ? Award : FolderCode;

  return (
    <article className="card flex h-full flex-col overflow-hidden transition-colors hover:border-cat-yellow">
      <ImageGallery images={entry.images} alt={entry.title} />

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cat-yellow">
          <TypeIcon className="h-4 w-4" aria-hidden />
          {isAward ? "Award" : "Project"}
        </p>
        <h2 className="mt-2 text-2xl">{entry.title}</h2>
        <p className="mt-2 flex-1 text-neutral-300">{entry.description}</p>

        {entry.tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies and tools">
            {entry.tech.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        )}

        {entry.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3 border-t border-cat-line pt-4">
            {entry.links.map((link) => {
              const LinkIcon = /github\.com/i.test(link.url) ? GithubIcon : ExternalLink;
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cat-yellow hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
