"use client";

import { ReactNode } from "react";
import { useEditMode } from "./EditModeProvider";

export default function EditableRepeater({
  children,
  onAdd,
}: {
  children: ReactNode;
  onAdd?: () => void;
}) {
  const { isAdmin, editMode } = useEditMode();
  return (
    <div className="relative">
      {children}
      {isAdmin && editMode && onAdd && (
        <button type="button" onClick={onAdd} className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue text-white shadow-1">
          +
        </button>
      )}
    </div>
  );
}
