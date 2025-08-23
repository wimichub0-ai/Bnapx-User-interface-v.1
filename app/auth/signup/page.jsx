'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [show, setShow] = useState(false);

  function update(k,v){ setForm(s => ({...s, [k]: v})); }
  function submit(e){
    e.preventDefault();
    alert('Prototype signup:\n' + JSON.stringify(form, null, 2));
  }

  return (
    <main className="screen">
      <header className="topbar">
        <Link href="/" className="backBtn" aria-label="Back">←</Link>
        <Image src="/logo.svg" alt="BnapX" width={28} height={28} priority />
      </header>

      <section className="card">
        <h1 className="title">Create an account</h1>
        <p className="sub">Sign up to get started</p>

        <form className="form" onSubmit={submit}>
          <div className="field">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e=>update('name', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e=>update('email', e.target.value)}
              required
            />
          </div>

          <div className="field has-eye">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e=>update('password', e.target.value)}
              required
            />
            <button
              type="button"
              className="eye"
              onClick={()=>setShow(s=>!s)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          <button className="primaryBtn" type="submit">Create Account</button>

          <div className="inlineRow" style={{marginTop:12}}>
            <span className="muted">Already have an account?</span>
            <Link href="/auth/login" className="link">Login</Link>
          </div>
        </form>
      </section>

      <style jsx>{`
        .screen{
          min-height:100dvh;
          background:#F6F4FC;
          display:flex; flex-direction:column; align-items:center;
        }
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
        .card{
          width:100%; max-width:520px;
          margin:12px 16px 24px;
          background:#fff; border-radius:20px;
          box-shadow:0 10px 30px rgba(16,24,40,.09);
          padding:22px 16px 20px;
        }
        .title{ font-size:20px; font-weight:800; color:#0f172a; margin:4px 0 4px 4px; }
        .sub{ color:#475467; margin:0 0 10px 4px; }
        .muted{ color:#64748b; }
        .link{ color:#2864F8; text-decoration:none; font-weight:600; }

        .form{ width:min(409px, 100%); margin:8px auto 0; }
        .field{
          width:100%; height:55px;
          margin:8px 0; background:#fff;
          border:1px solid #E7EAF3;
          border-radius:8px;
          display:flex; align-items:center; padding:0 12px;
          position:relative;
        }
        .field input{
          width:100%; height:100%;
          border:0; outline:0; background:transparent;
          font-size:16px; color:#0f172a;
        }
        .has-eye .eye{
          position:absolute; right:8px; top:50%; transform:translateY(-50%);
          width:40px; height:40px;
          display:flex; align-items:center; justify-content:center;
          border:0; background:transparent; cursor:pointer; font-size:18px;
        }

        .primaryBtn{
          width:min(409px, 100%); height:55px; margin:14px auto 0;
          background:#2864F8; color:#fff; border:0;
          border-radius:12px;
          font-weight:700; letter-spacing:.2px;
          display:flex; align-items:center; justify-content:center;
          text-decoration:none; cursor:pointer;
          box-shadow:0 6px 18px rgba(40,100,248,.25);
        }
        .inlineRow{ display:flex; justify-content:center; align-items:center; gap:6px; }

        @media (max-width:380px){ .form{ width:100%; } }
      `}</style>
    </main>
  );
}




