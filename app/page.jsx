'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import TabBar from '@/components/TabBar';

const brandBlue = '#0C47F9';
const brandSoft = '#F6F4FC';

function QuickTile({ href, iconSrc, label, sub }) {
  return (
    <Link href={href} className="quick-tile">
      <div className="qt-icon">
        <Image src={iconSrc} alt={label} width={48} height={48} />
      </div>
      <div className="qt-text">
        <div className="qt-label">{label}</div>
        {sub && <div className="qt-sub">{sub}</div>}
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [userName, setUserName] = useState('Trader');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (u) {
        const meta =
          u.user_metadata?.full_name ||
          u.user_metadata?.username ||
          u.email?.split('@')[0];
        setUserName(meta || 'Trader');
      }
    })();
  }, []);

  return (
    <main className="home-wrap">
      {/* Curved brand header */}
      <div className="brand-hero">
        <div className="brand-hello">
          <div className="hello-1">Hi {userName}</div>
          <div className="hello-2">What are you trading today?</div>
        </div>
        <div className="bell" aria-label="Notifications">🔔</div>
      </div>

      {/* Wallet Card */}
      <section className="wallet-card">
        <div className="wc-row">
          <div className="wc-title">Wallet Balance</div>
          <div className="wc-balance">₦500,000.00</div>
        </div>
        <hr className="wc-sep" />
        <div className="wc-actions">
          <button className="pill">
            <span className="pill-ic">⤓</span> Withdraw
          </button>
          <button className="pill">
            <span className="pill-ic">＋</span> Add Bank
          </button>
        </div>
      </section>

      {/* Quick action */}
      <section className="section">
        <h3 className="section-title">Quick action</h3>
        <div className="quick-grid">
          <QuickTile
            href="/trade?tab=sell"
            iconSrc="/icons/usdt.png"
            label="Sell Crypto"
            sub="USDT, BTC, more"
          />
          <QuickTile
            href="/trade?tab=buy"
            iconSrc="/icons/btc.png"
            label="Buy Crypto"
            sub="Instant rates"
          />
          <QuickTile
            href="/trade?tab=giftcard"
            iconSrc="/icons/itunes.png"
            label="Sell Giftcard"
            sub="iTunes, Amazon, more"
          />
          <QuickTile
            href="/send-gift"
            iconSrc="/icons/gift.png"
            label="Send Gift"
            sub="Coming soon"
          />
        </div>
      </section>

      {/* Promo / Ad */}
      <section className="section">
        <h3 className="section-title">Promo/Ad</h3>
        <div className="promo-card">
          <div className="promo-copy">
            <div className="promo-h">Boss you don check our rate today?</div>
            <div className="promo-p">E go shock you, trade now</div>
          </div>
          <div className="promo-art">
            <Image
              src="/promo-banner.jpg"
              alt="Promo"
              width={320}
              height={110}
              className="promo-img"
            />
          </div>
        </div>
      </section>

      <TabBar />
    </main>
  );
}


