'use client';

import { useState } from 'react';

const BNAPX_WALLET = 'UQCihj9gc-ySfF17s2h6XgiplYQtACjhfWlB9L9MMRzcuOA6';

export default function TradePage() {
  const [tab, setTab] = useState('sell');
  return (
    <main style={{ padding: 16 }}>
      <h2>Trade</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab('sell')}>Sell</button>
        <button onClick={() => setTab('buy')}>Buy</button>
        <button onClick={() => setTab('giftcard')}>Giftcard</button>
      </div>

      {tab === 'sell' && (
        <div>
          <label>Send to this wallet</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={BNAPX_WALLET} style={{ flex: 1 }} />
            <button type="button" onClick={() => navigator.clipboard.writeText(BNAPX_WALLET)}>
              Copy
            </button>
          </div>
        </div>
      )}

      {tab === 'buy' && (
        <div>
          <label>Your wallet address</label>
          <input placeholder="Paste address" />
        </div>
      )}

      {tab === 'giftcard' && <p>Coming soon…</p>}
    </main>
  );
}



