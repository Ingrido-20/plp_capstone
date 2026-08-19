"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { pumps } from "@/data/mockData";

interface AppContextValue {
  toastMessage: string | null;
  showToast: (message: string) => void;

  openPumpId: string | null;
  openPump: (id: string) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [openPumpId, setOpenPumpId] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2600);
  }, []);

  const openPump = useCallback((id: string) => {
    if (!pumps.find((p) => p.pump_id === id)) return;
    setOpenPumpId(id);
  }, []);

  const closeModal = useCallback(() => setOpenPumpId(null), []);

  const value = useMemo(
    () => ({
      toastMessage: toastVisible ? toastMessage : null,
      showToast,
      openPumpId,
      openPump,
      closeModal,
    }),
    [toastMessage, toastVisible, showToast, openPumpId, openPump, closeModal]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
