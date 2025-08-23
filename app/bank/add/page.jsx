'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const BANKS = [
  'Access Bank', 'Fidelity Bank', 'FCMB', 'First Bank', 'GTBank',
  'Keystone Bank', 'Kuda Bank', 'Moniepoint MFB', 'Opay', 'Polaris Bank',
  'Providus Bank', 'Stanbic IBTC', 'Sterling Bank', 'UBA', 'Union Bank',
  'Unity Bank', 'Wema Bank', 'Zenith Bank'
];

export default function AddBankPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Require auth; if not logged in, send to login
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) router.replace('/auth/login');
      else setUserId(uid);
    });
  }, [router]);

  async function saveBank(e) {
    e.preventDefault();
    if (!userId) return;
    if (!bankName || !accountNumber || !accountName) {
      alert('Please fill all fields.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('banks').insert({
      user_id: userId,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName
    });
    setSaving(false);

    if (error) {
      alert(`Could not save bank: ${error.message}`);
      return;
    }
    alert('Bank saved.');
    router.replace('/withdraw'); // go pick it for withdrawal
  }

  // styles
  const page = { maxWidth: 480, margin:'0 auto', padding:16, background:'#F6F4FC', minHeight:'100dvh' };
  const h  = { fontWeight:800, color:'#0E1525', textAlign:'center', margin:'8px 0 16px' };
  const field = {
    width: '100%', maxWidth: 406, height: 71, borderRadius: 12,
    border: '1px solid #E7EAF3', background:'#fff',
    padding: '0 14px', fontSize: 16, outline: 'none'
  };
  const row = { display:'flex', justifyContent:'center', margin:'8px 0' };
  const btn = {
    width: '100%', maxWidth: 409, height: 55, borderRadius: 12,
    background:'#2864F8', color:'#fff', border:0, fontWeight:700,
    display:'grid', placeItems:'center', cursor:'pointer'
  };
  const card = {
    background:'#fff', border:'1px solid #E7EAF3', borderRadius:16, padding:16,
    boxShadow:'0 8px 24px rgba(16,24,40,.06)'
  };

  return (
    <main style={page}>
      <h2 style={h}>Add Bank</h2>

      <section style={card}>
        <form onSubmit={saveBank}>
          <div style={row}>
            <select value={bankName} onChange={e=>setBankName(e.target.value)} style={field}>
              <option value="">Select Bank</option>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div style={row}>
            <input
              style={field}
              inputMode="numeric"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={e=>setAccountNumber(e.target.value.replace(/[^\d]/g,''))}
              maxLength={20}
            />
          </div>

          <div style={row}>
            <input
              style={field}
              placeholder="Account Name"
              value={accountName}
              onChange={e=>setAccountName(e.target.value)}
            />
          </div>

          <div style={{display:'flex', justifyContent:'center', marginTop:12}}>
            <button type="submit" style={btn} disabled={saving}>
              {saving ? 'Saving…' : 'Add'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
