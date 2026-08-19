"use client";

import { useAppContext } from "@/context/AppContext";

export function Toast() {
  const { toastMessage } = useAppContext();

  if (!toastMessage) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[300]">
      <div className="animate-toast-in pointer-events-auto rounded-squircle glass-dark px-5 py-3 text-[13px] font-semibold text-white shadow-elevated">
        {toastMessage}
      </div>
    </div>
  );
}
