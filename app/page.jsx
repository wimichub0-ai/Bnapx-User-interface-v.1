'use client';
import Link from 'next/link';

export default function AuthLanding() {
  return (
    <main className="wrap">
      <header className="hrow">
        <img src="/logo.svg" alt="BnapX" className="logo" />
      </header>

      <section className="card">
        <img src="/onboarding-illustration.png" alt="" className="illus" />
        <h2 className="h2">CRYPTO AND GIFTCARD</h2>
        <p className="p">
          Trade all your digital assets in one place — secure, fast, easy, and seamless.
        </p>

        <div className="actions">
          <Link href="/auth/login" className="btn primary">Login</Link>
          <Link href="/auth/signup" className="btn secondary">Create Account</Link>
        </div>
      </section>

      <style jsx>{`
        .wrap{
          min-height:100dvh; background:#F6F4FC;
          display:flex; flex-direction:column; align-items:center;
          padding:24px 16px;
        }
        .hrow{
          width:100%; max-width:520px; display:flex; align-items:center;
        }
        .logo{ width:120px; height:auto; }
        .card{
          width:100%; max-width:520px; display:flex; flex-direction:column;
          align-items:center; text-align:center; margin-top:24px;
        }
        .illus{ width:365px; height:365px; object-fit:contain; }
        .h2{ font-size:18px; font-weight:800; letter-spacing:.6px; margin:6px 0 6px; color:#101828; }
        .p{ color:#475467; max-width:420px; }
        .actions{ display:grid; gap:12px; margin-top:16px; }
        .btn{
          width:409px; height:55px; border-radius:12px; display:grid; place-items:center;
          font-weight:800; text-decoration:none; margin:0 auto;
        }
        .primary{ background:#2864F8; color:#fff; }
        .secondary{ background:#fff; color:#2864F8; border:1px solid #C7D2FE; }
        @media (max-width:430px){
          .btn{ width:100%; max-width:409px; }
          .illus{ width:100%; max-width:365px; height:auto; }
        }
      `}</style>
    </main>
  );
}
