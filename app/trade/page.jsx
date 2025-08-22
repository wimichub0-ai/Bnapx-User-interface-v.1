'use client';

import { useRouter } from 'next/navigation';

import { useMemo, useState } from 'react';

/* ---------------- RATES (hardcoded demo) ----------------
   Define rates as NGN per 1 unit of asset, per network (if needed).
   You can adjust these values anytime. Later we’ll fetch from DB. */
const RATES = {
  'USDT-TRC20': 1785,   // ₦ per 1 USDT (TRON)
  'USDT-ERC20': 1795,   // ₦ per 1 USDT (ETH)
  'USDT-BEP20': 1780,   // ₦ per 1 USDT (BSC)
  'USDC-ERC20': 1790,   // ₦ per 1 USDC
  'BTC':        12200000000 / 1e8, // example: ₦122,000,000 per BTC => ₦122,000,000 / 1 BTC
};

const NETWORKS = [
  { code: 'USDT-TRC20', label: 'USDT • TRC20', asset: 'USDT' },
  { code: 'USDT-ERC20', label: 'USDT • ERC20', asset: 'USDT' },
  { code: 'USDT-BEP20', label: 'USDT • BEP20', asset: 'USDT' },
  { code: 'USDC-ERC20', label: 'USDC • ERC20', asset: 'USDC' },
  { code: 'BTC',        label: 'BTC • Mainnet', asset: 'BTC' },
];

const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

/* ---------------- Helpers (USD -> NGN) ---------------- */
function formatNaira(n) {
  if (!isFinite(n)) return '₦0';
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n);
  } catch {
    return `₦${Number(n).toLocaleString()}`;
  }
}
function formatCrypto(n, asset) {
  if (!isFinite(n)) return `0 ${asset}`;
  const digits = asset === 'BTC' ? 8 : 4;
  return `${Number(n).toFixed(digits)} ${asset}`;
}
function parseAmount(input) {
  if (!input) return 0;
  const cleaned = String(input).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

/** Convert user USD input to NGN using the selected network’s rate */
function quoteNairaFromUsd(usd, networkCode) {
  const rate = RATES[networkCode]; // ₦ per 1 unit (USDT/USDC/BTC…)
  if (!rate || rate <= 0) return 0;
  return usd * rate;
}

/* ---------------- Page ---------------- */
export default function TradePage() {
  const [tab, setTab] = useState('sell'); // 'sell' | 'buy' | 'giftcard'
  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <h2 style={{ fontWeight: 800, margin: '8px 2px 12px' }}>Trade</h2>

      {/* Segmented tabs */}
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


/* ---------------- SELL (USD input) ---------------- */
function SellCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amountUSD, setAmountUSD] = useState(''); // user types USD
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue = parseAmount(amountUSD);
  const estNaira = useMemo(() => quoteNairaFromUsd(usdValue, network), [usdValue, network]);
  const rateNGN = RATES[network] || 0;
  const router = useRouter();


  async function copyAddr() {
    try {
      await navigator.clipboard.writeText(BNAPX_WALLET);
      setCopied(true);
      setTimeout(()=>setCopied(false), 1200);
    } catch {}
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Sell Crypto</div>
        <span className="small" style={{ background:'var(--bg)', padding:'6px 10px', borderRadius: 999, color:'var(--brand)' }}>Instant</span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Amount (USD)</div>
          <div className="field">
            <span style={{opacity:.6}}>$</span>
            <input
              placeholder="0.00"
              inputMode="decimal"
              value={amountUSD}
              onChange={e=>setAmountUSD(e.target.value)}
            />
          </div>
          <div className="small" style={{ marginTop: 6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per 1 {asset}
          </div>
          <div className="small" style={{ marginTop: 2 }}>
            You’ll receive approx: <b>{formatNaira(estNaira)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Send to this wallet</div>
        <div className="wallet-display">
          <input readOnly value={BNAPX_WALLET} />
          <button className="tabbtn" type="button" onClick={copyAddr} style={{ whiteSpace:'nowrap' }}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <button className="btn" style={{ marginTop: 12 }} onClick={()=>setConfirmOpen(true)}>I have sent</button>
      <div className="small" style={{ marginTop: 8 }}>
        We’ll verify on-chain and update your status to <b>Paid</b> when confirmed.
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Confirm transfer"
          desc={`You’re confirming a ${asset} transfer on ${network} for $${usdValue.toLocaleString()}. We’ll mark this trade as Pending and notify you when it’s confirmed.`}
          onClose={()=>setConfirmOpen(false)}
          onConfirm={()=>{ setConfirmOpen(false); alert('Marked as Pending'); }}
        />
      )}
    </section>
  );
} 

/* ---------------- BUY (USD input) ---------------- */
function BuyCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amountUSD, setAmountUSD] = useState('');   // user types USD
  const [toAddr, setToAddr]     = useState('');

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue  = parseAmount(amountUSD);
  const estNaira  = useMemo(() => quoteNairaFromUsd(usdValue, network), [usdValue, network]);
  const rateNGN   = RATES[network] || 0;
  const router = useRouter();

  function createOrder(){
    // Later: POST to /api/payments/create and save to DB with "Pending"
    alert(`Buy request: $${usdValue.toLocaleString()} on ${network} → ${toAddr}\nYou’ll pay: ${formatNaira(estNaira)} (Pending)`);
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Buy Crypto</div>
        <span className="small" style={{ background:'var(--bg)', padding:'6px 10px', borderRadius: 999, color:'var(--brand)' }}>Best rates</span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Amount (USD)</div>
          <div className="field">
            <span style={{opacity:.6}}>$</span>
            <input
              placeholder="0.00"
              inputMode="decimal"
              value={amountUSD}
              onChange={e=>setAmountUSD(e.target.value)}
            />
          </div>
          <div className="small" style={{ marginTop: 6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per 1 {asset}
          </div>
          <div className="small" style={{ marginTop: 2 }}>
            You’ll pay approx: <b>{formatNaira(estNaira)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Your wallet address (receive)</div>
        <div className="field">
          <input placeholder="Paste the wallet to receive crypto" value={toAddr} onChange={e=>setToAddr(e.target.value)} />
        </div>
      </div>

     <button className="btn" style={{ marginTop: 10 }} onClick={async ()=>{
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert('Please login first'); return; }
  if (!toAddr) { alert('Enter your wallet address'); return; }

  const ref = `TX-${Date.now()}`;
  const { error } = await supabase.from('trades').insert({
    user_id: user.id,
    type: 'buy',
    network_code: network,
    asset,
    usd_amount: usdValue,
    ngn_amount: estNaira,
    to_address: toAddr,     // where we will send crypto
    tx_ref: ref,
    status: 'pending'
  });

  if (error) {
    alert(`Could not create trade: ${error.message}`);
  } else {
    router.push('/history?new=1');
  }
}}>
  Proceed
</button>


/* ---------------- Modal ---------------- */
{confirmOpen && (
  <ConfirmModal
    title="Confirm transfer"
    desc={`You’re confirming a ${asset} transfer on ${network} for $${usdValue.toLocaleString()}. We’ll mark this as Pending.`}
    onClose={()=>setConfirmOpen(false)}
    onConfirm={async ()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert('Please login first'); return; }

      const ref = `TX-${Date.now()}`;
      const { error } = await supabase.from('trades').insert({
        user_id: user.id,
        type: 'sell',
        network_code: network,
        asset,
        usd_amount: usdValue,
        ngn_amount: estNaira,
        to_address: BNAPX_WALLET,
        tx_ref: ref,
        status: 'pending'
      });

      if (error) {
        alert(`Could not create trade: ${error.message}`);
      } else {
        setConfirmOpen(false);
        router.push('/history?new=1');
      }
    }}
  />
)}



