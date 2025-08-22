// app/trade/page.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/* ---------------- RATES (prototype) ---------------- */
const RATES = {
  'USDT-TRC20': 1785,
  'USDT-ERC20': 1795,
  'USDT-BEP20': 1780,
  'USDC-ERC20': 1790,
  'BTC': 1785, // demo
};
const NETWORKS = [
  { code: 'USDT-TRC20', label: 'USDT • TRC20', asset: 'USDT' },
  { code: 'USDT-ERC20', label: 'USDT • ERC20', asset: 'USDT' },
  { code: 'USDT-BEP20', label: 'USDT • BEP20', asset: 'USDT' },
  { code: 'USDC-ERC20', label: 'USDC • ERC20', asset: 'USDC' },
  { code: 'BTC',        label: 'BTC • Mainnet', asset: 'BTC' },
];
const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

/* helpers */
const parseAmount = (s)=> {
  if (!s) return 0;
  const n = parseFloat(String(s).replace(/[^\d.]/g,''));
  return Number.isFinite(n) ? n : 0;
};
const formatNaira = (n)=> new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:2}).format(n);
const quoteNairaFromUSD = (usd, code)=> (RATES[code] || 0) * usd;

/* ---------------- Page ---------------- */
export default function TradePage() {
  const router = useRouter();

  // simple auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/auth/login');
    });
  }, [router]);

  const [tab, setTab] = useState('sell');
  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <h2 style={{ fontWeight: 800, margin: '8px 2px 12px' }}>Trade</h2>

      <div className="tabs">
        <button className={`tab ${tab==='sell' ? 'tab--active' : ''}`} onClick={()=>setTab('sell')}>Sell Crypto</button>
        <button className={`tab ${tab==='buy' ? 'tab--active' : ''}`} onClick={()=>setTab('buy')}>Buy Crypto</button>
        <button className={`tab ${tab==='giftcard' ? 'tab--active' : ''}`} onClick={()=>setTab('giftcard')}>Sell Giftcard</button>
      </div>

      {tab==='sell' && <SellCard />}
      {tab==='buy' && <BuyCard />}
      {tab==='giftcard' && <GiftcardCard />}
    </main>
  );
}

/* ------- SELL ------- */
function SellCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [usd, setUsd] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const asset = useMemo(()=> NETWORKS.find(n=>n.code===network)?.asset || 'USDT', [network]);
  const usdVal = parseAmount(usd);
  const ngn = useMemo(()=> quoteNairaFromUSD(usdVal, network), [usdVal, network]);
  const rateNGN = RATES[network] || 0;

  async function copyAddr(){
    try{
      await navigator.clipboard.writeText(BNAPX_WALLET);
      setCopied(true); setTimeout(()=>setCopied(false), 1200);
    }catch{}
  }
  async function createPending(){
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return alert('Please login');

    const { error } = await supabase.from('trades').insert([{
      user_id: user.id,
      type: 'sell',
      asset,
      network_code: network,
      usd_amount: usdVal,
      ngn_amount: ngn,
      status: 'pending',
      to_address: BNAPX_WALLET
    }]);
    if (error) return alert(error.message);
    alert('Marked as Pending');
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
        <div style={{ fontSize:18, fontWeight:800 }}>Sell Crypto</div>
        <span className="small" style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:999, color:'var(--brand)' }}>Instant</span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n=> <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Amount (USD)</div>
          <div className="field">
            <input placeholder="$ 0.00" inputMode="decimal" value={usd} onChange={e=>setUsd(e.target.value)} />
          </div>
          <div className="small" style={{ marginTop:6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per $1
          </div>
          <div className="small" style={{ marginTop:2 }}>
            You’ll get ≈ <b>{formatNaira(ngn)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop:10 }}>
        <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Send to this wallet</div>
        <div className="wallet-display">
          <input readOnly value={BNAPX_WALLET} />
          <button className="copy-btn" type="button" onClick={copyAddr}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>

      <button className="btn" style={{ marginTop:12 }} onClick={()=>setConfirmOpen(true)}>I have sent</button>
      <div className="small" style={{ marginTop:8 }}>
        We’ll verify on-chain and update your status to <b>Paid</b> when confirmed.
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Confirm transfer"
          desc={`Confirm you sent ${usdVal ? `$${usdVal.toLocaleString()}` : '$0'} on ${network}. We’ll mark this as Pending.`}
          onClose={()=>setConfirmOpen(false)}
          onConfirm={()=>{ setConfirmOpen(false); createPending(); }}
        />
      )}
    </section>
  );
}

/* ------- BUY ------- */
function BuyCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [usd, setUsd] = useState('');
  const [toAddr, setToAddr] = useState('');

  const usdVal = parseAmount(usd);
  const ngn = useMemo(()=> quoteNairaFromUSD(usdVal, network), [usdVal, network]);
  const rateNGN = RATES[network] || 0;

  async function createOrder(){
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return alert('Please login');

    const asset = NETWORKS.find(n=>n.code===network)?.asset || 'USDT';
    const { error } = await supabase.from('trades').insert([{
      user_id: user.id,
      type: 'buy',
      asset,
      network_code: network,
      usd_amount: usdVal,
      ngn_amount: ngn,
      status: 'pending',
      to_address: toAddr
    }]);
    if (error) return alert(error.message);
    alert('Buy order created (Pending)');
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
        <div style={{ fontSize:18, fontWeight:800 }}>Buy Crypto</div>
        <span className="small" style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:999, color:'var(--brand)' }}>Best rates</span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n=> <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Amount (USD)</div>
          <div className="field">
            <input placeholder="$ 0.00" inputMode="decimal" value={usd} onChange={e=>setUsd(e.target.value)} />
          </div>
          <div className="small" style={{ marginTop:6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per $1
          </div>
          <div className="small" style={{ marginTop:2 }}>
            You’ll pay ≈ <b>{formatNaira(ngn)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop:8 }}>
        <div className="small" style={{ fontWeight:700, marginBottom:6 }}>Your wallet address (receive)</div>
        <div className="field">
          <input placeholder="Paste the wallet to receive crypto" value={toAddr} onChange={e=>setToAddr(e.target.value)} />
        </div>
      </div>

      <button className="btn" style={{ marginTop:10 }} onClick={createOrder}>Create Test Payment</button>
      <div className="small" style={{ marginTop:8 }}>
        We’ll send the crypto to the address above once payment is confirmed.
      </div>
    </section>
  );
}

/* ------- GIFTCARD (placeholder) ------- */
function GiftcardCard(){
  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
        <div style={{ fontSize:18, fontWeight:800 }}>Sell Giftcard</div>
        <span className="small" style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:999, color:'var(--brand)' }}>Coming soon</span>
      </div>
      <div className="small">UI will match your giftcard flow with logos, categories, and rates.</div>
    </section>
  );
}

/* ------- Modal ------- */
function ConfirmModal({ title, desc, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

