'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage(){
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/auth/login');
    });
  }, [router]);

  // ...rest of the page
}


import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/* ---------------- RATES (prototype) ----------------
   Treat these as NGN per 1 USD-equivalent for now
   so a user typing $amount => NGN = amount * rate.
   (USDT/USDC map perfectly; BTC is a rough demo rate.) */
const RATES = {
  'USDT-TRC20': 1785,
  'USDT-ERC20': 1795,
  'USDT-BEP20': 1780,
  'USDC-ERC20': 1790,
  'BTC':        1785, // prototype: use same NGN per $ for display calc
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
function parseAmount(input) {
  if (!input) return 0;
  const cleaned = String(input).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}
function formatNaira(n) {
  if (!Number.isFinite(n)) return '₦0';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', maximumFractionDigits: 2
    }).format(n);
  } catch {
    return `₦${Number(n).toLocaleString()}`;
  }
}
function formatUSD(n) {
  if (!Number.isFinite(n)) return '$0';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 2
    }).format(n);
  } catch {
    return `$${Number(n).toLocaleString()}`;
  }
}

/* NGN quoted from $ input using NGN-per-USD rate */
function quoteNairaFromUSD(usd, networkCode) {
  const rate = RATES[networkCode];
  if (!rate || rate <= 0) return 0;
  return usd * rate;
}

/* ---------------- Page ---------------- */
export default function TradePage() {
  const [tab, setTab] = useState('sell'); // 'sell' | 'buy' | 'giftcard'

  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <h2 style={{ fontWeight: 800, margin: '8px 2px 12px' }}>Trade</h2>

      <div className="tabs">
        <button className={`tab ${tab === 'sell' ? 'tab--active' : ''}`} onClick={() => setTab('sell')}>
          Sell Crypto
        </button>
        <button className={`tab ${tab === 'buy' ? 'tab--active' : ''}`} onClick={() => setTab('buy')}>
          Buy Crypto
        </button>
        <button className={`tab ${tab === 'giftcard' ? 'tab--active' : ''}`} onClick={() => setTab('giftcard')}>
          Sell Giftcard
        </button>
      </div>

      {tab === 'sell' && <SellCard />}
      {tab === 'buy' && <BuyCard />}
      {tab === 'giftcard' && <GiftcardCard />}
    </main>
  );
}

/* ---------------- SELL ---------------- */
function SellCard() {
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amountUSD, setAmountUSD] = useState(''); // user types USD
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue = parseAmount(amountUSD);
  const nairaQuote = useMemo(() => quoteNairaFromUSD(usdValue, network), [usdValue, network]);
  const rateNGN = RATES[network] || 0;

  async function copyAddr() {
    try {
      await navigator.clipboard.writeText(BNAPX_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  async function confirmSent() {
    setConfirmOpen(false);
    // (Optional) Write Pending trade to Supabase
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        alert('Please login to create a trade.');
        return;
      }
      const tx_ref = `SELL-${Date.now()}`;
      await supabase.from('trades').insert({
        user_id: user.id,
        type: 'sell',
        network_code: network,
        asset,
        usd_amount: usdValue,
        ngn_amount: nairaQuote,
        to_address: BNAPX_WALLET,
        tx_ref,
        status: 'pending'
      });
      alert('Marked as Pending. Check your History.');
    } catch (e) {
      console.error(e);
      alert('Could not save trade (check Supabase columns/policies).');
    }
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Sell Crypto</div>
        <span className="small" style={{ background: 'var(--bg)', padding: '6px 10px', borderRadius: 999, color: 'var(--brand)' }}>
          Instant
        </span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e => setNetwork(e.target.value)}>
              {NETWORKS.map(n => (
                <option key={n.code} value={n.code}>{n.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Amount (USD)</div>
          <div className="field">
            <input
              placeholder="$ 0.00"
              inputMode="decimal"
              value={amountUSD}
              onChange={e => setAmountUSD(e.target.value)}
            />
          </div>
          <div className="small" style={{ marginTop: 6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per $1 ({asset})
          </div>
          <div className="small" style={{ marginTop: 2 }}>
            You’ll receive approx: <b>{formatNaira(nairaQuote)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Send to this wallet</div>
        <div className="wallet-display">
          <input readOnly value={BNAPX_WALLET} />
          <button className="copy-btn" type="button" onClick={copyAddr}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <button className="btn" style={{ marginTop: 12 }} onClick={() => setConfirmOpen(true)}>
        I have sent
      </button>
      <div className="small" style={{ marginTop: 8 }}>
        We’ll verify on-chain and update your status to <b>Paid</b> when confirmed.
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Confirm transfer"
          desc={`You’re confirming a transfer on ${network}. We’ll mark this trade as Pending and notify you when it’s confirmed.`}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmSent}
        />
      )}
    </section>
  );
}

/* ---------------- BUY ---------------- */
function BuyCard() {
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amountUSD, setAmountUSD] = useState(''); // user types USD they want to spend
  const [toAddr, setToAddr] = useState('');

  const asset = useMemo(() => NETWORKS.find(n => n.code === network)?.asset || 'USDT', [network]);
  const usdValue = parseAmount(amountUSD);
  const nairaQuote = useMemo(() => quoteNairaFromUSD(usdValue, network), [usdValue, network]);
  const rateNGN = RATES[network] || 0;

  async function createOrder() {
    // (Optional) Write Pending trade to Supabase
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        alert('Please login to create a trade.');
        return;
      }
      const tx_ref = `BUY-${Date.now()}`;
      await supabase.from('trades').insert({
        user_id: user.id,
        type: 'buy',
        network_code: network,
        asset,
        usd_amount: usdValue,
        ngn_amount: nairaQuote,
        to_address: toAddr,
        tx_ref,
        status: 'pending'
      });
      alert(`Buy request created. Est payout: ${formatNaira(nairaQuote)}. Check History.`);
    } catch (e) {
      console.error(e);
      alert('Could not save trade (check Supabase columns/policies).');
    }
  }

  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Buy Crypto</div>
        <span className="small" style={{ background: 'var(--bg)', padding: '6px 10px', borderRadius: 999, color: 'var(--brand)' }}>
          Best rates
        </span>
      </div>

      <div className="grid">
        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Network</div>
          <div className="field">
            <select value={network} onChange={e => setNetwork(e.target.value)}>
              {NETWORKS.map(n => (
                <option key={n.code} value={n.code}>{n.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Amount (USD)</div>
          <div className="field">
            <input
              placeholder="$ 0.00"
              inputMode="decimal"
              value={amountUSD}
              onChange={e => setAmountUSD(e.target.value)}
            />
          </div>
          <div className="small" style={{ marginTop: 6 }}>
            Rate: <b>{formatNaira(rateNGN)}</b> per $1 ({asset})
          </div>
          <div className="small" style={{ marginTop: 2 }}>
            You’ll pay approx: <b>{formatNaira(nairaQuote)}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>Your wallet address (receive)</div>
        <div className="wallet-display">
          <input
            placeholder="Paste the wallet to receive crypto"
            value={toAddr}
            onChange={e => setToAddr(e.target.value)}
          />
        </div>
      </div>

      <button className="btn" style={{ marginTop: 10 }} onClick={createOrder}>
        Create Test Payment
      </button>
      <div className="small" style={{ marginTop: 8 }}>
        We’ll send the crypto to the address above once payment is confirmed.
      </div>
    </section>
  );
}

/* ---------------- GIFTCARD (placeholder) ---------------- */
function GiftcardCard() {
  return (
    <section className="card-lite" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Sell Giftcard</div>
        <span className="small" style={{ background: 'var(--bg)', padding: '6px 10px', borderRadius: 999, color: 'var(--brand)' }}>
          Coming soon
        </span>
      </div>
      <div className="small">UI will match your giftcard flow with logos, categories, and rates.</div>
    </section>
  );
}

/* ---------------- Modal ---------------- */
function ConfirmModal({ title, desc, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3 style={{ marginTop: 4 }}>{title}</h3>
        <p style={{ marginTop: 8 }}>{desc}</p>
        <div className="actions" style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
          <button className="cancel" onClick={onClose} style={{
            height: 40, padding: '0 14px', borderRadius: 8, border: '1px solid #E7EAF3', background: '#fff'
          }}>
            Cancel
          </button>
          <button className="confirm" onClick={onConfirm} style={{
            height: 40, padding: '0 14px', borderRadius: 8, border: 'none', background: 'var(--brand)', color: '#fff', fontWeight: 700
          }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
