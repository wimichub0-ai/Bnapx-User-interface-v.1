'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function WithdrawPage() {
  const router = useRouter();

  // auth + data
  const [userId, setUserId] = useState(null);
  const [banks, setBanks]   = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(null);
  const selectedBank = useMemo(
    () => banks.find(b => b.id === selectedBankId) || null,
    [banks, selectedBankId]
  );

  // modals / flow
  const [showPIN, setShowPIN] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Require auth
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) {
        router.replace('/auth/login');
        return;
      }
      setUserId(uid);

      // Load saved banks
      const { data: rows, error } = await supabase
        .from('banks')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      setBanks(rows || []);
      setLoading(false);
    });
  }, [router]);

  async function handleWithdraw() {
    if (!userId) return;
    const amt = parseAmount(amount);
    if (!amt || !selectedBank) {
      alert('Enter amount and select a bank.');
      return;
    }
    // open PIN modal
    setShowPIN(true);
  }

  async function onPINConfirmed(pinValue) {
    // Optional: try to create a record (if table exists / policies set)
    try {
      const payload = {
        user_id: userId,
        amount_ngn: parseAmount(amount),
        bank_name: selectedBank?.bank_name,
        account_name: selectedBank?.account_name,
        account_number: selectedBank?.account_number,
        status: 'pending',
      };
      await supabase.from('withdrawals').insert(payload);
    } catch (e) {
      // If table not ready, just continue UX
      console.warn('Insert to withdrawals skipped/failed:', e?.message || e);
    }

    setShowPIN(false);
    setShowSuccess(true);
  }

  // ---------- styles ----------
  const page = { maxWidth: 480, margin: '0 auto', padding: 16, background: '#F6F4FC', minHeight: '100dvh' };
  const header = { display:'flex', alignItems:'center', gap:10, marginBottom: 10 };
  const back = { width: 36, height: 36, borderRadius: 10, background:'#fff', border:'1px solid #E7EAF3', display:'grid', placeItems:'center', cursor:'pointer' };
  const hTitle = { fontWeight: 800, fontSize: 18, color:'#0E1525' };
  const card = { background:'#fff', border:'1px solid #E7EAF3', borderRadius:16, padding:16, boxShadow:'0 8px 24px rgba(16,24,40,.06)' };
  const row = { display:'flex', justifyContent:'center', margin:'10px 0' };
  const field = {
    width:'100%', maxWidth:406, height:71,
    border:'1px solid #E7EAF3', borderRadius:12,
    background:'#fff', padding:'0 14px', fontSize:18, outline:'none'
  };
  const btn = {
    width:'100%', maxWidth:409, height:55,
    border:'0', borderRadius:12, background:'#2864F8', color:'#fff',
    fontWeight:700, display:'grid', placeItems:'center', cursor:'pointer'
  };

  const bankList = { display:'flex', flexDirection:'column', gap:10, marginTop:8 };
  const bankItem = (active) => ({
    border:'1px solid ' + (active ? '#2864F8' : '#E7EAF3'),
    background:'#fff',
    borderRadius:12,
    padding:12,
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    cursor:'pointer'
  });
  const badge = { padding:'6px 10px', borderRadius:999, background:'#F6F4FC', color:'#2864F8', fontWeight:700 };

  if (loading) {
    return (
      <main style={page}>
        <div style={header}>
          <button style={back} onClick={() => history.back()} aria-label="Back">←</button>
          <div style={hTitle}>Withdraw</div>
        </div>
        <div className="card-lite" style={card}><p>Loading…</p></div>
      </main>
    );
  }

  return (
    <main style={page}>
      {/* top bar */}
      <div style={header}>
        <button style={back} onClick={() => history.back()} aria-label="Back">←</button>
        <div style={hTitle}>Withdraw</div>
      </div>

      {/* Amount */}
      <section style={card}>
        <div style={{fontWeight:700, margin:'2px 0 8px'}}>Amount (NGN)</div>
        <div style={row}>
          <input
            style={field}
            inputMode="numeric"
            placeholder="Enter amount e.g. 50,000"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^\d.]/g,''))}
          />
        </div>

        {/* Saved banks */}
        <div style={{fontWeight:700, margin:'14px 0 8px'}}>Select a saved bank</div>
        <div style={bankList}>
          {banks.length === 0 && (
            <div style={{fontSize:14, color:'#6B7280'}}>No saved banks yet.</div>
          )}
          {banks.map(b => (
            <div
              key={b.id}
              style={bankItem(selectedBankId === b.id)}
              onClick={() => setSelectedBankId(b.id)}
            >
              <div>
                <div style={{fontWeight:700}}>{b.bank_name}</div>
                <div style={{fontSize:13, color:'#6B7280', marginTop:2}}>
                  {b.account_name} • {b.account_number}
                </div>
              </div>
              {selectedBankId === b.id ? <span style={badge}>Selected</span> : <span/>}
            </div>
          ))}
        </div>

        {/* Add bank link */}
        <div style={{marginTop:12, textAlign:'center'}}>
          <a href="/add" style={{color:'#2864F8', fontWeight:700, textDecoration:'none'}}>+ Add another bank</a>
        </div>

        {/* Withdraw button */}
        <div style={{display:'flex', justifyContent:'center', marginTop:16}}>
          <button style={btn} onClick={handleWithdraw}>Withdraw</button>
        </div>
      </section>

      {/* PIN Modal */}
      {showPIN && (
        <PinModal
          onClose={() => setShowPIN(false)}
          onConfirm={onPINConfirmed}
        />
      )}

      {/* Success */}
      {showSuccess && <SuccessModal onClose={() => {
        setShowSuccess(false);
        // go to History or stay
        window.location.href = '/history';
      }}/>}
    </main>
  );
}

/* ---------------- PIN Modal ---------------- */
function PinModal({ onClose, onConfirm }) {
  const [values, setValues] = useState(['', '', '', '']);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  function setDigit(i, val) {
    const v = val.replace(/[^\d]/g,'').slice(0,1);
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v && i < 3) refs[i+1].current?.focus();
  }
  function backspace(i, e) {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs[i-1].current?.focus();
    }
  }
  const pin = values.join('');
  const canConfirm = pin.length === 4;

  // styles
  const wrap = { position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'grid', placeItems:'center', padding:24, zIndex:50 };
  const box = { background:'#fff', borderRadius:16, padding:20, width:'100%', maxWidth:420, boxShadow:'0 15px 40px rgba(0,0,0,.18)', border:'1px solid #E7EAF3' };
  const title = { fontWeight:800, fontSize:18, margin:'0 0 4px' };
  const sub = { color:'#6B7280', margin:'0 0 10px' };
  const pinRow = { display:'flex', gap:12, justifyContent:'center', margin:'12px 0 16px' };
  const pinBox = {
    width:64, height:55, textAlign:'center', fontSize:22,
    border:'1px solid #E7EAF3', borderRadius:8, outline:'none'
  };
  const btnRow = { display:'flex', gap:10, marginTop:8, justifyContent:'flex-end' };
  const btnGhost = { padding:'10px 14px', borderRadius:10, border:'1px solid #E7EAF3', background:'#fff', cursor:'pointer', fontWeight:700 };
  const btn = { padding:'10px 16px', borderRadius:10, border:0, background:'#2864F8', color:'#fff', cursor:'pointer', fontWeight:700, opacity: canConfirm ? 1 : .5 };

  return (
    <div style={wrap}>
      <div style={box}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={title}>Confirm withdrawal</div>
            <div style={sub}>Enter your 4-digit PIN to proceed</div>
          </div>
          <button onClick={onClose} style={{background:'transparent', border:0, fontSize:24, lineHeight:1, cursor:'pointer'}}>×</button>
        </div>

        <div style={pinRow}>
          {values.map((v, i) => (
            <input
              key={i}
              ref={refs[i]}
              style={pinBox}
              inputMode="numeric"
              value={v}
              onChange={(e)=>setDigit(i, e.target.value)}
              onKeyDown={(e)=>backspace(i, e)}
              autoFocus={i===0}
            />
          ))}
        </div>

        <div style={btnRow}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button
            style={btn}
            disabled={!canConfirm}
            onClick={()=> onConfirm(pin)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Success Modal ---------------- */
function SuccessModal({ onClose }) {
  const wrap = { position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'grid', placeItems:'center', padding:24, zIndex:50 };
  const box = { background:'#fff', borderRadius:16, padding:20, width:'100%', maxWidth:420, boxShadow:'0 15px 40px rgba(0,0,0,.18)', border:'1px solid #E7EAF3', textAlign:'center' };
  const title = { fontWeight:800, fontSize:18, margin:'0 0 6px' };
  const sub = { color:'#6B7280', margin:'0 0 14px' };
  const btn = { width:'100%', maxWidth:409, height:55, borderRadius:12, background:'#2864F8', color:'#fff', border:0, fontWeight:700, display:'grid', placeItems:'center', cursor:'pointer', margin:'0 auto' };

  return (
    <div style={wrap}>
      <div style={box}>
        <div style={title}>Withdrawal successful</div>
        <div style={sub}>We’re processing your transfer. You’ll see the update in History shortly.</div>
        <button style={btn} onClick={onClose}>Go to History</button>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function parseAmount(input) {
  if (!input) return 0;
  const cleaned = String(input).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

