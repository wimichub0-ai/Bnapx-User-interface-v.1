'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const BANKS = [
  { code: 'opal', name: 'Opay Bank' },
  { code: 'moniepoint', name: 'Moniepoint' },
  { code: 'kuda', name: 'Kuda' },
  { code: 'access', name: 'Access Bank' },
  { code: 'gtb', name: 'GTBank' },
  { code: 'zenith', name: 'Zenith Bank' },
  { code: 'first', name: 'First Bank' },
  { code: 'uba', name: 'UBA' },
  { code: 'palmpay', name: 'Palmpay' },
  { code: 'fidelity', name: 'Fidelity Bank' },
  { code: 'polaris', name: 'Polaris Bank' },
  { code: 'fcmb', name: 'FCMB' },
  { code: 'sterling', name: 'Sterling Bank' },
  { code: 'wema', name: 'Wema Bank' },
];

export default function AddBankPage() {
  const router = useRouter();
  const [bankCode, setBankCode] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect unauthenticated users to /auth/login (optional)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/auth/login');
    });
  }, [router]);

  async function handleSave() {
    if (!bankCode || !accountNo || !accountName) {
      alert('Please select a bank and enter both Account Number and Account Name.');
      return;
    }
    if (accountNo.length < 6) {
      alert('Account number looks too short.');
      return;
    }

    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        alert('You must be logged in.');
        setSaving(false);
        return;
      }

      const bank = BANKS.find(b => b.code === bankCode);
      const { error } = await supabase.from('user_banks').insert({
        user_id: user.id,
        bank_code: bank.code,
        bank_name: bank.name,
        account_number: accountNo,
        account_name: accountName,
      });

      if (error) {
        console.error(error);
        alert('Could not save bank. Please try again.');
      } else {
        alert('Bank saved!');
        // go back to withdraw screen or wherever you want
        router.push('/withdraw'); // change if your route differs
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={wrap}>
      <header style={header}>
        <button onClick={() => router.back()} style={backBtn}>‹</button>
        <h2 style={title}>Add Bank</h2>
        <div style={{ width: 24 }} />
      </header>

      <section style={{ marginTop: 8 }}>
        {/* Bank select */}
        <div style={fieldWrap}>
          <select
            value={bankCode}
            onChange={e => setBankCode(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Bank</option>
            {BANKS.map(b => (
              <option key={b.code} value={b.code}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Account number */}
        <div style={fieldWrap}>
          <input
            inputMode="numeric"
            placeholder="Enter Account Number"
            value={accountNo}
            onChange={e => setAccountNo(e.target.value.replace(/[^\d]/g,''))}
            style={inputStyle}
          />
        </div>

        {/* Account name (typed by user for now) */}
        <div style={fieldWrap}>
          <input
            placeholder="Account Name"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button style={primaryBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Add'}
        </button>
      </section>
    </main>
  );
}

/* ---------- inline styles ---------- */
const wrap = {
  maxWidth: 480,
  margin: '0 auto',
  minHeight: '100vh',
  background: '#F6F4FC',
  padding: '16px',
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
};

const backBtn = {
  width: 24, height: 24,
  borderRadius: 999,
  border: '1px solid #E6EAF2',
  background: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontSize: 18,
  cursor: 'pointer'
};

const title = { margin: 0, fontSize: 20, fontWeight: 800, color: '#0C47F9' };

const fieldWrap = { margin: '10px 0', display:'flex', justifyContent:'center' };

const inputStyle = {
  width: '406px', height: '71px', maxWidth: '100%',
  background: '#fff',
  border: '1px solid #E6EAF2',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 16,
  outline: 'none',
};

const primaryBtn = {
  width: '409px', height: '55px', maxWidth: '100%',
  background: '#2864F8',
  color: '#fff',
  fontWeight: 700,
  border: 0,
  borderRadius: 12,
  marginTop: 14,
  cursor: 'pointer',
};
