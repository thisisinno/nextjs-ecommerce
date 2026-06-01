"use client";

import Image, { ImageProps } from "next/image";
import { useRef, useState } from "react";
import { updateContentBlock } from "@/lib/api/content";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { ApiContentBlock } from "@/types/content";
import { useEditMode } from "./EditModeProvider";
import MediaEditModal from "./MediaEditModal";

export default function EditableImage({ block, ...props }: ImageProps & { block?: ApiContentBlock }) {
  const { isAdmin, editMode } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload } = useMediaUpload();

  const src = block?.media_detail?.file_url || block?.value || props.src;

  const alt = props.alt ?? block?.media_detail?.alt_text ?? "";

  return (
    <span className="relative inline-block">
      <Image {...props} src={src} alt={alt} />
      {isAdmin && editMode && block && (
        <>
          <button type="button" onClick={() => inputRef.current?.click()} className="absolute right-2 top-2 rounded bg-blue px-2 py-1 text-custom-xs text-white shadow-1">
            Edit
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
          {selectedFile && (
            <MediaEditModal
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onSave={async (file, metadata) => {
                const media = await upload(file, metadata);
                await updateContentBlock(block.id, { media: media.id, value: media.file_url || media.file });
                setSelectedFile(null);
              }}
            />
          )}
        </>
      )}
    </span>
  );
}
