'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function Signup(){
  const [first,setFirst]=useState('');const [last,setLast]=useState('');const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');const [phone,setPhone]=useState('');const [promo,setPromo]=useState('');
  const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');
  const [msg,setMsg]=useState('');const [uErr,setUErr]=useState('');const [uOk,setUOk]=useState('');

  useEffect(()=>{const t=setTimeout(async()=>{
    setUErr('');setUOk('');
    const v=username.trim().toLowerCase(); if(!v) return;
    if(!/^[a-zA-Z0-9_]{3,16}$/.test(v)){setUErr('Use 3–16 letters, numbers, underscore.');return;}
    const { data } = await supabase.from('profiles').select('username').eq('username', v).maybeSingle();
    if(data){ setUErr('Username already exists'); } else { setUOk('Great — username is available.'); }
  },350); return ()=>clearTimeout(t);},[username]);

  async function onSubmit(e){
    e.preventDefault(); setMsg('');
    if(password!==confirm){ setMsg('Passwords do not match'); return; }
    if(uErr){ setMsg('Fix username issue'); return; }
    const { data:sign, error } = await supabase.auth.signUp({email,password});
    if(error){ setMsg(error.message); return; }
    const user = sign.user;
    if(user){
      await supabase.from('profiles').insert({id:user.id, username:username.trim().toLowerCase(), first_name:first, last_name:last, phone:phone, promo_code:promo});
    }
    window.location.href='/(tabs)';
  }

  return (<main>
    <div className='header-grad'><img className='logo' src='/logo-blue.png'/><h2>Let’s create your account</h2><p className='small'>Create an account for <b>free</b></p></div>
    <div className='container card'><form onSubmit={onSubmit}>
      <div className='row'>
        <div className='field' style={{flex:1}}><input placeholder='Firstname' value={first} onChange={e=>setFirst(e.target.value)} required/></div>
        <div className='field' style={{flex:1}}><input placeholder='Lastname' value={last} onChange={e=>setLast(e.target.value)} required/></div>
      </div>
      <div className='field'><input placeholder='@Username' value={username} onChange={e=>setUsername(e.target.value)} required/></div>
      <div className='field'><input type='email' placeholder='Email@bnapx.com' value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div className='row'>
        <div className='field' style={{width:90}}><input value='+234' readOnly/></div>
        <div className='field' style={{flex:1}}><input placeholder='Phone Number' value={phone} onChange={e=>setPhone(e.target.value)} required/></div>
      </div>
      <div className='row'>
        <div className='field' style={{flex:1}}><input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        <div className='field' style={{flex:1}}><input type='password' placeholder='Confirm Password' value={confirm} onChange={e=>setConfirm(e.target.value)} required/></div>
      </div>
      <div className='field'><input placeholder='Promo code (optional)' value={promo} onChange={e=>setPromo(e.target.value)}/></div>
      {uErr && <div className='small' style={{color:'crimson'}}>{uErr}</div>}
      {uOk && <div className='small' style={{color:'green'}}>{uOk}</div>}
      {msg && <div className='small' style={{color:'crimson'}}>{msg}</div>}
      <button className='btn' type='submit'>Create Account</button>
      <div className='small' style={{marginTop:8}}>Already have an account? <Link href='/auth/login'>Login</Link></div>
    </form></div>
  </main>);
}
