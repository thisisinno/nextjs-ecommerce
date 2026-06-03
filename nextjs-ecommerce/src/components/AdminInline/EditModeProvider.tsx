"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, logout as apiLogout } from "@/lib/api/auth";
import { ApiUser } from "@/types/auth";

type EditModeContextValue = {
  user: ApiUser | null;
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [editMode, setEditMode] = useState(false);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (!currentUser?.is_staff && !currentUser?.is_superuser) {
        setEditMode(false);
      }
    } catch {
      setUser(null);
      setEditMode(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: Boolean(user?.is_staff || user?.is_superuser),
      editMode,
      setEditMode,
      toggleEditMode: () => setEditMode((current) => !current),
      refreshUser,
      logout: () => {
        apiLogout();
        setUser(null);
        setEditMode(false);
      },
    }),
    [user, editMode]
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) throw new Error("useEditMode must be used inside EditModeProvider");
  return context;
}
