'use client';
import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const RATES = {
  'USDT-TRC20': 1785,
  'USDT-ERC20': 1795,
  'USDT-BEP20': 1780,
  'USDC-ERC20': 1790,
  'BTC': 1785, // demo: treat as NGN per $ to show Naira calc
};
const NETWORKS = [
  { code: 'USDT-TRC20', label: 'USDT • TRC20', asset: 'USDT' },
  { code: 'USDT-ERC20', label: 'USDT • ERC20', asset: 'USDT' },
  { code: 'USDT-BEP20', label: 'USDT • BEP20', asset: 'USDT' },
  { code: 'USDC-ERC20', label: 'USDC • ERC20', asset: 'USDC' },
  { code: 'BTC',        label: 'BTC • Mainnet', asset: 'BTC' },
];
const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

function parseAmount(s){ const n = parseFloat(String(s).replace(/[^\d.]/g,'')); return Number.isFinite(n)? n: 0; }
function formatNaira(n){ try{ return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:2}).format(n||0) }catch{return `₦${(n||0).toLocaleString()}`}}
function quoteNairaFromUSD(usd, net){ const r = RATES[net]; return r>0 ? usd * r : 0; }
function formatCrypto(n,a){ return `${Number(n||0).toFixed(a==='BTC'?8:4)} ${a}`; }

export default function TradePage(){
  const [tab, setTab] = useState('sell'); // sell | buy | giftcard
  return (
    <main className="wrap">
      <h2 className="h2">Trade</h2>

      {/* Segmented tabs */}
      <div className="tabs">
        <button className={`tab ${tab==='sell'?'active':''}`} onClick={()=>setTab('sell')}>Sell Crypto</button>
        <button className={`tab ${tab==='buy'?'active':''}`} onClick={()=>setTab('buy')}>Buy Crypto</button>
        <button className={`tab ${tab==='giftcard'?'active':''}`} onClick={()=>setTab('giftcard')}>Sell Giftcard</button>
      </div>

      {tab==='sell' && <SellCard/>}
      {tab==='buy' && <BuyCard/>}
      {tab==='giftcard' && <GiftcardCard/>}

      <style jsx>{`
        .wrap{ min-height:100dvh; padding:16px; padding-bottom:90px; background:#fff; }
        .h2{ font-weight:800; margin:8px 2px 12px; }
        .tabs{ position:relative; z-index:1; display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:8px 0 12px; }
        .tab{ padding:12px; border:1px solid #E7EAF3; border-radius:12px; background:#fff; font-weight:700; }
        .tab.active{ background:#0C47F9; color:#fff; border-color:#0C47F9; }
        .card{
          position:relative; z-index:0; background:#fff; border:1px solid #E7EAF3; border-radius:16px; box-shadow:0 8px 24px rgba(16,24,40,.06);
          padding:16px; margin-top:2px;
        }
        .grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .field{ display:flex; align-items:center; border:1px solid #E7EAF3; border-radius:12px; background:#fff; padding:10px 12px; }
        .field input, .field select{ flex:1; border:0; outline:0; font-size:16px; height:40px; background:transparent; }
        .note{ font-size:12px; color:#667085; margin-top:6px; }
        .copyrow{ display:flex; gap:8px; }
        .copybtn{ width:80px; height:38px; border-radius:8px; background:#F6F4FC; border:1px solid #E7EAF3; font-weight:700; }
        .btn{ width:409px; height:55px; border-radius:12px; border:0; background:#2864F8; color:#fff; font-weight:800; display:grid; place-items:center; margin:10px auto 0; }
        @media (max-width:430px){ .btn{ width:100%; max-width:409px; } .grid{ grid-template-columns:1fr; } }
      `}</style>
    </main>
  );
}

/* ---------------- SELL ---------------- */
function SellCard(){
  const [network, setNet] = useState('USDT-TRC20');
  const [usd, setUSD] = useState('');
  const [copied, setCopied] = useState(false);

  const asset = useMemo(()=> NETWORKS.find(n=>n.code===network)?.asset || 'USDT', [network]);
  const amountUSD = parseAmount(usd);
  const naira = useMemo(()=> quoteNairaFromUSD(amountUSD, network), [amountUSD, network]);

  async function copyAddr(){
    try{ await navigator.clipboard.writeText(BNAPX_WALLET); setCopied(true); setTimeout(()=>setCopied(false),1200); }catch{}
  }

  return (
    <section className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:800}}>Sell Crypto</div>
        <span className="note" style={{background:'#F6F4FC',padding:'6px 10px',borderRadius:999,color:'#0C47F9'}}>Instant</span>
      </div>

      <div className="grid">
        <div>
          <div className="note" style={{fontWeight:700, marginBottom:6}}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNet(e.target.value)}>
              {NETWORKS.map(n=> <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="note" style={{fontWeight:700, marginBottom:6}}>Amount (USD)</div>
          <div className="field">
            <input placeholder="$ 0.00" inputMode="decimal" value={usd} onChange={e=>setUSD(e.target.value)} />
          </div>
          <div className="note">Est. You’ll receive: <b>{formatNaira(naira)}</b></div>
          <div className="note">Rate: <b>{formatNaira(RATES[network])}</b> per $1</div>
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="note" style={{fontWeight:700, marginBottom:6}}>Send to this wallet</div>
        <div className="copyrow">
          <input readOnly className="field" style={{flex:1}} value={BNAPX_WALLET}/>
          <button type="button" className="copybtn" onClick={copyAddr}>{copied? 'Copied':'Copy'}</button>
        </div>
      </div>

      <button className="btn" onClick={()=>alert('Marked as Pending (demo)')}>I have sent</button>
      <div className="note">We’ll verify on-chain and update your status.</div>
    </section>
  );
}

/* ---------------- BUY ---------------- */
function BuyCard(){
  const [network, setNet] = useState('USDT-TRC20');
  const [usd, setUSD] = useState('');
  const [toAddr, setAddr] = useState('');

  const asset = useMemo(()=> NETWORKS.find(n=>n.code===network)?.asset || 'USDT', [network]);
  const amountUSD = parseAmount(usd);
  const naira = useMemo(()=> quoteNairaFromUSD(amountUSD, network), [amountUSD, network]);

  function createOrder(){
    alert(`Buy: ${amountUSD} USD → ${formatNaira(naira)} on ${network}\nSend to: ${toAddr}\n(Pending)`);
  }

  return (
    <section className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:800}}>Buy Crypto</div>
        <span className="note" style={{background:'#F6F4FC',padding:'6px 10px',borderRadius:999,color:'#0C47F9'}}>Best rates</span>
      </div>

      <div className="grid">
        <div>
          <div className="note" style={{fontWeight:700, marginBottom:6}}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNet(e.target.value)}>
              {NETWORKS.map(n=> <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="note" style={{fontWeight:700, marginBottom:6}}>Amount (USD)</div>
          <div className="field">
            <input placeholder="$ 0.00" inputMode="decimal" value={usd} onChange={e=>setUSD(e.target.value)} />
          </div>
          <div className="note">Est. You’ll pay: <b>{formatNaira(naira)}</b></div>
          <div className="note">Rate: <b>{formatNaira(RATES[network])}</b> per $1</div>
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="note" style={{fontWeight:700, marginBottom:6}}>Your wallet address (receive)</div>
        <div className="field">
          <input placeholder="Paste the wallet to receive crypto" value={toAddr} onChange={e=>setAddr(e.target.value)} />
        </div>
      </div>

      <button className="btn" onClick={createOrder}>Create Order</button>
    </section>
  );
}

/* ---------------- Giftcard placeholder ---------------- */
function GiftcardCard(){
  return (
    <section className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:800}}>Sell Giftcard</div>
        <span className="note" style={{background:'#F6F4FC',padding:'6px 10px',borderRadius:999,color:'#0C47F9'}}>Coming soon</span>
      </div>
      <div className="note">Giftcard Redeeming with sharp rate coming soon.</div>
    </section>
  );
}



