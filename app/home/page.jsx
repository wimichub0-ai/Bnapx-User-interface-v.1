'use client';
import Link from 'next/link';
import TabBar from '@/components/TabBar';

export default function HomePage(){
  return (
    <main className="wrap">
      {/* Brand header */}
      <section className="hero">
        <div className="hero-row">
          <div className="hello">
            <div className="h1">Hi there</div>
            <div className="h2">What are you trading today?</div>
          </div>
          <img src="/icons/bell.png" alt="Notifications" className="bell"/>
        </div>

        {/* Wallet card */}
        <div className="wallet">
          <div className="wallet-head">
            <span>Wallet Balance</span>
            <span className="balance">₦500,000.00</span>
          </div>
          <div className="wallet-actions">
            {/* Hooked buttons */}
            <Link href="/bank/add" className="pill"><span>＋</span> Add Bank</Link>
            <Link href="/withdraw" className="pill"><span>⤓</span> Withdraw</Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="section">
        <h3 className="title">Quick action</h3>
        <div className="grid">
          <Link href="/trade?tab=sell" className="tile blue"><img src="/icons/usdt.png" alt="" /><span>Sell Crypto</span></Link>
          <Link href="/trade?tab=buy"  className="tile cyan"><img src="/icons/btc.png" alt=""  /><span>Buy Crypto</span></Link>
          <Link href="/trade?tab=giftcard" className="tile lilac"><img src="/icons/itunes.png" alt="" /><span>Sell Giftcard</span></Link>
          <div className="tile purple"><img src="/icons/gift.png" alt="" /><span>Send Gift (soon)</span></div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="section">
        <h3 className="title">Promo/Ad</h3>
        <div className="promo">
          <img src="/banner/promo1.jpg" alt="Promo" />
        </div>
      </section>

      <TabBar active="/home" />

            <style jsx>{`
        .wrap{ min-height:100dvh; background:#fff; padding-bottom:100px; }
        .hero{ ... }

        .wallet{ ... }

        .section{ padding:16px; }
        .title{ font-weight:800; color:#101828; margin:8px 0 12px; }
        .grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .tile{
          background:#fff; border:1px solid #EEF0F6; border-radius:16px; padding:12px;
          display:flex; flex-direction:column; align-items:center; gap:8px; text-decoration:none;
          box-shadow:0 6px 18px rgba(16,24,40,.06);
        }
        .tile img{ width:56px; height:56px; border-radius:12px; object-fit:cover; }
        .tile span{ font-weight:700; color:#0C47F9; }
        .blue{ background:#e8f0ff; } .cyan{ background:#e6f8ff; } .lilac{ background:#efeaff; } .purple{ background:#ece6ff; }

        /* 👇 Add this to kill underline */
        .grid .tile,
        .grid .tile:link,
        .grid .tile:visited,
        .grid .tile:hover,
        .grid .tile:active {
          text-decoration: none !important;
        }

        .promo img{ width:100%; height:auto; border-radius:16px; }
      `}</style>
    </main>
  );
}





