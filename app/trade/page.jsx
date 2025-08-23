'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/* --------- Rates (NGN per 1 USD-equivalent) --------- */
const RATES = {
  'USDT-TRC20': 1785,
  'USDT-ERC20': 1795,
  'USDT-BEP20': 1780,
  'USDC-ERC20': 1790,
  'BTC':        1785, // prototype calc
};

const NETWORKS = [
  { code: 'USDT-TRC20', label: 'USDT • TRC20', asset: 'USDT' },
  { code: 'USDT-ERC20', label: 'USDT • ERC20', asset: 'USDT' },
  { code: 'USDT-BEP20', label: 'USDT • BEP20', asset: 'USDT' },
  { code: 'USDC-ERC20', label: 'USDC • ERC20', asset: 'USDC' },
  { code: 'BTC',        label: 'BTC • Mainnet', asset: 'BTC' },
];

const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

/* ---------------- Helpers ---------------- */
function parseUSD(input) {
  if (!input) return 0;
  const cleaned = String(input).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}
function formatNaira(n) {
  if (!Number.isFinite(n)) return '₦0';
  try {
    return new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits:2 }).format(n);
  } catch {
    return `₦${Number(n).toLocaleString()}`;
  }
}
function formatUSD(n) {
  if (!Number.isFinite(n)) return '$0';
  try {
    return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:2 }).format(n);
  } catch {
    return `$${Number(n).toLocaleString()}`;
  }
}
function formatCrypto(n, asset) {
  if (!isFinite(n)) return `0 ${asset}`;
  const digits = asset === 'BTC' ? 8 : 4;
  return `${Number(n).toFixed(digits)} ${asset}`;
}
function ngnFromUsd(usd, networkCode) {
  const rate = RATES[networkCode];
  if (!rate || rate <= 0) return 0;
  return usd * rate;
}
function randomRef(prefix='BNX') {
  return `${prefix}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

/* ================= Page ================= */
export default function TradePage() {
  const [tab, setTab] = useState('sell'); // sell | buy | giftcard

  return (
    <main className="screen">
      <h2 className="heading">Trade</h2>

      {/* Segmented tabs */}
      <div className="tabs">
        <button className={`tab ${tab==='sell' ? 'tab--active' : ''}`} onClick={()=>setTab('sell')}>Sell Crypto</button>
        <button className={`tab ${tab==='buy' ? 'tab--active' : ''}`}  onClick={()=>setTab('buy')}>Buy Crypto</button>
        <button className={`tab ${tab==='giftcard' ? 'tab--active' : ''}`} onClick={()=>setTab('giftcard')}>Sell Giftcard</button>
      </div>

      {tab==='sell' && <SellCard/>}
      {tab==='buy' &&  <BuyCard/>}
      {tab==='giftcard' && <GiftcardCard/>}

      <style jsx>{`
        .screen{
          min-height:100dvh;
          background:#F6F4FC;
          padding:16px;
          display:flex; flex-direction:column; align-items:center;
          padding-bottom:90px;
        }
        .heading{
          width:100%; max-width:520px;
          font-weight:800; margin:6px 0 12px; color:#0f172a;
        }
        .tabs{
          width:100%; max-width:520px;
          display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;
          margin:4px 0 12px;
        }
        .tab{
          height:40px;
          border:1px solid #E7EAF3; background:#fff; color:#0f172a;
          border-radius:10px; font-weight:600; cursor:pointer;
        }
        .tab--active{
          background:#2864F8; color:#fff; border-color:#2864F8;
        }
      `}</style>
    </main>
  );
}

/* ---------------- SELL ---------------- */
function SellCard(){
  const router = useRouter();
  const [network, setNetwork] = useState('USDT-TRC20');
  const [usd, setUsd] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue = parseUSD(usd);
  const naira = useMemo(() => ngnFromUsd(usdValue, network), [usdValue, network]);
  const estCrypto = asset === 'BTC' ? usdValue / 100000 : usdValue; // placeholder demo

  async function copyAddr(){
    try {
      await navigator.clipboard.writeText(BNAPX_WALLET);
      setCopied(true);
      setTimeout(()=>setCopied(false), 1200);
    } catch {}
  }

  async function insertTrade() {
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        alert('Please login first'); 
        router.push('/auth/login'); 
        return;
      }
      const tx_ref = randomRef('SELL');
      const { error } = await supabase.from('trades').insert([
        {
          user_id: user.id,
          type: 'sell',
          asset,
          network_code: network,
          usd_amount: usdValue,
          ngn_amount: naira,
          to_address: null,
          status: 'pending',
          tx_ref,
        },
      ]);
      if (error) {
        console.error(error);
        alert('Could not create trade. Check console / Supabase RLS.');
        return;
      }
      alert('Trade marked Pending. You can see it on History.');
      router.push('/history');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <div className="cardHead">
        <div className="cardTitle">Sell Crypto</div>
        <span className="chip">Instant</span>
      </div>

      <div className="row2">
        <div className="cell">
          <div className="label">Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div className="cell">
          <div className="label">Amount (USD)</div>
          <div className="field">
            <input
              placeholder="$ 0.00"
              inputMode="decimal"
              value={usd}
              onChange={e=>setUsd(e.target.value)}
            />
          </div>
          <div className="hint">You’ll send approx: <b>{formatCrypto(estCrypto, asset)}</b></div>
          <div className="hint">We’ll pay approx: <b>{formatNaira(naira)}</b></div>
        </div>
      </div>

      <div className="walletBlock">
        <div className="label">Send to this wallet</div>
        <div className="walletRow">
          <input className="walletInput" readOnly value={BNAPX_WALLET} />
          <button className="copyBtn" type="button" onClick={copyAddr}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>

      <button className="primaryBtn" disabled={saving} onClick={()=>setConfirmOpen(true)}>
        {saving ? 'Saving…' : 'I have sent'}
      </button>
      <div className="footNote">We’ll verify on-chain and update your status to <b>Pending</b> when confirmed.</div>

      {confirmOpen && (
        <ConfirmModal
          title="Confirm transfer"
          desc={`You’re confirming a transfer on ${network}. We’ll mark this trade as Pending and notify you when it’s confirmed.`}
          onClose={()=>setConfirmOpen(false)}
          onConfirm={()=>{ setConfirmOpen(false); insertTrade(); }}
        />
      )}

      <style jsx>{baseCardCss}</style>
    </section>
  );
}

/* ---------------- BUY ---------------- */
function BuyCard(){
  const router = useRouter();
  const [network, setNetwork] = useState('USDT-TRC20');
  const [usd, setUsd] = useState('');
  const [toAddr, setToAddr] = useState('');
  const [saving, setSaving] = useState(false);

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue = parseUSD(usd);
  const naira = useMemo(() => ngnFromUsd(usdValue, network), [usdValue, network]);
  const estReceive = asset === 'BTC' ? usdValue / 100000 : usdValue; // placeholder

  async function createOrder(){
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        alert('Please login first');
        router.push('/auth/login');
        return;
      }
      if (!toAddr.trim()) {
        alert('Please enter a wallet address to receive.');
        return;
      }
      const tx_ref = randomRef('BUY');
      const { error } = await supabase.from('trades').insert([
        {
          user_id: user.id,
          type: 'buy',
          asset,
          network_code: network,
          usd_amount: usdValue,
          ngn_amount: naira,
          to_address: toAddr.trim(),
          status: 'pending',
          tx_ref,
        },
      ]);
      if (error) {
        console.error(error);
        alert('Could not create trade. Check console / Supabase RLS.');
        return;
      }
      alert('Buy order created as Pending. See History.');
      router.push('/history');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <div className="cardHead">
        <div className="cardTitle">Buy Crypto</div>
        <span className="chip chip--blue">Best rates</span>
      </div>

      <div className="row2">
        <div className="cell">
          <div className="label">Network</div>
          <div className="field">
            <select value={network} onChange={e=>setNetwork(e.target.value)}>
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div className="cell">
          <div className="label">Amount (USD)</div>
          <div className="field">
            <input
              placeholder="$ 0.00"
              inputMode="decimal"
              value={usd}
              onChange={e=>setUsd(e.target.value)}
            />
          </div>
          <div className="hint">You’ll receive approx: <b>{formatCrypto(estReceive, asset)}</b></div>
          <div className="hint">You’ll pay approx: <b>{formatNaira(naira)}</b></div>
        </div>
      </div>

      <div className="cell" style={{marginTop:8}}>
        <div className="label">Your wallet address (receive)</div>
        <div className="field">
          <input
            placeholder="Paste the wallet to receive crypto"
            value={toAddr}
            onChange={e=>setToAddr(e.target.value)}
          />
        </div>
      </div>

      <button className="primaryBtn" disabled={saving} onClick={createOrder}>
        {saving ? 'Saving…' : 'Create Test Payment'}
      </button>
      <div className="footNote">We’ll send the crypto to the address above once payment is confirmed.</div>

      <style jsx>{baseCardCss}</style>
    </section>
  );
}

/* ---------------- GIFTCARD (placeholder) ---------------- */
function GiftcardCard(){
  return (
    <section className="card">
      <div className="cardHead">
        <div className="cardTitle">Sell Giftcard</div>
        <span className="chip">Coming soon</span>
      </div>
      <div className="hint">UI will match your giftcard flow with logos, categories, and rates.</div>
      <style jsx>{baseCardCss}</style>
    </section>
  );
}

/* ---------------- Modal ---------------- */
function ConfirmModal({ title, desc, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3 className="m-title">{title}</h3>
        <p className="m-desc">{desc}</p>
        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.45);
          display:flex; align-items:center; justify-content:center;
          padding:24px;
        }
        .modal {
          width:100%; max-width:420px;
          background:#fff; border-radius:16px;
          padding:18px 16px 16px;
          box-shadow:0 15px 40px rgba(0,0,0,0.18);
          position:relative;
        }
        .modal-close {
          position:absolute; right:8px; top:4px;
          background:transparent; border:0; font-size:26px; line-height:1; cursor:pointer;
        }
        .m-title { margin:6px 0 4px; font-size:18px; font-weight:800; color:#0f172a; }
        .m-desc  { margin:0 0 10px; color:#475467; }
        .actions { display:flex; gap:8px; justify-content:flex-end; }
        .cancel {
          height:40px; padding:0 14px; border-radius:10px;
          border:1px solid #E7EAF3; background:#fff; cursor:pointer; font-weight:600;
        }
        .confirm {
          height:40px; padding:0 14px; border-radius:10px; border:0;
          background:#2864F8; color:#fff; cursor:pointer; font-weight:700;
          box-shadow:0 6px 18px rgba(40,100,248,.25);
        }
      `}</style>
    </div>
  );
}

/* ------------- Shared card CSS (styled-jsx) ------------- */
const baseCardCss = `
  .card{
    width:100%; max-width:520px;
    background:#fff; border-radius:20px;
    box-shadow:0 10px 30px rgba(16,24,40,.08);
    padding:16px; margin:10px 0;
  }
  .cardHead{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .cardTitle{ font-size:18px; font-weight:800; color:#0f172a; }
  .chip{
    background:#F6F4FC; color:#2864F8;
    padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700;
  }
  .chip--blue{ background:#e9ecff; }
  .row2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:8px; }
  @media (max-width:560px){ .row2{ grid-template-columns:1fr; } }

  .label{ font-size:12px; font-weight:700; color:#0f172a; margin:6px 0; }
  .field{
    width:min(409px, 100%); height:55px;
    background:#fff; border:1px solid #E7EAF3; border-radius:8px;
    display:flex; align-items:center; padding:0 12px;
  }
  .field input, .field select{
    width:100%; height:100%; border:0; outline:0; background:transparent; font-size:16px; color:#0f172a;
  }

  .walletBlock{ margin-top:10px; }
  .walletRow{ display:flex; gap:8px; align-items:center; }
  .walletInput{
    flex:1; height:55px;
    border:1px solid #E7EAF3; border-radius:8px;
    padding:0 12px; font-size:14px;
  }
  .copyBtn{
    width:80px; height:38px;
    background:#F6F4FC; color:#101828; border:1px solid #E7EAF3;
    border-radius:8px; font-weight:600; cursor:pointer;
  }

  .hint{ margin-top:6px; font-size:12px; color:#667085; }

  .primaryBtn{
    width:min(409px, 100%); height:55px; margin:14px 0 6px;
    background:#2864F8; color:#fff; border:0; border-radius:12px;
    font-weight:700; letter-spacing:.2px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 6px 18px rgba(40,100,248,.25);
  }
  .footNote{ font-size:12px; color:#64748b; }
`;


