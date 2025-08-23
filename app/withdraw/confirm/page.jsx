'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Optional supabase insert on confirm:
// import { supabase } from '@/lib/supabaseClient';

export default function ConfirmWithdrawPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get('amount') || '0';
  const bankName = searchParams.get('bank') || 'Bank';
  const accountNumber = searchParams.get('account') || '';

  const [pin, setPin] = useState(['', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => { inputsRef.current?.[0]?.focus(); }, []);

  const setDigit = (i, val) => {
    const v = (val || '').replace(/\D/g, '').slice(-1);
    const next = [...pin]; next[i] = v; setPin(next);
    if (v && i < 3) inputsRef.current?.[i + 1]?.focus();
  };
  const onKeyDown = (e, i) => {
    if (e.key === 'Backspace' && pin[i] === '' && i > 0) {
      inputsRef.current?.[i - 1]?.focus();
    }
  };
  const onPaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const digits = (text || '').replace(/\D/g, '').slice(0, 4).split('');
    if (!digits.length) return;
    e.preventDefault();
    const next = ['', '', '', ''];
    for (let i = 0; i < 4; i++) next[i] = digits[i] || '';
    setPin(next);
    inputsRef.current?.[Math.min(digits.length - 1, 3)]?.focus();
  };

  async function handleConfirm() {
    if (pin.some(d => d === '')) return alert('Enter 4-digit pin');
    setSubmitting(true);

    // If you want to mark a DB row as confirmed:
    // try {
    //   await supabase.from('withdrawals').insert({
    //     amount: Number(amount),
    //     bank_name: bankName,
    //     account_number: accountNumber,
    //     status: 'submitted'
    //   });
    // } catch {}

    // Go to success screen
    router.replace(
      `/withdraw/success?amount=${encodeURIComponent(amount)}&bank=${encodeURIComponent(
        bankName
      )}&account=${encodeURIComponent(accountNumber)}`
    );
  }

  return (
    <main style={wrap}>
      <header style={header}>
        <button onClick={() => router.back()} style={backBtn} aria-label="Back">‹</button>
        <h2 style={title}>Confirm Withdraw</h2>
        <div style={{ width: 24 }} />
      </header>

      <section style={summaryRow}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{`₦${Number(amount).toLocaleString()}`}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>{accountNumber}</div>
          <div style={{ fontSize: 12, color: '#475467' }}>{bankName}</div>
        </div>
      </section>

      <div style={{ textAlign: 'center', margin: '32px 0 12px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Enter transaction pin</h3>
        <p style={{ fontSize: 14, color: '#475467' }}>
          Kindly enter your withdrawal pin to complete this withdrawal
        </p>
      </div>

      <div style={pinRow} onPaste={onPaste}>
        {[0,1,2,3].map(i=>(
          <input
            key={i}
            ref={el=>inputsRef.current[i]=el}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={pin[i]}
            onChange={e=>setDigit(i,e.target.value)}
            onKeyDown={e=>onKeyDown(e,i)}
            style={pinBox}
          />
        ))}
      </div>

      <button style={primaryBtn} onClick={handleConfirm} disabled={submitting}>
        {submitting ? 'Processing…' : 'Confirm'}
      </button>
    </main>
  );
}

/* styles */
const wrap = { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#F6F4FC', padding: 16 };
const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const backBtn = { width: 24, height: 24, borderRadius: 999, border: '1px solid #E6EAF2', background: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, cursor: 'pointer' };
const title = { margin: 0, fontSize: 20, fontWeight: 800, color: '#101828' };
const summaryRow = { margin: '24px 8px', padding: '12px 16px', borderRadius: 12, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E6EAF2' };
const pinRow = { display: 'flex', justifyContent: 'center', gap: 12, margin: '20px 0' };
const pinBox = { width: 64, height: 55, textAlign: 'center', fontSize: 22, fontWeight: 700, border: '1px solid #D0D5DD', borderRadius: 8, background: '#fff', outline: 'none' };
const primaryBtn = { width: 409, height: 55, maxWidth: '100%', background: '#2864F8', color: '#fff', fontWeight: 700, border: 0, borderRadius: 12, margin: '24px auto 0', display: 'block', cursor: 'pointer' };
