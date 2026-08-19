import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toast } from "@/components/ui/Toast";
import { PumpModal } from "@/components/PumpModal";

export const metadata: Metadata = {
  title: "Flowgard — KPC Predictive Maintenance",
  description: "Control room prototype for KPC pipeline predictive maintenance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-bg text-text">
        <AppProvider>
          <div className="flex h-full overflow-hidden">
            <Sidebar />
            <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
              <Topbar />
              <main className="scroll-thin flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <Toast />
          <PumpModal />
        </AppProvider>
      </body>
    </html>
  );
}
