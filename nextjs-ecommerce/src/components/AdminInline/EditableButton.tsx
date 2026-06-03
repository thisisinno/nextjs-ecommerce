"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { upsertContentBlock } from "@/lib/api/content";
import { useEditMode } from "./EditModeProvider";

type EditableButtonProps = {
  label?: string;
  href?: string;
  contentKey: string;
  blockId?: number | null;
  pageSlug?: string;
  sectionKey?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function EditableButton({
  label,
  href = "#",
  contentKey,
  blockId = null,
  pageSlug,
  sectionKey,
  className,
  children,
}: EditableButtonProps) {
  const { isAdmin, editMode } = useEditMode();
  const [text, setText] = useState(label || (typeof children === "string" ? children : "") || "");
  const [link, setLink] = useState(href);
  const [draftText, setDraftText] = useState(text);
  const [draftLink, setDraftLink] = useState(link);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentBlockId, setCurrentBlockId] = useState<number | null>(blockId);

  useEffect(() => {
    setText(label || (typeof children === "string" ? children : "") || "");
    setLink(href);
  }, [children, href, label]);

  const save = async () => {
    const previousText = text;
    const previousLink = link;
    setSaving(true);
    setError("");
    setText(draftText);
    setLink(draftLink);
    try {
      const updated = await upsertContentBlock({
        blockId: currentBlockId,
        pageSlug,
        sectionKey,
        key: contentKey,
        content_type: "button",
        value: draftText,
        metadata: { href: draftLink },
      });
      setCurrentBlockId(updated.id);
      setText(updated.value || draftText);
      const metadataHref = typeof updated.metadata?.href === "string" ? updated.metadata.href : draftLink;
      setLink(metadataHref);
      setEditing(false);
    } catch {
      setText(previousText);
      setLink(previousLink);
      setError("Could not save button.");
    } finally {
      setSaving(false);
    }
  };

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isAdmin && editMode) event.preventDefault();
  };

  return (
    <span className={editing ? "relative inline-flex" : "contents"}>
      <Link
        href={link}
        onClick={onClick}
        onDoubleClick={(event) => {
          if (!isAdmin || !editMode) return;
          event.preventDefault();
          event.stopPropagation();
          setDraftText(text);
          setDraftLink(link);
          setEditing(true);
        }}
        title={isAdmin && editMode ? "Double-click to edit" : undefined}
        className={`${className ?? ""} ${isAdmin && editMode ? "outline-1 outline-dashed outline-transparent hover:outline-blue/60" : ""}`}
      >
        {text}
      </Link>
      {editing && (
        <span className="absolute left-0 top-full z-[10000] mt-2 w-[280px] rounded-md border border-gray-3 bg-white p-3 text-left shadow-2">
          <label className="mb-2 block text-custom-xs font-medium text-dark">Button text</label>
          <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 text-custom-sm text-dark outline-none focus:border-blue" value={draftText} onChange={(event) => setDraftText(event.target.value)} autoFocus />
          <label className="mb-2 block text-custom-xs font-medium text-dark">Button link</label>
          <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 text-custom-sm text-dark outline-none focus:border-blue" value={draftLink} onChange={(event) => setDraftLink(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") save(); if (event.key === "Escape") setEditing(false); }} />
          <span className="flex items-center gap-2">
            <button type="button" disabled={saving} onClick={save} className="rounded bg-blue px-3 py-1.5 text-custom-xs font-medium text-white disabled:opacity-60">{saving ? "Saving" : "Save"}</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded bg-gray-2 px-3 py-1.5 text-custom-xs font-medium text-dark">Cancel</button>
          </span>
          {error && <span className="mt-2 block text-custom-xs text-red">{error}</span>}
        </span>
      )}
    </span>
  );
}
