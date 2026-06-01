"use client";

import { ElementType, useState } from "react";
import { ApiContentBlock } from "@/types/content";
import { updateContentBlock } from "@/lib/api/content";
import { useEditMode } from "./EditModeProvider";

type EditableTextProps = {
  as?: ElementType;
  block?: ApiContentBlock;
  fallback: string;
  className?: string;
};

export default function EditableText({ as: Component = "span", block, fallback, className }: EditableTextProps) {
  const { isAdmin, editMode } = useEditMode();
  const [value, setValue] = useState(block?.value || fallback);
  const [saving, setSaving] = useState(false);

  if (!isAdmin || !editMode || !block) {
    return <Component className={className}>{block?.value || fallback}</Component>;
  }

  return (
    <Component className={className}>
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={async (event) => {
          const nextValue = event.currentTarget.textContent || "";
          if (nextValue === value) return;
          setSaving(true);
          try {
            await updateContentBlock(block.id, { value: nextValue });
            setValue(nextValue);
          } finally {
            setSaving(false);
          }
        }}
        className="outline outline-1 outline-blue/40 rounded-[3px]"
      >
        {value}
      </span>
      {saving && <span className="ml-2 text-custom-xs text-dark-4">Saving</span>}
    </Component>
  );
}
