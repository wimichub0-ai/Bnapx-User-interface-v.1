'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage(){
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [trades, setTrades] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // ---- Auth + Load ----
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data?.session?.user?.id;
      if (!uid) {
        router.replace('/auth/login');
        return;
      }
      setUserId(uid);

      // Load both tables
      const [{ data: tRows, error: tErr }, { data: wRows, error: wErr }] = await Promise.all([
        supabase.from('trades').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
        supabase.from('withdrawals').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      ]);

      if (tErr) console.error('trades error', tErr);
      if (wErr) console.error('withdrawals error', wErr);

      setTrades(tRows || []);
      setWithdrawals(wRows || []);
      setLoading(false);
    })();
  }, [router]);

  // ---- Normalize & group by day ----
  const grouped = useMemo(() => {
    // shape both into one list with common fields
    const items = [
      ...trades.map(t => ({
        kind: 'trade',
        id: t.id,
        created_at: t.created_at,
        title: `${t.type?.toUpperCase?.() || 'TRADE'} • ${t.asset} (${t.network_code})`,
        status: t.status || 'pending',
        right: `${formatUSD(t.usd_amount)} • ${formatNGN(t.ngn_amount)}`,
        extra: [
          t.to_address ? `Address: ${t.to_address}` : null,
          t.tx_ref ? `Ref: ${t.tx_ref}` : null
        ].filter(Boolean)
      })),
      ...withdrawals.map(w => ({
        kind: 'withdrawal',
        id: w.id,
        created_at: w.created_at,
        title: `WITHDRAWAL • ${w.bank_name}`,
        status: w.status || 'pending',
        right: `${formatNGN(w.amount_ngn)}`,
        extra: [
          w.account_name ? `Acct Name: ${w.account_name}` : null,
          w.account_number ? `Acct No: ${w.account_number}` : null
        ].filter(Boolean)
      }))
    ];

    // sort desc
    items.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    // group by date key
    const map = new Map();
    for (const it of items) {
      const key = dateKey(it.created_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    // to array with order preserved by first appearance (already sorted)
    const blocks = [];
    for (const [key, list] of map.entries()) {
      blocks.push({ label: prettyDateLabel(key), items: list });
    }
    // ensure Today/Yesterday appear before others (they already will due to sorting)
    return blocks;
  }, [trades, withdrawals]);

  // ---- styles ----
  const page = { maxWidth: 480, margin: '0 auto', padding: 16, minHeight: '100dvh', background:'#fff' };
  const header = { display:'flex', alignItems:'center', gap:10, marginBottom: 8 };
  const back = { width: 36, height: 36, borderRadius: 10, background:'#F6F4FC', border:'1px solid #E7EAF3', display:'grid', placeItems:'center', cursor:'pointer' };
  const title = { fontWeight: 800, fontSize: 18, color:'#0E1525' };

  const section = { background:'#fff', border:'1px solid #E7EAF3', borderRadius:16, boxShadow:'0 8px 24px rgba(16,24,40,.06)' };
  const dayHeader = { fontWeight:800, color:'#0E1525', margin:'14px 4px 8px' };
  const row = { padding:'12px 16px', borderTop:'1px solid #EEF0F6' };
  const firstRow = { ...row, borderTop:'none' };
  const lineTop = { display:'flex', justifyContent:'space-between', alignItems:'center', fontWeight:700, color:'#101828' };
  const lineSub = { marginTop:4, fontSize:13, color:'#667085' };
  const chip = (status) => ({
    textTransform:'capitalize',
    fontSize:12,
    padding:'4px 8px',
    borderRadius:999,
    border:'1px solid ' + chipColor(status).border,
    color: chipColor(status).text,
    background: chipColor(status).bg,
  });

  if (loading) {
    return (
      <main style={page}>
        <div style={header}>
          <button style={back} onClick={() => history.back()} aria-label="Back">←</button>
          <div style={title}>Transaction History</div>
        </div>
        <div style={{...section, padding:16}}><p>Loading…</p></div>
      </main>
    );
  }

  const totalCount = (trades?.length || 0) + (withdrawals?.length || 0);

  if (!totalCount) {
    return (
      <main style={page}>
        <div style={header}>
          <button style={back} onClick={() => history.back()} aria-label="Back">←</button>
          <div style={title}>Transaction History</div>
        </div>
        <div style={{...section, padding:16}}>
          <p className="small" style={{ margin:0 }}>No trades or withdrawals yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={header}>
        <button style={back} onClick={() => history.back()} aria-label="Back">←</button>
        <div style={title}>Transaction History</div>
      </div>

      {grouped.map((block, bi) => (
        <section key={bi} style={{...section, marginTop:12}}>
          <div style={dayHeader}>{block.label}</div>
          <div style={{paddingBottom:4}}>
            {block.items.map((it, i) => (
              <div key={it.kind + it.id} style={i===0 ? firstRow : row}>
                <div style={lineTop}>
                  <span>{it.title}</span>
                  <span style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span style={{fontWeight:700, color:'#0E1525'}}>{it.right}</span>
                    <span style={chip(it.status)}>{it.status}</span>
                  </span>
                </div>
                <div style={lineSub}>
                  {new Date(it.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  {it.extra?.length ? ' • ' + it.extra.join(' • ') : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

/* ---------------- helpers ---------------- */

function formatNGN(n){
  const v = Number(n || 0);
  try {
    return new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits: 2 }).format(v);
  } catch {
    return `₦${v.toLocaleString()}`;
  }
}
function formatUSD(n){
  const v = Number(n || 0);
  try {
    return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits: 2 }).format(v);
  } catch {
    return `$${v.toLocaleString()}`;
  }
}

// yyyy-mm-dd
function dateKey(iso){
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function prettyDateLabel(key){
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const tKey = dateKey(today.toISOString());
  const yKey = dateKey(yesterday.toISOString());
  if (key === tKey) return 'Today';
  if (key === yKey) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m-1, d).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
}

function chipColor(status){
  // pending (amber), paid (sky), completed (green), failed/cancelled (red), fallback gray
  const s = String(status || '').toLowerCase();
  if (s === 'pending')   return { bg:'#FFFAEB', text:'#B45309', border:'#FED7AA' };
  if (s === 'paid')      return { bg:'#ECFEFF', text:'#0EA5E9', border:'#BAE6FD' };
  if (s === 'completed') return { bg:'#ECFDF5', text:'#16A34A', border:'#BBF7D0' };
  if (s === 'failed' || s === 'cancelled') return { bg:'#FEF2F2', text:'#DC2626', border:'#FECACA' };
  return { bg:'#F4F4F5', text:'#3F3F46', border:'#E4E4E7' };
}
