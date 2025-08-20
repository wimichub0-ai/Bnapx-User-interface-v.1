"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

const TabBar = dynamic(() => import("@/components/TabBar"), { ssr: false });

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    }
    load();

    // Keep in sync if auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null; // or a small spinner

  return session ? <Home /> : <Landing />;
}

/* ---------- LOGGED-IN HOME (brand UI) ---------- */
function Home() {
  return (
    <main className="home container">
      <section className="home-hero">
        <div className="hero-top">
          <div className="hello">
            <div className="hello-title">Hi Michael muta</div>
            <div className="hello-sub">What are you trading today?</div>
          </div>
          <div className="bell" aria-label="Notifications">🔔</div>
        </div>

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

      <section className="home-section">
        <h3 className="section-title">Quick action</h3>
        <div className="tiles">
          <Link href="/trade?tab=sell" className="tile blue">
            <Image src="/icons/usdt.png" alt="Sell Crypto" width={60} height={60} priority />
            <span>Sell Crypto</span>
          </Link>
          <Link href="/trade?tab=buy" className="tile cyan">
            <Image src="/icons/btc.png" alt="Buy Crypto" width={60} height={60} priority />
            <span>Buy Crypto</span>
          </Link>
          <Link href="/trade?tab=giftcard" className="tile lilac">
            <Image src="/icons/itunes.png" alt="Sell Giftcard" width={60} height={60} />
            <span>Sell Giftcard</span>
          </Link>
          <div className="tile purple disabled" title="Coming soon">
            <Image src="/icons/gift.png" alt="Send Gift (soon)" width={60} height={60} />
            <span>Send Gift</span>
          </div>
        </div>
      </section>

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
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn" href="/auth/signup" style={{ textAlign: "center", paddingTop: 12 }}>
            Create account
          </Link>
          <Link className="btn" href="/auth/login" style={{ textAlign: "center", paddingTop: 12 }}>
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
