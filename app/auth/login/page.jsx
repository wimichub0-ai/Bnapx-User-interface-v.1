'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="screen">
      <header className="topbar">
        <Image src="/logo.svg" alt="BnapX" width={28} height={28} priority />
      </header>

      <section className="card">
        <h1 className="title">Welcome back buddy</h1>
        <p className="sub">Kindly input your email and password to access your account</p>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          <div className="field"><input type="email" placeholder="Email address" required /></div>
          <div className="field"><input type="password" placeholder="Enter password" required /></div>

          <div className="inlineRow">
            <span />
            <Link href="/auth/forgot" className="link">Forgot Password</Link>
          </div>

          <button className="primaryBtn" type="submit">Login</button>

          <div className="inlineRow" style={{marginTop:12}}>
            <span className="muted">Don’t have an account?</span>
            <Link href="/auth/signup" className="link">Create account</Link>
          </div>
        </form>
        
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
/* Screen */
.screen{
  min-height:100dvh;
  background:#F6F4FC;
  display:flex;
  flex-direction:column;
  align-items:center;
}

/* Top bar with left-aligned logo */
.topbar{
  width:100%;
  max-width:520px;
  padding:18px 16px 8px;
  display:flex;
  align-items:center;
}

/* Card shell */
.card{
  width:100%;
  max-width:520px;
  margin:12px 16px 24px;
  background:#fff;
  border-radius:20px;
  box-shadow:0 10px 30px rgba(16,24,40,.09);
  padding:22px 16px 20px;
}

/* Headings */
.title{ font-size:20px; font-weight:800; color:#0f172a; margin:4px 0 4px 4px; }
.sub{ color:#475467; margin:0 0 10px 4px; }
.muted{ color:#64748b; }

/* Form layout */
.form{
  width:min(409px, 100%);
  margin:8px auto 0;
}
.field{
  width:100%;
  height:55px;               /* exact */
  margin:8px 0;
  background:#fff;
  border:1px solid #E7EAF3;
  border-radius:8px;         /* rounded 8 */
  display:flex;
  align-items:center;
  padding:0 12px;
}
.field input{
  width:100%; height:100%;
  border:0; outline:0;
  background:transparent;
  font-size:16px; color:#0f172a;
}
.inlineRow{ display:flex; justify-content:space-between; align-items:center; gap:8px; }

/* Button 409x55 centered text */
.primaryBtn{
  width:min(409px, 100%);
  height:55px;
  margin:10px auto 0;
  background:#2864F8;
  color:#fff;
  border:0;
  border-radius:12px;
  font-weight:700;
  letter-spacing:.2px;
  display:flex; align-items:center; justify-content:center;
  text-decoration:none;
  cursor:pointer;
  box-shadow:0 6px 18px rgba(40,100,248,.25);
}

/* Links */
.link{ color:#2864F8; text-decoration:none; font-weight:600; }

/* Face ID (optional) */
.faceRow{ display:flex; flex-direction:column; align-items:center; gap:6px; margin-top:18px; }
.faceLabel{ color:#334155; font-weight:600; }
`;
