'use client';
export const dynamic = 'force-dynamic'; // avoid static prerender issues for "/"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CryptoAction from '@/components/CryptoAction';
import { supabase } from '@/lib/supabaseClient';

// Make TabBar render only on the client
const TabBar = dynamic(() => import('@/components/TabBar'), { ssr: false });

export default function Page() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // or a spinner
  return session ? <Home /> : <Landing />;
}

/* ---------- LOGGED-IN HOME (brand UI) ---------- */
function Home() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const metaName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.username;
        setUserName(metaName || data.user.email || 'Trader');
      }
    }
    loadUser();
  }, []);

  return (
    <main className="container">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-top">
          <div className="hello">
            <div className="hello-title">Hi {userName}</div>
            <div className="hello-sub">What are you trading today?</div>
          </div>
          <div className="bell" aria-label="Notifications">🔔</div>
        </div>

        {/* Wallet */}
        <div className="wallet">
          <div className="wallet-row">
            <div className="wallet-title">Wallet Balance</div>
            <div className="wallet-balance">₦500,000.00</div>
          </div>
          <div className="wallet-actions">
            <button className="pill"><span className="icon">⤓</span>Withdraw</button>
            <button className="pill"><span className="icon">＋</span>Add Bank</button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="home-section">
        <h3 className="section-title">Quick action</h3>
        <div className="tiles">
          <CryptoAction type="usdt"  label="Sell Crypto"   href="/trade?tab=sell" />
          <CryptoAction type="btc"   label="Buy Crypto"    href="/trade?tab=buy" />
          <CryptoAction type="itunes"label="Sell Giftcard" href="/trade?tab=giftcard" />
          <CryptoAction type="gift"  label="Send Gift"     href="/send-gift" />
        </div>
      </section>

      {/* Promo */}
      <section className="home-section">
        <h3 className="section-title">Promo/Ad</h3>
        <div className="promo">
          <div className="promo-text">
            <div className="promo-h">Boss you don check our rate today?</div>
            <div className="promo-p">E go shock you, trade now</div>
          </div>
          <div className="promo-img" aria-hidden>🧢</div>
        </div>
      </section>

      <TabBar />
    </main>
  );
}

/* ---------- LOGGED-OUT LANDING (your original) ---------- */
function Landing() {
  return (
    <main>
      <div className="header-grad">
        <img className="logo" src="/logo-blue.png" alt="BnapX" />
        <h2>Welcome to BnapX</h2>
        <p className="small">Start by signing in or creating an account</p>
      </div>
      <div className="container card">
        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="btn" href="/auth/signup" style={{ textAlign: 'center', paddingTop: 12 }}>
            Create account
          </Link>
          <Link className="btn" href="/auth/login" style={{ textAlign: 'center', paddingTop: 12 }}>
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

