"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import { atRiskPumps } from "@/lib/selectors";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

function buildGroups(alertCount: number): NavGroup[] {
  return [
    { items: [{ href: "/", label: "Control room", icon: "▦" }] },
    {
      label: "Monitoring",
      items: [
        { href: "/network", label: "Pipeline network", icon: "◉" },
        { href: "/pumps", label: "Pump fleet", icon: "⚙" },
        { href: "/flowgard", label: "Flowgard engine", icon: "◈" },
        { href: "/alerts", label: "Active alerts", icon: "⚠", badge: alertCount },
      ],
    },
    {
      label: "Maintenance",
      items: [
        { href: "/workorders", label: "Work orders", icon: "▤" },
        { href: "/schedule", label: "Service schedule", icon: "▣" },
      ],
    },
    {
      label: "Analytics",
      items: [
        { href: "/model", label: "Model performance", icon: "◐" },
        { href: "/roi", label: "ROI & business case", icon: "▲" },
      ],
    },
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const groups = buildGroups(atRiskPumps.length);

  return (
    <aside className="glass-dark scroll-thin flex h-full w-[248px] shrink-0 flex-col overflow-y-auto border-r border-white/[0.06] text-[#cfd8e5]">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-squircle-sm bg-gradient-to-br from-teal to-blue text-[15px] shadow-soft">
          ◈
        </div>
        <div>
          <div className="text-[13px] font-extrabold tracking-wide text-white">FLOWGARD</div>
          <div className="text-[9px] tracking-[0.12em] text-[#7f95ad]">KPC PREDICTIVE MAINTENANCE</div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-1 pt-3 first:pt-0">
            {group.label && (
              <div className="px-2.5 pb-1.5 pt-2 text-[10px] font-bold tracking-[0.08em] text-[#5f7b99]">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "mb-0.5 flex items-center justify-between rounded-squircle-sm px-3 py-2.5 text-[13px] font-medium transition-colors duration-150",
                    active ? "bg-teal font-bold text-white shadow-soft" : "text-[#c3d0de] hover:bg-white/[0.07] hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </span>
                  {!!item.badge && (
                    <span className="rounded-pill bg-red px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cx(
            "flex items-center gap-2.5 rounded-squircle-sm px-3 py-2.5 text-[13px] font-medium transition-colors duration-150",
            pathname === "/settings" ? "bg-teal font-bold text-white shadow-soft" : "text-[#c3d0de] hover:bg-white/[0.07] hover:text-white"
          )}
        >
          <span aria-hidden>⚙</span> Settings
        </Link>
      </div>
    </aside>
  );
}
