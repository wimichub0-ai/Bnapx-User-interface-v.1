'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = params.get('amount') || '';

  return (
    <main style={{maxWidth:480, margin:'0 auto', padding:16, minHeight:'100dvh', background:'#fff', display:'grid', placeItems:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48, marginBottom:8}}>✅</div>
        <h1 style={{margin:'0 0 8px', fontSize:20, fontWeight:800}}>Withdrawal Successful</h1>
        <p style={{margin:'0 0 16px', color:'#667085'}}>₦{Number(amount||0).toLocaleString()} is being processed.</p>

        <button
          style={{
            width:409, height:55, borderRadius:12, border:0, background:'#2864F8',
            color:'#fff', fontWeight:800, display:'inline-block', cursor:'pointer'
          }}
          onClick={()=>router.replace('/home')}
        >
          Go to Home
        </button>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{maxWidth:480, margin:'0 auto', padding:16}}>Loading…</main>}>
      <SuccessInner />
    </Suspense>
  );
}

