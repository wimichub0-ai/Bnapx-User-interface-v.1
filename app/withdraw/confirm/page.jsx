'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Make sure this page never gets statically prerendered
export const dynamic = 'force-dynamic';

function ConfirmInner() {
  const router = useRouter();
  const params = useSearchParams();

  // read params safely
  const amount = params.get('amount') || '';
  const bankId = params.get('bankId') || '';
  const bankName = params.get('bankName') || '';
  const accountNumber = params.get('accountNumber') || '';
  const accountName = params.get('accountName') || '';

  // --- your existing JSX for the confirm screen goes here ---
  return (
    <main style={{maxWidth:480, margin:'0 auto', padding:16, minHeight:'100dvh', background:'#fff'}}>
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
        <button onClick={()=>router.back()} style={{width:36, height:36, borderRadius:10, background:'#F6F4FC', border:'1px solid #E7EAF3', display:'grid', placeItems:'center'}}>←</button>
        <h1 style={{margin:0, fontSize:18, fontWeight:800}}>Confirm Withdrawal</h1>
      </div>

      <div style={{background:'#fff', border:'1px solid #E7EAF3', borderRadius:16, boxShadow:'0 8px 24px rgba(16,24,40,.06)', padding:16}}>
        <div style={{marginBottom:10, fontWeight:700}}>Amount</div>
        <div style={{marginBottom:16}}><b>₦{Number(amount||0).toLocaleString()}</b></div>

        <div style={{marginBottom:10, fontWeight:700}}>Bank</div>
        <div className="small" style={{marginBottom:6}}>{bankName || '—'}</div>
        <div className="small">Acct No: {accountNumber || '—'} • {accountName || '—'}</div>

        <button
          style={{
            width:409, height:55, borderRadius:12, border:0, background:'#2864F8',
            color:'#fff', fontWeight:800, display:'block', margin:'20px auto 0', cursor:'pointer'
          }}
          onClick={()=>router.push(`/withdraw/success?amount=${amount}`)}
        >
          Withdraw
        </button>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{maxWidth:480, margin:'0 auto', padding:16}}>Loading…</main>}>
      <ConfirmInner />
    </Suspense>
  );
}
