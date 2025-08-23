
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      setAuthed(!!user);
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending:false });

      if (!mounted) return;
      if (error) console.error(error);
      setRows(data || []);
      setLoading(false);
    })();

    return ()=>{ mounted=false; };
  },[]);

  if (loading) return <main className="wrap"><p>Loading…</p><style jsx>{css}</style></main>;

  if (!authed) {
    return (
      <main className="wrap">
        <h2 className="h2">Transaction History</h2>
        <p className="muted">Please <Link href="/auth/login">login</Link> to see your trades.</p>
        <style jsx>{css}</style>
      </main>
    );
  }

  if (!rows.length) {
    return (
      <main className="wrap">
        <h2 className="h2">Transaction History</h2>
        <p className="muted">No trades yet.</p>
        <style jsx>{css}</style>
      </main>
    );
  }

  return (
    <main className="wrap">
      <h2 className="h2">Transaction History</h2>
      <div className="card">
        {rows.map((r)=>(
          <div key={r.id} className="row">
            <div className="top">
              <span className="left">{r.type?.toUpperCase()} • {r.asset} ({r.network_code})</span>
              <span className={`status s-${r.status || 'pending'}`}>{r.status}</span>
            </div>
            <div className="small">${Number(r.usd_amount||0).toLocaleString()} ≈ {new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(r.ngn_amount||0)}</div>
            {r.to_address && <div className="small">Address: {r.to_address}</div>}
            {r.tx_ref && <div className="small">Ref: {r.tx_ref}</div>}
            <div className="small">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</div>
          </div>
        ))}
      </div>

      <style jsx>{css}</style>
    </main>
  );
}

const css = `
  .wrap{ min-height:100dvh; background:#F6F4FC; padding:16px; }
  .h2{ font-weight:800; margin:6px 0 12px; color:#0f172a; }
  .muted{ color:#667085; }
  .card{
    background:#fff; border-radius:20px; box-shadow:0 10px 30px rgba(16,24,40,.08);
    border:1px solid #E7EAF3; padding:0;
  }
  .row{ padding:12px 16px; border-bottom:1px solid #E7EAF3; }
  .row:last-child{ border-bottom:0; }
  .top{ display:flex; justify-content:space-between; font-weight:700; }
  .left{ color:#0f172a; }
  .status{ text-transform:capitalize; }
  .s-pending{ color:#b45309; }
  .s-paid{ color:#0ea5e9; }
  .s-completed{ color:#16a34a; }
  .s-cancelled{ color:#dc2626; }
  .small{ margin-top:4px; font-size:12px; color:#667085; }
`;
