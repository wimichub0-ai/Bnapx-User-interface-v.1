'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** NOTE about icon filenames with spaces:
 * If your svg files truly have spaces in their filenames, the src must be URL-encoded.
 * Example: "/home%204.svg". If possible, rename them to: home-4.svg, arrow-swap-vertical.svg, activity-3.svg, user-tag.svg
 * Below I include encoded paths so it works either way.
 */
const icons = {
  home: '/home%204.svg',
  trade: '/arrow%20swap%20vertical.svg',
  history: '/activity%203.svg',
  profile: '/user%20tag.svg',
};

export default function TabBar({ active }) {
  const pathname = usePathname();
  const current = active || pathname || '/home';

  const items = [
    { href: '/home', label: 'Home', icon: icons.home },
    { href: '/trade', label: 'Trade', icon: icons.trade },
    { href: '/history', label: 'History', icon: icons.history },
    { href: '/profile', label: 'Profile', icon: icons.profile },
  ];

  return (
    <>
      <nav className="btabbar" role="navigation" aria-label="Bottom">
        {items.map((it) => {
          const isActive = current.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={`btab ${isActive ? 'active' : ''}`}>
              <img src={it.icon} alt="" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .btabbar{
          position:sticky; bottom:0; left:0; right:0;
          display:grid; grid-template-columns: repeat(4,1fr);
          gap:8px; padding:10px 12px calc(10px + env(safe-area-inset-bottom));
          background:#fff; border-top:1px solid #E7EAF3; z-index:10;
          max-width:520px; margin:0 auto;
        }
        .btab{
          display:flex; flex-direction:column; align-items:center; gap:4px;
          text-decoration:none; font-size:12px; color:#667085; font-weight:600;
        }
        .btab img{ width:22px; height:22px; }
        .btab.active{ color:#0C47F9; }
      `}</style>
    </>
  );
}
