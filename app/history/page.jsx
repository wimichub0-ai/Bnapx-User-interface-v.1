'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function HistoryPage(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setRows([]); setLoading(false); return; }
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      setRows(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <h2 style={{ fontWeight: 800, margin: '8px 2px 12px' }}>Transaction History</h2>

      {loading && <div className="small">Loading...</div>}
      {!loading && rows.length === 0 && (
        <div className="card-lite">
          <div className="small">No transactions yet.</div>
          <div className="small" style={{ marginTop: 8 }}>
            Start a trade on <Link href="/trade">Trade</Link>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gap: 10 }}>
        {rows.map(r => (
          <div key={r.id} className="card-lite" style={{display:'grid', gap:6}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <b>{r.type.toUpperCase()} • {r.asset}</b>
              <StatusBadge status={r.status} />
            </div>
            <div className="small">Network: {r.network_code}</div>
            <div className="small">Amount: ${Number(r.usd_amount||0).toLocaleString()}  •  {new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN' }).format(r.ngn_amount||0)}</div>
            {r.to_address && <div className="small" style={{wordBreak:'break-all'}}>To: {r.to_address}</div>}
            <div className="small" style={{opacity:.7}}>Ref: {r.tx_ref}</div>
            <div className="small" style={{opacity:.7}}>{new Date(r.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

function StatusBadge({ status }){
  const map = {
    pending:   { bg:'#fff7ed', color:'#c2410c', text:'Pending' },
    paid:      { bg:'#eef2ff', color:'#3730a3', text:'Paid' },
    completed: { bg:'#ecfdf5', color:'#065f46', text:'Completed' },
    failed:    { bg:'#fef2f2', color:'#991b1b', text:'Failed' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background:s.bg, color:s.color, padding:'4px 10px',
      borderRadius:999, fontSize:12, fontWeight:700
    }}>
      {s.text}
    </span>
  );
}
