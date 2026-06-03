"use client";

import Image, { ImageProps } from "next/image";
import { useRef, useState } from "react";
import { upsertContentBlock } from "@/lib/api/content";
import { uploadMedia } from "@/lib/api/media";
import { ApiContentBlock } from "@/types/content";
import { useEditMode } from "./EditModeProvider";

type EditableImageProps = ImageProps & {
  block?: ApiContentBlock | null;
  blockId?: number | null;
  pageSlug: string;
  pageTitle?: string;
  sectionKey: string;
  sectionTitle?: string;
  contentKey: string;
  caption?: string;
};

export default function EditableImage({
  block,
  blockId = null,
  pageSlug,
  pageTitle,
  sectionKey,
  sectionTitle,
  contentKey,
  caption,
  ...props
}: EditableImageProps) {
  const { isAdmin, editMode } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<ImageProps["src"]>(block?.media_detail?.file_url || block?.value || props.src);
  const [altText, setAltText] = useState(String(props.alt ?? block?.media_detail?.alt_text ?? ""));
  const [draftAlt, setDraftAlt] = useState(altText);
  const [draftCaption, setDraftCaption] = useState(caption || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentBlockId, setCurrentBlockId] = useState<number | null>(block?.id ?? blockId);

  const editable = isAdmin && editMode;

  const openEditor = () => inputRef.current?.click();

  const onFileChange = (file: File | null) => {
    setSelectedFile(file);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const save = async () => {
    if (!contentKey || !selectedFile) return;
    const previousSrc = src;
    setSaving(true);
    setError("");
    try {
      const media = await uploadMedia(selectedFile, { alt_text: draftAlt, caption: draftCaption });
      const updated = await upsertContentBlock({
        blockId: currentBlockId,
        pageSlug,
        pageTitle,
        sectionKey,
        sectionTitle,
        key: contentKey,
        content_type: "image",
        value: media.file_url || media.file,
        media: media.id,
        metadata: { alt: draftAlt, caption: draftCaption },
      });
      setCurrentBlockId(updated.id);
      setSrc(updated.media_detail?.file_url || updated.value || media.file_url || media.file);
      setAltText(draftAlt);
      setSelectedFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
    } catch {
      setSrc(previousSrc);
      setError("Could not save image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <span
      className="group relative inline-block"
      onDoubleClick={(event) => {
        if (!editable) return;
        event.preventDefault();
        event.stopPropagation();
        openEditor();
      }}
      title={editable ? "Double-click to edit image" : undefined}
    >
      <Image {...props} src={src} alt={altText} />
      {editable && (
        <>
          <button type="button" onClick={openEditor} className="absolute right-2 top-2 hidden rounded bg-dark/80 px-2 py-1 text-custom-xs font-medium text-white shadow-1 group-hover:block">
            Edit image
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
        </>
      )}
      {selectedFile && (
        <span className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark/50 px-4">
          <span className="w-full max-w-[420px] rounded-lg bg-white p-5 shadow-2">
            <span className="mb-4 block text-lg font-semibold text-dark">Edit image</span>
            {preview && <img src={preview} alt="" className="mb-4 max-h-[220px] w-full rounded object-contain" />}
            <label className="mb-2 block text-custom-xs font-medium text-dark">Alt text</label>
            <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 text-custom-sm text-dark outline-none focus:border-blue" value={draftAlt} onChange={(event) => setDraftAlt(event.target.value)} />
            <label className="mb-2 block text-custom-xs font-medium text-dark">Caption</label>
            <input className="mb-4 w-full rounded border border-gray-3 px-3 py-2 text-custom-sm text-dark outline-none focus:border-blue" value={draftCaption} onChange={(event) => setDraftCaption(event.target.value)} />
            <span className="flex items-center gap-2">
              <button type="button" disabled={saving} onClick={save} className="rounded bg-blue px-4 py-2 text-custom-sm font-medium text-white disabled:opacity-60">{saving ? "Saving" : "Save"}</button>
              <button type="button" onClick={() => onFileChange(null)} className="rounded bg-gray-2 px-4 py-2 text-custom-sm font-medium text-dark">Cancel</button>
            </span>
            {error && <span className="mt-3 block text-custom-xs text-red">{error}</span>}
          </span>
        </span>
      )}
    </span>
  );
}
