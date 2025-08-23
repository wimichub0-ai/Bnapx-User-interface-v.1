'use client';

import Link from 'next/link';

export default function AuthLanding() {
  return (
    <main className="screen">
      {/* Top bar with logo on the left */}
      <header className="topbar">
        <img src="/logo.svg" alt="BnapX" className="logo" />
      </header>

      {/* Content card */}
      <section className="card">
        <img
          src="/onboarding-illustration.png"
          alt=""
          className="illus"
          width={365}
          height={365}
        />

        <h2 className="title">CRYPTO AND GIFTCARD</h2>
        <p className="sub">
          Trade all your digital assets in one place, secure, fast, easy, and
          seemlessly
        </p>

        <div className="actions">
          <Link href="/auth/login" className="btn">
            <span>Login</span>
          </Link>

          <Link href="/auth/signup" className="btn">
            <span>Create Account</span>
          </Link>
        </div>
      </section>

      <style jsx>{`
        :global(html, body) {
          margin: 0;
          padding: 0;
          background: #f6f4fc;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
            Roboto, Arial;
          color: #0e1525;
        }

        .screen {
          min-height: 100dvh;
          background: #f6f4fc;
          display: grid;
          grid-template-rows: auto 1fr;
        }

        .topbar {
          height: 88px;
          padding: calc(env(safe-area-inset-top, 0) + 16px) 16px 8px 16px;
          display: flex;
          align-items: center;
        }
        .logo {
          width: 40px;
          height: auto;
        }

        .card {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 16px 32px;
        }

        .illus {
          display: block;
          width: 365px;
          height: 365px;
          max-width: 100%;
          object-fit: contain;
          margin: 0 auto 10px;
        }

        .title {
          margin: 8px 4px 6px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #2864f8;
          text-align: left;
        }

        .sub {
          margin: 0 4px 18px;
          color: #475467;
          line-height: 1.45;
          font-size: 14px;
        }

        .actions {
          display: grid;
          justify-items: center;
          gap: 12px;
        }

        /* Real-app buttons: exact size, centered text, elevation + states */
        .btn {
          width: 409px;
          max-width: 100%;
          height: 55px;
          display: inline-flex;
          align-items: center;
          justify-content: center; /* center label perfectly */
          border-radius: 12px;
          background: #2864f8;
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.2px;
          border: none;
          outline: none;
          box-shadow: 0 8px 22px rgba(40, 100, 248, 0.22),
            0 2px 6px rgba(17, 24, 39, 0.06);
          transition: transform 0.06s ease, box-shadow 0.2s ease,
            filter 0.15s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .btn:focus-visible {
          box-shadow: 0 10px 26px rgba(40, 100, 248, 0.26),
            0 0 0 3px rgba(40, 100, 248, 0.18);
        }
        .btn:active {
          transform: translateY(1px);
          box-shadow: 0 6px 16px rgba(40, 100, 248, 0.18);
          filter: saturate(0.98);
        }

        @media (max-width: 380px) {
          .illus {
            width: 320px;
            height: 320px;
          }
        }
      `}</style>
    </main>
  );
}



