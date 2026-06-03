"use client";

import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import { ReduxProvider } from "@/redux/provider";
import { EditModeProvider } from "@/components/AdminInline/EditModeProvider";
import AdminBottomNav from "@/components/AdminInline/AdminBottomNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ReduxProvider>
          <EditModeProvider>
            {children}
            <AdminBottomNav />
          </EditModeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
