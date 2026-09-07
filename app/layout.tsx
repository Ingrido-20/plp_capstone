import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ScadaProvider } from "@/context/ScadaContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toast } from "@/components/ui/Toast";
import { PumpModal } from "@/components/PumpModal";

export const metadata: Metadata = {
  title: "FlowGuard AI — KPC Predictive Maintenance & Reconciliation Engine",
  description: "End-to-end condition-based predictive maintenance and hydraulic reconciliation engine for KPC and global pipeline infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-bg text-text">
        <ScadaProvider>
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
        </ScadaProvider>
      </body>
    </html>
  );
}
