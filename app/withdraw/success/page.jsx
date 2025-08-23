'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function WithdrawSuccessPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const amount = sp.get('amount') || '0';
  const bankName = sp.get('bank') || 'Bank';
  const accountNumber = sp.get('account') || '';

  return (
    <main style={wrap}>
      <div style={card}>
        <div style={checkWrap}>✓</div>
        <h2 style={h2}>Withdrawal Submitted</h2>
        <p style={p}>
          {`₦${Number(amount).toLocaleString()}`} to {bankName} {accountNumber}
        </p>
        <button style={primaryBtn} onClick={()=>router.replace('/history')}>Done</button>
      </div>
    </main>
  );
}

/* styles */
const wrap = { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#F6F4FC', display: 'grid', placeItems: 'center', padding: 16 };
const card = { width: '100%', background: '#fff', border: '1px solid #E6EAF2', borderRadius: 16, padding: 24, textAlign: 'center' };
const checkWrap = { width: 72, height: 72, margin: '0 auto 12px', borderRadius: 999, background: '#E7F5FF', color: '#0ea5e9', fontWeight: 900, display: 'grid', placeItems: 'center', fontSize: 36 };
const h2 = { margin: '4px 0 6px', fontSize: 20, fontWeight: 800, color: '#101828' };
const p = { margin: 0, color: '#475467' };
const primaryBtn = { width: 409, height: 55, maxWidth: '100%', background: '#2864F8', color: '#fff', fontWeight: 700, border: 0, borderRadius: 12, margin: '18px auto 0', display: 'block', cursor: 'pointer' };
