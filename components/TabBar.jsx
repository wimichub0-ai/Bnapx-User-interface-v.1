'use client';
import Link from 'next/link';
import styles from './tabbar.module.css';

export default function TabBar({active="home"}) {
  return (
    <nav className={styles.bar}>
      <Link href="/" className={`${styles.item} ${active==='home'&&styles.active}`}>🏠<span>Home</span></Link>
      <Link href="/trade" className={`${styles.item} ${active==='trade'&&styles.active}`}>🎵<span>Trade</span></Link>
      <Link href="/history" className={`${styles.item} ${active==='history'&&styles.active}`}>📄<span>History</span></Link>
      <Link href="/profile" className={`${styles.item} ${active==='profile'&&styles.active}`}>👤<span>Profile</span></Link>
    </nav>
  );
}
