"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home" },
    { href: "/trade", label: "Trade" },
    { href: "/history", label: "History" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-md">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm font-medium ${
              active ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
