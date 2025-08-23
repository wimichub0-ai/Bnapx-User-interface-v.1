'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Optional: comment out next line if you don't want to write to DB here
// import { supabase } from '@/lib/supabaseClient';

export default function WithdrawPage() {
  const router = useRouter();

  // Pretend “saved banks” (replace with your Supabase fetch)
  const [banks, setBanks] = useState([
    { id: '1', bank_name: 'Opay', account_number: '9011032037' },
    { id: '2', bank_name: 'Access Bank', account_number: '0123456789' },
  ]);
  const [selectedId, setSelectedId] = useState('1');
  const [amount, setAmount] = useState('');

  const selected = banks.find(b => b.id === selectedId) || banks[0];

  async function handleWithdraw() {
    const amt = Number((amount || '0').replace(/[^\d.]/g, ''));
    if (!selected) return alert('Pick a bank');
    if (!amt || amt <= 0) return alert('Enter amount');

    // If you want to create a pending “withdrawal request” row up-front:
    // try {
    //   await supabase.from('withdrawals').insert({
    //     bank_name: selected.bank_name,
    //     account_number: selected.account_number,
    //     amount: amt,
    //     status: 'pin_pending',
    //   });
    // } catch {}

    router.push(
      `/withdraw/confirm?amount=${encodeURIComponent(
        amt
      )}&bank=${encodeURIComponent(selected.bank_name)}&account=${encodeURIComponent(
        selected.account_number
      )}`
    );
  }

  return (
    <main style={wrap}>
      <header style={header}>
        <button onClick={() => router.back()} style={backBtn} aria-label="Back">‹</button>
        <h2 style={title}>Withdraw</h2>
        <div style={{ width: 24 }} />
      </header>

      {/* Balance card (static showcase) */}
      <div style={balanceCard}>
        <span style={{ color: '#cfe0ff' }}>Your Balance</span>
        <div style={balVal}>₦500,000.00</div>
      </div>

      {/* Bank select */}
      <label style={label}>Bank Account</label>
      <div style={selectField}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={selectEl}
        >
          {banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.bank_name} • {b.account_number}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <label style={label}>Enter Amount</label>
      <div style={inputField}>
        <input
          style={inputEl}
          inputMode="numeric"
          placeholder="₦0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Summary */}
      <div style={summaryBox}>
        <div style={row}>
          <span>Amount</span>
          <b>{`₦${Number((amount || '0').replace(/[^\d.]/g, '') || 0).toLocaleString()}`}</b>
        </div>
        <div style={row}>
          <span>Fee</span>
          <b style={{ color: '#16a34a' }}>free</b>
        </div>
      </div>

      <button style={primaryBtn} onClick={handleWithdraw}>Withdraw</button>
    </main>
  );
}

/* ------------ styles ------------ */
const wrap = { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#F6F4FC', padding: 16 };
const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const backBtn = { width: 24, height: 24, borderRadius: 999, border: '1px solid #E6EAF2', background: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, cursor: 'pointer' };
const title = { margin: 0, fontSize: 20, fontWeight: 800, color: '#101828' };

const balanceCard = { marginTop: 16, marginBottom: 16, background: 'linear-gradient(180deg,#1e4ed8,#0b3edb)', borderRadius: 18, padding: '16px 18px', color: '#fff', boxShadow: '0 10px 30px rgba(12,71,249,0.15)' };
const balVal = { fontSize: 20, fontWeight: 800 };

const label = { display: 'block', margin: '10px 2px 6px', fontSize: 14, fontWeight: 700, color: '#0b1220' };
const fieldBase = { width: 406, height: 71, maxWidth: '100%', background: '#fff', border: '1px solid #E6EAF2', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 12px' };
const selectField = { ...fieldBase };
const inputField = { ...fieldBase };

const selectEl = { width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 16 };
const inputEl = { width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 16 };

const summaryBox = { marginTop: 12, background: '#fff', border: '1px solid #E6EAF2', borderRadius: 12, padding: 12 };
const row = { display: 'flex', justifyContent: 'space-between', padding: '6px 2px' };

const primaryBtn = { width: 409, height: 55, maxWidth: '100%', background: '#2864F8', color: '#fff', fontWeight: 700, border: 0, borderRadius: 12, margin: '18px auto 0', display: 'block', cursor: 'pointer' };
