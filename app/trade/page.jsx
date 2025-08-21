'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TradePage() {
  const [active, setActive] = useState<'sell' | 'buy' | 'giftcard'>('sell');

  return (
    <main className="container card" style={{paddingBottom:90}}>
      <h2 className="section-title">Trade</h2>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${active==='sell'?'tab--active':''}`} onClick={()=>setActive('sell')}>Sell Crypto</button>
        <button className={`tab ${active==='buy'?'tab--active':''}`} onClick={()=>setActive('buy')}>Buy Crypto</button>
        <button className={`tab ${active==='giftcard'?'tab--active':''}`} onClick={()=>setActive('giftcard')}>Sell Giftcard</button>
      </div>

      {active === 'sell'    && <SellForm />}
      {active === 'buy'     && <BuyForm  />}
      {active === 'giftcard'&& <GiftcardStub />}
    </main>
  );
}

/* ---------- SELL ---------- */
function SellForm() {
  const [amount, setAmount] = useState('');
  const [coin, setCoin]     = useState('USDT');
  const [network, setNet]   = useState('TRON-TRC20');
  const [showModal, setShowModal] = useState(false);

  // Your platform wallet address (read-only for users)
  const platformWallet = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(platformWallet);
      alert('Wallet address copied!');
    } catch {
      alert('Copy failed. Long-press to copy.');
    }
  };

  return (
    <form className="trade-form" onSubmit={(e)=>e.preventDefault()}>
      <h3>Sell Crypto</h3>

      <div className="row">
        <div className="field">
          <label className="small">Coin</label>
          <select value={coin} onChange={e=>setCoin(e.target.value)}>
            <option>USDT</option>
            <option>USDC</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>SOL</option>
            <option>TRX</option>
            <option>TON</option>
          </select>
        </div>
        <div className="field">
          <label className="small">Network</label>
          <select value={network} onChange={e=>setNet(e.target.value)}>
            {/* common networks */}
            <option>TRON-TRC20</option>
            <option>ETH-ERC20</option>
            <option>BSC-BEP20</option>
            <option>Polygon</option>
            <option>Solana</option>
            <option>TON</option>
          </select>
        </div>
      </div>

      <div className="field">
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="Enter amount to sell"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          required
        />
      </div>

      {/* Display your receiving wallet (read-only) */}
      <div className="field">
        <label className="small">Send to this wallet address</label>
        <div className="wallet-display">
          <input type="text" value={platformWallet} readOnly />
          <button type="button" onClick={copyWallet}>Copy</button>
        </div>
      </div>

      <button className="btn" type="button" onClick={()=>setShowModal(true)}>
        I Have Sent
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <Modal onClose={()=>setShowModal(false)}>
          <h4>Thanks! We’ll verify your transfer</h4>
          <p className="small">
            We’ve received your notice for <b>{amount || '—'}</b> {coin} on <b>{network}</b>.
            Our team will confirm on-chain and update your status shortly.
          </p>
          <button className="btn" onClick={()=>setShowModal(false)}>Okay</button>
        </Modal>
      )}
    </form>
  );
}

/* ---------- BUY ---------- */
function BuyForm() {
  const [amount, setAmount] = useState('');
  const [coin, setCoin]     = useState('USDT');
  const [network, setNet]   = useState('TRON-TRC20');
  const [destWallet, setDestWallet] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!destWallet.trim()) {
      alert('Please enter your wallet address.');
      return;
    }
    // keep your existing payment flow here
    alert('Proceeding to payment (test)…');
  };

  return (
    <form className="trade-form" onSubmit={onSubmit}>
      <h3>Buy Crypto</h3>

      <div className="row">
        <div className="field">
          <label className="small">Coin</label>
          <select value={coin} onChange={e=>setCoin(e.target.value)}>
            <option>USDT</option>
            <option>USDC</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>SOL</option>
            <option>TRX</option>
            <option>TON</option>
          </select>
        </div>
        <div className="field">
          <label className="small">Network</label>
          <select value={network} onChange={e=>setNet(e.target.value)}>
            <option>TRON-TRC20</option>
            <option>ETH-ERC20</option>
            <option>BSC-BEP20</option>
            <option>Polygon</option>
            <option>Solana</option>
            <option>TON</option>
          </select>
        </div>
      </div>

      <div className="field">
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="Enter amount to buy"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          required
        />
      </div>

      {/* USER wallet address to receive coins */}
      <div className="field">
        <label className="small">Your wallet address (receive here)</label>
        <input
          type="text"
          placeholder="Paste wallet address"
          value={destWallet}
          onChange={(e)=>setDestWallet(e.target.value)}
          required
        />
      </div>

      <button className="btn" type="submit">Proceed to Payment</button>
    </form>
  );
}

/* ---------- Giftcard placeholder (kept minimal for now) ---------- */
function GiftcardStub() {
  return (
    <div className="trade-form">
      <h3>Sell Giftcard</h3>
      <p className="small">Choose a card and upload details (coming next).</p>
      <Link href="/trade">Back</Link>
    </div>
  );
}

/* ---------- Generic Modal ---------- */
function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}


