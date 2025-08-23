'use client';

import Link from 'next/link';

export default function AuthLanding() {
  return (
    <main className="shell">
      {/* Header / brand area */}
      <header className="heroTop">
        <img src="/logo.svg" alt="BnapX" className="logo" />
      </header>

      {/* Card */}
      <section className="card">
        <img
          src="/illustration.png"
          alt=""
          className="illus"
          width={365}
          height={365}
        />

        <h2 className="h2">CRYPTO AND GIFTCARD</h2>
        <p className="p">
          Trade all your digital assets in one place, secure, fast, easy, and
          seemlessly
        </p>

        <div className="actions">
          <Link href="/auth/login" className="btn btnPrimary">
            Login
          </Link>
          <Link href="/auth/signup" className="btn btnPrimary">
            Create Account
          </Link>
        </div>
      </section>

      <style jsx>{`
        :global(html, body) {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
            Roboto, Arial;
          color: #0e1525;
        }

        .shell {
          min-height: 100dvh;
          background: #ffffff;
        }

        /* Brand header */
        .heroTop {
          height: 260px;
          background: #2864f8; /* brand header blue */
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
        }
        .logo {
          width: 64px;
          height: auto;
        }

        /* Card that overlaps header */
        .card {
          max-width: 480px;
          margin: -72px auto 24px; /* pull up over blue header */
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(16, 24, 40, 0.08);
          padding: 20px 16px 28px;
        }

        .illus {
          display: block;
          width: 365px;
          height: 365px;
          max-width: 100%;
          object-fit: contain;
          margin: 0 auto 8px;
          border-radius: 16px; /* subtle rounding like your mock */
        }

        .h2 {
          margin: 6px 6px 2px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #2864f8;
        }

        .p {
          margin: 6px 6px 16px;
          color: #475467;
          line-height: 1.45;
          font-size: 14px;
        }

        .actions {
          display: grid;
          justify-items: center;
          gap: 12px;
          margin-top: 16px;
        }

        /* Buttons (exact size & color as requested) */
        .btn {
          width: 409px;
          max-width: 100%;
          height: 55px;
          line-height: 55px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.04s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 20px rgba(40, 100, 248, 0.18);
        }
        .btnPrimary {
          background: #2864f8;
          color: #ffffff;
        }
        .btn:active {
          transform: translateY(1px);
          box-shadow: 0 6px 16px rgba(40, 100, 248, 0.16);
        }

        /* Safe spacing on very small screens */
        @media (max-width: 380px) {
          .heroTop {
            height: 230px;
          }
          .illus {
            width: 320px;
            height: 320px;
          }
        }
      `}</style>
    </main>
  );
}



