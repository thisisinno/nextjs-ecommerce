"use client";

import React, { ElementType, KeyboardEvent, useEffect, useState } from "react";
import { ApiContentBlock } from "@/types/content";
import { upsertContentBlock } from "@/lib/api/content";
import { useEditMode } from "./EditModeProvider";

type EditableTextProps = {
  as?: ElementType;
  block?: ApiContentBlock | null;
  value?: string;
  fallback?: string;
  pageSlug: string;
  pageTitle?: string;
  sectionKey: string;
  sectionTitle?: string;
  contentKey: string;
  contentType?: "title" | "subtitle" | "caption" | "text" | "button" | "price" | "label" | "rich_text";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
  blockId?: number | null;
};

export default function EditableText({
  as: Component = "span",
  block,
  blockId,
  value,
  fallback,
  contentKey,
  sectionKey,
  sectionTitle,
  pageSlug,
  pageTitle,
  contentType = "text",
  className,
  children,
  placeholder,
  multiline = false,
}: EditableTextProps) {
  const { isAdmin, editMode } = useEditMode();
  const initialValue = block?.value || value || fallback || (typeof children === "string" ? children : "") || placeholder || "";
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentBlockId, setCurrentBlockId] = useState<number | null>(block?.id ?? blockId ?? null);

  useEffect(() => {
    const nextValue = block?.value || value || fallback || (typeof children === "string" ? children : "") || placeholder || "";
    setDisplayValue(nextValue);
    setDraft(nextValue);
    setCurrentBlockId(block?.id ?? blockId ?? null);
  }, [block, blockId, children, fallback, placeholder, value]);

  const renderedValue = displayValue || placeholder || "";
  const editable = isAdmin && editMode;

  const save = async () => {
    const previousValue = displayValue;
    const nextValue = draft.trim();
    if (nextValue === previousValue) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setError("");
    setDisplayValue(nextValue);
    try {
      const updated = await upsertContentBlock({
        blockId: currentBlockId,
        pageSlug,
        pageTitle,
        sectionKey,
        sectionTitle,
        key: contentKey,
        content_type: contentType,
        value: nextValue,
        metadata: block?.metadata ?? {},
      });
      setCurrentBlockId(updated.id);
      setDisplayValue(updated.value || nextValue);
      setDraft(updated.value || nextValue);
      setEditing(false);
    } catch {
      setDisplayValue(previousValue);
      setDraft(previousValue);
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      setDraft(displayValue);
      setEditing(false);
      setError("");
    }
    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      save();
    }
  };

  if (!editable) {
    return <Component className={className}>{children ?? renderedValue}</Component>;
  }

  if (editing) {
    return (
      <Component className={className}>
        <span className="inline-flex max-w-full flex-col gap-2 align-baseline">
          {multiline ? (
            <textarea
              className="min-h-[90px] w-full min-w-[260px] rounded-md border border-blue bg-white px-3 py-2 text-dark shadow-1 outline-none"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
            />
          ) : (
            <input
              className="w-full min-w-[220px] rounded-md border border-blue bg-white px-3 py-1.5 text-dark shadow-1 outline-none"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
            />
          )}
          <span className="inline-flex items-center gap-2">
            <button type="button" onClick={save} disabled={saving} className="rounded bg-blue px-3 py-1 text-custom-xs font-medium text-white disabled:opacity-60">
              {saving ? "Saving" : "Save"}
            </button>
            <button type="button" onClick={() => { setDraft(displayValue); setEditing(false); setError(""); }} className="rounded bg-gray-2 px-3 py-1 text-custom-xs font-medium text-dark">
              Cancel
            </button>
          </span>
          {error && <span className="text-custom-xs text-red">{error}</span>}
        </span>
      </Component>
    );
  }

  return (
    <Component
      className={`${className ?? ""} cursor-text transition outline-1 outline-dashed outline-transparent hover:outline-blue/60`}
      title="Double-click to edit"
      onDoubleClick={(event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
      }}
    >
      {renderedValue}
      {error && <span className="ml-2 text-custom-xs text-red">{error}</span>}
    </Component>
  );
}
