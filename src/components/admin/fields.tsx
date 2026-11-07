"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

// ---------- List helpers ----------

export const replaceAt = <T,>(list: T[], index: number, item: T): T[] =>
  list.map((existing, i) => (i === index ? item : existing));

export const removeAt = <T,>(list: T[], index: number): T[] => list.filter((_, i) => i !== index);

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

// ---------- Inputs ----------

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  type?: string;
};

export function Field({ label, value, onChange, rows, placeholder, type = "text" }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input" />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input" />
      )}
    </div>
  );
}

/** Edits a string[] as one item per line. Empty lines are removed on save. */
export function LinesField({
  label,
  values,
  onChange,
  hint = "One per line",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
}) {
  return (
    <Field
      label={`${label} (${hint.toLowerCase()})`}
      rows={Math.max(3, values.length + 1)}
      value={values.join("\n")}
      onChange={(text) => onChange(text.split("\n"))}
    />
  );
}

// ---------- Layout ----------

export function Section({ title, children, onAdd, addLabel }: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <fieldset className="card space-y-4 p-5">
      <legend className="px-2 font-display text-xl uppercase text-cat-yellow">{title}</legend>
      {children}
      {onAdd && (
        <button type="button" onClick={onAdd} className="btn-outline">
          <Plus className="h-4 w-4" /> {addLabel ?? "Add"}
        </button>
      )}
    </fieldset>
  );
}

/** A removable, reorderable row inside a list editor. */
export function Row({ children, onRemove, onMove }: {
  children: React.ReactNode;
  onRemove: () => void;
  onMove: (delta: number) => void;
}) {
  const iconButton = "rounded p-1.5 text-cat-gray hover:bg-cat-steel hover:text-cat-yellow";
  return (
    <div className="rounded-lg border border-cat-line bg-cat-black/40 p-4">
      <div className="mb-3 flex justify-end gap-1">
        <button type="button" onClick={() => onMove(-1)} className={iconButton} aria-label="Move up">
          <ArrowUp className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => onMove(1)} className={iconButton} aria-label="Move down">
          <ArrowDown className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRemove} className={`${iconButton} hover:text-red-400`} aria-label="Remove">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/** Wires a list of items to Row components with replace / remove / move handlers. */
export function ListEditor<T>({ items, onChange, render }: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (item: T) => void) => React.ReactNode;
}) {
  return (
    <>
      {items.map((item, i) => (
        <Row key={i} onRemove={() => onChange(removeAt(items, i))} onMove={(d) => onChange(moveItem(items, i, d))}>
          {render(item, (next) => onChange(replaceAt(items, i, next)))}
        </Row>
      ))}
    </>
  );
}
