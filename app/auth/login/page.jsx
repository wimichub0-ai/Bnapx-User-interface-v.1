'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '../auth.module.css';

export default function Login() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    r.push('/'); // Home
  }

  return (
    <main className={styles.formShell}>
      <div className={styles.gradTop} />
      <div className={styles.avatarWrap}>
        <img src="/avatar.png" className={styles.avatar} alt="" />
      </div>
      <h2 className={styles.title}>Welcome back Michael</h2>
      <p className={styles.sub}>Kindly input your login Password to have access to your account</p>

      <form onSubmit={onSubmit} className={styles.form}>
        <input className={styles.input} type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Enter Password" value={password} onChange={e=>setPassword(e.target.value)} required />

        <div className={styles.metaRow}>
          <Link href="/auth/forgot" className={styles.forgot}>Forgot Password</Link>
        </div>

        {msg && <div className={styles.error}>{msg}</div>}
        <button className={styles.primaryBtn} type="submit">Login</button>

        <p className={styles.smallCenter}>
          Don’t have an account? <Link href="/auth/signup" className={styles.link}>Create account</Link>
        </p>

        <div className={styles.faceIdWrap}>
          <img src="/faceid.png" alt="" className={styles.faceId} />
          <div className={styles.smallCenter}>Face ID</div>
        </div>
      </form>
    </main>
  );
}

