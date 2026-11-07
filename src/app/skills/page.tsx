import type { Metadata } from "next";
import { BookOpen, CircleCheck, Cpu } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import SkillBar from "@/components/SkillBar";
import { getSkills } from "@/lib/content";
import type { Skill } from "@/lib/types";

export const metadata: Metadata = { title: "Skills" };

function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category || "Other";
    groups.set(key, [...(groups.get(key) ?? []), skill]);
  }
  return [...groups];
}

export default async function SkillsPage() {
  const { technical, tools } = await getSkills();

  const toolGroups = [
    { title: "Tools I Know", icon: CircleCheck, items: tools.known, chipClass: "chip" },
    {
      title: "Currently Learning",
      icon: BookOpen,
      items: tools.learning,
      chipClass: "chip border-cat-yellow/60 text-cat-yellow",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="Toolbox"
        intro="Technical skills with my current proficiency, plus the tools I use and the ones I'm learning."
      />

      <section className="container-page py-12">
        <h2 className="mb-6 flex items-center gap-3 text-3xl">
          <Cpu className="h-7 w-7 text-cat-yellow" aria-hidden /> Technical Skills
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupByCategory(technical).map(([category, skills], i) => (
            <FadeIn key={category} delay={i * 0.08} className="card p-6">
              <h3 className="mb-5 border-b border-cat-line pb-2 text-xl text-cat-yellow">{category}</h3>
              <ul className="space-y-5">
                {skills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-6 md:grid-cols-2">
        {toolGroups.map(({ title, icon: Icon, items, chipClass }) => (
          <FadeIn key={title} className="card p-6">
            <h2 className="mb-5 flex items-center gap-3 text-2xl">
              <Icon className="h-6 w-6 text-cat-yellow" aria-hidden /> {title}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className={`${chipClass} px-4 py-1.5 text-sm`}>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </section>
    </>
  );
}
