'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function Login(){
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [err,setErr]=useState('');
  async function onSubmit(e){e.preventDefault();setErr('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setErr(error.message);return;}window.location.href='/(tabs)';}
  return(<main>
    <div className='header-grad'><img className='logo' src='/logo-blue.png'/><h2>Login</h2><p className='small'>Access your account</p></div>
    <div className='container card'><form onSubmit={onSubmit}>
      <div className='field'><input type='email' placeholder='Email@bnapx.com' value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div className='field'><input type='password' placeholder='Enter Password' value={password} onChange={e=>setPassword(e.target.value)} required/></div>
      {err && <div className='small' style={{color:'crimson'}}>{err}</div>}
      <button className='btn' type='submit'>Login</button>
      <div className='small' style={{marginTop:8}}>Don't have an account? <Link href='/auth/signup'>Create account</Link></div>
    </form></div></main>);
}
