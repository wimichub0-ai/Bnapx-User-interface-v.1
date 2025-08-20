export default function Home(){return(<main>
  <div className='card-lite'>
    <div className='balance'><div><b>Wallet Balance</b></div><div style={{fontWeight:800}}>₦50,000.00</div></div>
    <div className='row' style={{justifyContent:'space-around'}}><div>⬇️ Withdraw</div><div>＋ Add Bank</div></div>
  </div>
  <div style={{marginTop:16}}>
    <div style={{fontWeight:800, margin:'6px 2px'}}>Quick action</div>
    <div className='grid'>
      <a className='tile' href='/(tabs)/trade'><img src='/icons/usdt.png'/><div style={{fontWeight:700}}>Sell Crypto</div></a>
      <a className='tile' href='/(tabs)/trade?tab=buy'><img src='/icons/btc.png'/><div style={{fontWeight:700}}>Buy Crypto</div></a>
      <a className='tile' href='/(tabs)/trade?tab=giftcard'><img src='/cards/itunes.png'/><div style={{fontWeight:700}}>Sell Giftcard</div></a>
      <div className='tile'><img src='/cards/googleplay.png'/><div style={{fontWeight:700}}>Send Gift</div></div>
    </div>
  </div>
</main>);}
