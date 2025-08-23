'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({
    first: '', last: '', username: '',
    email: '', phoneCode: '+234', phone: '',
    pass: '', pass2: '', promo: '', agree: true,
  });

  function update(k, v){ setForm(s => ({...s, [k]: v})); }
  function submit(e){
    e.preventDefault();
    // Hook up to Supabase later
    alert('Prototype: account create\n' + JSON.stringify(form, null, 2));
  }

  return (
    <main className="screen">
      <header className="topbar">
        <Link href="/" className="backBtn" aria-label="Back">←</Link>
        <Image src="/logo.svg" alt="BnapX" width={28} height={28} priority />
      </header>

      <section className="card">
        <h1 className="title">Let’s create your account</h1>
        <p className="sub">
          Kindly create an account for <span className="link">free</span>
        </p>

        <form className="form" onSubmit={submit}>
          <div className="row2">
            <div className="field"><input value={form.first} onChange={e=>update('first', e.target.value)} placeholder="Firstname" /></div>
            <div className="field"><input value={form.last}  onChange={e=>update('last',  e.target.value)} placeholder="Lastname" /></div>
          </div>

          <div className="field"><input value={form.username} onChange={e=>update('username', e.target.value)} placeholder="@Username" /></div>
          <div className="field"><input type="email" value={form.email} onChange={e=>update('email', e.target.value)} placeholder="Email address" /></div>

          <div className="row2">
            <div className="field"><input value={form.phoneCode} onChange={e=>update('phoneCode', e.target.value)} placeholder="+234" /></div>
            <div className="field"><input value={form.phone} onChange={e=>update('phone', e.target.value)} placeholder="Phone Number" /></div>
          </div>

          <div className="row2">
            <div className="field"><input type="password" value={form.pass}  onChange={e=>update('pass',  e.target.value)} placeholder="Password" /></div>
            <div className="field"><input type="password" value={form.pass2} onChange={e=>update('pass2', e.target.value)} placeholder="Confirm Password" /></div>
          </div>

          <div className="field"><input value={form.promo} onChange={e=>update('promo', e.target.value)} placeholder="Promo code (optional)" /></div>

          <label className="check">
            <input type="checkbox" checked={form.agree} onChange={e=>update('agree', e.target.checked)} />
            <span>I Agree to all <a href="/terms" className="link">Terms</a> and <a href="/conditions" className="link">Conditions</a></span>
          </label>

          <button className="primaryBtn" type="submit">Create Account</button>

          <div className="inlineRow" style={{marginTop:12}}>
            <span className="muted">Already have an account?</span>
            <Link href="/auth/login" className="link">Login</Link>
          </div>
        </form>
      </section>

      <style jsx>{`
        /* Screen */
        .screen{
          min-height:100dvh;
          background:#F6F4FC;
          display:flex; flex-direction:column; align-items:center;
        }

        /* Topbar */
        .topbar{
          width:100%; max-width:520px;
          padding:18px 16px 8px;
          display:flex; align-items:center; gap:10px;
        }
        .backBtn{
          display:inline-flex; align-items:center; justify-content:center;
          width:36px; height:36px; border-radius:10px;
          background:#e9ecff; color:#2864F8; text-decoration:none;
        }

        /* Card */
        .card{
          width:100%; max-width:520px;
          margin:12px 16px 24px;
          background:#fff; border-radius:20px;
          box-shadow:0 10px 30px rgba(16,24,40,.09);
          padding:22px 16px 20px;
        }

        /* Text */
        .title{ font-size:20px; font-weight:800; color:#0f172a; margin:4px 0 4px 4px; }
        .sub{ color:#475467; margin:0 0 10px 4px; }
        .muted{ color:#64748b; }
        .link{ color:#2864F8; text-decoration:none; font-weight:600; }

        /* Form */
        .form{ width:min(409px, 100%); margin:8px auto 0; }
        .row2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .field{
          width:100%; height:55px;               /* 409×55 spec */
          margin:8px 0; background:#fff;
          border:1px solid #E7EAF3;
          border-radius:8px;                      /* rounded 8 on inputs */
          display:flex; align-items:center; padding:0 12px;
        }
        .field input{
          width:100%; height:100%;
          border:0; outline:0; background:transparent;
          font-size:16px; color:#0f172a;
        }
        .check{ display:flex; gap:10px; align-items:center; margin:6px 2px 2px; font-size:14px; color:#334155; }
        .check input{ width:18px; height:18px; }

        .inlineRow{ display:flex; justify-content:space-between; align-items:center; gap:8px; }

        /* Primary Button 409×55 */
        .primaryBtn{
          width:min(409px, 100%); height:55px; margin:10px auto 0;
          background:#2864F8; color:#fff; border:0;
          border-radius:12px;                      /* app-like feel */
          font-weight:700; letter-spacing:.2px;
          display:flex; align-items:center; justify-content:center;
          text-decoration:none; cursor:pointer;
          box-shadow:0 6px 18px rgba(40,100,248,.25);
        }

        @media (max-width:380px){
          .row2{ grid-template-columns:1fr; }
        }
      `}</style>
    </main>
  );
}



