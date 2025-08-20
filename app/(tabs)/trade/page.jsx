'use client';
import { useEffect, useMemo, useState } from 'react';import { useSearchParams } from 'next/navigation';
const COINS={BTC:{networks:['Bitcoin'],rate:95000000},ETH:{networks:['Ethereum'],rate:600000},USDT:{networks:['TRC20','ERC20','BEP20','Solana','Polygon'],rate:1500},USDC:{networks:['AVAXC','ERC20','BEP20','Solana','Polygon','POS','Arbitrum'],rate:1480},TRX:{networks:['TRON'],rate:150},SOL:{networks:['Solana'],rate:95000},TON:{networks:['TON'],rate:80000}};
const BRANDS=[{key:'razer',name:'RAZER GOLD',img:'/cards/razer.png'},{key:'itunes',name:'ITUNES',img:'/cards/itunes.png'},{key:'steam',name:'STEAM',img:'/cards/steam.png'},{key:'amazon',name:'AMAZON',img:'/cards/amazon.png'},{key:'walmart',name:'WALMART CARD',img:'/cards/walmart.png',list:true},{key:'spotify',name:'SPOTIFY CARD',img:'/cards/spotify.png',list:true},{key:'xbox',name:'XBOX CARD',img:'/cards/xbox.png',list:true},{key:'googleplay',name:'GOOGLE PLAY',img:'/cards/googleplay.png',list:true},];
export default function Trade(){const sp=useSearchParams();const initial=sp.get('tab')||'sell';const [tab,setTab]=useState(initial);const [coin,setCoin]=useState('USDT');const [network,setNetwork]=useState('TRC20');const [amount,setAmount]=useState('');useEffect(()=>{if(tab==='sell'||tab==='buy'){setNetwork(COINS[coin].networks[0]);}},[coin,tab]);const rate=COINS[coin].rate;const ngn=useMemo(()=>{const v=parseFloat(amount||'0');return isNaN(v)?'0':new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(v*rate);},[amount,rate]);
return(<main>
  <h2 style={{margin:'0 0 8px'}}>Trade</h2>
  <div className='tabs-inline'>
    <button className={`tabbtn ${tab==='sell'?'active':''}`} onClick={()=>setTab('sell')}>Sell Crypto</button>
    <button className={`tabbtn ${tab==='buy'?'active':''}`} onClick={()=>setTab('buy')}>Buy Crypto</button>
    <button className={`tabbtn ${tab==='giftcard'?'active':''}`} onClick={()=>setTab('giftcard')}>Sell Giftcard</button>
  </div>
  {tab!=='giftcard' && <div className='card-lite'>
    <div className='field'><select value={coin} onChange={e=>{setCoin(e.target.value);setNetwork(COINS[e.target.value].networks[0]);}}>{Object.keys(COINS).map(k=><option key={k} value={k}>{k}</option>)}</select></div>
    <div className='field'><select value={network} onChange={e=>setNetwork(e.target.value)}>{COINS[coin].networks.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
    <div className='field'><input placeholder='Amount' value={amount} onChange={e=>setAmount(e.target.value)}/></div>
    <div className='small'>Rate: {new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(rate)} per {coin}</div>
    <div style={{marginTop:8,fontWeight:700}}>You’ll receive: {ngn}</div>
    <button className='btn' onClick={()=>alert('Payment intent (Flutterwave sandbox) would be created here in /api/payments/create')}>Create Test Payment</button>
  </div>}
  {tab==='giftcard' && <div>
    <div className='small' style={{margin:'8px 2px'}}>Kindly select the giftcard you want to redeem</div>
    <div className='grid'>{BRANDS.slice(0,4).map(b=>(<a key={b.key} className='tile' href='#gift'><img src={b.img}/><div style={{fontWeight:700}}>{b.name}</div></a>))}</div>
    <div style={{marginTop:14}} className='card-lite'>
      {BRANDS.slice(4).map(b=>(<div key={b.key} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid var(--line)'}}><img src={b.img} style={{width:64,height:40,borderRadius:8,objectFit:'cover'}}/><div style={{fontWeight:700,flex:1}}>{b.name}<div className='small'>Hot Deals 🔥</div></div></div>))}
      <div className='small' style={{marginTop:8,display:'flex',justifyContent:'space-between'}}><span>Rate Update: $1</span><span>NGN******</span></div>
    </div>
  </div>}
</main>);}
