'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../auth.module.css';

export default function LoginPage() {
  return (
    <main className={styles.screen}>
      <header className={styles.topbar}>
        <Image src="/logo.svg" alt="BnapX" width={28} height={28} priority />
      </header>

      <section className={styles.card}>
        <h1 className={styles.title}>Welcome back buddy</h1>
        <p className={styles.sub}>Kindly input your email and password to access your account</p>

        <form className={styles.form} onSubmit={(e)=>e.preventDefault()}>
          <div className={styles.field}>
            <input type="email" placeholder="Email address" required />
          </div>
          <div className={styles.field}>
            <input type="password" placeholder="Enter password" required />
          </div>

          <div className={styles.inlineRow}>
            <span /> 
            <Link href="/auth/forgot" className={styles.link}>Forgot Password</Link>
          </div>

          <button className={styles.primaryBtn} type="submit">Login</button>

          <div className={styles.inlineRow} style={{marginTop:12}}>
            <span className={styles.muted}>Don’t have an account?</span>
            <Link href="/auth/signup" className={styles.link}>Create account</Link>
          </div>
        </form>

      </section>
    </main>
  );
}


