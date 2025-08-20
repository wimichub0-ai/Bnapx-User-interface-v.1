"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const TABS = [
    { href: "/",        label: "Home",    icon: "🏠" },
    { href: "/trade",   label: "Trade",   icon: "💱" },
    { href: "/history", label: "History", icon: "📄" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="tabbar" role="navigation" aria-label="Bottom tabs">
      <div className="tabs">
        {TABS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`tab ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <div className="dot" aria-hidden>{icon}</div>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
