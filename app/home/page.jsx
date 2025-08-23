'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // quick inline styles (mobile-first, max width 480)
  const wrap = {
    maxWidth: 480, margin: '0 auto', padding: 16,
    background: '#F6F4FC', minHeight: '100dvh'
  };
  const card = {
    background: 'linear-gradient(180deg, #2864F8 0%, #184BEA 100%)',
    borderRadius: 16, padding: 16, color: '#fff',
    boxShadow: '0 10px 28px rgba(40,100,248,.25)'
  };
  const balanceHead = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 };
  const actionsRow = { display:'flex', gap: 12, marginTop: 8 };

  // shared primary button (409×55 when space allows)
  const primaryBtn = {
    flex: 1, height: 55, maxWidth: 409, borderRadius: 12,
    background: '#2864F8', color:'#fff', border:0, fontWeight:700,
    display:'grid', placeItems:'center', cursor:'pointer'
  };

  return (
    <main style={wrap}>
      {/* tiny header */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
        <Image src="/logo.svg" alt="BnapX" width={28} height={28}/>
        <div style={{fontWeight:800, color:'#0E1525'}}>Hi Michael</div>
      </div>

      {/* Wallet card */}
      <section style={card}>
        <div style={balanceHead}>
          <span style={{opacity:.9}}>Wallet Balance</span>
          <Image src="/bell.svg" alt="" width={18} height={18}/>
        </div>
        <div style={{fontWeight:800, fontSize:22}}>₦500,000.00</div>

        <div style={actionsRow}>
          <button style={primaryBtn} onClick={() => router.push('/add-bank')}>
            Add Bank
          </button>
          <button style={primaryBtn} onClick={() => router.push('/withdraw')}>
            Withdraw
          </button>
        </div>
      </section>

      {/* Quick actions */}
      <section style={{marginTop:18}}>
        <h3 style={{margin:'0 0 10px', color:'#0E1525'}}>Quick action</h3>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:12
        }}>
          <Link href="/trade?tab=sell" style={tile('#e8f0ff')}>
            <Image src="/icons/usdt.png" alt="" width={56} height={56}/>
            <span>Sell Crypto</span>
          </Link>
          <Link href="/trade?tab=buy" style={tile('#e6f8ff')}>
            <Image src="/icons/btc.png" alt="" width={56} height={56}/>
            <span>Buy Crypto</span>
          </Link>
          <Link href="/trade?tab=giftcard" style={tile('#efeaff')}>
            <Image src="/icons/itunes.png" alt="" width={56} height={56}/>
            <span>Sell Giftcard</span>
          </Link>
          <div style={tile('#ece6ff')}>
            <Image src="/icons/gift.png" alt="" width={56} height={56}/>
            <span>Send Gift (soon)</span>
          </div>
        </div>
      </section>

      {/* Promo banner (optional) */}
      <section style={{marginTop:18}}>
        <div style={{
          position:'relative', width:'100%', height:120,
          borderRadius:16, overflow:'hidden', boxShadow:'0 8px 22px rgba(16,24,40,.12)'
        }}>
          <Image src="/promo1.jpg" alt="Promo" fill style={{objectFit:'cover'}}/>
        </div>
      </section>
    </main>
  );
}

function tile(bg) {
  return {
    background: bg,
    borderRadius: 16,
    padding: 14,
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#0E1525',
    fontWeight: 700,
    boxShadow: '0 6px 18px rgba(2,22,80,.05)'
  };
}




