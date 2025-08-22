'use client';

import { useState } from 'react';
import styles from './trade.module.css';

const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

const NETWORKS = [
  { code: 'USDT-TRC20', label: 'USDT • TRC20' },
  { code: 'USDT-ERC20', label: 'USDT • ERC20' },
  { code: 'USDT-BEP20', label: 'USDT • BEP20' },
  { code: 'USDC-ERC20', label: 'USDC • ERC20' },
  { code: 'BTC',        label: 'BTC • Mainnet' },
];

export default function TradePage() {
  const [tab, setTab] = useState('sell'); // 'sell' | 'buy' | 'giftcard'
  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Trade</h1>

      {/* Segmented tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab==='sell' ? styles.tabActive : ''}`}
          onClick={()=>setTab('sell')}
        >Sell Crypto</button>
        <button
          className={`${styles.tab} ${tab==='buy' ? styles.tabActive : ''}`}
          onClick={()=>setTab('buy')}
        >Buy Crypto</button>
        <button
          className={`${styles.tab} ${tab==='giftcard' ? styles.tabActive : ''}`}
          onClick={()=>setTab('giftcard')}
        >Sell Giftcard</button>
      </div>

      {tab==='sell' && <SellCard />}
      {tab==='buy' && <BuyCard />}
      {tab==='giftcard' && <GiftcardCard />}
    </main>
  );
}

/* -------- SELL -------- */
function SellCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function copyAddr() {
    try {
      await navigator.clipboard.writeText(BNAPX_WALLET);
      setCopied(true);
      setTimeout(()=>setCopied(false), 1400);
    } catch {}
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}>Sell Crypto</div>
        <span className={styles.badge}>Instant</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Network</label>
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={network}
              onChange={(e)=>setNetwork(e.target.value)}
            >
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Amount (NGN)</label>
          <input
            className={styles.input}
            placeholder="₦ 0.00"
            inputMode="numeric"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Send to this wallet</label>
        <div className={styles.copyRow}>
          <input className={styles.input} readOnly value={BNAPX_WALLET}/>
          <button className={styles.copyBtn} type="button" onClick={copyAddr}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <button className={styles.primary} onClick={()=>setConfirmOpen(true)}>
        I have sent
      </button>

      <p className={styles.help}>
        We’ll verify on-chain and update your status to <b>Paid</b> when confirmed.
      </p>

      {confirmOpen && (
        <ConfirmModal
          title="Confirm transfer"
          desc={`You’re confirming a transfer on ${network}. We’ll mark this trade as Pending and notify you when it’s confirmed.`}
          onClose={()=>setConfirmOpen(false)}
          onConfirm={()=>{ setConfirmOpen(false); alert('Marked as Pending'); }}
        />
      )}
    </section>
  );
}

/* -------- BUY -------- */
function BuyCard(){
  const [network, setNetwork] = useState('USDT-TRC20');
  const [amount, setAmount] = useState('');
  const [toAddr, setToAddr] = useState('');

  function createOrder(){
    // TODO: call /api/payments/create and save "Pending" in Supabase
    alert(`Buy request: NGN ${amount} on ${network} → ${toAddr} (Pending)`);
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}>Buy Crypto</div>
        <span className={styles.badge}>Best rates</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Network</label>
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={network}
              onChange={(e)=>setNetwork(e.target.value)}
            >
              {NETWORKS.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Amount (NGN)</label>
          <input
            className={styles.input}
            placeholder="₦ 0.00"
            inputMode="numeric"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Your wallet address (receive)</label>
        <input
          className={styles.input}
          placeholder="Paste the wallet to receive crypto"
          value={toAddr}
          onChange={(e)=>setToAddr(e.target.value)}
        />
      </div>

      <button className={styles.primary} onClick={createOrder}>
        Create Test Payment
      </button>

      <p className={styles.help}>
        We’ll send the crypto to the address above once payment is confirmed.
      </p>
    </section>
  );
}

/* -------- GIFTCARD (placeholder for now) -------- */
function GiftcardCard(){
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}>Sell Giftcard</div>
        <span className={styles.badge}>Coming soon</span>
      </div>
      <p className={styles.help}>UI will match your giftcard flow with logos, categories, and rates.</p>
    </section>
  );
}

/* -------- Modal (plain JSX) -------- */
function ConfirmModal({ title, desc, onClose, onConfirm }) {
  return (
    <div className={styles.modalBack}>
      <div className={styles.modal}>
        <h4 className={styles.modalTitle}>{title}</h4>
        <p className={styles.modalText}>{desc}</p>
        <div className={styles.modalRow}>
          <button className={styles.secondary} onClick={onClose}>Cancel</button>
          <button className={styles.primary} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}



