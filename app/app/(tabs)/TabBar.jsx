"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const Tab = ({ href, icon, label }) => {
    const active = pathname === href;
    return (
      <Link href={href} className={`tab ${active ? "active" : ""}`}>
        <div className="dot">{icon}</div>
        {label}
      </Link>
    );
  };

  return (
    <div className="tabbar">
      <div className="tabs">
        <Tab href="/"
             icon="🏠"
             label="Home" />
        <Tab href="/trade"
             icon="💱"
             label="Trade" />
        <Tab href="/history"
             icon="📄"
             label="History" />
        <Tab href="/profile"
             icon="👤"
             label="Profile" />
      </div>
    </div>
  );
}
