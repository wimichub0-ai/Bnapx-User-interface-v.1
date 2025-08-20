/* ---------- LOGGED-IN HOME (brand UI) ---------- */
function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // Try profile name first (if you store it in metadata), else email
        const metaName = data.user.user_metadata?.full_name || data.user.user_metadata?.username;
        setUserName(metaName || data.user.email || "Trader");
      }
    }
    loadUser();
  }, []);

  return (
    <main className="container">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-top">
          <div className="hello">
            <div className="hello-title">Hi {userName}</div>
            <div className="hello-sub">What are you trading today?</div>
          </div>
          <div className="bell" aria-label="Notifications">🔔</div>
        </div>

        {/* Wallet */}
        <div className="wallet">
          <div className="wallet-row">
            <div className="wallet-title">Wallet Balance</div>
            <div className="wallet-balance">₦500,000.00</div>
          </div>
          <div className="wallet-actions">
            <button className="pill"><span className="icon">⤓</span>Withdraw</button>
            <button className="pill"><span className="icon">＋</span>Add Bank</button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="home-section">
        <h3 className="section-title">Quick action</h3>
        <div className="tiles">
          <CryptoAction type="usdt"  label="Sell Crypto"   href="/trade?tab=sell" />
          <CryptoAction type="btc"   label="Buy Crypto"    href="/trade?tab=buy" />
          <CryptoAction type="itunes"label="Sell Giftcard" href="/trade?tab=giftcard" />
          <CryptoAction type="gift"  label="Send Gift"     href="/send-gift" />
        </div>
      </section>

      {/* Promo */}
      <section className="home-section">
        <h3 className="section-title">Promo/Ad</h3>
        <div className="promo">
          <div className="promo-text">
            <div className="promo-h">Boss you don check our rate today?</div>
            <div className="promo-p">E go shock you, trade now</div>
          </div>
          <div className="promo-img" aria-hidden>🧢</div>
        </div>
      </section>

      <TabBar />
    </main>
  );
}

