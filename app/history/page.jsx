'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) { setRows([]); setLoading(false); return; }

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending:false });

      if (error) console.error(error);
      setRows(data || []);
      setLoading(false);
    }
    load();
  },[]);

  if (loading) return <main className="container"><p>Loading…</p></main>;
  if (!rows.length) return <main className="container"><h2>Transaction History</h2><p className="small">No trades yet.</p></main>;

  return (
    <main className="container">
      <h2 style={{fontWeight:800, margin:'8px 2px 12px'}}>Transaction History</h2>
      <div className="card-lite" style={{padding:0}}>
        {rows.map((r)=>(
          <div key={r.id} style={{padding:'12px 16px', borderBottom:'1px solid #E7EAF3'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:700}}>
              <span>{r.type.toUpperCase()} • {r.asset} ({r.network_code})</span>
              <span style={{textTransform:'capitalize',
                color: r.status==='pending' ? '#b45309' :
                       r.status==='paid' ? '#0ea5e9' :
                       r.status==='completed' ? '#16a34a' : '#dc2626'
              }}>{r.status}</span>
            </div>
            <div className="small" style={{marginTop:4}}>
              ${Number(r.usd_amount||0).toLocaleString()} ≈ {new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(r.ngn_amount||0)}
            </div>
            {r.to_address && <div className="small" style={{marginTop:4}}>Address: {r.to_address}</div>}
            {r.tx_ref && <div className="small" style={{marginTop:4}}>Ref: {r.tx_ref}</div>}
            <div className="small" style={{marginTop:4}}>{new Date(r.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

