"use client";

import { ReactNode } from "react";
import { useEditMode } from "./EditModeProvider";

export default function InlineEditToolbar({
  children,
  onSave,
  onCancel,
}: {
  children?: ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const { editMode, isAdmin } = useEditMode();
  if (!isAdmin || !editMode) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded bg-white shadow-1 border border-gray-3 px-2 py-1 text-custom-xs text-dark">
      {children}
      {onSave && (
        <button type="button" onClick={onSave} className="text-blue">
          Save
        </button>
      )}
      {onCancel && (
        <button type="button" onClick={onCancel} className="text-dark-4">
          Cancel
        </button>
      )}
    </span>
  );
}
