'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Signup(){
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setErr('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setErr(error.message);

    // if email confirmation is OFF, user is already signed in
    // if it's ON, they must check email (or you can show a message)
    router.push('/'); // or '/trade'
  }

  return (/* your form UI using onSubmit */);
}


