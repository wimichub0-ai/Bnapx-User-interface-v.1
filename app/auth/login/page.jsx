'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage(){
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.replace('/home');
  }

  return (
    <main className="wrap">
      <header className="hrow">
        <img src="/logo.svg" alt="BnapX" className="logo" />
      </header>

      <section className="card">
        <h2 className="h2">Welcome back</h2>
        <p className="sub">Login to continue</p>

        <form onSubmit={onSubmit} className="form">
          <label>Email</label>
          <input
            className="txt"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            className="txt"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e=>setPass(e.target.value)}
            required
          />

          {err && <div className="err">{err}</div>}

          <button className="btn primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="alt">
          Don’t have an account? <Link href="/auth/signup">Create Account</Link>
        </p>
      </section>

      <style jsx>{`
        .wrap{ min-height:100dvh; background:#F6F4FC; display:flex; flex-direction:column; align-items:center; padding:24px 16px; }
        .hrow{ width:100%; max-width:520px; display:flex; align-items:center; }
        .logo{ width:120px; height:auto; }
        .card{ width:100%; max-width:520px; margin-top:18px; }
        .h2{ font-size:22px; font-weight:800; color:#101828; margin:8px 0 4px; }
        .sub{ color:#475467; margin-bottom:14px; }
        .form{ display:grid; gap:10px; }
        label{ font-weight:700; color:#0F172A; }
        .txt{
          width:409px; height:55px; border:1px solid #E7EAF3; border-radius:12px;
          padding:0 14px; background:#fff; font-size:16px;
        }
        .btn{
          width:409px; height:55px; border-radius:12px; border:0; font-weight:800;
          display:grid; place-items:center; background:#2864F8; color:#fff; margin-top:6px; cursor:pointer;
        }
        .err{ background:#FEF3F2; color:#B42318; border:1px solid #FEE4E2; padding:10px 12px; border-radius:10px; }
        .alt{ margin-top:10px; color:#475467; }
        .alt a{ color:#2864F8; font-weight:700; text-decoration:none; }
        @media (max-width:430px){
          .txt,.btn{ width:100%; max-width:409px; }
        }
      `}</style>
    </main>
  );
}

