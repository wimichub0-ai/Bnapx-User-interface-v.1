'use client';

import { useState } from 'react';

const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

export default function TradePage() {
  const [tab, setTab] = useState('sell'); // 'sell' | 'buy' | 'giftcard'

  return (
    <main className="container" style={{ paddingBottom: 90 }}>
      <h2 style={{ margin: '16px 0' }}>Trade</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={tab === 'sell' ? 'btn' : 'pill'}
          onClick={() => setTab('sell')}
        >
          Sell Crypto
        </button>
        <button
          className={tab === 'buy' ? 'btn' : 'pill'}
          onClick={() => setTab('buy')}
        >
          Buy Crypto
        </button>
        <button
          className={tab === 'giftcard' ? 'btn' : 'pill'}
          onClick={() => setTab('giftcard')}
        >
          Sell Giftcard
        </button>
      </div>

      {tab === 'sell' && <SellForm />}
      {tab === 'buy' && <BuyForm />}
      {tab === 'giftcard' && <GiftcardForm />}
    </main>
  );
}

function SellForm() {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('USDT-TRC20');

  function copyAddr() {
    navigator.clipboard?.writeText(BNAPX_WALLET);
    alert('Wallet address copied');
  }
  function confirmSent() {
    // TODO: send to API to create a “Pending” record
    alert('Thanks! We marked this as Pending. We’ll confirm shortly.');
  }

  return (
    <section className="card" style={{ padding: 16 }}>
      <h3>Sell Crypto</h3>

      <label className="small">Network</label>
      <select value={network} onChange={(e) => setNetwork(e.target.value)}>
        <option>USDT-TRC20</option>
        <option>USDT-ERC20</option>
        <option>USDT-BEP20</option>
        <option>USDC-ERC20</option>
        <option>BTC</option>
      </select>

      <label className="small" style={{ marginTop: 12 }}>Amount (NGN)</label>
      <input
        placeholder="3000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="small" style={{ marginTop: 12 }}>Send to this wallet</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input readOnly value={BNAPX_WALLET} />
        <button className="pill" type="button" onClick={copyAddr}>Copy</button>
      </div>

      <button className="btn" style={{ marginTop: 12 }} onClick={confirmSent}>
        I have sent
      </button>
      <p className="small" style={{ color: '#6B7280', marginTop: 8 }}>
        We’ll verify on-chain and update your status to <b>Paid</b> when confirmed.
      </p>
    </section>
  );
}

function BuyForm() {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('USDT-TRC20');
  const [dest, setDest] = useState('');

  function createOrder() {
    // TODO: POST to /api/payments/create
    alert(`Buy request created for ${amount} on ${network} → ${dest} (Pending)`);
  }

  return (
    <section className="card" style={{ padding: 16 }}>
      <h3>Buy Crypto</h3>

      <label className="small">Network</label>
      <select value={network} onChange={(e) => setNetwork(e.target.value)}>
        <option>USDT-TRC20</option>
        <option>USDT-ERC20</option>
        <option>USDT-BEP20</option>
        <option>USDC-ERC20</option>
        <option>BTC</option>
      </select>

      <label className="small" style={{ marginTop: 12 }}>Amount (NGN)</label>
      <input
        placeholder="3000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="small" style={{ marginTop: 12 }}>Your wallet address</label>
      <input
        placeholder="Paste the address to receive crypto"
        value={dest}
        onChange={(e) => setDest(e.target.value)}
      />

      <button className="btn" style={{ marginTop: 12 }} onClick={createOrder}>
        Create Test Payment
      </button>
      <p className="small" style={{ color: '#6B7280', marginTop: 8 }}>
        We’ll send crypto to your address after payment is confirmed.
      </p>
    </section>
  );
}

function GiftcardForm() {
  return (
    <section className="card" style={{ padding: 16 }}>
      <h3>Sell Giftcard</h3>
      <p className="small">Coming soon — UI only placeholder.</p>
    </section>
  );
}


