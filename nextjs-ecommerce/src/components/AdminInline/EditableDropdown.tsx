"use client";

import { createFilterOption } from "@/lib/api/filters";
import { ApiFilterGroup } from "@/types/filter";
import { useEditMode } from "./EditModeProvider";

export default function EditableDropdown({
  group,
  children,
  onCreated,
}: {
  group?: ApiFilterGroup;
  children: React.ReactNode;
  onCreated?: () => void;
}) {
  const { isAdmin, editMode } = useEditMode();

  const addOption = async () => {
    if (!group) return;
    const label = window.prompt("New dropdown item label");
    if (!label) return;
    const value = window.prompt("Value/slug", label.toLowerCase().replace(/\s+/g, "-"));
    await createFilterOption({
      filter_group: group.id,
      label,
      value: value || label.toLowerCase().replace(/\s+/g, "-"),
      order: group.options.length,
      is_active: true,
    });
    onCreated?.();
  };

  return (
    <div className="relative">
      {children}
      {isAdmin && editMode && group && (
        <button type="button" onClick={addOption} className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue text-white text-sm shadow-1">
          +
        </button>
      )}
    </div>
  );
}
