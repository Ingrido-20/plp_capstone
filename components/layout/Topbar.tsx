"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { pumps } from "@/data/mockData";
import { atRiskPumps } from "@/lib/selectors";

export function Topbar() {
  const { openPump } = useAppContext();
  const [query, setQuery] = useState("");

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) return;
    const hit = pumps.find((p) => p.pump_id.toLowerCase().includes(value.toLowerCase()));
    if (hit) openPump(hit.pump_id);
  }

  return (
    <header className="glass-light flex items-center justify-between gap-4 border-b border-border px-6 py-3.5">
      <input
        value={query}
        aria-label="Search pumps, stations, and work orders"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search pumps, stations, work orders..."
        className="w-full max-w-[420px] rounded-squircle-sm border border-border bg-bg px-4 py-2.5 text-[13px] outline-none transition-shadow focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
      <div className="flex shrink-0 items-center gap-4">
        <Link
          href="/alerts"
          aria-label={`Active alerts${atRiskPumps.length > 0 ? ` (${atRiskPumps.length})` : ""}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[16px] transition-colors hover:bg-black/[0.04]"
        >
          ⚠
          {atRiskPumps.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 rounded-pill bg-red px-1.5 py-0 text-[9.5px] font-bold text-white">
              {atRiskPumps.length}
            </span>
          )}
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-[12px] font-bold text-white shadow-soft">
          LM
        </div>
        <div>
          <div className="text-[12.5px] font-bold leading-tight">L. Mugo</div>
          <div className="text-[11px] leading-tight text-text-mute">Maintenance planner</div>
        </div>
      </div>
    </header>
  );
}
