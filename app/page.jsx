'use client';
import Link from 'next/link';
import styles from './auth/auth.module.css'

export default function AuthLanding() {
  return (
    <main className={styles.shell}>
      <header className={styles.heroTop}>
        <img src="/logo-blue.png" alt="BnapX" className={styles.logo} />
      </header>

      <section className={styles.card}>
        <img src="/onboarding-illustration.png" alt="" className={styles.illus} />
        <h2 className={styles.h2}>CRYPTO AND GIFTCARD</h2>
        <p className={styles.p}>
          Trade all your digital assets in one place, secure, fast, easy, and seamlessly
        </p>

        <div className={styles.actions}>
          <Link href="/auth/login" className={styles.primaryBtn}>Login</Link>
          <Link href="/auth/signup" className={styles.secondaryBtn}>Create Account</Link>
        </div>
      </section>
    </main>
  );
}


