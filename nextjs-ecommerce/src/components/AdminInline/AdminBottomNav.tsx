"use client";

import { useEditMode } from "./EditModeProvider";

export default function AdminBottomNav() {
  const { isAdmin, editMode, setEditMode, logout } = useEditMode();
  if (!isAdmin) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-gray-3 bg-white px-3 py-2 shadow-2">
      <button type="button" onClick={() => setEditMode(!editMode)} className={`rounded-[5px] px-3 py-2 text-custom-sm ${editMode ? "bg-blue text-white" : "bg-gray-1 text-dark"}`}>
        Edit Mode
      </button>
      {["Orders", "Analytics", "Cart Activities", "Content", "Media"].map((item) => (
        <a key={item} href={`/my-account?admin=${encodeURIComponent(item.toLowerCase())}`} className="rounded-[5px] px-3 py-2 text-custom-sm text-dark hover:bg-gray-1">
          {item}
        </a>
      ))}
      <button type="button" onClick={logout} className="rounded-[5px] px-3 py-2 text-custom-sm text-dark hover:bg-gray-1">
        Logout
      </button>
    </nav>
  );
}
