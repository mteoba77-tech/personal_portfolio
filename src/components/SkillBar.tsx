import { MAX_SKILL_LEVEL, type Skill } from "@/lib/types";

const LEVEL_LABELS = ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"];

export default function SkillBar({ skill }: { skill: Skill }) {
  const level = Math.min(Math.max(Math.round(skill.level), 1), MAX_SKILL_LEVEL);
  const label = LEVEL_LABELS[level - 1];

  return (
    <li>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="font-semibold">{skill.name}</span>
        <span className="text-xs uppercase tracking-wider text-cat-gray">{label}</span>
      </div>
      <div
        className="flex gap-1"
        role="meter"
        aria-label={`${skill.name} proficiency`}
        aria-valuemin={1}
        aria-valuemax={MAX_SKILL_LEVEL}
        aria-valuenow={level}
        aria-valuetext={label}
      >
        {Array.from({ length: MAX_SKILL_LEVEL }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 -skew-x-12 ${i < level ? "bg-cat-yellow" : "bg-cat-steel"}`}
          />
        ))}
      </div>
    </li>
  );
}
