'use client';

import Image from 'next/image';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import styles from './home.module.css';

export default function Home() {
  return (
    <main className={styles.wrap}>
      {/* Top brand header */}
      <section className={styles.brand}>
        <div className={styles.brandRow}>
          <div className={styles.user}>
            <Image src="/avatar.jpg" alt="avatar" width={40} height={40} className={styles.avatar}/>
            <div>
              <div className={styles.hi}>Hi Michael muta</div>
              <div className={styles.sub}>What are you trading today?</div>
            </div>
          </div>
          <Image src="/icons/bell.svg" alt="bell" width={20} height={20}/>
        </div>

        {/* Wallet card */}
        <div className={styles.wallet}>
          <div className={styles.walletHead}>
            <span>Wallet Balance</span>
            <span className={styles.balance}>₦500,000.00</span>
          </div>
          <div className={styles.walletActions}>
            <button className={styles.actionBtn}>
              <span className={styles.plus}>＋</span>
              <span>Add Bank</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.download}>⤓</span>
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick action */}
      <section className={styles.section}>
        <h3 className={styles.title}>Quick action</h3>
        <div className={styles.grid}>
          <Link href="/trade?tab=sell" className={`${styles.tile} ${styles.blueTile}`}>
            <Image src="/icons/usdt.png" alt="USDT" width={56} height={56}/>
            <span>Sell Crypto</span>
          </Link>
          <Link href="/trade?tab=buy" className={`${styles.tile} ${styles.cyanTile}`}>
            <Image src="/icons/btc.png" alt="BTC" width={56} height={56}/>
            <span>Buy Crypto</span>
          </Link>
          <Link href="/trade?tab=giftcard" className={`${styles.tile} ${styles.lilacTile}`}>
            <Image src="/icons/itunes.png" alt="iTunes" width={56} height={56}/>
            <span>Sell Giftcard</span>
          </Link>
          <div className={`${styles.tile} ${styles.purpleTile}`}>
            <Image src="/icons/gift.png" alt="Gift" width={56} height={56}/>
            <span>Coming soon{"\n"}Send Gift</span>
          </div>
        </div>
      </section>

      {/* Promo/Ad */}
      <section className={styles.section}>
        <h3 className={styles.title}>Promo/Ad</h3>
        <div className={styles.promo}>
          <Image src="/banners/promo1.jpg" alt="Promo" fill className={styles.promoImg}/>
        </div>
      </section>

      <TabBar active="home" />
    </main>
  );
}



