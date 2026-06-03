"use client";

import { useEditMode } from "./EditModeProvider";

export default function AdminBottomNav() {
  const { isAdmin, editMode, toggleEditMode, logout } = useEditMode();
  if (!isAdmin) return null;

  return (
    <>
      {editMode && (
        <div className="fixed bottom-20 left-1/2 z-[9999] -translate-x-1/2 rounded-md bg-dark px-4 py-2 text-custom-sm font-medium text-white shadow-2">
          Edit mode is ON - double-click content to edit
        </div>
      )}
      <nav className="fixed bottom-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-gray-3 bg-white px-3 py-2 shadow-2">
        <button type="button" onClick={toggleEditMode} className={`rounded-[5px] px-3 py-2 text-custom-sm ${editMode ? "bg-blue text-white" : "bg-gray-1 text-dark"}`}>
          Edit Mode
        </button>
        {[
          ["Products", "/admin/products"],
          ["Categories", "/admin/categories"],
          ["Orders", "/my-account?admin=orders"],
          ["Analytics", "/my-account?admin=analytics"],
          ["Content", "/my-account?admin=content"],
          ["Media", "/my-account?admin=media"],
        ].map(([item, href]) => (
          <a key={item} href={href} className="rounded-[5px] px-3 py-2 text-custom-sm text-dark hover:bg-gray-1">
            {item}
          </a>
        ))}
        <button type="button" onClick={logout} className="rounded-[5px] px-3 py-2 text-custom-sm text-dark hover:bg-gray-1">
          Logout
        </button>
      </nav>
    </>
  );
}
