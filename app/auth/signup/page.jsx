'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <main className="screen">
      <header className="topbar">
        <Link href="/" className="backBtn" aria-label="Back">←</Link>
        <Image src="/logo.svg" alt="BnapX" width={28} height={28} priority />
      </header>

      <section className="card">
        <h1 className="title">Let’s create your account</h1>
        <p className="sub">Kindly create an account for <b className="link">free</b></p>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          <div className="field"><input placeholder="Firstname" /></div>
          <div className="field"><input placeholder="Lastname" /></div>
          <div className="field"><input placeholder="@Username" /></div>
          <div className="field"><input type="email" placeholder="Email address" /></div>

          <div className="row2">
            <div className="field"><input placeholder="+234" defaultValue="+234" /></div>
            <div className="field"><input placeholder="Phone number" /></div>
          </div>

          <div className="row2">
            <div className="field"><input type="password" placeholder="Password" /></div>
            <div className="field"><input type="password" placeholder="Confirm password" /></div>
          </div>

          <div className="field"><input placeholder="Promo code (optional)" /></div>

          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>I agree to all <a href="/terms" className="link">Terms</a> and <a href="/conditions" className="link">Conditions</a></span>
          </label>

          <button className="primaryBtn" type="submit">Create Account</button>

          <div className="inlineRow" style={{marginTop:12}}>
            <span className="muted">Already have an account?</span>
            <Link href="/auth/login" className="link">Login</Link>
          </div>
        </form>
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
.screen{
  min-height:100dvh; background:#F6F4FC;
  display:flex; flex-direction:column; align-items:center;
}
.topbar{
  width:100%; max-width:520px; padding:18px 16px 8px;
  display:flex; align-items:center; gap:10px;
}
.backBtn{
  display:inline-flex; align-items:center; justify-content:center;
  width:36px; height:36px; border-radius:10px; background:#e9ecff; color:#2864F8;
  text-decoration:none; margin-right:4px;
}
.card{
  width:100%; max-width:520px; margin:12px 16px 24px;
  background:#fff; border-radius:20px; box-shadow:0 10px 30px rgba(16,24,40,.09);
  padding:22px 16px 20px;
}
.title{ font-size:20px; font-weight:800; color:#0f172a; margin:4px 0 4px 4px; }
.sub{ color:#475467; margin:0 0 10px 4px; }
.muted{ color:#64748b; }

.form{ width:min(409px, 100%); margin:8px auto 0; }
.field{
  width:100%; height:55px; margin:8px 0; background:#fff;
  border:1px solid #E7EAF3; border-radius:8px; display:flex; align-items:center; padding:0 12px;
}
.field input{ width:100%; height:100%; border:0; outline:0; background:transparent; font-size:16px; color:#0f172a; }
.row2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.inlineRow{ display:flex; justify-content:space-between; align-items:center; gap:8px; }

/* Checkbox */
.check{ display:flex; gap:10px; align-items:center; margin:6px 2px 2px; font-size:14px; color:#334155; }
.check input{ width:18px; height:18px; }

/* Primary button 409x55 */
.primaryBtn{
  width:min(409px, 100%); height:55px; margin:10px auto 0;
  background:#2864F8; color:#fff; border:0; border-radius:12px; font-weight:700; letter-spacing:.2px;
  display:flex; align-items:center; justify-content:center; text-decoration:none; cursor:pointer;
  box-shadow:0 6px 18px rgba(40,100,248,.25);
}

.link{ color:#2864F8; text-decoration:none; font-weight:600; }

@media (max-width:380px){ .row2{ grid-template-columns:1fr; } }
`;



