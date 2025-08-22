'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '../auth.module.css';

export default function Signup() {
  const r = useRouter();
  const [form, setForm] = useState({
    first: '', last: '', username: '',
    email: '', phone: '', password: '', confirm: '',
    promo: '', agree: true
  });
  const [msg, setMsg] = useState('');

  function up(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault(); setMsg('');
    if (!form.agree) return setMsg('Please agree to Terms & Conditions.');
    if (form.password !== form.confirm) return setMsg('Passwords do not match');

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: `${form.first} ${form.last}`, username: form.username, phone: form.phone, promo: form.promo }
      }
    });
    if (error) return setMsg(error.message);

    // Optional: create a profile row (ignore if you already have triggers)
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: form.first,
        last_name: form.last,
        username: form.username?.toLowerCase(),
        phone: form.phone,
        promo_code: form.promo
      });
    }

    r.push('/'); // go to Home after sign up
  }

  return (
    <main className={styles.formShell}>
      <div className={styles.gradTop} />
      <h2 className={styles.title}>Let create your account</h2>
      <p className={styles.sub}>Kindly create an account for <b className={styles.link}>free</b></p>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.row2}>
          <input className={styles.input} placeholder="Firstname" value={form.first} onChange={e=>up('first',e.target.value)} required />
          <input className={styles.input} placeholder="Lastname"  value={form.last}  onChange={e=>up('last', e.target.value)} required />
        </div>

        <input className={styles.input} placeholder="@Username" value={form.username} onChange={e=>up('username',e.target.value)} required />
        <input className={styles.input} type="email" placeholder="Email@bnapx.com" value={form.email} onChange={e=>up('email',e.target.value)} required />

        <div className={styles.row2}>
          <input className={`${styles.input} ${styles.code}`} value="+234" readOnly />
          <input className={styles.input} placeholder="Phone Number" value={form.phone} onChange={e=>up('phone',e.target.value)} required />
        </div>

        <div className={styles.row2}>
          <input className={styles.input} type="password" placeholder="Password" value={form.password} onChange={e=>up('password',e.target.value)} required />
          <input className={styles.input} type="password" placeholder="Confirm Password" value={form.confirm} onChange={e=>up('confirm',e.target.value)} required />
        </div>

        <input className={styles.input} placeholder="Promo code" value={form.promo} onChange={e=>up('promo',e.target.value)} />

        <div className={styles.optRow}>
          <label className={styles.checkRow}>
            <input type="checkbox" checked={form.agree} onChange={e=>up('agree',e.target.checked)} />
            <span>I Agree To All <a className={styles.link}>Terms</a> And <a className={styles.link}>Conditions</a></span>
          </label>
        </div>

        {msg && <div className={styles.error}>{msg}</div>}
        <button className={styles.primaryBtn} type="submit">Create Account</button>
      </form>
    </main>
  );
}


